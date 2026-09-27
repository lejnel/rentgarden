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
