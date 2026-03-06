/* js/utils.js — shared across all pages */
'use strict';

// ═══════════════════════════════════════════════════════════════
// API ENDPOINTS
// ═══════════════════════════════════════════════════════════════
const OPENF1  = 'https://api.openf1.org/v1';
const ERGAST  = 'https://api.jolpi.ca/ergast/f1'; // Jolpica mirror (Ergast shutting down)
const OWM     = 'https://api.openweathermap.org/data/2.5';
const WIKI_SUMMARY = 'https://en.wikipedia.org/api/rest_v1/page/summary';

async function fetchF1(ep, params = {}) {
  const qs = Object.keys(params).length ? '?' + new URLSearchParams(params) : '';
  const r = await fetch(`${OPENF1}${ep}${qs}`);
  if (!r.ok) throw new Error(`OpenF1 ${r.status}: ${ep}`);
  return r.json();
}

async function fetchErgast(path) {
  const r = await fetch(`${ERGAST}${path}.json?limit=1000`);
  if (!r.ok) throw new Error(`Ergast ${r.status}: ${path}`);
  const d = await r.json();
  return d.MRData;
}

async function fetchWiki(title) {
  const r = await fetch(`${WIKI_SUMMARY}/${encodeURIComponent(title)}`);
  if (!r.ok) return null;
  return r.json();
}

// ═══════════════════════════════════════════════════════════════
// YEAR DETECTION — 2026+ uses Active Aero labels
// ═══════════════════════════════════════════════════════════════
function isActiveAeroEra(year) { return parseInt(year) >= 2026; }

function getAeroLabel(drsValue, year) {
  const aa = isActiveAeroEra(year);
  if (drsValue >= 10) return aa
    ? { label: 'STRAIGHT', cls: 'aero-open',  tip: 'Active aero — straight mode (low drag)' }
    : { label: 'DRS ON',   cls: 'aero-open',  tip: 'Drag Reduction System open' };
  if (drsValue === 8)  return aa
    ? { label: 'OVERTAKE', cls: 'aero-avail', tip: 'Overtake mode eligible (+0.5MJ deploy)' }
    : { label: 'ELIGIBLE', cls: 'aero-avail', tip: 'DRS eligible — within 1s at detection' };
  return aa
    ? { label: 'CORNER',   cls: 'aero-off',   tip: 'Active aero — corner mode (high downforce)' }
    : { label: 'DRS OFF',  cls: 'aero-off',   tip: 'DRS closed' };
}

// ═══════════════════════════════════════════════════════════════
// FORMATTING
// ═══════════════════════════════════════════════════════════════
function fmtLap(s) {
  if (!s || isNaN(s)) return '—';
  const m = Math.floor(s / 60), sec = (s % 60).toFixed(3).padStart(6, '0');
  return `${m}:${sec}`;
}
function fmtGap(s) {
  if (s == null) return '—';
  if (typeof s === 'string') return s;
  if (Math.abs(s) > 90) return `+${Math.floor(Math.abs(s) / 60)}L`;
  return `+${Math.abs(s).toFixed(3)}s`;
}
function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
}
function fmtISOShort(d) { return d.toISOString().slice(0, 19); }

// ═══════════════════════════════════════════════════════════════
// TEAM COLOURS — covers all eras
// ═══════════════════════════════════════════════════════════════
const TEAM_COLORS = {
  'Red Bull':       '#3671C6', 'Red Bull Racing':    '#3671C6',
  'Ferrari':        '#E8002D', 'Scuderia Ferrari':   '#E8002D',
  'McLaren':        '#FF8000',
  'Mercedes':       '#27F4D2', 'Mercedes-AMG':       '#27F4D2',
  'Alpine':         '#FF87BC', 'BWT Alpine':         '#FF87BC',
  'Aston Martin':   '#229971',
  'Haas':           '#B6BABD', 'Haas F1':            '#B6BABD',
  'RB':             '#6692FF', 'Racing Bulls':       '#6692FF', 'AlphaTauri': '#6692FF', 'Toro Rosso': '#6692FF',
  'Williams':       '#64C4FF',
  'Kick Sauber':    '#52E252', 'Sauber':             '#52E252', 'Alfa Romeo': '#52E252',
  'Cadillac':       '#CC4400',
  // Historic
  'Lotus':          '#006400', 'Tyrrell':            '#003399',
  'Brabham':        '#006600', 'BRM':                '#CC0000',
  'Mclaren':        '#FF8000', 'Renault':            '#FFD700',
  'Jordan':         '#FFD700', 'BAR':                '#FFFFFF',
  'Toyota':         '#CC0000', 'Honda':              '#FFFFFF',
  'Force India':    '#FF80C7', 'Racing Point':       '#F596C8',
  'Stewart':        '#FFFFFF', 'Jaguar':             '#006600',
  'Minardi':        '#191919', 'Arrows':             '#FF6600',
};
function teamColor(name) {
  if (!name) return '#555';
  for (const [k, v] of Object.entries(TEAM_COLORS)) {
    if (name.toLowerCase().includes(k.toLowerCase())) return v;
  }
  return '#555';
}

// ═══════════════════════════════════════════════════════════════
// LAP CLEANING
// ═══════════════════════════════════════════════════════════════
function cleanLaps(laps, bestTime) {
  const thr = bestTime * 1.07;
  return laps.filter(l =>
    l.lap_duration > 0 && !l.is_pit_out_lap &&
    l.lap_duration <= thr &&
    l.duration_sector_1 != null && l.duration_sector_2 != null && l.duration_sector_3 != null
  );
}

