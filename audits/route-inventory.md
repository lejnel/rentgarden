# Public route and content inventory

Run date: 27 September 2026

## Counts

The route generation inputs and the checked-in site audit report classify the published surface as follows:

| Route group | Count | Template / content status | Source status |
| --- | ---: | --- | --- |
| Globe homepage `/` | 1 | Interactive listing map and average-rent overlay | Listing records carry source fields where supplied; the stored rent overlay is attributed to GlobalPropertyGuide but lacks observation and FX dates |
| Editorial / utility routes | 6 | `explore`, `about`, `rent-budget`, `best-cities-for-remote-workers`, `privacy`, `terms` | Editorial explanations and calculations are in source; ranking/snapshot claims inherit the stored-data provenance gap |
| Country snapshot routes | 71 | `src/pages/countries/[slug].astro`; one page per `avg-rent.json` country entry | Stored USD city records attributed to GlobalPropertyGuide; original page, observation date, sample size, FX date and reuse permission are not retained |
| City snapshot routes | 196 distinct city-country pairs | `src/pages/rent-prices/[slug].astro`; 207 source records collapse to 196 route identities | Same stored snapshot gap; six identities contain conflicting records and are explicitly flagged on city pages |
| Generated sitemap URLs | 274 | Canonical public routes from `src/pages/sitemap.xml.ts` | Includes the globe, six editorial routes, 71 country routes and 196 distinct city routes |
| Non-indexed utility / ranking routes | 4 | Present in the built site but excluded from the sitemap | Not part of the canonical content inventory |

The repository's `audits/site-quality.json` reports 207 snapshot records, 196 distinct city-country pairs, 71 countries, 278 HTML pages, 4 noindex utility/ranking pages, and no recorded build-audit errors. The 278 HTML-page figure includes the 274 sitemap URLs plus four non-indexed utility/ranking pages.

## Content and provenance findings

- Every country and city snapshot page currently labels the values as stored USD references and states that observation dates are unavailable.
- The six conflicting identities are Cairo, Munich, Metro Manila, Barcelona, Dubai and Abu Dhabi. Their source record counts are 2, 2, 3, 2, 6 and 2 respectively.
- The country template says repeated city names have unresolved values; the city template shows all records but uses the first imported record for its headline. These remain readiness blockers until source evidence resolves them or the headline is no longer presented as a reliable city figure.
- The dataset contains no per-record source URL, observation date, sample size, exchange-rate date or reuse-permission field. The source ledger must therefore distinguish known attribution from unknown provenance rather than treating missing fields as verified.
- The route set preserves `/` as the globe homepage and does not use a blanket noindex workaround. Snapshot pages remain available for exploration while their provenance is reviewed.

## Next dependency

Review the original data pipeline and source links/reuse terms, then create a compact source ledger covering attribution, observation date, retrieval date, currency/FX basis, coverage and permission evidence. Do not research or rewrite the route set until that ledger identifies the recoverable gaps.
