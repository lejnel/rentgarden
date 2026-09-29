"""Audit the actual built HTML. Run after npm run build."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json, re, xml.etree.ElementTree as ET

root = Path('dist')
def slug(value):
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', value.lower())).strip('-')

data=json.loads(Path('public/avg-rent.json').read_text())
data_source=json.loads(Path('public/rent-source.json').read_text())
retired_routes={f"/rent-prices/{slug(city['city'])}-{slug(entry['country'])}/" for entry in data for city in entry.get('cities',[]) if city.get('retired')}
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

errors=[]; pages={}; html_by_route={}; snapshot_count=0
for file in root.rglob('*.html'):
    rel=file.relative_to(root).as_posix()
    route='/' if rel=='index.html' else '/'+rel.removesuffix('index.html') if rel.endswith('/index.html') else '/'+rel.removesuffix('.html')+'/'
    html=file.read_text(); page=Page(html); pages[route]=page; html_by_route[route]=html
    if page.ads:errors.append(f'{route}: advertising script present')
    if len(page.canonical)!=1 or page.canonical[0]!='https://rentmap.net'+route:errors.append(f'{route}: incorrect canonical {page.canonical}')
    if len(page.robots)!=1:errors.append(f'{route}: duplicate/missing robots')
    restricted=route in ['/admin/','/404/','/cheapest-cities-to-rent/','/most-expensive-cities/'] or route in retired_routes
    if restricted:
        if route not in retired_routes:snapshot_count+=1
        if not any('noindex' in r for r in page.robots):errors.append(f'{route}: must be noindex')
    elif any('noindex' in r for r in page.robots):errors.append(f'{route}: editorial page unexpectedly noindex')
    if route not in ['/admin/'] and page.h1!=1:errors.append(f'{route}: expected one H1')
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
sitemap_routes=[urlsplit(loc.text).path for loc in sitemap.findall('.//s:loc',ns)]
if len(sitemap_routes)!=len(set(sitemap_routes)):errors.append('sitemap: duplicate routes')
for route,page in pages.items():
    if not any('noindex' in r for r in page.robots) and route not in sitemap_routes:errors.append(f'sitemap: missing indexable route {route}')
records=[(entry['country'],city) for entry in data if isinstance(entry,dict) for city in entry.get('cities',[]) if not city.get('retired') and not city.get('unavailable')]
capture=json.loads(Path('audits/gpg-rent-source-2026-09.json').read_text())
captured={(row['country'],row['city']):row for row in capture.get('records',[])}
if len(captured)!=len(capture.get('records',[])):errors.append('source capture: duplicate city/country rows')
if len(captured)!=capture.get('sourceRecordCount'):errors.append('source capture: declared row count does not match captured records')
from collections import Counter
counts=Counter((country,city['city']) for country,city in records)
conflicts=[{'country':key[0],'city':key[1],'records':n} for key,n in counts.items() if n>1]
for conflict in conflicts:
    route=f"/rent-prices/{slug(conflict['city'])}-{slug(conflict['country'])}/"
    html=html_by_route.get(route)
    if html is None:
        errors.append(f'{route}: conflicting city page missing from rendered output')
        continue
    if re.search(r'<title>[^<]*\bAverage\s+\$', html, re.I) or re.search(r'\baverage rent is\s+\$', html, re.I):
        errors.append(f'{route}: conflicting records have a reliable-looking average headline')
for country,city in records:
    is_migrated = bool(city.get('source') or city.get('sourceUrl'))
    if is_migrated and city.get('currency') not in ['USD','EUR']:errors.append(f'data: unsupported/missing currency in {country}/{city["city"]}')
    if is_migrated and not (city.get('sourceUrl') or city.get('source')):errors.append(f'data: missing source URL in {country}/{city["city"]}')
    if is_migrated and not (city.get('sourceUpdatedAt') or city.get('sourceUpdateDate') or city.get('updatedAt') or data_source.get('lastUpdate')):errors.append(f'data: missing source update date in {country}/{city["city"]}')
    if not (city.get('retrievedAt') or data_source.get('retrievedAt')):errors.append(f'data: missing retrieval date in {country}/{city["city"]}')
    values=[city.get(k) for k in ['rent1','rent2','rent3']]
    if not any(isinstance(v,(int,float)) and v>0 for v in values):errors.append(f'data: no numeric rents in {country}/{city["city"]}')
    captured_row=captured.get((country,city['city']))
    if captured_row is None:errors.append(f'data: active row absent from source capture in {country}/{city["city"]}')
    elif values!=captured_row['rents'] or city.get('currency')!=captured_row['currency']:errors.append(f'data: values/currency differ from source capture in {country}/{city["city"]}')
    if city.get('sourceUrl')!=data_source.get('url'):errors.append(f'data: source URL differs from ledger in {country}/{city["city"]}')
retired_records=[(entry['country'],city) for entry in data for city in entry.get('cities',[]) if city.get('retired')]
for country,city in retired_records:
    route=f"/rent-prices/{slug(city['city'])}-{slug(country)}/"
    if (country,city['city']) in captured:errors.append(f'data: retired row exists in current capture in {country}/{city["city"]}')
    if route not in pages or not any('noindex' in robots for robots in pages[route].robots):errors.append(f'{route}: retired page must exist and be noindex')
report={'source_records':len(records),'verified_against_source_capture':sum((country,city['city']) in captured and [city.get(k) for k in ['rent1','rent2','rent3']]==captured[(country,city['city'])]['rents'] and city.get('currency')==captured[(country,city['city'])]['currency'] for country,city in records),'retired_records':len(retired_records),'captured_source_rows':len(captured),'distinct_city_country_pairs':len(counts),'conflicting_records_requiring_source_review':conflicts,'html_pages':len(pages),'noindex_utility_and_ranking_pages':snapshot_count,'errors':errors}
Path('audits').mkdir(exist_ok=True)
Path('audits/site-quality.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2));raise SystemExit(bool(errors))