// ═══════════════════════════════════════════════════════════════
// CIRCUITS ENCYCLOPEDIA DATA
// ═══════════════════════════════════════════════════════════════
const CIRCUITS = [
  {
    id: 'bahrain', name: 'Bahrain International Circuit', country: 'Bahrain', city: 'Sakhir',
    lat: 26.0325, lng: 50.5106, length: 5.412, laps: 57, corners: 15,
    lapRecord: { time: '1:31.447', driver: 'Pedro de la Rosa', year: 2005 },
    firstGP: 2004, drsZones: 3,
    description: 'One of the premier venues on the F1 calendar, the Bahrain International Circuit is famous for its night race atmosphere and challenging mix of fast straights and technical corners. The desert setting creates unique conditions with sand on track and cooling temperatures after sundown.',
    trivia: [
      'First F1 race held under floodlights (2014)',
      'Sand blown onto the circuit can change grip levels dramatically between sessions',
      'The Outer Circuit layout used in 2020 reversed the direction of the main circuit',
      'Sector 3 is one of the most technically demanding sequences in F1',
    ],
    characteristics: { overtaking: 'High', tyre_wear: 'High', downforce: 'Medium', power_sensitive: true },
    ergastId: 'bahrain',
    wikiTitle: 'Bahrain_International_Circuit',
  },
  {
    id: 'jeddah', name: 'Jeddah Corniche Circuit', country: 'Saudi Arabia', city: 'Jeddah',
    lat: 21.6319, lng: 39.1044, length: 6.174, laps: 50, corners: 27,
    lapRecord: { time: '1:30.734', driver: 'Lewis Hamilton', year: 2021 },
    firstGP: 2021, drsZones: 3,
    description: 'The world\'s second-fastest street circuit after Monza, Jeddah features an unbroken sequence of fast corners running along the Red Sea. The circuit is notorious for its narrow barriers, minimal run-off, and frequent safety car interventions.',
    trivia: [
      'Average speed exceeds 250 km/h — fastest street circuit in F1',
      'At 6.174km it is one of the longest circuits on the calendar',
      '27 corners with almost no straight-line respite',
      'First introduced to the calendar in 2021 as part of Saudi Arabia\'s sporting ambitions',
    ],
    characteristics: { overtaking: 'Low', tyre_wear: 'Medium', downforce: 'Low', power_sensitive: true },
    ergastId: 'jeddah',
    wikiTitle: 'Jeddah_Corniche_Circuit',
  },
  {
    id: 'melbourne', name: 'Albert Park Circuit', country: 'Australia', city: 'Melbourne',
    lat: -37.8497, lng: 144.968, length: 5.278, laps: 58, corners: 16,
    lapRecord: { time: '1:19.813', driver: 'Charles Leclerc', year: 2024 },
    firstGP: 1996, drsZones: 4,
    description: 'Set in the picturesque Albert Park, the Melbourne street circuit winds around a public park lake. After a 2021–2022 revamp that added a fourth DRS zone and reprofiled several corners, lap times dropped significantly. The season opener status gives the race enormous strategic importance.',
    trivia: [
      'Australia hosted the first F1 world championship race in 1950 — at Silverstone, not Melbourne',
      'The circuit runs anti-clockwise around Albert Park Lake',
      'Became season opener in 1996 when it replaced Adelaide',
      'The 2022 redesign cut lap times by nearly 4 seconds',
      'Average speed increased dramatically after corner reprofiling — Albert Park is now a genuine fast circuit',
    ],
    characteristics: { overtaking: 'Medium', tyre_wear: 'Medium', downforce: 'Medium', power_sensitive: false },
    ergastId: 'albert_park',
    wikiTitle: 'Albert_Park_Circuit',
  },
  {
    id: 'suzuka', name: 'Suzuka International Racing Course', country: 'Japan', city: 'Suzuka',
    lat: 34.8431, lng: 136.5415, length: 5.807, laps: 53, corners: 18,
    lapRecord: { time: '1:30.983', driver: 'Lewis Hamilton', year: 2019 },
    firstGP: 1987, drsZones: 2,
    description: 'Universally regarded as the greatest circuit on the Formula 1 calendar, Suzuka\'s figure-of-eight layout is unique in motorsport. The legendary 130R, the Esses sequence, and Spoon Corner demand a perfect car setup and complete driver commitment.',
    trivia: [
      'The only circuit in F1 with a figure-of-eight layout (crossing over itself)',
      'Drivers consistently vote it the best circuit on the calendar',
      'The Esses are taken flat-out — any small mistake destroys multiple corners',
      'Ayrton Senna won here five times; the circuit is associated with his legacy',
      '130R corner was considered uncuttable until car aerodynamics advanced enough',
    ],
    characteristics: { overtaking: 'Low', tyre_wear: 'Medium', downforce: 'High', power_sensitive: false },
    ergastId: 'suzuka',
    wikiTitle: 'Suzuka_International_Racing_Course',
  },
  {
    id: 'shanghai', name: 'Shanghai International Circuit', country: 'China', city: 'Shanghai',
    lat: 31.3389, lng: 121.2198, length: 5.451, laps: 56, corners: 16,
    lapRecord: { time: '1:32.238', driver: 'Michael Schumacher', year: 2004 },
    firstGP: 2004, drsZones: 2,
    description: 'Designed by Hermann Tilke, Shanghai features a distinctive snail-shaped turn 1–2 complex that is unique in F1. The long back straight enables significant tyre degradation and creates interesting strategic options, particularly around the medium-hard compound choice.',
    trivia: [
      'The iconic Turn 1–2 snail complex is unlike anything else in F1',
      'One of only a few circuits where the pit lane is longer than on many tracks',
      'Long periods off the calendar due to COVID; returned in 2024',
      'Tyre degradation on the rear axle is notably high',
    ],
    characteristics: { overtaking: 'High', tyre_wear: 'High', downforce: 'Medium', power_sensitive: true },
    ergastId: 'shanghai',
    wikiTitle: 'Shanghai_International_Circuit',
  },
  {
    id: 'miami', name: 'Miami International Autodrome', country: 'USA', city: 'Miami',
    lat: 25.958, lng: -80.239, length: 5.412, laps: 57, corners: 19,
    lapRecord: { time: '1:29.708', driver: 'Max Verstappen', year: 2023 },
    firstGP: 2022, drsZones: 3,
    description: 'Built around the Hard Rock Stadium in Miami Gardens, the circuit is one of F1\'s newest additions. While the street-style circuit initially drew criticism for its artificial marina and heat conditions, the sprint format has added strategic interest.',
    trivia: [
      'Hosts a Sprint weekend — one of very few on the calendar',
      'The fake marina and boat props were controversial but have become a visual staple',
      'Temperatures regularly exceed 35°C, creating significant tyre management challenges',
      'One of the few US venues hosting F1 in recent years alongside Austin and Vegas',
    ],
    characteristics: { overtaking: 'Medium', tyre_wear: 'High', downforce: 'Medium', power_sensitive: false },
    ergastId: 'miami',
    wikiTitle: 'Miami_International_Autodrome',
  },
  {
    id: 'imola', name: 'Autodromo Enzo e Dino Ferrari', country: 'Italy', city: 'Imola',
    lat: 44.3439, lng: 11.7167, length: 4.909, laps: 63, corners: 19,
    lapRecord: { time: '1:15.484', driver: 'Rubens Barrichello', year: 2004 },
    firstGP: 1980, drsZones: 2,
    description: 'Named after Enzo and Dino Ferrari, Imola is one of the most beloved circuits in Italy. The circuit is forever linked with the tragic 1994 San Marino Grand Prix which claimed the lives of Roland Ratzenberger and Ayrton Senna.',
    trivia: [
      'Site of the tragic deaths of Senna and Ratzenberger on the same race weekend in 1994',
      'One of the few remaining old-school anti-clockwise circuits',
      'Piratella and Acque Minerali corners are among the most feared in F1',
      'Tifosi (Ferrari fans) create an electric atmosphere throughout the weekend',
    ],
    characteristics: { overtaking: 'Low', tyre_wear: 'Medium', downforce: 'High', power_sensitive: false },
    ergastId: 'imola',
    wikiTitle: 'Autodromo_Enzo_e_Dino_Ferrari',
  },
  {
    id: 'monaco', name: 'Circuit de Monaco', country: 'Monaco', city: 'Monte Carlo',
    lat: 43.7347, lng: 7.4205, length: 3.337, laps: 78, corners: 19,
    lapRecord: { time: '1:12.909', driver: 'Lewis Hamilton', year: 2021 },
    firstGP: 1929, drsZones: 1,
    description: 'The jewel in the crown of Formula 1, Monaco is the most prestigious, glamorous and technically challenging circuit in the world. Racing through the tight streets of the principality at 280 km/h requires a unique combination of bravery and precision.',
    trivia: [
      'Part of motorsport\'s unofficial Triple Crown alongside Le Mans and Indy 500',
      'The Tunnel is the only section of F1 track that goes underground',
      'The circuit is barely wide enough for two cars side by side in most places',
      'Ayrton Senna won six times here — the record',
      'First held in 1929 — predates the Formula 1 World Championship by over 20 years',
      'Average speed is lowest of any circuit — but most prestigious win',
    ],
    characteristics: { overtaking: 'Very Low', tyre_wear: 'Low', downforce: 'Very High', power_sensitive: false },
    ergastId: 'monaco',
    wikiTitle: 'Circuit_de_Monaco',
  },
  {
    id: 'barcelona', name: 'Circuit de Barcelona-Catalunya', country: 'Spain', city: 'Barcelona',
    lat: 41.57, lng: 2.2611, length: 4.657, laps: 66, corners: 16,
    lapRecord: { time: '1:18.149', driver: 'Max Verstappen', year: 2021 },
    firstGP: 1991, drsZones: 2,
    description: 'Catalunya has hosted F1 since 1991 and is used extensively for pre-season testing due to its varied circuit characteristics. The circuit\'s familiar layout means it is one of the best known by fans, though the test-heavy history means few surprises remain.',
    trivia: [
      'Used more than any other circuit for pre-season testing — teams know it intimately',
      'Turn 3 (Renault) is one of the most demanding high-speed corners in F1',
      'Michael Schumacher\'s famous four-wheel burnout doughnut in 2004 took place here',
      'Overtaking was historically difficult but the 2021 layout change improved the situation',
    ],
    characteristics: { overtaking: 'Low', tyre_wear: 'High', downforce: 'Medium-High', power_sensitive: false },
    ergastId: 'catalunya',
    wikiTitle: 'Circuit_de_Barcelona-Catalunya',
  },
  {
    id: 'canada', name: 'Circuit Gilles Villeneuve', country: 'Canada', city: 'Montreal',
    lat: 45.5, lng: -73.5228, length: 4.361, laps: 70, corners: 14,
    lapRecord: { time: '1:13.078', driver: 'Valtteri Bottas', year: 2019 },
    firstGP: 1978, drsZones: 3,
    description: 'Named after Canadian racing legend Gilles Villeneuve, this circuit on Île Notre-Dame is a power circuit with long straights and heavy braking zones. The infamous Wall of Champions at the final chicane has claimed numerous top drivers.',
    trivia: [
      'The Wall of Champions got its name after Damon Hill, Michael Schumacher, and Jacques Villeneuve all crashed there in 1999',
      'Named after Gilles Villeneuve who raced here before his fatal 1982 accident',
      'One of the best circuits for overtaking due to the stop-start nature',
      'Fuel-saving is critical here due to the long full-throttle sections',
      'Sebastian Vettel won here six times — the circuit record',
    ],
    characteristics: { overtaking: 'High', tyre_wear: 'Low', downforce: 'Low', power_sensitive: true },
    ergastId: 'villeneuve',
    wikiTitle: 'Circuit_Gilles_Villeneuve',
  },
  {
    id: 'silverstone', name: 'Silverstone Circuit', country: 'Great Britain', city: 'Northamptonshire',
    lat: 52.0786, lng: -1.0169, length: 5.891, laps: 52, corners: 18,
    lapRecord: { time: '1:27.097', driver: 'Max Verstappen', year: 2020 },
    firstGP: 1950, drsZones: 2,
    description: 'Silverstone hosted the very first Formula 1 World Championship race in 1950. Built on a WWII RAF airfield, the circuit is synonymous with British motorsport heritage. High-speed sweeping corners like Copse, Maggotts, and Becketts are regarded as F1\'s finest sequence.',
    trivia: [
      'Hosted the FIRST ever Formula 1 World Championship race on 13 May 1950',
      'Maggotts-Becketts-Chapel complex is taken at over 280 km/h — utterly flat for modern F1 cars',
      'The Home of British Motorsport — has hosted a British GP nearly every year since 1950',
      'The 2020 race featured a dramatic four-way tyre failure in the closing laps',
      'Copse corner became controversial in 2021 after the Verstappen-Hamilton collision',
    ],
    characteristics: { overtaking: 'Medium', tyre_wear: 'High', downforce: 'High', power_sensitive: false },
    ergastId: 'silverstone',
    wikiTitle: 'Silverstone_Circuit',
  },
  {
    id: 'hungary', name: 'Hungaroring', country: 'Hungary', city: 'Budapest',
    lat: 47.5789, lng: 19.2486, length: 4.381, laps: 70, corners: 14,
    lapRecord: { time: '1:16.627', driver: 'Lewis Hamilton', year: 2020 },
    firstGP: 1986, drsZones: 1,
    description: 'The Hungaroring was the first circuit behind the Iron Curtain, bringing Formula 1 to Eastern Europe in 1986. The twisty, low-speed layout has earned it the nickname "Monaco without the barriers" — it is notoriously difficult to overtake.',
    trivia: [
      'First F1 race behind the Iron Curtain — fans queued for days to get in',
      'Lewis Hamilton won here a record eight times',
      '"Monaco without the barriers" — narrow, twisty, difficult to overtake',
      'Qualifying position is crucial — track position almost determines race result',
    ],
    characteristics: { overtaking: 'Low', tyre_wear: 'Medium', downforce: 'Very High', power_sensitive: false },
    ergastId: 'hungaroring',
    wikiTitle: 'Hungaroring',
  },
  {
    id: 'spa', name: 'Circuit de Spa-Francorchamps', country: 'Belgium', city: 'Spa',
    lat: 50.4372, lng: 5.9714, length: 7.004, laps: 44, corners: 19,
    lapRecord: { time: '1:46.286', driver: 'Valtteri Bottas', year: 2018 },
    firstGP: 1950, drsZones: 2,
    description: 'Spa-Francorchamps is widely considered the greatest Formula 1 circuit in the world. Carved through the Ardennes forest in Belgium, its combination of high-speed corners, unpredictable weather, and sheer challenge is unmatched.',
    trivia: [
      'Eau Rouge / Raidillon: the most iconic corner sequence in motorsport — taken flat at over 300 km/h',
      'Weather can change from sunshine to thunderstorms lap by lap due to the microclimate',
      'The longest circuit on the current F1 calendar at 7.004 km',
      'Michael Schumacher won here six times; Ayrton Senna won four consecutive Belgian GPs here',
      'The Kemmel Straight is one of the best overtaking spots in F1',
    ],
    characteristics: { overtaking: 'High', tyre_wear: 'Medium', downforce: 'Medium-High', power_sensitive: true },
    ergastId: 'spa',
    wikiTitle: 'Circuit_de_Spa-Francorchamps',
  },
  {
    id: 'zandvoort', name: 'Circuit Zandvoort', country: 'Netherlands', city: 'Zandvoort',
    lat: 52.3888, lng: 4.5409, length: 4.259, laps: 72, corners: 14,
    lapRecord: { time: '1:11.097', driver: 'Lewis Hamilton', year: 2021 },
    firstGP: 1952, drsZones: 2,
    description: 'Tucked into the sand dunes of the Dutch coast near Haarlem, Zandvoort returned to the F1 calendar in 2021. The banked final corners are unique in modern F1 and allow cars to run multiple racing lines through them.',
    trivia: [
      'The banked Arie Luyendyk and Hugenholtz corners are unique in modern F1',
      'Dutch fans (Oranje) create one of the loudest and most colourful atmospheres on the calendar',
      'The circuit sits in sand dunes on the North Sea coast — winds can dramatically affect car balance',
      'Absent from the F1 calendar from 1985 to 2021',
    ],
    characteristics: { overtaking: 'Low', tyre_wear: 'High', downforce: 'High', power_sensitive: false },
    ergastId: 'zandvoort',
    wikiTitle: 'Circuit_Zandvoort',
  },
  {
    id: 'monza', name: 'Autodromo Nazionale Monza', country: 'Italy', city: 'Monza',
    lat: 45.6156, lng: 9.2811, length: 5.793, laps: 53, corners: 11,
    lapRecord: { time: '1:21.046', driver: 'Rubens Barrichello', year: 2004 },
    firstGP: 1950, drsZones: 2,
    description: 'The Temple of Speed. Monza is the fastest circuit on the Formula 1 calendar, with average speeds approaching 260 km/h. The circuit\'s historic park setting, passionate Tifosi, and ancient banked oval section (no longer used in F1) give it a timeless character.',
    trivia: [
      'Fastest circuit on the F1 calendar — average race speed approaches 260 km/h',
      'F1 cars use their lowest downforce setup of the year here',
      'The Tifosi (Ferrari fans) create an incredible atmosphere regardless of Ferrari\'s performance',
      'Historic banked oval is still visible in the park but no longer used in F1',
      'The slipstream effect here is so powerful that qualifying grids are almost random',
    ],
    characteristics: { overtaking: 'High', tyre_wear: 'Low', downforce: 'Very Low', power_sensitive: true },
    ergastId: 'monza',
    wikiTitle: 'Autodromo_Nazionale_Monza',
  },
  {
    id: 'baku', name: 'Baku City Circuit', country: 'Azerbaijan', city: 'Baku',
    lat: 40.3724, lng: 49.8533, length: 6.003, laps: 51, corners: 20,
    lapRecord: { time: '1:43.009', driver: 'Charles Leclerc', year: 2019 },
    firstGP: 2017, drsZones: 2,
    description: 'The Baku City Circuit is one of the most dramatic tracks on the calendar. Combining a 2.2 km straight (the longest in F1) with the ultra-narrow medieval castle section, it creates wild unpredictable racing — often featuring safety cars, crashes, and surprise results.',
    trivia: [
      'The longest straight in F1 at 2.2 km — top speeds exceed 350 km/h',
      'The castle section (Turn 7–8) is only 7.6 m wide — barely wider than an F1 car with mirrors',
      'Famous for dramatic late-race incidents: Vettel-Hamilton 2017, Verstappen-Hamilton 2021 crashes',
      'Safety car deployments are almost guaranteed every race',
    ],
    characteristics: { overtaking: 'High', tyre_wear: 'Low', downforce: 'Low', power_sensitive: true },
    ergastId: 'baku',
    wikiTitle: 'Baku_City_Circuit',
  },
  {
    id: 'singapore', name: 'Marina Bay Street Circuit', country: 'Singapore', city: 'Singapore',
    lat: 1.2914, lng: 103.8644, length: 4.94, laps: 62, corners: 23,
    lapRecord: { time: '1:35.867', driver: 'Kevin Magnussen', year: 2018 },
    firstGP: 2008, drsZones: 3,
    description: 'Marina Bay hosts the only true night race in Formula 1. Racing under 1,500 floodlights through the streets of Singapore creates a stunning visual spectacle. High humidity, oppressive heat, and a relentlessly demanding track make this the most physically punishing race of the season.',
    trivia: [
      'Only true night race in Formula 1 — 1,500 floodlights illuminate the circuit',
      'One of the most physically demanding races of the year due to heat and humidity',
      'Cars are the slowest around any circuit in terms of average speed (excluding Monaco)',
      '2008 "Crashgate" scandal: Nelson Piquet Jr. deliberately crashed on team orders to favour Alonso',
      'Singapore often sees surprising results due to safety cars and strategy complexity',
    ],
    characteristics: { overtaking: 'Low', tyre_wear: 'Medium', downforce: 'Very High', power_sensitive: false },
    ergastId: 'marina_bay',
    wikiTitle: 'Marina_Bay_Street_Circuit',
  },
  {
    id: 'austin', name: 'Circuit of the Americas', country: 'USA', city: 'Austin, Texas',
    lat: 30.1328, lng: -97.6411, length: 5.513, laps: 56, corners: 20,
    lapRecord: { time: '1:36.169', driver: 'Charles Leclerc', year: 2019 },
    firstGP: 2012, drsZones: 2,
    description: 'COTA was designed specifically for Formula 1 by Hermann Tilke and officially opened in 2012. Its signature Turn 1 — a steep blind crest leading into a hairpin — provides one of the best overtaking spots in the Americas.',
    trivia: [
      'Turn 1 is the highest elevation change in any racing corner in the USA',
      'Hosts a Sprint weekend',
      'Designed with specific nods to famous corners from other circuits (Turn 2 mimics Maggotts, Turn 11 mimics the Hairpin at Spa)',
      'Lewis Hamilton won the US GP at COTA a record six times',
    ],
    characteristics: { overtaking: 'Medium', tyre_wear: 'High', downforce: 'Medium', power_sensitive: false },
    ergastId: 'americas',
    wikiTitle: 'Circuit_of_the_Americas',
  },
  {
    id: 'mexico', name: 'Autodromo Hermanos Rodriguez', country: 'Mexico', city: 'Mexico City',
    lat: 19.4042, lng: -99.0907, length: 4.304, laps: 71, corners: 17,
    lapRecord: { time: '1:17.774', driver: 'Valtteri Bottas', year: 2021 },
    firstGP: 1963, drsZones: 3,
    description: 'Racing at 2,285m above sea level, Mexico City presents unique challenges for both engines and aerodynamics. Thin air reduces engine power and aero efficiency by 20-25%, forcing teams to use higher-downforce setups. The incredible stadium section creates the most enclosed atmosphere in F1.',
    trivia: [
      'Highest altitude circuit on the F1 calendar at 2,285m above sea level',
      'Thin air reduces aerodynamic downforce by 20–25% — unique setup requirements',
      'Engine power output drops significantly — teams compensate with turbo boost',
      'The stadium section (Foro Sol baseball stadium) holds 75,000 fans around the final corner',
      'Original circuit hosted Fangio and Clark in the 1960s',
    ],
    characteristics: { overtaking: 'Medium', tyre_wear: 'Low', downforce: 'Medium', power_sensitive: true },
    ergastId: 'rodriguez',
    wikiTitle: 'Autodromo_Hermanos_Rodriguez',
  },
  {
    id: 'brazil', name: 'Autodromo Jose Carlos Pace', country: 'Brazil', city: 'São Paulo',
    lat: -23.7036, lng: -46.6997, length: 4.309, laps: 71, corners: 15,
    lapRecord: { time: '1:10.540', driver: 'Valtteri Bottas', year: 2018 },
    firstGP: 1972, drsZones: 2,
    description: 'Interlagos is one of the most beloved circuits on the F1 calendar. The passionate Brazilian fans — the Torcida — create an electric atmosphere. The circuit runs anti-clockwise and features dramatic elevation changes and unpredictable weather.',
    trivia: [
      'Anti-clockwise layout is rare in F1',
      'Nelson Piquet Sr. won the 1983 championship here on the final lap of the season',
      'Ayrton Senna\'s home circuit — his wins here hold deep emotional significance for Brazilians',
      'The Torcida (fans) create some of the most passionate scenes in all of motorsport',
      '2012: Sebastian Vettel\'s dramatic spin and recovery to claim the championship',
    ],
    characteristics: { overtaking: 'High', tyre_wear: 'High', downforce: 'Medium', power_sensitive: false },
    ergastId: 'interlagos',
    wikiTitle: 'Autodromo_Jose_Carlos_Pace',
  },
  {
    id: 'lasvegas', name: 'Las Vegas Street Circuit', country: 'USA', city: 'Las Vegas',
    lat: 36.1147, lng: -115.1728, length: 6.201, laps: 50, corners: 17,
    lapRecord: { time: '1:35.490', driver: 'Oscar Piastri', year: 2024 },
    firstGP: 2023, drsZones: 2,
    description: 'The Las Vegas Grand Prix runs along the iconic Las Vegas Strip at night, with casino hotels as the backdrop. The long 1.9 km Koval straight creates spectacular slipstream battles and heavy braking zones.',
    trivia: [
      'Runs past iconic casinos including the Bellagio, Caesars Palace, and the MGM Grand',
      'Koval straight at 1.9 km is one of the longest DRS zones in F1',
      'Race held at night in freezing November temperatures — unusual for F1 in Las Vegas',
      'The 2023 debut was controversial due to a drain cover incident in practice',
    ],
    characteristics: { overtaking: 'High', tyre_wear: 'Low', downforce: 'Low', power_sensitive: true },
    ergastId: 'vegas',
    wikiTitle: 'Las_Vegas_Street_Circuit',
  },
  {
    id: 'qatar', name: 'Lusail International Circuit', country: 'Qatar', city: 'Lusail',
    lat: 25.49, lng: 51.4541, length: 5.38, laps: 57, corners: 16,
    lapRecord: { time: '1:24.319', driver: 'Max Verstappen', year: 2023 },
    firstGP: 2021, drsZones: 1,
    description: 'The Lusail Circuit was originally built for MotoGP and hosted its first Formula 1 Grand Prix in 2021. A flowing, high-speed circuit with challenging compound corners, it has quickly become a favourite among drivers.',
    trivia: [
      'Originally built for MotoGP — first F1 race held here in 2021',
      'One of the most consistently fast circuits on the calendar',
      'Hosts a Sprint weekend',
      'The 2023 race saw Max Verstappen obliterate the field',
    ],
    characteristics: { overtaking: 'Medium', tyre_wear: 'High', downforce: 'Medium-High', power_sensitive: false },
    ergastId: 'losail',
    wikiTitle: 'Lusail_International_Circuit',
  },
  {
    id: 'abudhabi', name: 'Yas Marina Circuit', country: 'UAE', city: 'Abu Dhabi',
    lat: 24.4672, lng: 54.6031, length: 5.281, laps: 58, corners: 16,
    lapRecord: { time: '1:26.103', driver: 'Max Verstappen', year: 2021 },
    firstGP: 2009, drsZones: 2,
    description: 'Yas Marina hosts the season finale of the Formula 1 World Championship. Built on an artificial island with the circuit passing under and alongside a luxury hotel, it has a unique visual identity. The 2021 season finale — decided on the final lap — is one of the most dramatic conclusions in F1 history.',
    trivia: [
      'Season finale since 2009 — has decided the championship multiple times',
      'The circuit passes through the Yas Viceroy hotel on the pit straight',
      '2021 finale: Verstappen passed Hamilton on the final lap to win his first championship',
      'Extensive redesign in 2021 significantly improved overtaking',
    ],
    characteristics: { overtaking: 'Medium', tyre_wear: 'Medium', downforce: 'Medium', power_sensitive: false },
    ergastId: 'yas_marina',
    wikiTitle: 'Yas_Marina_Circuit',
  },
];

