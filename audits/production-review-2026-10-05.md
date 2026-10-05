# Production review — 5 October 2026

AdSense account inspected in Safari. RentMap has two recorded rejection reasons: low-value content and Google-served ads on screens without publisher content. Last status update was 20 September 2026. A request-review control is available; no review was submitted.

Cloudflare Pages project `rentgarden` serves `rentmap.net` and has no Git integration. This explains why repository pushes did not update production. A direct production deployment now publishes the refreshed dataset and site remediation.

Verified in Safari after deployment: Sydney shows USD 1,990 / 2,805 / 4,325 and a combined reference of 3,040; source currency and September 2026 metadata are visible. Nearby Andorra is displayed in EUR. The budget calculator at rent 1,200 shows monthly outgoings 2,450, remaining 550, upfront cash 3,700 and housing share 46.7%. Homepage globe renders with listing clusters and visible source/coverage explanation.

Code corrections: missing bedroom values no longer produce zero-price comparisons or misleading inversion warnings; retired records excluded from related-city cards; cards retain each city's own currency; map hover conversion uses the source currency. Map explanation repositioned to avoid property-filter overlap.

Local build and full rendered audit pass: 192 active records match the retained capture; two retired records; 276 rendered pages; zero audit errors. Advertising execution remains disabled, retaining the ownership tag and ads.txt. Original budget tool, shortlist guide, methodology and calculated comparisons are published.

Remaining evidence limitations: mobile behavior has not been reverified in this batch; original data reuse permission is not independently documented (user confirms independent price research); audience evidence and Google's qualitative content decision are not established by code checks. Certified consent setup remains required before personalized ads for affected regions. Do not claim Google approval or attest all issues resolved solely from deployment.
