# Public route and content inventory

Run date: 30 September 2026 (after source-table reconciliation and HUS1 correction)

## Counts

The route generation inputs and the checked-in site audit report classify the published surface as follows:

| Route group | Count | Template / content status | Source status |
| --- | ---: | --- | --- |
| Globe homepage `/` | 1 | Interactive listing map and average-rent overlay | Listing records carry source fields where supplied; the stored rent overlay matches the captured Global Property Guide table, but lacks per-city observation dates and sample counts |
| Editorial / utility routes | 6 | `explore`, `about`, `rent-budget`, `best-cities-for-remote-workers`, `privacy`, `terms` | Editorial explanations and calculations are in source; ranking/snapshot claims inherit the stored-data provenance gap |
| Country snapshot routes | 71 | `src/pages/countries/[slug].astro`; one page per `avg-rent.json` country entry | 192 active city records reconcile exactly to the saved September 2026 GPG capture; per-city dates, sample sizes and reuse permission remain unknown |
| City snapshot routes | 194 distinct city-country pairs | `src/pages/rent-prices/[slug].astro`; 192 active records plus 2 retired locations | Active routes match the capture; Wellington and Chon Buri are retired/noindex because absent from the source capture |
| Generated sitemap URLs | 270 | Canonical public routes from `src/pages/sitemap.xml.ts` | Includes the globe, six editorial routes, 71 country routes and 192 active city routes |
| Non-indexed utility / ranking / retired routes | 6 | Four utility/ranking routes plus two retired city pages | Excluded from the sitemap |

The repository's `audits/site-quality.json` reports 192 active snapshot records, 192 distinct active city-country pairs, 71 countries, 276 HTML pages, 4 noindex utility/ranking pages, 2 retired city pages, and no recorded build-audit errors. The 276 HTML pages include 270 sitemap URLs plus six noindex pages.

## Content and provenance findings

- Active rent records retain their displayed EUR/USD currency, source URL, retrieval date and September 2026 update label. The capture provides no per-city observation date or sample size.
- All 192 active city/country identities match one of the 402 rows in `audits/gpg-rent-source-2026-09.json`; the automated audit checks each rent value and currency. Wellington and Chon Buri were absent and are retired/noindex.
- The six formerly conflicting identities have been reconciled to exact source rows where present; no duplicate active city/country pairs remain.
- Reuse permission/terms remain unknown. Attribution is recorded but is not treated as a license.
- Statistics Denmark's current HUS1 table has changed its index base period since the stored extract. Stale embedded index values were removed from country and city pages pending a verified refreshed extract; pages link to the live official table instead.
- The route set preserves `/` as the globe homepage and does not use a blanket noindex workaround. Snapshot pages remain available for exploration while their provenance is reviewed.

## Next dependencies

Verify permission/terms for reuse of the captured GPG table; consider requesting permission or replacing reproduced values with independently licensed/original inputs. Then inspect the actual deployed routes, real analytics/Search Console evidence, AdSense account status, and consent setup before making a reapplication decision. The source capture and row-by-row verification are retained in `audits/gpg-rent-source-2026-09.json`.