// ═══════════════════════════════════════════════════════════════
// DRIVER DATA (current 2025/2026 grid)
// ═══════════════════════════════════════════════════════════════
const CURRENT_DRIVERS = [
  { num: 1,  code:'VER', first:'Max',       last:'Verstappen', nat:'🇳🇱', team:'Red Bull Racing',      dob:'1997-09-30', wikiTitle:'Max_Verstappen' },
  { num: 4,  code:'NOR', first:'Lando',     last:'Norris',     nat:'🇬🇧', team:'McLaren',              dob:'1999-11-13', wikiTitle:'Lando_Norris' },
  { num: 16, code:'LEC', first:'Charles',   last:'Leclerc',    nat:'🇲🇨', team:'Ferrari',              dob:'1997-10-16', wikiTitle:'Charles_Leclerc' },
  { num: 44, code:'HAM', first:'Lewis',     last:'Hamilton',   nat:'🇬🇧', team:'Ferrari',              dob:'1985-01-07', wikiTitle:'Lewis_Hamilton' },
  { num: 63, code:'RUS', first:'George',    last:'Russell',    nat:'🇬🇧', team:'Mercedes',             dob:'1998-02-15', wikiTitle:'George_Russell_(racing_driver)' },
  { num: 12, code:'ANT', first:'Kimi',      last:'Antonelli',  nat:'🇮🇹', team:'Mercedes',             dob:'2006-08-25', wikiTitle:'Andrea_Kimi_Antonelli' },
  { num: 14, code:'ALO', first:'Fernando',  last:'Alonso',     nat:'🇪🇸', team:'Aston Martin',         dob:'1981-07-29', wikiTitle:'Fernando_Alonso' },
  { num: 18, code:'STR', first:'Lance',     last:'Stroll',     nat:'🇨🇦', team:'Aston Martin',         dob:'1998-10-29', wikiTitle:'Lance_Stroll' },
  { num: 81, code:'PIA', first:'Oscar',     last:'Piastri',    nat:'🇦🇺', team:'McLaren',              dob:'2001-04-06', wikiTitle:'Oscar_Piastri' },
  { num: 55, code:'SAI', first:'Carlos',    last:'Sainz',      nat:'🇪🇸', team:'Williams',             dob:'1994-09-01', wikiTitle:'Carlos_Sainz_Jr.' },
  { num: 10, code:'GAS', first:'Pierre',    last:'Gasly',      nat:'🇫🇷', team:'Alpine',               dob:'1996-02-07', wikiTitle:'Pierre_Gasly' },
  { num: 31, code:'OCO', first:'Esteban',   last:'Ocon',       nat:'🇫🇷', team:'Haas',                 dob:'1996-09-17', wikiTitle:'Esteban_Ocon' },
  { num: 27, code:'HUL', first:'Nico',      last:'Hülkenberg', nat:'🇩🇪', team:'Kick Sauber',          dob:'1987-08-19', wikiTitle:'Nico_Hülkenberg' },
  { num: 5,  code:'BEA', first:'Oliver',    last:'Bearman',    nat:'🇬🇧', team:'Haas',                 dob:'2005-05-08', wikiTitle:'Oliver_Bearman' },
  { num: 23, code:'ALB', first:'Alexander', last:'Albon',      nat:'🇹🇭', team:'Williams',             dob:'1996-03-23', wikiTitle:'Alexander_Albon' },
  { num: 22, code:'TSU', first:'Yuki',      last:'Tsunoda',    nat:'🇯🇵', team:'Racing Bulls',         dob:'2000-05-11', wikiTitle:'Yuki_Tsunoda' },
  { num: 6,  code:'HAD', first:'Isack',     last:'Hadjar',     nat:'🇫🇷', team:'Racing Bulls',         dob:'2004-09-28', wikiTitle:'Isack_Hadjar' },
  { num: 43, code:'COL', first:'Franco',    last:'Colapinto',  nat:'🇦🇷', team:'Alpine',               dob:'2003-05-27', wikiTitle:'Franco_Colapinto' },
  { num: 87, code:'BOR', first:'Gabriel',   last:'Bortoleto',  nat:'🇧🇷', team:'Kick Sauber',          dob:'2004-10-14', wikiTitle:'Gabriel_Bortoleto' },
  { num: 30, code:'LIN', first:'Arvid',     last:'Lindblad',   nat:'🇬🇧', team:'Racing Bulls',         dob:'2006-12-10', wikiTitle:'Arvid_Lindblad' },
];

