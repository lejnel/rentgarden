# AdSense reapplication plan — status update 5 October 2026

Production fixes deployed directly to Cloudflare Pages after discovering this project does not deploy from Git pushes. Actual account rejection: low-value content and ads without publisher content. Sydney prices, calculator and globe verified in Safari; all active rents pass capture verification. Remaining: recheck mobile flows, document source reuse basis and review genuine audience evidence before attesting all issues resolved. See `audits/production-review-2026-10-05.md`. No automatic AdSense request.

## Outcome and boundaries
Prepare a defensible go/no-go decision on 4 October. Approval and Google's review time cannot be guaranteed. Keep the globe at `/`, preserve the light city/country pages and complete canonical sitemap. Ads remain disabled during remediation; globe ads remain a future option once content and consent requirements are met. Do not submit review automatically.

Current audited inventory: 192 active city records/routes and 71 country pages, plus two retired/noindex legacy city routes. The 192 active values and currency match the user-provided 402-row September 2026 Global Property Guide capture. Four earlier overlapping city/country tasks have been completed. Sample checks do not establish site-wide quality: remaining widespread thin or unsupported content blocks reapplication even if the schedule is complete.

## Phone-first development
Design and implement for phones first, then enhance for tablet and desktop. Use a narrow single-column base layout with larger-screen enhancements. Validate changed user flows at 360px and 390px widths before desktop, and check 320px for overflow. Prioritize readable text, touch targets around 44px, visible focus, and controls that work without hover. Test long content, open menus, forms with the keyboard, and portrait/landscape layouts. Keep map controls, listing panels and navigation reachable without overlap; account for mobile browser bars and safe areas. Prefer lightweight assets and defer expensive work so the globe remains usable on phones. Browser viewport checks are not proof of real-device performance; record that limitation when physical-device testing is unavailable.

Apply these checks to each changed UI batch rather than redesigning the whole site during a content-only run. Phone usability is a release requirement, not a final desktop adaptation.

## Remaining work to 4 October
This replaces the expired seven-day schedule. Do not mark an owner-only or evidence-dependent item complete without the publisher's confirmation.

| Date | Remaining task | Evidence / completion condition |
|---|---|---|
| 30 Sep | Verify current Statistics Denmark HUS1 definitions and stop showing stale local values. | Done: current table uses a changed 2021=100 base; old 2015=100 values removed from visible pages and replaced with source links. Refresh embedded values only after verifying table selections/series. |
| 1 Oct | Resolve GPG data reuse permission; if unavailable, choose a licensed or original dataset and review content value beyond the imported table. | Written terms/permission or a documented replacement decision. Source matching alone does not clear rights. Do not assume permission from attribution. |
| 2 Oct | Review publisher identity/contact, corrections process, privacy disclosures, ownership verification and Search Console/analytics evidence with the site owner. | Public statements accurate; actual account/evidence reviewed by owner; unknowns remain explicitly open. |
| 3 Oct | Review deployed production routes and mobile behavior; check indexability, map/error/loading states and policy compliance. | Production observations recorded for homepage, explore, calculator, about, representative city/country pages and retired pages; test at 320/360/390px or mark unable to verify. |
| 4 Oct | Re-check current Google policy and account-side readiness; issue evidence-based go/no-go. | READY only if all gates below pass; otherwise NOT READY with blockers. Never submit review automatically. |

## Readiness gates — all required for READY
- [x] Route inventory covers route groups and generated counts; audit passes. [ ] Substantive value across the city/country page family and live audience/indexing evidence still need production/owner review; disclosures alone do not establish value.
- [ ] Material rent claims match the captured source row and currencies. [ ] Reuse rights, per-city observation dates and sample sizes remain unresolved; resolve or replace/remove the affected snapshot before a confident resubmission. No invented freshness, rights, prices or sample sizes.
- [ ] Reference pages demonstrate original useful guidance; shared templates offer meaningful comparisons rather than city-name substitutions alone.
- [ ] Globe remains the homepage and works on desktop/mobile; its purpose, sources, coverage and limitations are clear. Ads do not execute on loading, empty, error or admin screens.
- [x] About, contact, methodology/corrections and privacy routes exist in the repository. [ ] Confirm statements against real operations; owner must verify Search Console ownership and any future certified CMP setup.
- [x] Local build, rendered audit, internal links, canonicals and sitemap pass after the current code changes. [ ] Verify pushed/deployed production output. No site-wide noindex workaround.
- [ ] Final report lists evidence, deployed commits, unresolved issues and account-side availability of review if accessible. Traffic is neither fabricated nor treated as a made-up minimum threshold.

## Token-efficient execution
Use the current repository evidence and only relevant files. One scoped issue or at most two researched pages per run; shared fixes may affect all routes. Cache source evidence in a small ledger; fetch again only for a freshness-sensitive claim or final policy check. Avoid repeated broad audits and cosmetic changes. Run the full build/audit once per implementation batch, plus targeted browser checks. Use a short progress record: completed, evidence, blockers, next action. Preserve unrelated changes.

Commit/push verified changes; deploy only when site output changed, explicitly to Cloudflare Pages `rentgarden` production branch `main`. Verify production before calling it published. Documentation-only batches need no deployment. On 4 October, report the decision; do not submit review without the user.

## Policy references
- https://support.google.com/publisherpolicies/answer/11112688 — valuable publisher content must be central; empty, navigation-only and error screens cannot host Google ads.
- https://support.google.com/adsense/answer/10015918 — content and user experience guidance (recheck at final review).
- https://support.google.com/adsense/answer/13554116 — consent platform requirements where applicable (verify before activation).

The schedule and quality gates above are our implementation plan, not Google-mandated page counts, waiting periods or an approval guarantee.
