// Dynamisk sitemap med alle by-sider (fra avg-rent.json)
import avgData from '../../public/avg-rent.json';

function slugify(city, country) {
  return `${city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${country.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

export async function GET() {
  const urls = ['https://rentmap.net/'];
  for (const entry of avgData) {
    for (const c of entry.cities) {
      urls.push(`https://rentmap.net/rent-prices/${slugify(c.city, entry.country)}/`);
    }
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://rentmap.net/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
${urls.slice(1).map(u => `  <url><loc>${u}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
