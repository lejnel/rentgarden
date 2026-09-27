import data from '../../public/avg-rent.json';
const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// Include canonical public pages; exclude redirects, errors, admin and noindex rankings.
export async function GET() {
  const paths = [...new Set(['/', '/explore/', '/about/', '/rent-budget/', '/best-cities-for-remote-workers/', '/privacy/', '/terms/', ...data.flatMap(entry => [
    `/countries/${slug(entry.country)}/`,
    ...entry.cities.map(city => `/rent-prices/${slug(city.city)}-${entry.country.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/`)
  ])])];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(path => `<url><loc>https://rentmap.net${path}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
