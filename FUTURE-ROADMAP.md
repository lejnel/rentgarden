# RentMap — Fremtidig roadmap

> Prioriteret backlog for at gøre RentMap attraktivt, troværdigt og hurtigt.
> Aktuel status: 8 lande og ca. 1.191 aktive listings.

## Fase 1 — Mere liv og flere brugerindsendelser

### 1. Synlig social proof på forsiden
**Prioritet:** Høj · **Effort:** Lille

Vis diskret på globussen:
- `1.191 active listings`
- `8 countries`
- `Updated today`
- `Add your rent`

Formål: Besøgende skal straks forstå, at siden har rigtig aktivitet.

### 2. Stærkere “Add your listing”-CTA
**Prioritet:** Høj · **Effort:** Lille

- Gør plus-knappen mere forklarende: `Add your rent price`
- Tilføj en lille tekst ved knappen: `Help build the world's rent map`
- Vis kort hvad brugeren får ud af at bidrage
- Gør det tydeligt at email kun bruges til moderation

### 3. “Recently added”
**Prioritet:** Høj · **Effort:** Middel

Et diskret panel med de seneste 5–10 indsendelser:
- By/land
- Pris
- Boligtype
- “Added 2 hours ago”

Det giver siden liv uden at kræve flere scrape-kilder.

### 4. Bedre indsendelses-flow
**Prioritet:** Høj · **Effort:** Middel

- Vis success-side/status efter indsendelse
- Validér pris, m², valuta og URL tydeligere
- Vis “Your listing is being reviewed”
- Bevar brugerens input ved fejl
- Vis land/valuta automatisk fra kortplaceringen

## Fase 2 — Data og troværdighed

### 5. Datakilde- og dato-badges
**Prioritet:** Høj · **Effort:** Lille

På hvert listing-panel:
- `Source: DotProperty`
- `Listed: 2026-08-12`
- `Active listing`
- Direkte link til original annoncen

### 6. Listing freshness
**Prioritet:** Høj · **Effort:** Middel

- Automatisk “Active / Older / Historical” status
- Udløb efter 12 måneder
- Vis kun friske listings som standard
- Historiske år kan stadig browses

### 7. Bedre dækning uden at overbelaste kortet
**Prioritet:** Høj · **Effort:** Middel

- Bevar max 100 synlige listings per område
- Vis `+260 more listings` i clusteret
- Tilføj “Show more” efter zoom
- Sørg for fair sampling, så de samme første 100 ikke altid vises

### 8. Datakvalitetskontrol
**Prioritet:** Middel · **Effort:** Middel

- Afvis koordinater uden for det valgte land
- Flag ekstreme priser
- Flag m² = 0 eller manglende valuta
- Dedup på source URL og listing-id
- Cron-advarsel hvis en kilde pludselig returnerer 0 listings

## Fase 3 — Flere lande

### 9. DotProperty Thailand
**Prioritet:** Høj · **Effort:** Middel

Thailand har en anden HTML-struktur end Vietnam/Philippines/Malaysia og skal have et særskilt parser-script.

### 10. Udvid DotProperty-kilder
**Prioritet:** Middel · **Effort:** Middel

Undersøg og tilføj hvis aktive:
- Cambodia
- Laos
- Myanmar
- Singapore
- Indonesien, hvis domænet kommer tilbage

### 11. Næste store markeder
**Prioritet:** Middel · **Effort:** Varierer

- Canada via Zumper eller Realtor
- UK via Rightmove
- Spanien/Italien/Portugal via Idealista
- Sverige via Hemnet
- Norge via Finn
- UAE via Property Finder/Bayut
- Australien via Realestate.com.au
- Brasilien via VivaReal/Zap

Hver ny kilde skal først testes for HTTP 200, data i HTML, dedup, geocoding og rate limits.

## Fase 4 — SEO og organisk vækst

### 12. Land- og by-sider
**Prioritet:** Høj · **Effort:** Stor

Generér SEO-sider som:
- `/rent-prices/denmark`
- `/rent-prices/copenhagen`
- `/rent-prices/vietnam`
- `/rent-prices/ho-chi-minh-city`

Siderne skal vise:
- Antal aktive listings
- Gennemsnitspris
- Pris pr. m²
- Seneste listings
- Link til globussen

