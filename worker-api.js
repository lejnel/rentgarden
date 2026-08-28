// Standalone Worker for RentGarden API — deployed separately from Pages
// This Worker has D1 access via wrangler.toml binding

export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);
    
    const publicView = url.searchParams.get('public') === '1';
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
      'Cache-Control': publicView ? 'public, max-age=60' : 'no-store',
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }
    
    const db = env.DB;
    
    // Sørg for dato-index ved kold start (idempotent) — skærer rows read
    // markant på public-listen (ORDER BY submitted_at uden index = fuldt scan)
    context.waitUntil(
      db.prepare('CREATE INDEX IF NOT EXISTS idx_prices_dates ON prices(listing_date, submitted_at)').run()
    );
    
    try {
      // GET /
      if (request.method === 'GET') {
        const year = url.searchParams.get('year');
      
        // Cache public GET-svar i Cloudflare Cache API (6 timer; historiske år 12 timer)
        // → max 4 D1-kald pr. dag pr. URL (data opdateres kun 1× dagligt via cron)
        // Beskytter D1-kvoten (free-plan: 5M rows read/dag) — hvert kald scanner ~2.500 rows
        if (publicView) {
          const cache = caches.default;
          // Normaliser cache-nøglen: ignorer u-relevante query-parametre
          // (?cb, ?utm_*, ?fbclid osv. fra bots/værktøjer skaber ellers ÉT
          // D1-scan pr. variant) — kun public + year bestemmer dataene.
          const base = `${url.origin}${url.pathname === '/' ? '/' : url.pathname}`;
          const cacheKey = new Request(
            year ? `${base}?public=1&year=${year}` : `${base}?public=1`,
            { method: 'GET' }
          );
          const cached = await cache.match(cacheKey);
          if (cached) {
            return cached;
          }
          const ttl = year ? 43200 : 21600;
          const resp = await buildGetResponse(db, publicView, year);
          resp.headers.set('Cache-Control', `public, max-age=${ttl}`);
          resp.headers.set('CF-Cache-Status', 'HIT-MISS');
          context.waitUntil(cache.put(cacheKey, resp.clone()));
          return resp;
        }
        return await buildGetResponse(db, publicView, year);
      }
    
      // Injicér/fjern en listing DIREKTE i det cachelagrede public-svar — så siden
      // viser ændringen MED DET SAMME uden at slette cachen (sparer et dyrt D1-scan).
      // Næste cache-populering (6 t TTL) henter et rent D1-svar og overskriver det hele.
      async function patchPublicCache({ upsert = null, removeId = null }) {
        try {
          const cache = caches.default;
          const origin = url.origin;
          const year = new Date().getUTCFullYear();
          const keys = [
            `${origin}?public=1`,
            `${origin}/?public=1`,
            `${origin}?public=1&year=${year}`,
            `${origin}/?public=1&year=${year}`,
          ];
          for (const k of keys) {
            const cacheKey = new Request(k, { method: 'GET' });
            const cached = await cache.match(cacheKey);
            if (!cached) continue;
            const data = await cached.json();
            if (!data || !Array.isArray(data.prices)) continue;
            if (removeId !== null) {
              data.prices = data.prices.filter(p => p.id !== removeId);
            }
            if (upsert) {
              // Undgå midlertidig dublet i cachen, indsæt øverst (submitted_at DESC)
              data.prices = data.prices.filter(p => p.source_url !== upsert.source_url);
              data.prices.unshift(upsert);
            }
            const fresh = new Response(JSON.stringify(data), {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Cache-Control': 'public, max-age=21600',
              },
            });
            await cache.put(cacheKey, fresh);
          }
        } catch (e) {
          // Skrivning til cachen er ikke kritisk — næste TTL-udløb fanger det alligevel
        }
      }

      async function buildGetResponse(db, publicView, year) {
        let whereClause, params;
        if (year) {
          // Show all listings from a specific year (historical browsing)
          whereClause = `AND CAST(substr(COALESCE(listing_date, submitted_at), 1, 4) AS INTEGER) = ?`;
          params = [year];
        } else {
          // Default: show active listings (last 12 months)
          whereClause = `AND COALESCE(listing_date, submitted_at) >= date('now', '-12 months')`;
          params = [];
        }
      
        const priceSelect = publicView
          ? `id, city, country, lat, lng, price_total, price_per_m2, sqm, rooms, type, source_url, source_site, listing_date, currency, CAST(substr(COALESCE(listing_date, submitted_at), 1, 4) AS INTEGER) as listing_year`
          : `*, CAST(substr(COALESCE(listing_date, submitted_at), 1, 4) AS INTEGER) as listing_year`;
        const { results: prices } = await db.prepare(`
          SELECT ${priceSelect}
          FROM prices WHERE verified = 1 ${whereClause}
          ORDER BY submitted_at DESC LIMIT 5000
        `).bind(...params).all();
      
        const { results: cities } = await db.prepare(`
          SELECT city, country, AVG(price_per_m2) as avg_price_per_m2,
                 MIN(price_per_m2) as min_price_per_m2, MAX(price_per_m2) as max_price_per_m2,
                 COUNT(*) as count, AVG(lat) as lat, AVG(lng) as lng
          FROM prices WHERE verified = 1 AND price_per_m2 IS NOT NULL ${whereClause}
          GROUP BY city, country ORDER BY count DESC LIMIT 100
        `).bind(...params).all();
      
        return new Response(JSON.stringify({ prices, cities }), { headers });
      }
      
      // POST /api/prices
      if (request.method === 'POST') {
        const body = await request.json();
        const { city, country, lat, lng, price_total, sqm, rooms, type, source_url, listing_date, currency, submitter_email } = body;
        
        if (!city || !lat || !lng || !price_total || !source_url) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers });
        }
        // Email is REQUIRED (used for moderation, never shown publicly)
        if (!submitter_email || !String(submitter_email).includes('@')) {
          return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400, headers });
        }
        
        const price_per_m2 = sqm && sqm > 0 ? Math.round(price_total / sqm) : null;
        const source_site = source_url ? new URL(source_url).hostname : null;

        // Dedup check: exact source_url
        const exactDup = await db.prepare('SELECT id FROM prices WHERE source_url = ? LIMIT 1').bind(source_url).run();
        if (exactDup.results.length > 0) {
          return new Response(JSON.stringify({ success: true, id: exactDup.results[0].id, duplicate: true }), { headers });
        }

        // Dedup check: NoBroker re-announces the same property with a new UUID,
        // so the slug (between /property/ and the UUID) identifies the listing.
        const slugMatch = source_url.match(/\/property\/([^/]+)\//);
        if (slugMatch) {
          const slug = slugMatch[1];
          const slugDup = await db.prepare("SELECT id FROM prices WHERE instr(source_url, ?) > 0 LIMIT 1").bind('/property/' + slug + '/').run();
          if (slugDup.results.length > 0) {
            return new Response(JSON.stringify({ success: true, id: slugDup.results[0].id, duplicate: true }), { headers });
          }
        }

        const { meta } = await db.prepare(`
          INSERT INTO prices (city, country, lat, lng, price_total, price_per_m2, sqm, rooms, type, source_url, source_site, listing_date, currency, submitter_email)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          city, country || 'DK', lat, lng, price_total, price_per_m2,
          sqm || null, rooms || null, type || 'apartment',
          source_url, source_site,
          listing_date || new Date().toISOString().split('T')[0],
          currency || 'EUR',
          submitter_email || null
        ).run();
        
        // Injicér den nye listing i cachen MED DET SAMME (uden dyrt D1-scan)
        const listingDate = listing_date || new Date().toISOString().split('T')[0];
        context.waitUntil(patchPublicCache({
          upsert: {
            id: meta.last_row_id,
            city, country, lat, lng, price_total,
            price_per_m2, sqm: sqm || null, rooms: rooms || null, type: type || 'apartment',
            source_url, source_site, listing_date: listingDate, currency: currency || 'EUR',
            listing_year: parseInt(listingDate.slice(0, 4), 10),
          },
        }));
        return new Response(JSON.stringify({ success: true, id: meta.last_row_id }), { headers });
      }
      
      // DELETE /api/prices/:id
      if (request.method === 'DELETE') {
        const id = parseInt(url.pathname.split('/').pop());
        if (isNaN(id)) {
          return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400, headers });
        }
        await db.prepare('DELETE FROM prices WHERE id = ?').bind(id).run();
        // Fjern den slettede prik fra cachen MED DET SAMME
        context.waitUntil(patchPublicCache({ removeId: id }));
        return new Response(JSON.stringify({ success: true }), { headers });
      }
      
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
      
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }
};