// ═══════════════════════════════════════════════════════════════
// CONSTRUCTORS (current)
// ═══════════════════════════════════════════════════════════════
const CONSTRUCTORS = [
  { id:'mclaren',      name:'McLaren',          base:'Woking, UK',           firstYear:1966, titles:8,  ergastId:'mclaren',       color:'#FF8000', chassis:'MCL39', power:'Mercedes', wikiTitle:'McLaren' },
  { id:'ferrari',      name:'Ferrari',           base:'Maranello, Italy',     firstYear:1950, titles:16, ergastId:'ferrari',       color:'#E8002D', chassis:'SF-25', power:'Ferrari',  wikiTitle:'Scuderia_Ferrari' },
  { id:'redbull',      name:'Red Bull Racing',   base:'Milton Keynes, UK',    firstYear:2005, titles:6,  ergastId:'red_bull',      color:'#3671C6', chassis:'RB21',  power:'Honda RBPT', wikiTitle:'Red_Bull_Racing' },
  { id:'mercedes',     name:'Mercedes',          base:'Brackley, UK',         firstYear:2010, titles:8,  ergastId:'mercedes',      color:'#27F4D2', chassis:'W16',   power:'Mercedes', wikiTitle:'Mercedes-AMG_Petronas_F1_Team' },
  { id:'aston',        name:'Aston Martin',      base:'Silverstone, UK',      firstYear:2021, titles:0,  ergastId:'aston_martin',  color:'#229971', chassis:'AMR25', power:'Mercedes', wikiTitle:'Aston_Martin_in_Formula_One' },
  { id:'alpine',       name:'Alpine',            base:'Enstone, UK',          firstYear:2021, titles:0,  ergastId:'alpine',        color:'#FF87BC', chassis:'A525',  power:'Renault',  wikiTitle:'Alpine_F1_Team' },
  { id:'haas',         name:'Haas',              base:'Kannapolis, USA',      firstYear:2016, titles:0,  ergastId:'haas',          color:'#B6BABD', chassis:'VF-25', power:'Ferrari',  wikiTitle:'Haas_F1_Team' },
  { id:'williams',     name:'Williams',          base:'Grove, UK',            firstYear:1977, titles:7,  ergastId:'williams',      color:'#64C4FF', chassis:'FW47',  power:'Mercedes', wikiTitle:'Williams_Racing' },
  { id:'sauber',       name:'Kick Sauber',       base:'Hinwil, Switzerland',  firstYear:1993, titles:0,  ergastId:'sauber',        color:'#52E252', chassis:'C45',   power:'Ferrari',  wikiTitle:'Sauber_Motorsport' },
  { id:'racingbulls',  name:'Racing Bulls',      base:'Faenza, Italy',        firstYear:2006, titles:0,  ergastId:'rb',            color:'#6692FF', chassis:'VCARB02', power:'Honda RBPT', wikiTitle:'Racing_Bulls_(Formula_One_team)' },
];

