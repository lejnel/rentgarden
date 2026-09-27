"""Audit the actual built HTML. Run after npm run build."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json, re, xml.etree.ElementTree as ET

root = Path('dist')
class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(); self.links=[]; self.canonical=[]; self.robots=[]; self.h1=0; self.ads=[]; self.json=[]; self.ld=False; self.buffer=''; self.feed(html)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='a' and 'href' in a:self.links.append(a['href'])
        if tag=='h1':self.h1+=1
        if tag=='link' and a.get('rel')=='canonical':self.canonical.append(a.get('href'))
        if tag=='meta' and a.get('name')=='robots':self.robots.append(a.get('content',''))
        if tag=='script':
            if 'googlesyndication' in a.get('src',''):self.ads.append(a['src'])
            self.ld=a.get('type')=='application/ld+json'; self.buffer=''
    def handle_data(self, data):
        if self.ld:self.buffer+=data
    def handle_endtag(self, tag):
        if tag=='script' and self.ld:self.json.append(json.loads(self.buffer));self.ld=False

errors=[]; pages={}; snapshot_count=0
for file in root.rglob('*.html'):
    rel=file.relative_to(root).as_posix()
    route='/' if rel=='index.html' else '/'+rel.removesuffix('index.html') if rel.endswith('/index.html') else '/'+rel.removesuffix('.html')+'/'
    html=file.read_text(); page=Page(html); pages[route]=page
    if page.ads:errors.append(f'{route}: advertising script present')
    if len(page.canonical)!=1 or page.canonical[0]!='https://rentmap.net'+route:errors.append(f'{route}: incorrect canonical {page.canonical}')
    if len(page.robots)!=1:errors.append(f'{route}: duplicate/missing robots')
    restricted=route.startswith(('/rent-prices/','/countries/')) or route in ['/map/','/admin/','/404/','/cheapest-cities-to-rent/','/most-expensive-cities/']
    if restricted:
        snapshot_count+=1
        if not any('noindex' in r for r in page.robots):errors.append(f'{route}: must be noindex')
    elif any('noindex' in r for r in page.robots):errors.append(f'{route}: editorial page unexpectedly noindex')
    if route not in ['/map/','/admin/'] and page.h1!=1:errors.append(f'{route}: expected one H1')
    if re.search(r'updated daily|refreshed daily|66 cities per country',html,re.I):errors.append(f'{route}: unsupported freshness/coverage claim')
for route,page in pages.items():
    for href in page.links:
        url=urlsplit(href)
        if url.scheme or url.netloc or not url.path.startswith('/'):continue
        path=unquote(url.path); target=root/path.lstrip('/')
        if not target.exists() and not (target/'index.html').exists() and not target.with_suffix('.html').exists():errors.append(f'{route}: broken internal link {href}')
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
sitemap=ET.parse(root/'sitemap.xml')
for loc in sitemap.findall('.//s:loc',ns):
    route=urlsplit(loc.text).path
    if route not in pages or any('noindex' in r for r in pages[route].robots):errors.append(f'sitemap: non-indexable {route}')
data=json.loads(Path('public/avg-rent.json').read_text())
records=[(entry['country'],city) for entry in data for city in entry['cities']]
from collections import Counter
counts=Counter((country,city['city']) for country,city in records)
conflicts=[{'country':key[0],'city':key[1],'records':n} for key,n in counts.items() if n>1]
for country,city in records:
    if any(not isinstance(city.get(key),(int,float)) or city[key]<=0 for key in ['rent1','rent2','rent3','avg']):errors.append(f'data: invalid rent in {country}/{city["city"]}')
report={'snapshot_records':len(records),'distinct_city_country_pairs':len(counts),'conflicting_records_requiring_source_review':conflicts,'html_pages':len(pages),'noindex_snapshot_and_utility_pages':snapshot_count,'errors':errors}
Path('audits').mkdir(exist_ok=True)
Path('audits/site-quality.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2));raise SystemExit(bool(errors))
