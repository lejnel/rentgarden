// Standalone Worker for RentGarden API — deployed separately from Pages
// This Worker has D1 access via wrangler.toml binding

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }
    
    const db = env.DB;
    
    try {
      // GET /
      if (request.method === 'GET') {
        const year = url.searchParams.get('year');
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
        
        const { results: prices } = await db.prepare(`
          SELECT *, CAST(substr(COALESCE(listing_date, submitted_at), 1, 4) AS INTEGER) as listing_year
          FROM prices WHERE verified = 1 ${whereClause}
          ORDER BY submitted_at DESC LIMIT 5000
        `).bind(...params).all();
        
        const { results: cities } = await db.prepare(`
          SELECT city, country, AVG(price_per_m2) as avg_price_per_m2,
                 MIN(price_per_m2) as min_price_per_m2, MAX(price_per_m2) as max_price_per_m2,
                 COUNT(*) as count, AVG(lat) as lat, AVG(lng) as lng
          FROM prices WHERE verified = 1 AND price_per_m2 IS NOT NULL ${whereClause.replace('AND ','AND ')}
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
        
        return new Response(JSON.stringify({ success: true, id: meta.last_row_id }), { headers });
      }
      
      // DELETE /api/prices/:id
      if (request.method === 'DELETE') {
        const id = parseInt(url.pathname.split('/').pop());
        if (isNaN(id)) {
          return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400, headers });
        }
        await db.prepare('DELETE FROM prices WHERE id = ?').bind(id).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }
      
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
      
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }
};