### 13. Dynamisk sitemap
**Prioritet:** Middel · **Effort:** Middel

Sitemap skal indeholde de offentlige land- og by-sider, men aldrig `/admin`.

### 14. Delbare listing-links
**Prioritet:** Middel · **Effort:** Middel

Et listing skal kunne åbnes via URL, fx:
`rentmap.net/?listing=123`

Det gør deling, SEO og tilbagevendende besøg bedre.

## Fase 5 — UX og visualisering

### 15. Prisfilter
**Prioritet:** Middel · **Effort:** Middel

- Min/max månedlig husleje
- Pris pr. m²
- Valuta følger brugerens valg

### 16. Land- og byfilter
**Prioritet:** Middel · **Effort:** Middel

Globusoplevelsen bevares, men brugeren kan springe direkte til et land eller en by.

### 17. Prisudvikling
**Prioritet:** Middel · **Effort:** Stor

Når der er nok historiske data:
- Gennemsnitspris pr. måned
- Prisudvikling pr. by
- Sammenligning mellem lande

### 18. Flere listing-billeder
**Prioritet:** Lav · **Effort:** Stor

Kun hvis det kan gøres lovligt og med korrekt kildehenvisning. Ellers behold RentMap som et hurtigt pris- og geografikort.

## Fase 6 — Performance og drift

### 19. Cesium lazy/render optimization
**Prioritet:** Middel · **Effort:** Stor

- Undersøg `requestRenderMode`
- Reducér unødvendige renders
- Lazy-load flere globe-funktioner
- Mål især mobil performance før ændringer

### 20. API caching og pagination
**Prioritet:** Middel · **Effort:** Middel

- Public feed cachet kortvarigt
- Eventuel region-baseret loading
- Hent kun listings i relevant viewport ved store datamængder

### 21. Cron-dashboard
**Prioritet:** Middel · **Effort:** Middel

Admin-side med:
- Sidste kørsel pr. kilde
- Antal fundet/tilføjet
- Parser-fejl
- Geocoding-fejl
- Sidste succes

### 22. Privat analytics
**Prioritet:** Lav · **Effort:** Lille

Mål kun:
- Antal besøgende
- Klik på listings
- Klik på “Add your listing”
- Mest udforskede lande

Ingen unødvendig tracking af brugere.

## Anbefalet rækkefølge

1. Social proof på forsiden
2. Stærkere “Add your listing”-CTA
3. Recently added-panel
4. Data- og freshness-badges
5. Thailand-script
6. Land- og by-sider til SEO
7. Delbare listing-links
8. Pris- og landefiltre
9. Cron-dashboard
10. Cesium performance-optimering

## SEO-sammenligning med lignende side (Numbeo) — 24/8

Analyse af numbeo.com ("Cost of Living in Copenhagen. Aug 2026") mod rentmap.net:

### ⚡ Udført 24/8
- **Deploy af ventende SEO-arbejde** (commits 18:34-18:38 23/8 lå klar, aldrig deployet): alle 196 by-sider + 71 land-sider har nu unikke titler med priser ("Average Rent in Aalborg 2026: $1,163/mo | RentMap"), unikke descriptions, synlige H1'er og FAQPage-skema. Live verificeret efter `wrangler pages deploy`.
- IndexNow pinget efter deploy (HTTP 200, til ca. 5 nøglesider via rentmap_indexnow.sh).

### 📋 Næste forbedringer (fra Numbeo-sammenligningen)
- **København mangler i avg-rent.json** (kun Aarhus + Aalborg — DK's vigtigste by for "average rent" søgninger). Undersøg hvorfor data-generatoren mangler CPH og få den ind.
- **Cross-links mellem byer:** Numbeo linker by→by ("compare with..."). Tilføj "Sammenlign med" blok på by-sider (3-4 nabobyer) — internt link-netværk.
- **Friskhed i titler:** Numbeo har måned/år i titlen ("Aug 2026"). Vi har "2026"; overvej måned via updatedDate-logik.
- **Sammenligningsværktøj:** Numbeo har city-comparator — en "by A vs by B"-side ville matche 'rent comparison' søgninger.
- **Ryd op i 404-tjeneste-caches:** gamle by-URLs (fx copenhagen-denmark, som ikke længere er i data) kan blive serveret fra CF-cache — verificér efter deploy at de 404'er (s-maxage=0 er sat).
