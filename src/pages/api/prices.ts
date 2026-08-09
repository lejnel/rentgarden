// src/pages/api/prices.ts — Astro API route for prices CRUD
// Uses Cloudflare D1 when deployed, returns sample data in dev
import type { APIRoute } from 'astro';

export const prerender = false;

// Sample data for dev/fallback
const SAMPLE_CITIES = [
  {city:'Copenhagen',country:'DK',avg_price_per_m2:1850,min_price_per_m2:850,max_price_per_m2:3200,count:847,lat:55.6761,lng:12.5683},
  {city:'Berlin',country:'DE',avg_price_per_m2:980,min_price_per_m2:550,max_price_per_m2:1500,count:1234,lat:52.52,lng:13.405},
  {city:'London',country:'GB',avg_price_per_m2:2400,min_price_per_m2:1200,max_price_per_m2:4500,count:2100,lat:51.5074,lng:-0.1278},
  {city:'Paris',country:'FR',avg_price_per_m2:1950,min_price_per_m2:950,max_price_per_m2:3200,count:1560,lat:48.8566,lng:2.3522},
  {city:'Amsterdam',country:'NL',avg_price_per_m2:1600,min_price_per_m2:900,max_price_per_m2:2500,count:920,lat:52.3676,lng:4.9041},
  {city:'Stockholm',country:'SE',avg_price_per_m2:1400,min_price_per_m2:800,max_price_per_m2:2000,count:680,lat:59.3293,lng:18.0686},
  {city:'Oslo',country:'NO',avg_price_per_m2:1350,min_price_per_m2:750,max_price_per_m2:1900,count:540,lat:59.9139,lng:10.7522},
  {city:'Barcelona',country:'ES',avg_price_per_m2:900,min_price_per_m2:500,max_price_per_m2:1500,count:1100,lat:41.3874,lng:2.1686},
  {city:'Rome',country:'IT',avg_price_per_m2:850,min_price_per_m2:450,max_price_per_m2:1400,count:780,lat:41.9028,lng:12.4964},
  {city:'Warsaw',country:'PL',avg_price_per_m2:550,min_price_per_m2:300,max_price_per_m2:900,count:430,lat:52.2297,lng:21.0122},
  {city:'New York',country:'US',avg_price_per_m2:3200,min_price_per_m2:1800,max_price_per_m2:5800,count:3400,lat:40.7128,lng:-74.006},
  {city:'Tokyo',country:'JP',avg_price_per_m2:2100,min_price_per_m2:1000,max_price_per_m2:3800,count:1900,lat:35.6762,lng:139.6503},
  {city:'Bangkok',country:'TH',avg_price_per_m2:350,min_price_per_m2:180,max_price_per_m2:650,count:560,lat:13.7563,lng:100.5018},
  {city:'Singapore',country:'SG',avg_price_per_m2:2600,min_price_per_m2:1500,max_price_per_m2:4500,count:1200,lat:1.3521,lng:103.8198},
  {city:'Mumbai',country:'IN',avg_price_per_m2:300,min_price_per_m2:120,max_price_per_m2:600,count:450,lat:19.076,lng:72.8777},
  {city:'Dubai',country:'AE',avg_price_per_m2:1200,min_price_per_m2:600,max_price_per_m2:2200,count:890,lat:25.2048,lng:55.2708},
  {city:'Cape Town',country:'ZA',avg_price_per_m2:400,min_price_per_m2:200,max_price_per_m2:800,count:290,lat:-33.9249,lng:18.4241},
  {city:'Buenos Aires',country:'AR',avg_price_per_m2:280,min_price_per_m2:150,max_price_per_m2:550,count:320,lat:-34.6037,lng:-58.3816},
];

export const GET: APIRoute = async ({ request, locals }) => {
  const url = new URL(request.url);
  
  try {
    // Try to use D1 if available (Cloudflare deployment)
    const db = (locals as any).runtime?.env?.DB;
    
    if (db) {
      const city = url.searchParams.get('city');
      const bounds = url.searchParams.get('bounds');
      const limit = parseInt(url.searchParams.get('limit') || '500');
      
      let query = 'SELECT * FROM prices WHERE verified = 1';
      const params: any[] = [];
      
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
      
      const { results: prices } = await db.prepare(query).bind(...params).all();
      
      const { results: cities } = await db.prepare(`
        SELECT city, country, AVG(price_per_m2) as avg_price_per_m2,
               MIN(price_per_m2) as min_price_per_m2, MAX(price_per_m2) as max_price_per_m2,
               COUNT(*) as count, AVG(lat) as lat, AVG(lng) as lng
        FROM prices WHERE verified = 1 AND price_per_m2 IS NOT NULL
        GROUP BY city, country ORDER BY count DESC LIMIT 100
      `).all();
      
      return new Response(JSON.stringify({ prices, cities }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (e) {
    console.error('D1 error, falling back to sample data:', e);
  }
  
  // Fallback: empty — real data comes from D1
  return new Response(JSON.stringify({ prices: [], cities: [] }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { city, country, lat, lng, price_total, sqm, rooms, type, source_url, source_site, listing_date, currency, submitter_email } = body;
    
    if (!city || !lat || !lng || !price_total || !source_url) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const db = (locals as any).runtime?.env?.DB;
    
    if (db) {
      const price_per_m2 = sqm && sqm > 0 ? Math.round(price_total / sqm) : null;
      
      const { meta } = await db.prepare(`
        INSERT INTO prices (city, country, lat, lng, price_total, price_per_m2, sqm, rooms, type, source_url, source_site, listing_date, currency, submitter_email)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        city, country || 'DK', lat, lng, price_total, price_per_m2,
        sqm || null, rooms || null, type || 'apartment',
        source_url, source_site || new URL(source_url).hostname,
        listing_date || new Date().toISOString().split('T')[0],
        currency || 'EUR',
        submitter_email || null
      ).run();
      
      return new Response(JSON.stringify({ success: true, id: meta.last_row_id }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Dev mode: just acknowledge
    return new Response(JSON.stringify({ success: true, id: Date.now(), dev: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