// ═══════════════════════════════════════════════════════════════
// F1 WORLD CHAMPIONS since 1950
// ═══════════════════════════════════════════════════════════════
const CHAMPIONS_DATA = [
  { year:1950, driver:'Giuseppe Farina',     team:'Alfa Romeo',    nationality:'🇮🇹' },
  { year:1951, driver:'Juan Manuel Fangio',  team:'Alfa Romeo',    nationality:'🇦🇷' },
  { year:1952, driver:'Alberto Ascari',      team:'Ferrari',       nationality:'🇮🇹' },
  { year:1953, driver:'Alberto Ascari',      team:'Ferrari',       nationality:'🇮🇹' },
  { year:1954, driver:'Juan Manuel Fangio',  team:'Maserati/Mercedes',nationality:'🇦🇷' },
  { year:1955, driver:'Juan Manuel Fangio',  team:'Mercedes',      nationality:'🇦🇷' },
  { year:1956, driver:'Juan Manuel Fangio',  team:'Ferrari',       nationality:'🇦🇷' },
  { year:1957, driver:'Juan Manuel Fangio',  team:'Maserati',      nationality:'🇦🇷' },
  { year:1958, driver:'Mike Hawthorn',       team:'Ferrari',       nationality:'🇬🇧' },
  { year:1959, driver:'Jack Brabham',        team:'Cooper',        nationality:'🇦🇺' },
  { year:1960, driver:'Jack Brabham',        team:'Cooper',        nationality:'🇦🇺' },
  { year:1961, driver:'Phil Hill',           team:'Ferrari',       nationality:'🇺🇸' },
  { year:1962, driver:'Graham Hill',         team:'BRM',           nationality:'🇬🇧' },
  { year:1963, driver:'Jim Clark',           team:'Lotus',         nationality:'🇬🇧' },
  { year:1964, driver:'John Surtees',        team:'Ferrari',       nationality:'🇬🇧' },
  { year:1965, driver:'Jim Clark',           team:'Lotus',         nationality:'🇬🇧' },
  { year:1966, driver:'Jack Brabham',        team:'Brabham',       nationality:'🇦🇺' },
  { year:1967, driver:'Denny Hulme',         team:'Brabham',       nationality:'🇳🇿' },
  { year:1968, driver:'Graham Hill',         team:'Lotus',         nationality:'🇬🇧' },
  { year:1969, driver:'Jackie Stewart',      team:'Matra',         nationality:'🇬🇧' },
  { year:1970, driver:'Jochen Rindt',        team:'Lotus',         nationality:'🇦🇹', note:'Posthumous champion' },
  { year:1971, driver:'Jackie Stewart',      team:'Tyrrell',       nationality:'🇬🇧' },
  { year:1972, driver:'Emerson Fittipaldi',  team:'Lotus',         nationality:'🇧🇷' },
  { year:1973, driver:'Jackie Stewart',      team:'Tyrrell',       nationality:'🇬🇧' },
  { year:1974, driver:'Emerson Fittipaldi',  team:'McLaren',       nationality:'🇧🇷' },
  { year:1975, driver:'Niki Lauda',          team:'Ferrari',       nationality:'🇦🇹' },
  { year:1976, driver:'James Hunt',          team:'McLaren',       nationality:'🇬🇧' },
  { year:1977, driver:'Niki Lauda',          team:'Ferrari',       nationality:'🇦🇹' },
  { year:1978, driver:'Mario Andretti',      team:'Lotus',         nationality:'🇺🇸' },
  { year:1979, driver:'Jody Scheckter',      team:'Ferrari',       nationality:'🇿🇦' },
  { year:1980, driver:'Alan Jones',          team:'Williams',      nationality:'🇦🇺' },
  { year:1981, driver:'Nelson Piquet',       team:'Brabham',       nationality:'🇧🇷' },
  { year:1982, driver:'Keke Rosberg',        team:'Williams',      nationality:'🇫🇮' },
  { year:1983, driver:'Nelson Piquet',       team:'Brabham',       nationality:'🇧🇷' },
  { year:1984, driver:'Niki Lauda',          team:'McLaren',       nationality:'🇦🇹' },
  { year:1985, driver:'Alain Prost',         team:'McLaren',       nationality:'🇫🇷' },
  { year:1986, driver:'Alain Prost',         team:'McLaren',       nationality:'🇫🇷' },
  { year:1987, driver:'Nelson Piquet',       team:'Williams',      nationality:'🇧🇷' },
  { year:1988, driver:'Ayrton Senna',        team:'McLaren',       nationality:'🇧🇷' },
  { year:1989, driver:'Alain Prost',         team:'McLaren',       nationality:'🇫🇷' },
  { year:1990, driver:'Ayrton Senna',        team:'McLaren',       nationality:'🇧🇷' },
  { year:1991, driver:'Ayrton Senna',        team:'McLaren',       nationality:'🇧🇷' },
  { year:1992, driver:'Nigel Mansell',       team:'Williams',      nationality:'🇬🇧' },
  { year:1993, driver:'Alain Prost',         team:'Williams',      nationality:'🇫🇷' },
  { year:1994, driver:'Michael Schumacher',  team:'Benetton',      nationality:'🇩🇪' },
  { year:1995, driver:'Michael Schumacher',  team:'Benetton',      nationality:'🇩🇪' },
  { year:1996, driver:'Damon Hill',          team:'Williams',      nationality:'🇬🇧' },
  { year:1997, driver:'Jacques Villeneuve',  team:'Williams',      nationality:'🇨🇦' },
  { year:1998, driver:'Mika Häkkinen',       team:'McLaren',       nationality:'🇫🇮' },
  { year:1999, driver:'Mika Häkkinen',       team:'McLaren',       nationality:'🇫🇮' },
  { year:2000, driver:'Michael Schumacher',  team:'Ferrari',       nationality:'🇩🇪' },
  { year:2001, driver:'Michael Schumacher',  team:'Ferrari',       nationality:'🇩🇪' },
  { year:2002, driver:'Michael Schumacher',  team:'Ferrari',       nationality:'🇩🇪' },
  { year:2003, driver:'Michael Schumacher',  team:'Ferrari',       nationality:'🇩🇪' },
  { year:2004, driver:'Michael Schumacher',  team:'Ferrari',       nationality:'🇩🇪' },
  { year:2005, driver:'Fernando Alonso',     team:'Renault',       nationality:'🇪🇸' },
  { year:2006, driver:'Fernando Alonso',     team:'Renault',       nationality:'🇪🇸' },
  { year:2007, driver:'Kimi Räikkönen',      team:'Ferrari',       nationality:'🇫🇮' },
  { year:2008, driver:'Lewis Hamilton',      team:'McLaren',       nationality:'🇬🇧' },
  { year:2009, driver:'Jenson Button',       team:'Brawn GP',      nationality:'🇬🇧' },
  { year:2010, driver:'Sebastian Vettel',    team:'Red Bull',      nationality:'🇩🇪' },
  { year:2011, driver:'Sebastian Vettel',    team:'Red Bull',      nationality:'🇩🇪' },
  { year:2012, driver:'Sebastian Vettel',    team:'Red Bull',      nationality:'🇩🇪' },
  { year:2013, driver:'Sebastian Vettel',    team:'Red Bull',      nationality:'🇩🇪' },
  { year:2014, driver:'Lewis Hamilton',      team:'Mercedes',      nationality:'🇬🇧' },
  { year:2015, driver:'Lewis Hamilton',      team:'Mercedes',      nationality:'🇬🇧' },
  { year:2016, driver:'Nico Rosberg',        team:'Mercedes',      nationality:'🇩🇪' },
  { year:2017, driver:'Lewis Hamilton',      team:'Mercedes',      nationality:'🇬🇧' },
  { year:2018, driver:'Lewis Hamilton',      team:'Mercedes',      nationality:'🇬🇧' },
  { year:2019, driver:'Lewis Hamilton',      team:'Mercedes',      nationality:'🇬🇧' },
  { year:2020, driver:'Lewis Hamilton',      team:'Mercedes',      nationality:'🇬🇧' },
  { year:2021, driver:'Max Verstappen',      team:'Red Bull',      nationality:'🇳🇱' },
  { year:2022, driver:'Max Verstappen',      team:'Red Bull',      nationality:'🇳🇱' },
  { year:2023, driver:'Max Verstappen',      team:'Red Bull',      nationality:'🇳🇱' },
  { year:2024, driver:'Max Verstappen',      team:'Red Bull',      nationality:'🇳🇱' },
];

