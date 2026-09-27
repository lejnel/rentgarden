# RentMap AdSense remediation — 27 September 2026

## Findings and implementation plan
- Global ad loader appears on map, admin and all templated pages: remove ad execution site-wide; retain ownership meta tag and ads.txt. No ads until content and consent readiness are verified.
- Homepage is a full-screen map with little server-rendered explanation: give / a useful editorial homepage and move the map intact to /map/.
- City averages are a separate snapshot, not calculated from map listings. Source dates, sample sizes and FX dates are absent: disclose limitations, remove daily/current-year claims and noindex snapshot routes until provenance is reviewed.
- Country FAQs include unsupported worldwide comparisons and generic legal/deposit claims: replace with transparent dataset calculations and planning guidance.
- Remote-worker ranking duplicates cheapest ranking without remote-work evidence: replace with an original rental shortlist guide.
- Add an independent, editable budget calculator and explain its formulas and limitations.
- Add rendered-output checks for ad scripts, canonicals, internal links, robots directives, missing headings, unsupported freshness claims and sitemap consistency.

## Re-review gate
Do not automatically request AdSense review. A successful build is not Google approval.
Before requesting review, verify source URLs/observation dates/reuse rights for any snapshot pages proposed for indexing or advertising. Record real usage evidence if available; never fabricate traffic, testimonials or update dates. Configure and verify the required Google-certified consent platform before enabling ads for affected visitors. Review the deployed homepage, budget tool, methodology, guide and navigation. Keep map, admin, error and other utility screens ad-free.

## Policy sources
- https://support.google.com/publisherpolicies/answer/11112688
- https://support.google.com/adsense/answer/10015918
- https://support.google.com/adsense/answer/12169212

## Additional data-quality finding
The snapshot contains 207 records but only 196 distinct city-country pairs. Six city names recur with different values (Cairo, Munich, Metro Manila, Barcelona, Dubai and Abu Dhabi). No date or district label explains the difference. City routes are now deduplicated explicitly; affected pages display all conflicting records and identify the headline as the first imported record. Country calculations are described as record-weighted, not city-weighted. Do not claim these records are reconciled.

## Implemented and checked
- Ad script removed globally; ownership meta and ads.txt retained. Utility routes and snapshots explicitly noindex.
- Homepage, rental budget tool, original shortlist guide and methodology provide server-rendered content; the original globe remains at /map/.
- False freshness/coverage and generic legal/deposit claims removed from public editorial pages; duplicate ranking replaced by distinct guide.
- All public editorial and legal pages use light styling. Error page offers useful navigation without ads.
- `npm run build` and `npm run audit:site`: rendered HTML, internal links, canonicals, robots, sitemap, JSON-LD syntax and ad-script absence.
- Browser: calculator example = 2,250 monthly / 750 remaining / 3,500 upfront / 40%; rent 1,200 = 2,450 / 550 / 3,700 / 46.7%; zero income avoids division; negative input clears outputs. At 390px no horizontal overflow.
- Relocated map initializes with markers and hides loading overlay. Third-party Cesium console errors observed despite working imagery; no claim of a clean third-party console.

## Remaining before a confident resubmission
1. Reconcile six conflicting city identities and recover source observations, dates and permission/terms for reused data. Noindex and disclosures are mitigations, not a substitute for this work.
2. Review any genuine audience evidence in Search Console/analytics; no evidence was supplied or invented in this remediation.
3. Before enabling personalized advertising for EEA/UK/Switzerland visitors, configure and test an appropriate certified CMP: https://support.google.com/adsense/answer/13554116 . Ads remain disabled in this release.
4. Request review manually only when satisfied the remaining data issues are resolved. No AdSense review was submitted by this task.
