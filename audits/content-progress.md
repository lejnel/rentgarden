# Content readiness progress
Target decision: 4 October 2026. Plan: ../ADSENSE_WEEK_PLAN.md.
Completed: seven-day plan prepared; existing globe homepage, full sitemap and ad-disable safeguards retained. Day 1 morning route/content inventory recorded in audits/route-inventory.md.
Completed: Day 1 evening — reviewed the snapshot history, listing schema/handlers and public source methodology; created audits/source-ledger.md with known evidence and explicit unknowns.
Historical note (superseded by the September 28, 2026 reconciliation below): Day 2 checks flagged Cairo, Munich, Metro Manila, Barcelona, Dubai and Abu Dhabi as needing source/geographic review. Those interim notes preceded the user's full expanded source-table capture and should not be read as the current data audit.

Completed: September 28, 2026 — refreshed 192 exact city/country matches against the user-provided Global Property Guide table capture (402 unique source rows). Retired and cleared Wellington and Chon Buri because no exact matching source rows were present. The site audit verifies every active record against the capture. Individual city observation dates and republishing rights remain unverified.
Completed: Day 3 morning — tightened shared city/country calculations, added record-vs-city coverage counts, linked source methodology beside snapshot figures, and clarified that country headlines are record-weighted arithmetic means rather than national estimates. No current-price claims were added.
Completed: Day 3 follow-up — retired records are excluded from current rankings and sitemap, and conflicting city pages no longer publish an unverified record as a city average.
Latest data remediation (28 September 2026): imported the 402-row expanded Global Property Guide capture. All 192 active project city records match its exact country/city labels, three bedroom values (including explicit unavailable values), and displayed EUR/USD currency. Wellington and Chon Buri are absent from the capture and are retired/noindex. `npm run build` and `npm run audit:site` pass; the audit compares every active project row against the saved capture.
Remaining blockers: reuse permission/terms for the captured rents are not established; the source gives a table update month but no per-city observation date or sample size. Other AdSense review gates (deployed-site review and consent configuration before ads) remain.
Evidence: audits/route-inventory.md; audits/source-ledger.md; audits/site-quality.json; ADSENSE_READINESS.md records the current baseline.

Standing requirement: phone-first development; follow the mobile acceptance checks in ADSENSE_WEEK_PLAN.md for every UI change.
