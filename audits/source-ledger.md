# Source ledger

Reviewed: 27 September 2026 (repository and public-source review)

This ledger records what the current repository can prove. Missing metadata remains unknown; the review date is not an observation or refresh date.

| Dataset / surface | Attribution and source evidence | Observation date | Retrieval / import evidence | Currency / FX basis | Coverage | Reuse / permission |
|---|---|---|---|---|---|---|
| Stored city snapshot, `public/avg-rent.json` | Existing import attributes figures to [GlobalPropertyGuide rental-yield research](https://www.globalpropertyguide.com/rental-yields). Its public methodology describes 1-, 2- and 3-bedroom median asking rents sourced from a local property platform, but does not prove the provenance of this older import. | Unknown per record | `git` shows the first committed import in `e14e646` on 15 August 2026; no source capture or importer script is present in this checkout. | Values are stored as USD. Per-record original currency, conversion date, rate and rounding basis are unknown. | 207 records, 196 distinct city-country pairs across 71 countries; six city identities have conflicting records. Missing cities are not evidence of zero or rank. | No reuse licence, permission, or terms record is retained. Public attribution is not permission to republish. |
| Listing feed / map | Listing schema requires an original `source_url`; API stores `source_site`, optional `listing_date`, currency and submitted listing details. | Per listing: `listing_date` when supplied; otherwise the API may default to submission date. | Schema and handlers are present in `schema.sql`, `worker-api.js` and `functions/api/index.js`. Live database contents and crawler history were not inspected in this run. | Submitted listing currency is retained. No claim is made about conversions unless displayed by the frontend's approximate rates. | Current listing visibility is filtered to verified, non-hidden records within the recent-date window; actual live count is not established here. | User submission terms, source-site terms and permission to republish listing facts/links require separate verification; no blanket permission is assumed. |
| Danish rent index | [Statistics Denmark HUS1](https://www.statbank.dk/HUS1), stored in `src/data/dst-index.json`. | Stored period `2026K2`; this is the statistical period, not the repository review date. | File records `updated: 2026-08-31`. | Official index, base 2015=100; not USD rent and not converted. | Denmark national and five regions represented in the stored file. It is not city-specific asking-rent data. | Official source is linked; licence/terms should still be checked before new redistribution or bulk reuse. |

## Pipeline findings

- `public/avg-rent.json` has no row-level source URL, source page, observation date, sample size, original currency, FX date, or reuse evidence. The site must not present those fields as known.
- The repository contains implementation history for the overlay, but no recoverable generator/import script or raw source export for the snapshot. The commit date is provenance of the file, not provenance of the underlying rents.
- Listing records and the stored snapshot are separate datasets. Listing-level source fields must not be used to imply that they support the snapshot figures.
- The current snapshot attribution and methodology link are useful context only; they do not resolve rights, freshness, duplicate identities, or the six conflicting records.

## Readiness consequence

The ledger improves traceability but does not clear the provenance gate. Next action: inspect the original snapshot source/export outside this checkout if available, or preserve the snapshot as an explicitly unverified historical reference and resolve the six duplicate identities before treating any headline as reliable.

## Day 2 morning — Cairo, Munich and Metro Manila

The current Global Property Guide city pages provide useful comparison evidence, but do not reconstruct the imported rows' historical provenance. The live pages are updated datasets and their district labels, currencies and observation periods are not present in `public/avg-rent.json`.

| Identity | Stored conflicting rows | Recoverable source evidence | Decision |
|---|---|---|---|
| Cairo, Egypt | `$740/$1,020/$1,020`; `$680/$830/$1,110` | GPG's current Egypt page shows the first triplet under New Cairo and the second under 6th of October, while its Cairo all-locations series is different. [Source](https://www.globalpropertyguide.com/middle-east/egypt/rental-yields) | Do not merge or relabel. The exact match suggests a possible historical district export, but the missing date and district field make that inference non-verifiable. |
| Munich, Germany | `$1,508/$2,041/$2,772`; `$1,484/$1,913/$2,296` | GPG's current Germany page distinguishes District of Munich, named districts and Munich all locations, with different current figures and EUR labels. [Source](https://www.globalpropertyguide.com/europe/germany/rental-yields) | Unresolved. No source row can be tied to either stored triplet without the original export/date/currency basis. |
| Metro Manila, Philippines | `$840/$1,680/$3,570`; `$660/$1,470/$2,790`; `$420/$840/$1,600` | GPG's current Philippines page shows the first triplet for Taguig City, the second for Metro Manila all locations, and the third for Metro Manila (Manila City). [Source](https://www.globalpropertyguide.com/asia/philippines/rental-yields) | Do not collapse. The exact matches expose likely geographic variants, but the import did not retain those labels or the observation date, so the public city headline remains an unresolved first-record presentation. |

This review strengthens the explanation of why duplicates exist but does not clear the material-claims gate. No numeric data was changed: the three city pages already show all variants and warn that the headline is not reconciled. Required remediation remains either recovery of the original export with dates/labels/rights or removal of these snapshot figures from reliable headline use.
