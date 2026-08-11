# RentMap — Global Data Source Plan

> **Mål:** Én datakilde per land med lejeprisdata — implementeres systematisk.
> **Oprettet:** 2026-08-11 · **Status:** Plan

---

## Implementeringstyper (genbrug mønstre)

| Type | Beskrivelse | Script | Kompleksitet |
|------|-------------|--------|-------------|
| **A** | Server-rendered — curl + regex/DOMParser | `rentmap_dotproperty.js` mønster | ⭐ Nem |
| **B** | JavaScript-rendered — kræver Playwright | `rentmap_boligportal.js` mønster | ⭐⭐ Middel |
| **C** | JSON-LD / skjult API — fetch JSON direkte | `rentmap_zumper.js` mønster | ⭐ Nem |
| **D** | Blokeret (Captcha/DataDome) — brug aggregator | Alternativ kilde | ⭐⭐⭐ Svær |

---

## 📋 Platforme per region

### 🌏 Asien (Sydøst + Øst)

| Land | Platform | Type | Status |
|------|----------|------|--------|
| 🇻🇳 Vietnam | dotproperty.com.vn | **A** | ✅ **Live** |
| 🇹🇭 Thailand | dotproperty.co.th | **A** | 🔜 Copy Vietnam-script |
| 🇵🇭 Filippinerne | dotproperty.com.ph | **A** | 🔜 Copy Vietnam-script |
| 🇲🇾 Malaysia | dotproperty.com.my | **A** | 🔜 Copy Vietnam-script |
| 🇮🇩 Indonesien | dotproperty.co.id | **A** | 🔜 Copy Vietnam-script |
| 🇰🇭 Cambodia | dotproperty-kh.com | **A** | 🔜 (lille marked) |
| 🇱🇦 Laos | dotproperty.la | **A** | 🔜 (lille marked) |
| 🇲🇲 Myanmar | dotproperty.com.mm | **A** | 🔜 (lille marked) |
| 🇸🇬 Singapore | dotproperty.com.sg | **A** | 🔜 Copy Vietnam-script |
| 🇨🇳 Kina | smartshanghai.com | **A** | ✅ **Live** (Shanghai) |
| 🇮🇳 Indien | nobroker.in | **A/B** | ✅ **Live** (Mumbai) |
| 🇯🇵 Japan | suumo.jp | **D**? | 🔬 Skal undersøges |
| 🇰🇷 Sydkorea | zigbang.com | **D**? | 🔬 Skal undersøges |
| 🇹🇼 Taiwan | 591.com.tw | **A**? | 🔬 Skal undersøges |
| 🇭🇰 Hong Kong | squarefoot.com.hk | **A**? | 🔬 Skal undersøges |

### 🇪🇺 Europa

| Land | Platform | Type | Status |
|------|----------|------|--------|
| 🇩🇰 Danmark | boligportal.dk | **B** | ✅ **Live** |
| 🇩🇪 Tyskland | wg-gesucht.de | **A/B** | ✅ (cron findes) |
| 🇩🇪 Tyskland | immowelt.de / immobilienscout24.de | **D** | Blokeret (DataDome) |
| 🇬🇧 UK | rightmove.co.uk | **A**? | 🔬 Skal undersøges |
| 🇫🇷 Frankrig | seloger.com | **A**? | 🔬 Skal undersøges |
| 🇪🇸 Spanien | idealista.com | **A**? | 🔬 Skal undersøges |
| 🇮🇹 Italien | idealista.it / immobiliare.it | **A**? | 🔬 Skal undersøges |
| 🇵🇹 Portugal | idealista.pt | **A**? | 🔬 Skal undersøges |
| 🇳🇱 Holland | funda.nl / pararius.com | **A**? | 🔬 Skal undersøges |
| 🇧🇪 Belgien | immoweb.be | **A**? | 🔬 Skal undersøges |
| 🇸🇪 Sverige | hemnet.se / bostad.blocket.se | **A**? | 🔬 Skal undersøges |
| 🇳🇴 Norge | finn.no | **A**? | 🔬 Skal undersøges |
| 🇨🇭 Schweiz | homegate.ch / immoscout24.ch | **A**? | 🔬 Skal undersøges |
| 🇦🇹 Østrig | willhaben.at / immoscout24.at | **A**? | 🔬 Skal undersøges |
| 🇵🇱 Polen | otodom.pl / olx.pl | **A**? | 🔬 Skal undersøges |
| 🇬🇷 Grækenland | spitogatos.gr | **A**? | 🔬 Skal undersøges |
| 🇮🇪 Irland | daft.ie | **A**? | 🔬 Skal undersøges |

### 🌎 Nordamerika

| Land | Platform | Type | Status |
|------|----------|------|--------|
| 🇺🇸 USA | zumper.com | **C** (JSON-LD) | ✅ **Live** (NYC) |
| 🇨🇦 Canada | zumper.com (Canadian listings) | **C** | 🔜 Udvid USA-script |
| 🇨🇦 Canada | realtor.ca / rentals.ca | **A**? | 🔬 Skal undersøges |
| 🇲🇽 Mexico | inmuebles24.com / vivanuncios.com | **A**? | 🔬 Skal undersøges |

### 🌎 Latinamerika

