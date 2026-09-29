import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input = process.argv[2];
if (!input) throw new Error('Usage: node scripts/import-gpg-rent-capture.mjs <saved-expanded-page-text>');

const lines = fs.readFileSync(input, 'utf8').split(/\r?\n/).map(line => line.trim()).filter(Boolean);
const price = /^(?:€|\$)[\d,]+$|^n\.a\.$/;
const rows = [];
for (let i = 0; i < lines.length; i++) {
  const header = lines[i].match(/^(.+?),\s+(.+)$/);
  if (!header || !price.test(lines[i + 1] || '') || !price.test(lines[i + 2] || '') || !price.test(lines[i + 3] || '')) continue;
  const values = lines.slice(i + 1, i + 4);
  const currencySymbol = values.find(value => value !== 'n.a.')?.[0];
  rows.push({
    country: header[1],
    city: header[2],
    rents: values.map(value => value === 'n.a.' ? null : Number(value.replace(/[€$,]/g, ''))),
    currency: currencySymbol === '€' ? 'EUR' : 'USD',
  });
  i += 3;
}

const identity = row => `${row.country}|${row.city}`;
const sourceByIdentity = new Map();
for (const row of rows) {
  if (sourceByIdentity.has(identity(row))) throw new Error(`Duplicate source identity: ${identity(row)}`);
  sourceByIdentity.set(identity(row), row);
}
if (rows.length < 400) throw new Error(`Expected the expanded 400+ row table, parsed ${rows.length}`);

const sourceUrl = 'https://www.globalpropertyguide.com/property-rent-prices-by-country';
const retrievedAt = '2026-09-28';
const sourceUpdatedAt = 'Sep 2026';
const datasetPath = path.join(repo, 'public/avg-rent.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
const migrated = [];
const retired = [];
const unmatched = [];

for (const country of dataset) {
  for (const city of country.cities) {
    const row = sourceByIdentity.get(`${country.country}|${city.city}`);
    if (!row) {
      city.retired = true;
      city.retirementReason = `Not present in the Global Property Guide table updated ${sourceUpdatedAt}`;
      city.rent1 = null;
      city.rent2 = null;
      city.rent3 = null;
      city.avg = null;
      city.unavailableBedrooms = [1, 2, 3];
      delete city.currency;
      city.sourceUrl = sourceUrl;
      city.sourceName = 'Global Property Guide';
      city.sourceUpdatedAt = sourceUpdatedAt;
      city.retrievedAt = retrievedAt;
      retired.push(`${city.city}, ${country.country}`);
      unmatched.push(`${city.city}, ${country.country}`);
      continue;
    }

    [city.rent1, city.rent2, city.rent3] = row.rents;
    city.avg = Math.round(row.rents.filter(Number.isFinite).reduce((sum, value) => sum + value, 0) / row.rents.filter(Number.isFinite).length);
    city.currency = row.currency;
    city.sourceUrl = sourceUrl;
    delete city.source;
    city.sourceName = 'Global Property Guide';
    city.sourceUpdatedAt = sourceUpdatedAt;
    city.retrievedAt = retrievedAt;
    city.unavailableBedrooms = row.rents.flatMap((value, index) => value == null ? [index + 1] : []);
    delete city.retired;
    delete city.retirementReason;
    migrated.push(`${city.city}, ${country.country}`);
  }
}

const currenciesByCountry = new Map();
for (const country of dataset) {
  const values = new Set(country.cities.filter(city => !city.retired).map(city => city.currency));
  currenciesByCountry.set(country.country, [...values]);
}
const mixedCurrencyCountries = [...currenciesByCountry].filter(([, currencies]) => currencies.length > 1);

const capture = {
  sourceName: 'Global Property Guide',
  sourceUrl,
  sourceUpdatedAt,
  retrievedAt,
  method: 'Expanded public table captured from the user-provided page text. Values retain the displayed EUR/USD symbol; n.a. is null.',
  sourceRecordCount: rows.length,
  records: rows,
};
fs.writeFileSync(path.join(repo, 'audits/gpg-rent-source-2026-09.json'), `${JSON.stringify(capture, null, 2)}\n`);
fs.writeFileSync(datasetPath, `${JSON.stringify(dataset)}\n`);
fs.writeFileSync(path.join(repo, 'public/rent-source.json'), `${JSON.stringify({
  name: 'Global Property Guide',
  url: sourceUrl,
  measure: 'median monthly asking rent',
  currencies: ['EUR', 'USD'],
  retrievedAt,
  lastUpdate: sourceUpdatedAt,
  sourceRecordCount: rows.length,
  verifiedProjectRecords: migrated.length,
  retiredProjectRecords: retired.length,
  note: 'Project city records are reconciled against exact country/city labels in the expanded September 2026 source table. Source rows marked n.a. are kept as null. Project locations absent from the captured table are retired and excluded from active totals.',
}, null, 2)}\n`);

console.log(JSON.stringify({
  sourceRecords: rows.length,
  migratedRecords: migrated.length,
  retiredRecords: retired.length,
  retired,
  unmatched,
  mixedCurrencyCountries,
  unavailableBedrooms: dataset.flatMap(country => country.cities.filter(city => city.unavailableBedrooms?.length).map(city => ({ country: country.country, city: city.city, bedrooms: city.unavailableBedrooms }))),
}, null, 2));
