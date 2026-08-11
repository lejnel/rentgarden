# RentMap — Fejl & forbedringsplan

Dato: 2026-08-10 · Analyseret af kimi-k3
Fil: `src/pages/index.astro` (hovedsiden med globussen)

---

## 🔴 Kritiske fejl (funktionelle)

### F1: Tooltip kan hænge fast efter panel åbnes
**Hvor:** Hover-tooltip (linje ~1211-1227) vises ved hover over prikker, men skjules ikke når man klikker (panel åbner).
**Symptom:** Tooltip'en hænger fast på skærmen efter klik.
**Fix:** I `handler.setInputAction` for LEFT_CLICK, tilføj `tooltip.classList.remove('visible');` i starten.

### F2: `viewer` bruges før den er initialiseret i pill-klik
**Hvor:** `pill.onclick` i `rebuildPills()` (linje ~825-855) bruger `viewer` direkte — men `rebuildPills()` kan kaldes fra `switchType()`/`switchYear()` **før** `init()` er færdig (`viewer = new Cesium.Viewer(...)` kører senere).
**Symptom:** Hvis brugeren skifter type/år hurtigt efter load, kan `zoomInOnly` crashe med "Cannot read properties of undefined".
**Fix:** I `zoomInOnly()`, tilføj guard: `if (!viewer || !viewer.camera) return;` (allerede delvist — men verificér at den ikke fejler).

### F3: Dobbelt-lyttere på `touchend` kan konflikte
**Hvor:** To separate `touchend`-handlers:
1. `document.addEventListener('touchend', ...)` — panel swipe-down (linje ~994)
2. `viewer.scene.canvas.addEventListener('touchend', ...)` — double-tap zoom (linje ~1082)
**Symptom:** Hvis panel er åbent og man swiper på kortet bagved, kan begge fyre.
**Fix:** I double-tap handleren, tilføj check: `if (document.getElementById('infoPanel').classList.contains('open') && document.getElementById('infoPanel').contains(e.target)) return;`

---

## 🟡 Mellem fejl (UX/funktionalitet)

### F4: Popup-form mangler `price_per_m2` beregning
**Hvor:** `submitPopupPrice()` (linje ~1361) sender kun `price_total` — Worker beregner `price_per_m2` fra `sqm`, men popup-formularen har **intet sqm/rooms/type-felt**!
**Symptom:** Offentlige indsendelser via "+"-popup får `price_per_m2 = null` → mangler i "Price / m²"-visning og farve-beregning.
**Fix:** Tilføj sqm + rooms + type felter til popup-formularen (samme som admin-formularen har).

### F5: Popup sender ALTID `country: 'DK'` hardcoded
**Hvor:** `submitPopupPrice()` linje ~1374: `country: 'DK'` er hardkodet!
**Symptom:** Hvis nogen tilføjer en bolig i fx Sverige via popup, bliver den registreret som Danmark.
**Fix:** Reverse-geocoden i `reversePopupGeo()` returnerer allerede land — brug `d.address.country_code.toUpperCase()` og gem det i et hidden felt, og send det med.

### F6: `createPillCanvas()` er død kode
**Hvor:** Funktionen defineres (linje ~570) men kaldes aldrig — pills bruger inline-styled HTML-divs.
**Fix:** Slet funktionen (reducerer støj).

### F7: Panel-handle kan ikke trækkes ordentligt (kun klik)
**Hvor:** `.panel-handle` har `onclick="closePanel()"` — men swipe-down handleren er på `document`, ikke panelet selv.
**Symptom:** Man skal swipe HELE panelet — ikke bare grebet — for at lukke.
**Fix:** Fjern `onclick` fra handle, og lad swipe-handleren håndtere det (virker allerede via `panel.contains(e.target)`).

---

## 🟢 Mindre fejl (kosmetisk/robusthed)

### F8: Geo-meta i Layout siger kun "Copenhagen"
**Hvor:** `Layout.astro` linje ~30: `geo.placename content="Copenhagen"` — sitet er globalt.
**Fix:** Ændr til `content="Worldwide"` eller fjern geo.region/placename (de er ubrugte af de fleste crawlere alligevel).

### F9: Cron-script gemmer ikke log
**Hvor:** `/home/rasmusb/.hermes/scripts/rentmap_boligportal.js` — output går kun til stdout (tabes hvis cron fejler stille).
**Fix:** Tilføj `console.log` med timestamps + skriv til en log-fil, eller lad cron-prompten rapportere (den gør allerede).

### F10: Ingen "loading"-tilstand på admin-formular
**Hvor:** Admin-formularen viser ingen spinner ved "Add Price" klik.
**Fix:** Tilføj `disabled` + spinner på submit-knappen mens den venter på API.

---

## 📋 Prioriteret plan (for udfører)

| # | Prioritet | Opgave | Estimat |
|---|-----------|--------|---------|
| F5 | 🔴 | Popup: send rigtigt land (ikke hardcoded DK) | 10 min |
| F4 | 🔴 | Popup: tilføj sqm/rooms/type felter | 15 min |
| F1 | 🟡 | Tooltip: skjul ved klik | 5 min |
| F2 | 🟡 | zoomInOnly: guard mod undefined viewer | 5 min |
| F3 | 🟡 | touchend: undgå konflikt panel vs double-tap | 10 min |
| F7 | 🟢 | Panel-handle: fjern onclick | 2 min |
| F6 | 🟢 | Slet createPillCanvas (død kode) | 2 min |
| F8 | 🟢 | Layout: geo-meta fix | 5 min |

**Total estimat:** ~55 minutter for alle rettelser.

---

## ✅ Verificeret OK (ingen fejl fundet)
- Byg & deploy kører rent (exit 0, kun warnings om sharp/SESSION-binding — begge harmløse)
- Ingen JS-errors på hovedsiden eller admin
- City labels loader korrekt (11.119 byer)
- Cron-script har dedup + ISO-dato + ingen centrum-fallback
- Double-tap zoom kun single-finger
- zoomInOnly zoomer aldrig ud
- Viewport lazy-loading (max 100 pills)
- Grid-spredning af pills
- Clustering kun >80km