| Land | Platform | Type | Status |
|------|----------|------|--------|
| 🇧🇷 Brasilien | vivareal.com.br / zapimoveis.com.br | **A**? | 🔬 Skal undersøges |
| 🇦🇷 Argentina | zonaprop.com.ar / mercadolibre.com.ar | **A**? | 🔬 Skal undersøges |
| 🇨🇱 Chile | portalimobiliario.com / toctoc.com | **A**? | 🔬 Skal undersøges |
| 🇨🇴 Colombia | fincaraiz.com.co / metrocuadrado.com | **A**? | 🔬 Skal undersøges |
| 🇵🇪 Peru | adondevivir.com / urbania.pe | **A**? | 🔬 Skal undersøges |

### 🌍 Mellemøsten & Afrika

| Land | Platform | Type | Status |
|------|----------|------|--------|
| 🇦🇪 UAE | propertyfinder.ae / bayut.com | **A**? | 🔬 Skal undersøges |
| 🇸🇦 Saudi Arabien | aqar.sa / bayut.sa | **A**? | 🔬 Skal undersøges |
| 🇿🇦 Sydafrika | property24.com / privateproperty.co.za | **A**? | 🔬 Skal undersøges |
| 🇳🇬 Nigeria | propertypro.ng / nigeriapropertycentre.com | **A**? | 🔬 Skal undersøges |
| 🇰🇪 Kenya | buyrentkenya.com | **A**? | 🔬 Skal undersøges |
| 🇲🇦 Marokko | mubawab.ma / avito.ma | **A**? | 🔬 Skal undersøges |
| 🇪🇬 Egypten | aqarmap.com.eg / olx.com.eg | **A**? | 🔬 Skal undersøges |
| 🇹🇷 Tyrkiet | sahibinden.com / hepsiemlak.com | **A**? | 🔬 Skal undersøges |

### 🌏 Oceanien

| Land | Platform | Type | Status |
|------|----------|------|--------|
| 🇦🇺 Australien | realestate.com.au / domain.com.au | **A**? | 🔬 Skal undersøges |
| 🇳🇿 New Zealand | trademe.co.nz / realestate.co.nz | **A**? | 🔬 Skal undersøges |

---

## 🚀 Første bølge: DotProperty (7 lande, 1 script!)

**Platform:** DotProperty (LIFULL Connect) — **server-rendered, identisk struktur!**

| Land | URL | Symbol |
|------|-----|--------|
| 🇹🇭 Thailand | dotproperty.co.th/en/properties-for-rent?sort=newest | ฿ THB |
| 🇵🇭 Filippinerne | dotproperty.com.ph/en/properties-for-rent?sort=newest | ₱ PHP |
| 🇲🇾 Malaysia | dotproperty.com.my/en/properties-for-rent?sort=newest | RM MYR |
| 🇮🇩 Indonesien | dotproperty.co.id/en/properties-for-rent?sort=newest | Rp IDR |
| 🇸🇬 Singapore | dotproperty.com.sg/en/properties-for-rent?sort=newest | S$ SGD |
| 🇰🇭 Cambodia | dotproperty-kh.com/en/properties-for-rent?sort=newest | $ (USD) |
| 🇲🇲 Myanmar | dotproperty.com.mm/en/properties-for-rent?sort=newest | K MMK |

**Implementering:** Ét generisk script `rentmap_dotproperty.js` med parameter: domain + currency. Eller 7 separate scripts (som Vietnam) per land — enklere at debugge.

---

## 🟢 Anden bølge: 1 side per land (lavthængende)

Platformer der allerede er **server-rendered** og sandsynligvis virker:

1. **🇬🇧 Rightmove** (UK) — rightmove.co.uk/property-to-rent/ → server-rendered
2. **🇪🇸 Idealista** (ES/IT/PT) — idealista.com → server-rendered (Next.js?)
3. **🇩🇪 WG-Gesucht** (DE) — allerede i cron, kan udvides
4. **🇸🇪 Hemnet** (SE) — hemnet.se → server-rendered
5. **🇳🇴 Finn** (NO) — finn.no/realestate/lettings → server-rendered

---

## 📐 Script-skabelon (Type A — server-rendered)

```js
// rentmap_<platform>.js — generisk mønster
// 1. fetch side 1 (?sort=newest)
// 2. Parse listings fra HTML (regex/DOMParser)
// 3. Dedup mod API (source_url)
// 4. Geocode med Nominatim (1.1s delay)
// 5. POST til RentMap API
```

---

## 🔬 Næste skridt (undersøgelse)

Før implementering skal hver platform testes:
1. **curl-test:** Får vi 200 OK + listings i HTML?
2. **Parsing:** Kan vi ekstrahere pris/area/rooms/sqm/link/UUID?
3. **Pagination:** Virker ?page=N?
4. **Rate-limit:** Blokerer de efter X requests?
5. **Geocoding:** Kan Nominatim finde adressen?

**Anbefaling:** Start med DotProperty (7 lande på 1 dag), derefter undersøg de resterende én ad gangen.

---

## 📊 Status lige nu

| Antal lande live | Antal listings | Platforme |
|-----------------|----------------|-----------|
| 6 | ~1.063 | DotProperty VN, Zumper US, NoBroker IN, SmartShanghai CN, BoligPortal DK, WG-Gesucht DE |
| **Potentielt med plan** | **40+ lande** | **10-15 platforme** |
