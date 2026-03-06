# PITWALL — F1 Race Weekend Companion

> Your complete Formula 1 companion. Live race data, weekend analysis, circuit encyclopedia, driver profiles, constructor history, and F1 history since 1950.

🌐 **Live site:** [anirudh-arora.github.io/pitwall](https://anirudh-arora.github.io/pitwall)

---

## What's inside

| Section | Features |
|---|---|
| 🏠 **Home** | Next race countdown · Live championship standings · Quick navigation |
| 📊 **Weekend** | Lap times (driver filter + lap window zoom) · Sector analysis · Tyre strategy · Head-to-head · Pace progression · Performance ratings · Qualifying grid · Race results · AI analyst (Groq) |
| ⏺ **Live** | Timing tower · Circuit tracker (GPS) · Position history · Gap evolution · Overtake probability · Car telemetry · Team radio · Race control · Pit tracker · Live weather |
| 🏟 **Circuits** | All 24 GP venues · Length, corners, lap records · Track characteristics · Trivia · Wikipedia biography · Historical race winners |
| 👤 **Drivers** | Full 2026 grid · Profiles · Career stats (wins, poles, podiums) · Recent race results · Wikipedia biographies |
| 🔧 **Constructors** | All current teams · Stats · 2026 driver lineup · Histories |
| 📖 **History** | Every F1 World Champion since 1950 · WCC winners · Decade filter · Key milestones timeline · All-time records (wins, poles, podiums, titles) |
| 💬 **Glossary** | Every F1 technical term explained in plain English |

---

## 2026 Active Aero

Traditional DRS is replaced by **Active Aerodynamics** from 2026. Pitwall detects the session year automatically and updates all labels:

| Old (≤2025) | New (2026+) | Meaning |
|---|---|---|
| DRS OFF | **CORNER MODE** | Wings closed — max downforce |
| DRS ELIGIBLE | **OVERTAKE MODE** | Within 1s — +0.5MJ deploy available |
| DRS ON | **STRAIGHT MODE** | Wings open — low drag |

The `drs` field in the OpenF1 API continues to carry the same values (0/8/10/12/14) — Pitwall re-labels them based on season year.

---

## File structure

```
pitwall/
├── index.html                 ← App shell + navigation router
├── css/
│   └── styles.css             ← Complete design system
├── js/
│   ├── utils.js               ← API helpers, data constants (circuits, drivers, champions)
│   ├── companion_components.js ← Live race + weekend analysis components
│   ├── encyclopedia.js        ← Circuits, Drivers, Constructors, History pages
│   └── app.js                 ← Navigation, home page, standings widget
└── README.md
```

---

## Data sources

| Source | What it provides | Auth needed |
|---|---|---|
| [OpenF1 API](https://openf1.org) | Live timing, GPS, telemetry, laps, stints, radio | No (free) |
| [Jolpica/Ergast](https://api.jolpi.ca/ergast/) | Historical results, standings, champions since 1950 | No (free) |
| [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/) | Driver/circuit biographies and summaries | No (free) |
| [Groq](https://console.groq.com) | AI race predictions and live win probability | Optional (free key) |
| [OpenWeatherMap](https://openweathermap.org/api) | Weather forecast for race venue | Optional (free key) |

---

## Optional API keys

Both are free and optional — the app works without them, but with reduced features.

**Groq (AI Analyst):**
1. Go to [console.groq.com](https://console.groq.com)
2. Sign in → API Keys → Create new key
3. Paste key starting with `gsk_` into the AI panel in the Weekend section

**OpenWeatherMap (Weather):**
1. Go to [openweathermap.org](https://openweathermap.org/api)
2. Sign up → My API Keys → copy the key
3. Paste into the weather panel

---

## GitHub Pages deployment

### First time setup (creating the repo)

```bash
# 1. Go to github.com/new
#    - Repository name: pitwall
#    - Visibility: Public
#    - DO NOT add README (you already have one)
#    - Click "Create repository"

# 2. Clone the empty repo locally
git clone https://github.com/anirudh-arora/pitwall.git
cd pitwall
```

### Upload the files

```bash
# 3. Copy all Pitwall files into the cloned folder:
#    - index.html
#    - README.md
#    - css/styles.css
#    - js/utils.js
#    - js/companion_components.js
#    - js/encyclopedia.js
#    - js/app.js

# 4. Stage, commit and push
git add .
git commit -m "Initial Pitwall release — full F1 companion"
git push origin main
```

### Enable GitHub Pages

```bash
# 5. Go to your repo on GitHub:
#    github.com/anirudh-arora/pitwall

# 6. Click Settings → Pages (left sidebar)

# 7. Under "Build and deployment":
#    - Source: Deploy from a branch
#    - Branch: main
#    - Folder: / (root)
#    - Click Save

# 8. Wait ~60 seconds, then visit:
#    https://anirudh-arora.github.io/pitwall
```

---

### Updating files after changes

```bash
# Navigate to your local pitwall folder
cd pitwall

# Copy updated files in (replace existing ones)
# Then:
git add .
git commit -m "Update: [describe what changed]"
git push origin main

# GitHub Pages auto-deploys within ~30 seconds
# Hard-refresh the browser (Ctrl+Shift+R) to clear cache
```

---

### Updating specific files (quick reference)

| What changed | Which file to update |
|---|---|
| Live race / Weekend analysis features | `js/companion_components.js` |
| Circuit info, trivia, driver list | `js/utils.js` |
| Driver/Constructor/History pages | `js/encyclopedia.js` |
| Navigation, home page, standings | `js/app.js` |
| Visual design, colours, layout | `css/styles.css` |
| HTML shell or script loading order | `index.html` |

---

## Notes

- **Historical data:** OpenF1 covers 2023 onwards. Ergast/Jolpica covers 1950–present.
- **Live data:** OpenF1 free tier has a ~3–8 second delay behind the official FOM feed. Live mode polls at 2–15 second intervals depending on data type.
- **Circuit GPS:** Loads from a practice session at the start of the race weekend. Will show "Circuit data unavailable" outside of race weekends.
- **AI predictions:** Generated by `llama-3.3-70b-versatile` via Groq. Based on lap time distributions, stint lengths, and qualifying data from the current weekend. Not financial advice.
- **Mobile:** Fully responsive. Best experienced on desktop for the live timing view.

---

## Tech stack

- **React 18** (CDN, no build step needed)
- **Recharts** for all charts
- **Babel Standalone** for JSX compilation in-browser
- **Pure CSS** — no Tailwind or framework
- **Vanilla JS** — no bundler, no Node.js required

Everything runs in the browser. No server needed.

---

## Roadmap / future ideas

- [ ] Sprint weekend support (sprint qualifying + sprint race)
- [ ] Tyre performance model (degradation curves per compound per circuit)
- [ ] Driver comparison tool (career head-to-head across seasons)
- [ ] Lap time sector heatmap (coloured by S1/S2/S3 vs field)
- [ ] Historical race replay (lap-by-lap position reconstruction)
- [ ] Push notifications for race control messages
- [ ] Light mode

---

*Pitwall is an unofficial project and is not associated with Formula 1, the FIA, or any F1 team.*
*F1, FORMULA ONE, FORMULA 1 and related marks are trade marks of Formula One Licensing B.V.*