// WCC data
const WCC_DATA = [
  { year:1958, team:'Vanwall', nationality:'🇬🇧' },
  { year:1959, team:'Cooper-Climax', nationality:'🇬🇧' },
  { year:1960, team:'Cooper-Climax', nationality:'🇬🇧' },
  { year:1961, team:'Ferrari', nationality:'🇮🇹' },
  { year:1962, team:'BRM', nationality:'🇬🇧' },
  { year:1963, team:'Lotus-Climax', nationality:'🇬🇧' },
  { year:1964, team:'Ferrari', nationality:'🇮🇹' },
  { year:1965, team:'Lotus-Climax', nationality:'🇬🇧' },
  { year:1966, team:'Brabham-Repco', nationality:'🇬🇧' },
  { year:1967, team:'Brabham-Repco', nationality:'🇬🇧' },
  { year:1968, team:'Lotus-Ford', nationality:'🇬🇧' },
  { year:1969, team:'Matra-Ford', nationality:'🇫🇷' },
  { year:1970, team:'Lotus-Ford', nationality:'🇬🇧' },
  { year:1971, team:'Tyrrell-Ford', nationality:'🇬🇧' },
  { year:1972, team:'Lotus-Ford', nationality:'🇬🇧' },
  { year:1973, team:'Lotus-Ford', nationality:'🇬🇧' },
  { year:1974, team:'McLaren-Ford', nationality:'🇬🇧' },
  { year:1975, team:'Ferrari', nationality:'🇮🇹' },
  { year:1976, team:'Ferrari', nationality:'🇮🇹' },
  { year:1977, team:'Ferrari', nationality:'🇮🇹' },
  { year:1978, team:'Lotus-Ford', nationality:'🇬🇧' },
  { year:1979, team:'Ferrari', nationality:'🇮🇹' },
  { year:1980, team:'Williams-Ford', nationality:'🇬🇧' },
  { year:1981, team:'Williams-Ford', nationality:'🇬🇧' },
  { year:1982, team:'Ferrari', nationality:'🇮🇹' },
  { year:1983, team:'Ferrari', nationality:'🇮🇹' },
  { year:1984, team:'McLaren-TAG', nationality:'🇬🇧' },
  { year:1985, team:'McLaren-TAG', nationality:'🇬🇧' },
  { year:1986, team:'Williams-Honda', nationality:'🇬🇧' },
  { year:1987, team:'Williams-Honda', nationality:'🇬🇧' },
  { year:1988, team:'McLaren-Honda', nationality:'🇬🇧' },
  { year:1989, team:'McLaren-Honda', nationality:'🇬🇧' },
  { year:1990, team:'McLaren-Honda', nationality:'🇬🇧' },
  { year:1991, team:'McLaren-Honda', nationality:'🇬🇧' },
  { year:1992, team:'Williams-Renault', nationality:'🇬🇧' },
  { year:1993, team:'Williams-Renault', nationality:'🇬🇧' },
  { year:1994, team:'Williams-Renault', nationality:'🇬🇧' },
  { year:1995, team:'Benetton-Renault', nationality:'🇬🇧' },
  { year:1996, team:'Williams-Renault', nationality:'🇬🇧' },
  { year:1997, team:'Williams-Renault', nationality:'🇬🇧' },
  { year:1998, team:'McLaren-Mercedes', nationality:'🇬🇧' },
  { year:1999, team:'Ferrari', nationality:'🇮🇹' },
  { year:2000, team:'Ferrari', nationality:'🇮🇹' },
  { year:2001, team:'Ferrari', nationality:'🇮🇹' },
  { year:2002, team:'Ferrari', nationality:'🇮🇹' },
  { year:2003, team:'Ferrari', nationality:'🇮🇹' },
  { year:2004, team:'Ferrari', nationality:'🇮🇹' },
  { year:2005, team:'Renault', nationality:'🇫🇷' },
  { year:2006, team:'Renault', nationality:'🇫🇷' },
  { year:2007, team:'Ferrari', nationality:'🇮🇹' },
  { year:2008, team:'Ferrari', nationality:'🇮🇹' },
  { year:2009, team:'Brawn-Mercedes', nationality:'🇬🇧' },
  { year:2010, team:'Red Bull', nationality:'🇦🇹' },
  { year:2011, team:'Red Bull', nationality:'🇦🇹' },
  { year:2012, team:'Red Bull', nationality:'🇦🇹' },
  { year:2013, team:'Red Bull', nationality:'🇦🇹' },
  { year:2014, team:'Mercedes', nationality:'🇩🇪' },
  { year:2015, team:'Mercedes', nationality:'🇩🇪' },
  { year:2016, team:'Mercedes', nationality:'🇩🇪' },
  { year:2017, team:'Mercedes', nationality:'🇩🇪' },
  { year:2018, team:'Mercedes', nationality:'🇩🇪' },
  { year:2019, team:'Mercedes', nationality:'🇩🇪' },
  { year:2020, team:'Mercedes', nationality:'🇩🇪' },
  { year:2021, team:'Mercedes', nationality:'🇩🇪' },
  { year:2022, team:'Red Bull', nationality:'🇦🇹' },
  { year:2023, team:'Red Bull', nationality:'🇦🇹' },
  { year:2024, team:'McLaren', nationality:'🇬🇧' },
];

