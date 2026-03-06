# 🏎 PITWALL — F1 Race Weekend Companion

A self-contained, single-file web app for analysing Formula 1 race weekends — from practice sessions through to live race tracking. Built with React, Recharts, the [OpenF1](https://openf1.org) public API, and Groq AI.

**Live at → [anirudh-arora.github.io/pitwall](https://anirudh-arora.github.io/pitwall)**

---

## Features

### Pre-Race Mode

| Feature | Description |
|---|---|
| **Lap Times** | Interactive lap time chart for any session — FP1, FP2, FP3, Qualifying |
| **Sector Analysis** | Best sector times per driver across a session, colour-coded heatmap, sorted by theoretical best lap |
| **Tyre Strategy** | Visual stint timeline showing compound choices and lap ranges for all drivers |
| **Head-to-Head** | Select any two drivers and compare best lap, average pace, consistency (±stdev), sector bests, and an overlaid lap time chart |
| **Pace Progression** | Line chart showing each driver's best lap across FP1 → FP2 → FP3 → Qualifying — reveals who improved through the weekend |
| **Performance Ratings** | Scored table (0–100) across four dimensions: Qualifying extraction, Race pace, Consistency, vs Teammate |
| **Qualifying Grid** | Full starting grid with gap to pole |
| **Race Result** | Final classification from the race session |
| **AI Race Analyst** | Uses all FP + Qualifying data to predict the top 3 race finishers with win probabilities, reasoning, and confidence ratings. Powered by Llama 3.3 70B via Groq. Adapts automatically when qualifying hasn't happened yet. |

### Live Race Mode

| Feature | Description |
|---|---|
| **Timing Tower** | Live position, gap to leader, tyre compound + age, pit stop count, position change flashes |
| **Circuit Tracker** | Real-time GPS driver positions on an SVG circuit outline drawn from actual telemetry data |
| **Position History** | Line chart of every driver's position over race laps — tells the story of the race at a glance |
| **Gap Evolution** | Gap to leader over time for the top 8 — shows undercuts, VSC bunching, strategy windows |
| **Overtake Probability** | Scores each driver pairing (0–99%) based on gap to car ahead, DRS status, speed delta, and tyre compound advantage |
| **Car Telemetry** | Live speed, RPM, gear, throttle %, brake, and DRS status per driver, ordered by race position |
| **Team Radio** | Live team radio messages with inline audio playback |
| **Race Control** | Live flags, safety car, penalties, and steward messages with colour-coded severity |
| **Pit Stops** | Pit stop count, last stop duration, and laps-on-current-tyre with overdue warnings |
| **Weather** | Live track and air temperature, wind speed/direction, humidity, pressure, rain alert |
| **Weather Forecast** | 6-period race-day rain forecast via OpenWeatherMap (optional key) |
| **Live Win Probability** | AI-updated win probabilities mid-race, comparing live state vs pre-race predictions with trend indicators |

---

## Getting Started

No installation. No build step. Just open the file.

```
1. Download index.html
2. Open it in any modern browser
3. Select a race weekend
4. Everything loads automatically from the OpenF1 public API
```

### Optional API Keys

The app works without any API keys for all timing and analysis features. Keys are only needed for AI and weather:

| Key | Used For | How to Get | Cost |
|---|---|---|---|
| **Groq** | AI race predictions + live win probability | [console.groq.com](https://console.groq.com) | Free |
| **OpenWeatherMap** | Race-day weather forecast | [openweathermap.org/api](https://openweathermap.org/api) | Free tier |

Keys are entered inside the app and stay in your browser session only — they are never stored or transmitted anywhere except directly to Groq and OpenWeatherMap.

---

## Data Sources

| Source | What it provides |
|---|---|
| [OpenF1 API](https://openf1.org) | All timing, lap, sector, position, telemetry, GPS, radio, weather data — completely free and no key required |
| [Groq](https://groq.com) | LLM inference for AI race analyst (Llama 3.3 70B) |
| [OpenWeatherMap](https://openweathermap.org) | Weather forecast for circuit location |

OpenF1 provides live data during race weekends and historical data for all past sessions back to the 2023 season.

---

## Tech Stack

- **React 18** — UI framework (loaded via CDN, no build step)
- **Recharts** — lap time, sector, gap evolution, and pace progression charts
- **Babel Standalone** — JSX transpilation in-browser
- **OpenF1 REST API** — all F1 data
- **Groq API** — AI inference
- **Pure SVG** — circuit position tracker

Everything ships in a single `index.html` file with zero local dependencies.

---

## Notes

- **Circuit Tracker** draws the track outline from GPS telemetry recorded during practice sessions. Live driver positions update every 2 seconds during a race. GPS data availability depends on what OpenF1 receives from the FOM feed — some sessions may show "GPS data unavailable".
- **AI Analyst** clearly distinguishes between pre-qualifying projections (practice data only) and post-qualifying predictions (full grid + pace data). It will never fabricate a qualifying grid that hasn't happened.
- **Live polling** intervals: positions/intervals every 5s, car telemetry every 3s, GPS every 2s, pit/radio every 10s, stints/weather every 15s.
- Historical data is available for all races from the **2023 season onwards**.

---

## License

MIT — do whatever you want with it.

---

*Built by [Anirudh Arora](https://github.com/anirudh-arora)*
