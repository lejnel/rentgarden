# RentMap — Data Source Plan (opdateret 2026-08-14)

> **Mål:** Få flest mulige lande på kortet med minimal indsats.
> **Strategi:** Verificér hver kilde med curl FØR implementering. Genbrug eksisterende scripts.

## ✅ LIVE lige nu (9 lande)

| Land | Kilde | Type | Listings |
|------|-------|------|----------|
| 🇩🇰 Danmark | boligportal.dk | B (Playwright) | ~100 |
| 🇩🇪 Tyskland | wg-gesucht.de | A | ~40 |
| 🇺🇸 USA | zumper.com | C (JSON-LD) | ~250 |
| 🇮🇳 Indien | nobroker.in | A | ~290 |
| 🇨🇳 Kina | smartshanghai.com | A | ~360 |
| 🇻🇳 Vietnam | dotproperty.com.vn | A | 64 |
| 🇵🇭 Filippinerne | dotproperty.com.ph | A | 74 |
| 🇲🇾 Malaysia | dotproperty.com.my | A | 26 |

**I alt: ~1.200 aktive listings**

---

## 🌊 Bølge 1 — VERIFICERET, klar til implementering (~2-3 timer)

### 1. 🇹🇭 Thailand — dotproperty.co.th (Type A, eget script)
**Testet: HTTP 200, 30 artikler pr. side** ✅

- Struktur: `<article class="relative w-full overflow-hidden">` (ANDERLEDES end VN/PH/MY!)
- Pris: `฿16,000 per month`
- Detaljer: `Studio • 1 Bath • 22 SqM • ฿727/SqM • Condo`
- Adresse: `Khlong Tan Nuea, Watthana, Bangkok`
- Link: `/en/ads/...`
- Valuta: THB ฿ (allerede i frontend!)
- **Arbejde:** Nyt script `rentmap_dotproperty_th.js` med thailandsk parser (~30 min)
- **Bonus:** Jitter-funktion genbruges

### 2. 🇨🇦 Canada — zumper.com (Type C, copy-udvidelse af USA-script)
**Kendt: Zumper dækker canadiske byer** ✅

- Zumper-scriptet bruger JSON-LD — tilføj parameter for land
- Kilder: `zumper.com/ca/apartments-for-rent/...` (Toronto, Vancouver, Montreal)
- Valuta: CAD (skal tilføjes til frontend + ratesToUSD)
- **Arbejde:** Udvid `rentmap_zumper.js` til at acceptere land-parameter (~30 min)

### 3. 🇧🇪 Belgien — immoweb.be (Type A, nyt script)
**Testet: HTTP 200, 60 announce-links + 30 priser pr. side** ✅

- Links: `/en/classified/...`
- Priser: `€ 1.250` i HTML
- Sprog: `?searchType=rental` (husk /en/ prefix for engelsk)
- Valuta: EUR (findes allerede!)
- **Arbejde:** Nyt script `rentmap_immoweb.js` (~45 min)

---

## 🌊 Bølge 2 — LOVENDE, kræver 1-2 timers undersøgelse

### 4. 🇳🇴 Norge — finn.no (Type A/B?)
**Testet: HTTP 200, 77 kr-træffere, men ingen ad-links i HTML** ⚠️

- JSON-LD er kun breadcrumbs — listings loader client-side
- Måske: `https://www.finn.no/api/...` skjult endpoint
- Eller: Playwright
- **Næste skridt:** Inspicér network-traffic i browser (DevTools)

### 5. 🇬🇧 UK — rightmove.co.uk (Type B?)
**Testet: HTTP 200, men INGEN listings i HTML** ⚠️

- Side er React SPA — ingen NEXT_DATA, ingen priser
- Kendt skjult API: `https://www.rightmove.co.uk/api/propertySearch` (kræver tokens fra session)
- **Næste skridt:** Playwright-test med fuld session

### 6. 🇳🇱 Holland — funda.nl (Type B?)
**Testet: HTTP 200, men kun 15KB (bot-check side)** ⚠️