// ═══════════════════════════════════════════════════════════════
// F1 MILESTONES / TRIVIA
// ═══════════════════════════════════════════════════════════════
const F1_MILESTONES = [
  { year:1950, event:'Formula 1 World Championship begins', desc:'The FIA Formula One World Championship starts at Silverstone, UK. Giuseppe Farina wins the first race.' },
  { year:1958, event:'Constructors Championship introduced', desc:'The World Constructors Championship is established, with Vanwall winning the first title.' },
  { year:1968, event:'Commercial sponsorship begins', desc:'Lotus introduces commercial sponsorship (Gold Leaf) — changing F1\'s financial model forever.' },
  { year:1977, event:'Ground effect era begins', desc:'Colin Chapman\'s Lotus 78 introduces ground-effect aerodynamics, revolutionising car design.' },
  { year:1983, event:'Turbo era peaks', desc:'The turbocharged engine era reaches its peak — qualifying engines produce over 1,500 bhp.' },
  { year:1989, event:'Semi-automatic gearbox', desc:'Ferrari introduces the world\'s first semi-automatic paddle-shift gearbox, used by Nigel Mansell.' },
  { year:1994, event:'Imola tragedy', desc:'Ayrton Senna and Roland Ratzenberger die at San Marino GP. F1 is transformed by sweeping safety reforms.' },
  { year:2009, event:'KERS introduced', desc:'Kinetic Energy Recovery Systems appear in F1 for the first time, beginning the hybrid journey.' },
  { year:2014, event:'Hybrid power unit era', desc:'The 1.6L V6 turbo-hybrid power unit regulations transform F1\'s technical landscape entirely.' },
  { year:2017, event:'Wider cars return', desc:'F1 returns to wider, more aggressive aerodynamic cars — lap times tumble below 2004 records.' },
  { year:2021, event:'Sprint qualifying introduced', desc:'F1 introduces sprint races to selected weekends, adding a new competitive format.' },
  { year:2022, event:'Ground effect revolution', desc:'F1\'s biggest regulation reset in decades brings ground-effect aerodynamics back and closes the grid.' },
  { year:2026, event:'Active aero era begins', desc:'Traditional DRS is replaced by moveable aerodynamics — drivers control wing angles for straights (Straight Mode) and corners (Corner Mode). A new 1.5L V6 hybrid power unit with 50% electrical power share is introduced.' },
];

