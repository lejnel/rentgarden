# AdSense verification — 5 October 2026

Decision: **NOT READY for a confident reapplication**. This review uses the current `4641bc8` repository baseline, not the obsolete 207-row dataset. Source dates and sample counts absent from the source are disclosed limitations, not invented Google approval requirements. Traffic has no fabricated minimum threshold.

## Current evidence
- Latest upstream retained capture: 402 source rows; all 192 active project records match bedroom values and currencies. Two retired records are excluded; no active duplicate identities. Build and rendered audit pass: 276 HTML pages, no errors.
- Existing original budget tool, rental shortlist worksheet, explicit methodology, source-linked comparisons and trust pages are present. Globe remains `/`. Ads remain disabled; ownership meta and ads.txt are retained.
- Prior repository production review records AdSense rejection reasons as low-value content and ads without publisher content, with review available. This run did not independently inspect an authenticated AdSense account or submit review.
- Initial checkout was stale. An obsolete intermediate artifact was briefly deployed, then the current upstream release was rebuilt, audited and redeployed to production. That intermediate commit is preserved only on `codex/adsense-legacy-review` and is superseded, not merged.
- Additional repair on current code: provider attribution is visible above navigation, listing freshness wording is bounded, and phone attribution/listing/map action lanes are separate. Mobile/browser verification and final production evidence below.

## Concrete unresolved work
1. **Dataset reuse basis:** the publisher says they collected the data themselves, inspired by internet sites. The current repository nevertheless imports and verifies exact rows against a GPG capture. [GPG terms](https://www.globalpropertyguide.com/terms-of-use), checked today, limit use to personal/non-commercial purposes and require prior written consent for reproduction/distribution/scraping. Obtain permission for the reused table or replace it with documented independent/licensed inputs. This is a source-terms finding, not a legal conclusion about the publisher's conduct.
2. **Qualitative content decision:** code checks cannot establish that Google's low-value-content rejection has been resolved across every city/country page. The calculator, worksheet and comparisons improve value; further independent local research remains preferable to a table-first site. Google makes the approval decision.
3. **Ad activation:** configure and test a [Google-certified TCF CMP](https://support.google.com/adsense/answer/13554116) for personalized ads to affected EEA/UK/Swiss users. No certified configuration has been verified. Keep loading, empty, error and admin screens ad-free.

[Google readiness guidance](https://support.google.com/adsense/answer/12176698) requires valuable content, usable navigation and crawler access. Missing per-city sample sizes alone are not an AdSense prohibition. No automatic review or advertising activation occurred.

## Final verified release
- Commit `39953d0` pushed to `origin/main`; direct Cloudflare Pages production deployment `d8fb17c1` completed. Custom-domain browser confirms the updated listing-coverage wording and visible provider credits.
- All **270 production sitemap URLs** returned HTTP 200 with no detected ad loader or noindex directive. Evidence: `audits/adsense-live-2026-10-05.json`. This verifies availability, not Google's qualitative approval.
- Production Sydney page retains the September capture values USD 1,990 / 2,805 / 4,325 and combined USD 3,040, plus explicit source currency/update month.
- Phone globe verified at 360px and 390px with 320px overflow check; Sydney checked at 390px/320px. Final 390px bounds: controls end at y678, listing action occupies y696–744, credits y752–780, footer y793–837. No overlap between these lanes.
- Budget calculator at 320px: changing rent to 1,200 yields 2,450 monthly, 550 remaining, 3,700 upfront and 46.7% housing share. Desktop globe was also inspected; browser controls restored afterward. Physical-device performance remains unverified.
- Pre-existing modified `audits/content-progress.md` and untracked `src/data/place-routes.json` were preserved and excluded from commits. The old progress log is stale against the refreshed upstream dataset; this report supersedes its final assessment.
