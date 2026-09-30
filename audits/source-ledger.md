# Source ledger

## September 2026 reconciliation

On 2026-09-28, the user supplied the expanded Global Property Guide rent table text and saved page HTML after opening the source page. The capture contains 402 unique country/city rows. The project’s 194 prior records were compared against that capture: 192 exact country/city identities were refreshed from the captured 1-, 2-, and 3-bedroom values and displayed currency; Wellington, New Zealand and Chon Buri, Thailand were not present and were retired with their rent values cleared. The reproducible capture is stored in `audits/gpg-rent-source-2026-09.json`; import logic is in `scripts/import-gpg-rent-capture.mjs`. The site audit now checks all 192 active records against this source capture.

This reconciliation verifies the values against the user-provided page capture, not reuse rights. The source page labels its dataset last updated September 2026 but does not provide individual city observation dates in the capture. Permission to republish the source data remains unverified; do not represent the site as fully cleared for AdSense until reuse rights and the remaining site-wide policy/content review are addressed.

Reviewed: 27 September 2026 (repository and public-source review)

This ledger records what the current repository can prove. Missing metadata remains unknown; the review date is not an observation or refresh date.

| Dataset / surface | Attribution and source evidence | Observation date | Retrieval / import evidence | Currency / FX basis | Coverage | Reuse / permission |
|---|---|---|---|---|---|---|
| Global Property Guide city snapshot, `public/avg-rent.json` | All 192 active records match exact country/city, bedroom values and displayed currencies in the user-provided expanded page capture at `audits/gpg-rent-source-2026-09.json`. | Unknown per city | User-provided page capture retrieved 2026-09-28; source table labels itself updated September 2026. Reproducible importer is `scripts/import-gpg-rent-capture.mjs`. | Published EUR/USD currency retained; no FX conversion applied in refreshed records. | 192 active unique city-country pairs across 71 countries; 2 legacy locations absent from capture were retired. | Permission/terms to reproduce the rent data remain unverified; attribution alone is not permission. |
| Listing feed / map | Listing schema requires an original `source_url`; API stores `source_site`, optional `listing_date`, currency and submitted listing details. | Per listing: `listing_date` when supplied; otherwise the API may default to submission date. | Schema and handlers are present in `schema.sql`, `worker-api.js` and `functions/api/index.js`. Live database contents and crawler history were not inspected in this run. | Submitted listing currency is retained. No claim is made about conversions unless displayed by the frontend's approximate rates. | Current listing visibility is filtered to verified, non-hidden records within the recent-date window; actual live count is not established here. | User submission terms, source-site terms and permission to republish listing facts/links require separate verification; no blanket permission is assumed. |
| Danish rent index | [Statistics Denmark HUS1](https://m.statbank.dk/TableInfo/HUS1?lang=en); historical extract remains in `src/data/dst-index.json` but is no longer displayed. | Current table page shows periods through 2026Q2. | Checked 2026-09-30. | Official index; current table metadata describes a 2021=100 base, unlike the stale local extract marked 2015=100. | Table offers Denmark and five regions plus housing types; not city-specific asking-rent prices. | Official source linked; terms still require review before bulk reuse. |

## Pipeline findings

- The refreshed `public/avg-rent.json` has row-level source URL, retrieval date, source update month and displayed currency. Per-city observation date, sample size and reuse evidence remain unknown.
- The original old snapshot had no recoverable source export, but the user later supplied the expanded table capture. The import script and capture are now retained for reproducibility.
- Listing records and the stored snapshot are separate datasets. Listing-level source fields must not be used to imply that they support the snapshot figures.
- The exact source-row match resolves the earlier duplicate-identity discrepancy for active records. It does not resolve per-city dates, sample sizes or reuse rights.

## Readiness consequence

The refresh establishes row-level value and currency matches to the captured table, but does not clear the reuse-rights gate. The HUS1 local extract also became stale when its base period changed; its outdated values have been removed from visible pages pending an accurate refresh.

## Day 2 morning — Cairo, Munich and Metro Manila

The current Global Property Guide city pages provide useful comparison evidence, but do not reconstruct the imported rows' historical provenance. The live pages are updated datasets and their district labels, currencies and observation periods are not present in `public/avg-rent.json`.

| Identity | Stored conflicting rows | Recoverable source evidence | Decision |
|---|---|---|---|
| Cairo, Egypt | `$740/$1,020/$1,020`; `$680/$830/$1,110` | GPG's current Egypt page shows the first triplet under New Cairo and the second under 6th of October, while its Cairo all-locations series is different. [Source](https://www.globalpropertyguide.com/middle-east/egypt/rental-yields) | Do not merge or relabel. The exact match suggests a possible historical district export, but the missing date and district field make that inference non-verifiable. |
| Munich, Germany | `$1,508/$2,041/$2,772`; `$1,484/$1,913/$2,296` | GPG's current Germany page distinguishes District of Munich, named districts and Munich all locations, with different current figures and EUR labels. [Source](https://www.globalpropertyguide.com/europe/germany/rental-yields) | Unresolved. No source row can be tied to either stored triplet without the original export/date/currency basis. |
| Metro Manila, Philippines | `$840/$1,680/$3,570`; `$660/$1,470/$2,790`; `$420/$840/$1,600` | GPG's current Philippines page shows the first triplet for Taguig City, the second for Metro Manila all locations, and the third for Metro Manila (Manila City). [Source](https://www.globalpropertyguide.com/asia/philippines/rental-yields) | Do not collapse. The exact matches expose likely geographic variants, but the import did not retain those labels or the observation date, so the public city headline remains an unresolved first-record presentation. |

This review strengthens the explanation of why duplicates exist but does not clear the material-claims gate. No numeric data was changed: the three city pages already show all variants and warn that the headline is not reconciled. Required remediation remains either recovery of the original export with dates/labels/rights or removal of these snapshot figures from reliable headline use.

## Day 2 evening — Barcelona, Dubai and Abu Dhabi

The current Global Property Guide pages expose plausible geographic variants for each remaining conflict, but they do not reconstruct the imported rows' historical labels, dates, currency basis or reuse rights.

| Identity | Stored conflicting rows | Recoverable source evidence | Decision |
|---|---:|---|---|
| Barcelona, Spain | `$2,552/$3,074/$3,479`; `$1,844/$2,668/$3,178` | The current Spain page separates Barcelona from named areas including Ciutat Vella, Sant Martí, Sarrià-Sant Gervasi, Sants-Montjuïc and Horta Guinardó, with materially different asking rents. [Source](https://www.globalpropertyguide.com/europe/spain/rental-yields) | Unresolved. Do not assign either stored triplet to Barcelona city or a district without the original export/date/label. |
| Dubai, UAE | six rows: `$3,060/$5,220/$11,570`; `$2,500/$3,520/$5,560`; `$2,280/$3,400/$4,770`; `$2,200/$3,510/$5,790`; `$2,130/$3,400/$4,310`; `$1,700/$2,610/$3,400` | The current UAE page distinguishes Downtown, Palm Jumeirah, Dubai Marina, Business Bay, JLT, JVC, Arjan, Al Furjan and Dubai all locations. [Source](https://www.globalpropertyguide.com/middle-east/united-arab-emirates/rental-yields) | Unresolved. The matching-looking values may represent districts or different exports, but the snapshot has no district/date field. |
| Abu Dhabi, UAE | `$2,160/$3,180/$3,900`; `$2,040/$2,930/$3,860` | The current UAE page distinguishes Al Reem Island, Al Raha Beach, Yas Island and Abu Dhabi all locations. [Source](https://www.globalpropertyguide.com/middle-east/united-arab-emirates/rental-yields) | Unresolved. Do not merge, relabel or present a first row as the verified city headline. |

Historical note (superseded by the September 2026 reconciliation above): the live pages were initially treated only as methodology evidence, and six duplicate identities were unresolved. Those findings were resolved for active records using the user-provided expanded source table; observation dates, sample sizes and reuse permission remain unknown.
