# RentMap AdSense remediation — 27 September 2026

## Findings and implementation plan
- Global ad loader appears on map, admin and all templated pages: remove ad execution site-wide; retain ownership meta tag and ads.txt. No ads until content and consent readiness are verified.
- Homepage is a full-screen map with little server-rendered explanation: keep the globe at / as requested; provide the editorial overview at /explore/ and redirect /map/ to /.
- City averages are a separate snapshot, not calculated from map listings. Source dates, sample sizes and FX dates are absent: disclose limitations, remove daily/current-year claims and retain indexable city/country routes with clear limitations.
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

## Additional data-quality finding and current status (28 September 2026)
The expanded user-provided GPG capture contains 402 rows. The project now has 192 active rent records, each matched by exact country/city identity to a source row and verified for all three bedroom values and displayed currency. The capture is retained at `audits/gpg-rent-source-2026-09.json`; an automated audit compares every active project row against it. Source `n.a.` values are stored as null. Wellington and Chon Buri are absent from the capture; those two records are retired, their city pages are noindex, and neither appears in the sitemap. There are no duplicate active city/country identities.

The capture establishes the table's September 2026 update label and retrieval date, but not per-city observation dates or sample sizes. Permission/terms to reproduce GPG values remain unverified; attribution alone does not establish reuse rights.

## Implemented and checked
- Ad script removed globally; ownership meta and ads.txt retained. Admin, error and ranking routes explicitly noindex. City and country pages remain indexable and are included in the sitemap.
- The overview at /explore/, rental budget tool, original shortlist guide and methodology provide server-rendered content; the globe is the homepage. /map/ redirects to /.
- False freshness/coverage and generic legal/deposit claims removed from public editorial pages; duplicate ranking replaced by distinct guide.
- All public editorial and legal pages use light styling. Error page offers useful navigation without ads.
- `npm run build` and `npm run audit:site`: rendered HTML, internal links, canonicals, robots, sitemap, JSON-LD syntax and ad-script absence.
- Browser: calculator example = 2,250 monthly / 750 remaining / 3,500 upfront / 40%; rent 1,200 = 2,450 / 550 / 3,700 / 46.7%; zero income avoids division; negative input clears outputs. At 390px no horizontal overflow.
- Relocated map initializes with markers and hides loading overlay. Third-party Cesium console errors observed despite working imagery; no claim of a clean third-party console.

## Remaining before a confident resubmission
1. Verify reuse permission/terms for the reproduced Global Property Guide data. The current table rows and currencies have been reconciled, but attribution alone does not establish permission.
2. Review any genuine audience evidence in Search Console/analytics; no evidence was supplied or invented in this remediation.
3. Before enabling personalized advertising for EEA/UK/Switzerland visitors, configure and test an appropriate certified CMP: https://support.google.com/adsense/answer/13554116 . Ads remain disabled in this release.
4. Request review manually only when satisfied the remaining data issues are resolved. No AdSense review was submitted by this task.
