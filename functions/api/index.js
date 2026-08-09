// RentRadar API Worker — handles price data CRUD
// Deployed as Cloudflare Worker with D1 binding

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }
    
    try {
      // GET /api/prices — list prices, optional ?city= & ?bounds= filters
      if (path === '/api/prices' && request.method === 'GET') {
        const city = url.searchParams.get('city');
        const bounds = url.searchParams.get('bounds'); // lat1,lng1,lat2,lng2
        const limit = parseInt(url.searchParams.get('limit') || '500');
        
        let query = 'SELECT * FROM prices WHERE verified = 1';
        const params = [];
        
        if (city) {
          query += ' AND city LIKE ?';
          params.push(`%${city}%`);
        }
        
        if (bounds) {
          const [south, west, north, east] = bounds.split(',').map(Number);
          query += ' AND lat BETWEEN ? AND ? AND lng BETWEEN ? AND ?';
          params.push(south, north, west, east);
        }
        
        query += ' ORDER BY submitted_at DESC LIMIT ?';
        params.push(limit);
        
        const { results } = await env.DB.prepare(query).bind(...params).all();
        
        // Also return aggregated stats per city
        const { results: cities } = await env.DB.prepare(`
          SELECT 
            city, country,
            AVG(price_per_m2) as avg_price_per_m2,
            MIN(price_per_m2) as min_price_per_m2,
            MAX(price_per_m2) as max_price_per_m2,
            COUNT(*) as count,
            AVG(lat) as lat,
            AVG(lng) as lng
          FROM prices 
          WHERE verified = 1 AND price_per_m2 IS NOT NULL
          GROUP BY city, country
          ORDER BY count DESC
          LIMIT 100
        `).all();
        
        return new Response(JSON.stringify({ prices: results, cities }), { headers });
      }
      
      // POST /api/prices — add a new price
      if (path === '/api/prices' && request.method === 'POST') {
        const body = await request.json();
        const { city, country, lat, lng, price_total, sqm, rooms, type, source_url, source_site, listing_date, currency } = body;
        
        if (!city || !lat || !lng || !price_total || !source_url) {
          return new Response(JSON.stringify({ error: 'Missing required fields: city, lat, lng, price_total, source_url' }), 
            { status: 400, headers });
        }
        
        const price_per_m2 = sqm && sqm > 0 ? Math.round(price_total / sqm) : null;
        
        const { success, meta } = await env.DB.prepare(`
          INSERT INTO prices (city, country, lat, lng, price_total, price_per_m2, sqm, rooms, type, source_url, source_site, listing_date, currency)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          city, country || 'DK', lat, lng, price_total, price_per_m2,
          sqm || null, rooms || null, type || 'apartment',
          source_url, source_site || new URL(source_url).hostname,
          listing_date || new Date().toISOString().split('T')[0],
          currency || 'DKK'
        ).run();
        
        return new Response(JSON.stringify({ success: true, id: meta.last_row_id }), { headers });
      }
      
      // DELETE /api/prices/:id
      if (path.startsWith('/api/prices/') && request.method === 'DELETE') {
        const id = parseInt(path.split('/').pop());
        if (isNaN(id)) {
          return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400, headers });
        }
        
        await env.DB.prepare('DELETE FROM prices WHERE id = ?').bind(id).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }
      
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
      
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }
};
