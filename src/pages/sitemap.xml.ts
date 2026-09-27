// Only reviewed editorial routes; undated snapshot and utility pages remain noindex.
export async function GET() {
  const paths = ['/', '/about/', '/rent-budget/', '/best-cities-for-remote-workers/'];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(path => `<url><loc>https://rentmap.net${path}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
