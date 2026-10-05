# RentMap AdSense readiness — updated 5 October 2026

## Production correction — 5 October
Inspected the actual AdSense account: recorded issues are low-value content and ads on screens without publisher content; review is available. The Pages project has no Git integration, so earlier pushes had not updated production. Direct production deployment now publishes the refreshed rents, calculator, guide and methodology. Fixed null-price comparisons, related-card currencies and map source-currency conversion. Verified Sydney prices, calculator recalculation and globe rendering in Safari. See `audits/production-review-2026-10-05.md` for evidence and remaining limits. No review submitted; ads stay disabled. User reports independently researching the prices, which supports accuracy but is not retained evidence of a source-data licence.

## Findings and implementation plan
- Global ad loader appears on map, admin and all templated pages: remove ad execution site-wide; retain ownership meta tag and ads.txt. No ads until content and consent readiness are verified.
- Homepage is a full-screen map with little server-rendered explanation: keep the globe at / as requested; provide the editorial overview at /explore/ and redirect /map/ to /.
- City rents are a separate snapshot, not calculated from map listings. All 192 active rows match the user-provided expanded Global Property Guide capture and retain its displayed EUR/USD currency. The capture gives a table update month but not per-city observation dates or sample sizes; disclose these limits and retain no unsupported freshness claims.
- Country FAQs include unsupported worldwide comparisons and generic legal/deposit claims: replace with transparent dataset calculations and planning guidance.
- Remote-worker ranking duplicates cheapest ranking without remote-work evidence: replace with an original rental shortlist guide.
- Add an independent, editable budget calculator and explain its formulas and limitations.
- Add rendered-output checks for ad scripts, canonicals, internal links, robots directives, missing headings, unsupported freshness claims and sitemap consistency.

## Re-review gate
Do not automatically request AdSense review. A successful build is not Google approval.
Before requesting review, verify source URLs/observation dates/reuse rights for any snapshot pages proposed for indexing or advertising. Record real usage evidence if available; never fabricate traffic, testimonials or update dates. Configure and verify the required Google-certified consent platform before enabling ads for affected visitors. Review the deployed homepage, budget tool, methodology, guide and navigation. Keep admin, error and empty/loading screens ad-free. Globe advertising is a desired future option, subject to content and consent readiness; it is not permanently excluded.

## Policy sources
- https://support.google.com/publisherpolicies/answer/11112688
- https://support.google.com/adsense/answer/10015918
- https://support.google.com/adsense/answer/12169212

## Additional data-quality finding and current status (30 September 2026)
The expanded user-provided GPG capture contains 402 rows. The project now has 192 active rent records, each matched by exact country/city identity to a source row and verified for all three bedroom values and displayed currency. The capture is retained at `audits/gpg-rent-source-2026-09.json`; an automated audit compares every active project row against it. Source `n.a.` values are stored as null. Wellington and Chon Buri are absent from the capture; those two records are retired, their city pages are noindex, and neither appears in the sitemap. There are no duplicate active city/country identities.

The capture establishes the table's September 2026 update label and retrieval date, but not per-city observation dates or sample sizes. Permission/terms to reproduce GPG values remain unverified; attribution alone does not establish reuse rights.

The previous audit notes about 207 legacy rows and six active conflicts are historical and superseded by this reconciliation. There are now 192 active unique city/country records; two unmatched legacy records were retired and are noindex. Current audit results are in `audits/site-quality.json`.

The local Statistics Denmark HUS1 extract became stale: the live official table now uses a 2021=100 index base whereas the local extract was labeled 2015=100. Stale values have been removed from city and country page output and replaced with a link to the current HUS1 table until a verified new extract is recorded. Do not restore the old figures without checking current definitions and selections.

## Implemented and checked
- Ad script removed globally; ownership meta and ads.txt retained. Admin, error and ranking routes explicitly noindex. City and country pages remain indexable and are included in the sitemap.
- The overview at /explore/, rental budget tool, original shortlist guide and methodology provide server-rendered content; the globe is the homepage. /map/ redirects to /.
- False freshness/coverage and generic legal/deposit claims removed from public editorial pages; duplicate ranking replaced by distinct guide.
- All public editorial and legal pages use light styling. Error page offers useful navigation without ads.
- `npm run build` and `npm run audit:site`: rendered HTML, internal links, canonicals, robots, sitemap, JSON-LD syntax and ad-script absence. Latest source audit: 192/192 active values matched; 2 retired; 402 captured source rows; no errors.
- Browser: calculator example = 2,250 monthly / 750 remaining / 3,500 upfront / 40%; rent 1,200 = 2,450 / 550 / 3,700 / 46.7%; zero income avoids division; negative input clears outputs. At 390px no horizontal overflow.
- Relocated map initializes with markers and hides loading overlay. Third-party Cesium console errors observed despite working imagery; no claim of a clean third-party console.

## Remaining before a confident resubmission
1. Resolve permission/terms to reproduce the Global Property Guide rent data. If not granted, replace these values with data whose reuse is permitted or original inputs; attribution alone is not a license.
2. Refresh the HUS1 index from the current Statistics Denmark table only if keeping embedded values is useful. Verify the current 2021=100 base and chosen series/regions before publishing. Until then, visible city/country output links to the live source and does not display the stale extract.
3. Review genuine audience/indexing evidence in Search Console and analytics and the live production pages. No evidence was supplied or invented in this remediation.
4. Before enabling ads for EEA/UK/Switzerland visitors, configure and test a Google-certified CMP integrated with the IAB TCF. Ads remain disabled in this release. See [Google’s current publisher CMP requirement](https://support.google.com/adsense/answer/13554116).
5. Inspect account-side site/review availability with the publisher; do not submit automatically. No AdSense review was submitted by this task.