- Funda har stærk bot-beskyttelse
- **Næste skridt:** Playwright med stealth

---

## 🌊 Bølge 3 — PLAYWRIGHT NØDVENDIG (curl blokeret)

### 7. 🇪🇸 Spanien — idealista.com (Type B)
**Testet: HTTP 403** ⚠️
- Stor platform (Madrid, Barcelona) — værd at kæmpe for

### 8. 🇸🇪 Sverige — hemnet.se (Type B)
**Testet: HTTP 403** ⚠️

### 9. 🇫🇷 Frankrig — seloger.com (Type B)
**Testet: HTTP 403** ⚠️

### 10. 🇮🇪 Irland — daft.ie (Type B)
**Testet: HTTP 403** ⚠️

**Fælles tilgang:** Én generisk Playwright-script-skabelon med per-site selectors (~2-3 timer per site, men skabelonen genbruges)

---

## 🌊 Bølge 4 — DOTPROPERTY-RESTER

| Land | Domæne | Status | Næste skridt |
|------|--------|--------|--------------|
| 🇰🇭 Cambodia | dotproperty-kh.com | 403 | Prøv andre UA/paths |
| 🇮🇩 Indonesien | dotproperty.co.id | Domæne dødt | Ingen |
| 🇸🇬 Singapore | dotproperty.com.sg | 410 | Ingen (lukket) |
| 🇱🇦 Laos | dotproperty.com.la | Domæne dødt | Ingen |
| 🇲🇲 Myanmar | dotproperty.com.mm | Domæne dødt | Ingen |

---

## 🌊 Bølge 5 — DRØMME (store markeder, sværere)

| Land | Kandidat | Type | Bemærkning |
|------|----------|------|------------|
| 🇦🇺 Australien | realestate.com.au | B? | Skal testes |
| 🇳🇿 New Zealand | trademe.co.nz | A? | Skal testes |
| 🇧🇷 Brasilien | vivareal.com.br | A? | Skal testes |
| 🇦🇪 UAE | propertyfinder.ae | A? | Skal testes |
| 🇹🇷 Tyrkiet | hepsiemlak.com | A? | Skal testes |
| 🇿🇦 Sydafrika | property24.com | A? | Skal testes |
| 🇯🇵 Japan | suumo.jp | D? | Tung bot-beskyttelse |
| 🇰🇷 Sydkorea | zigbang.com | D? | API-baseret, kræver tokens |
| 🇲🇽 Mexico | inmuebles24.com | A? | Skal testes |

---

## 🧰 Genbrugelige komponenter

| Komponent | Findes i | Genbruges til |
|-----------|----------|---------------|
| `jitterCoords()` | dotproperty-scripts | ALLE lande (spreder distrikt-centre) |
| `geocode()` (Nominatim→OpenMeteo→Photon fallback) | dotproperty-scripts | ALLE scripts |
| Dedup (source_url mod API) | alle scripts | ALLE scripts |
| Cron-skabelon (kl. 09:00) | cron jobs | Hvert nyt land |
| Frontend-valuta (rates + symboler) | index.astro | Nye landes valuta |

## 🎯 Anbefalet prioritering

**I dag/morgen (2-3 timer):**
1. 🇹🇭 Thailand — script klar baseret på test
2. 🇨🇦 Canada — Zumper-udvidelse
3. 🇧🇪 Belgien — Immoweb-script

**Næste uge:**
4. 🇳🇴 Finn-undersøgelse (skjult API?)
5. 🇬🇧 Rightmove med Playwright
6. 🇪🇸 Idealista med Playwright-skabelon

**Effekt:** 3 nye lande nu (+~200 listings), derefter 3-4 mere når Playwright-skabelonen er klar.

## 📊 Kriterier for at droppe en kilde

- HTTP 403/429 i 3 forsøg med forskellige UAs → parkér
- Ingen listings efter 2 implementeringsforsøg → parkér
- Data uden adresse/by → tjek om by kan udledes af URL
- Valuta mangler i frontend → tilføj rates + symbol (10 min)