// ═══════════════════════════════════════════════════════════════
// ALL-TIME RECORDS
// ═══════════════════════════════════════════════════════════════
const ALL_TIME_RECORDS = {
  wins:          [{ driver:'Lewis Hamilton',    val:103 },{ driver:'Michael Schumacher', val:91 },{ driver:'Sebastian Vettel', val:53 },{ driver:'Alain Prost', val:51 },{ driver:'Ayrton Senna', val:41 },{ driver:'Max Verstappen', val:63 }],
  poles:         [{ driver:'Lewis Hamilton',    val:104 },{ driver:'Michael Schumacher', val:68 },{ driver:'Ayrton Senna',     val:65 },{ driver:'Sebastian Vettel', val:57 },{ driver:'Max Verstappen', val:40 }],
  podiums:       [{ driver:'Lewis Hamilton',    val:197 },{ driver:'Michael Schumacher', val:155 },{ driver:'Sebastian Vettel', val:122 },{ driver:'Max Verstappen', val:113 }],
  championships: [{ driver:'Lewis Hamilton',    val:7 },{ driver:'Michael Schumacher', val:7 },{ driver:'Juan Manuel Fangio', val:5 },{ driver:'Sebastian Vettel', val:4 },{ driver:'Alain Prost', val:4 }],
  constructorWins: [{ team:'Ferrari', val:248 },{ team:'McLaren', val:183 },{ team:'Mercedes', val:125 },{ team:'Red Bull', val:122 },{ team:'Williams', val:114 }],
  constructorTitles: [{ team:'Ferrari', val:16 },{ team:'Williams', val:9 },{ team:'McLaren', val:8 },{ team:'Mercedes', val:8 },{ team:'Red Bull', val:6 }],
};
