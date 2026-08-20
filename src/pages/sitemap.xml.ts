// Dynamisk sitemap med alle by- OG land-sider (fra avg-rent.json)
import avgData from '../../public/avg-rent.json';

function slugify(city, country) {
  return `${city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${country.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}
function landSlug(country) {
  return country.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function GET() {
  const urls = ['https://rentmap.net/'];
  for (const entry of avgData) {
    // Land-sider får højere priority + daglig/ugentlig
    urls.push(`https://rentmap.net/countries/${landSlug(entry.country)}/`);
    for (const c of entry.cities) {
      urls.push(`https://rentmap.net/rent-prices/${slugify(c.city, entry.country)}/`);
    }
  }
  const front = `  <url><loc>https://rentmap.net/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`;
  const build = u => {
    const isCountry = u.includes('/countries/');
    return `  <url><loc>${u}</loc><changefreq>${isCountry ? 'daily' : 'weekly'}</changefreq><priority>${isCountry ? 0.9 : 0.8}</priority></url>`;
  };
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${front}
${urls.slice(1).map(build).join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
