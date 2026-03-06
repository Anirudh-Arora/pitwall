// ═══════════════════════════════════════════════════════════════
// CIRCUIT SVG PATHS
// Simplified schematic track outlines. ViewBox: "0 0 200 140"
// Generated from official track maps — approximate shapes
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// CIRCUIT SVG PATHS — unique schematic outlines, viewBox 0 0 200 140
// Each circuit has its own recognizable silhouette
// ═══════════════════════════════════════════════════════════════
const CIRCUIT_SVG_PATHS = {
  // Bahrain — kidney-shaped, two main straights
  bahrain:
    "M 100 18 L 148 20 Q 172 24 175 52 L 168 80 Q 162 102 142 112 L 108 118 L 92 118 L 58 112 Q 36 102 30 80 L 26 54 Q 28 26 52 20 Z",

  // Jeddah — very long, thin street circuit hugging the coast  
  jeddah:
    "M 30 125 L 26 92 L 28 62 L 26 35 Q 26 14 44 10 L 92 8 L 148 10 Q 168 14 170 35 L 165 62 L 163 88 Q 160 110 144 120 L 100 126 Z",

  // Melbourne — bumpy anti-clockwise park circuit
  melbourne:
    "M 58 22 L 102 16 Q 140 14 158 34 L 168 58 L 162 82 Q 156 96 142 104 L 158 118 Q 166 126 155 132 L 118 134 L 78 130 Q 52 122 44 108 L 28 94 L 33 64 Q 37 40 58 22 Z",

  // Suzuka — unique figure-8 / infinity loop with crossover
  suzuka:
    "M 48 22 L 82 16 Q 108 14 118 28 L 124 48 Q 126 62 114 70 L 100 74 L 120 82 Q 136 92 134 110 L 118 126 Q 98 132 68 128 L 44 118 Q 36 106 40 90 L 42 76 Q 44 62 56 58 L 74 54 L 58 44 Q 44 36 44 22 Z",

  // Shanghai — distinctive L-shape with long hairpin run
  shanghai:
    "M 165 30 Q 176 50 170 72 L 152 92 Q 132 108 100 110 L 62 108 Q 34 98 28 72 L 30 48 Q 38 24 60 18 L 98 14 Q 138 12 158 22 L 165 30 Z M 100 110 L 100 126 Q 100 134 112 132 L 132 128 L 132 110",

  // Miami — oval complex with stadium section
  miami:
    "M 38 108 L 26 78 Q 22 50 38 32 L 66 20 L 110 16 Q 148 14 164 36 L 172 62 Q 175 88 158 108 L 128 122 L 88 124 Q 55 122 38 108 Z",

  // Imola — very narrow, twisty Italian circuit
  imola:
    "M 44 22 L 78 14 Q 118 8 148 26 L 167 52 Q 176 74 162 98 L 140 116 Q 112 126 80 122 L 48 114 Q 24 98 22 72 L 25 44 Z",

  // Monaco — ultra-narrow street, tight hairpin at Loews
  monaco:
    "M 92 14 L 132 17 Q 158 21 162 48 L 158 68 Q 154 85 136 90 L 148 102 Q 160 115 148 125 L 118 130 L 78 128 Q 48 122 36 100 L 34 78 Q 31 54 44 36 L 64 20 Z",

  // Barcelona — classic layout with long main straight
  barcelona:
    "M 33 88 L 28 54 Q 26 26 52 16 L 92 8 L 132 10 Q 160 16 166 44 L 170 68 Q 170 95 150 112 L 110 124 L 72 122 Q 36 114 33 88 Z",

  // Canada — Gilles Villeneuve island circuit with chicane
  canada:
    "M 40 104 L 25 70 L 26 40 Q 28 16 52 8 L 92 4 Q 136 2 160 24 L 174 50 Q 180 78 166 100 L 138 118 L 94 122 Q 58 122 40 104 Z M 94 4 L 94 28",

  // Silverstone — fast sweeping corners, Maggots/Becketts
  silverstone:
    "M 28 68 Q 24 44 38 26 L 72 12 Q 108 4 142 14 L 168 30 Q 182 50 178 78 L 162 106 Q 148 120 118 124 L 75 124 Q 36 118 28 92 L 28 68 Z",

  // Hungaroring — narrow, twisty, very hard to overtake
  hungary:
    "M 40 95 L 31 61 Q 26 33 48 20 L 83 10 Q 116 4 145 20 L 162 48 Q 174 74 162 100 L 132 120 L 85 126 Q 46 122 40 95 Z",

  // Spa-Francorchamps — long, famous Eau Rouge/Raidillon
  spa:
    "M 18 72 L 16 40 Q 14 12 45 6 L 92 2 Q 140 0 164 22 L 180 50 Q 186 80 170 108 L 132 126 L 80 128 Q 30 120 18 95 L 18 72 Z M 45 6 L 62 34 Q 68 52 56 60",

  // Zandvoort — narrow seaside circuit, famous banked Turn 3
  zandvoort:
    "M 40 96 L 33 62 Q 29 34 54 20 L 86 8 Q 120 4 146 22 L 166 52 Q 174 80 158 108 L 118 126 L 71 128 Q 34 118 40 96 Z",

  // Monza — high-speed oval with two chicanes, famous banking
  monza:
    "M 25 62 L 25 30 Q 25 10 50 6 L 100 4 Q 148 4 168 26 L 180 55 L 170 86 Q 148 106 100 108 L 50 106 Q 24 100 25 80 L 25 62 Z M 68 4 L 68 28 L 84 28 M 132 4 L 132 26 L 150 26",

  // Baku — long 2.2km straight, tight medieval city section
  baku:
    "M 18 55 L 16 22 Q 14 3 44 2 L 106 2 L 165 3 Q 183 8 185 35 L 183 58 L 168 86 Q 150 108 120 116 L 68 118 Q 25 110 18 85 L 18 55 Z",

  // Singapore — night race, bumpy Marina Bay streets
  singapore:
    "M 44 108 L 31 70 Q 26 40 48 23 L 88 10 Q 126 3 154 22 L 172 50 Q 180 82 162 108 L 125 126 L 70 128 Q 34 118 44 108 Z",

  // Austin (COTA) — signature Turn 1 long climb
  austin:
    "M 33 80 L 26 50 Q 24 24 48 13 L 93 5 Q 132 1 158 19 L 174 48 Q 180 78 164 102 L 120 122 L 67 126 Q 27 115 33 80 Z",

  // Mexico — long main straight, unique stadium section
  mexico:
    "M 36 90 L 30 56 Q 26 26 52 14 L 95 6 Q 138 3 162 25 L 176 55 Q 182 86 164 108 L 118 124 L 67 128 Q 28 118 36 90 Z",

  // Brazil — Interlagos, anti-clockwise, hilly
  brazil:
    "M 28 76 L 24 46 Q 22 18 48 10 L 88 3 Q 132 0 158 20 L 174 50 Q 180 80 162 106 L 120 120 L 70 124 Q 24 114 28 76 Z",

  // Las Vegas — super-long straights, 3 main sectors
  lasvegas:
    "M 18 65 L 16 28 Q 15 7 45 3 L 106 2 L 164 4 Q 182 10 184 38 L 184 65 L 178 92 Q 162 118 106 120 L 46 118 Q 18 108 18 88 L 18 65 Z",

  // Qatar — Lusail, sweeping flowing corners
  qatar:
    "M 33 93 L 27 57 Q 22 27 50 15 L 93 7 Q 136 3 162 25 L 177 57 Q 182 90 162 113 L 116 129 L 64 129 Q 26 117 33 93 Z",

  // Abu Dhabi — Yas Marina, Marina section is iconic
  abudhabi:
    "M 36 95 L 28 61 Q 24 31 52 18 L 93 8 Q 138 4 164 28 L 178 60 Q 182 92 162 115 L 116 130 L 64 130 Q 26 120 36 95 Z M 164 28 L 174 46 Q 180 62 170 78 L 160 90",
};

const CIRCUITS = [
  {
    id: 'bahrain', name: 'Bahrain International Circuit', country: 'Bahrain', city: 'Sakhir',
    lat: 26.0325, lng: 50.5106, length: 5.412, laps: 57, corners: 15,
    lapRecord: { time: '1:31.447', driver: 'Pedro de la Rosa', year: 2005 },
    sectors: { s1:'27.638', s2:'33.822', s3:'29.987', driver:'Verstappen', year:2024 },
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
    sectors: { s1:'27.500', s2:'19.812', s3:'43.422', driver:'Leclerc', year:2024 },
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
    sectors: { s1:'24.215', s2:'29.988', s3:'25.610', driver:'Leclerc', year:2024 },
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
    sectors: { s1:'28.124', s2:'33.288', s3:'29.571', driver:'Verstappen', year:2024 },
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
    sectors: { s1:'32.501', s2:'26.315', s3:'33.422', driver:'Verstappen', year:2024 },
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
    sectors: { s1:'22.884', s2:'17.955', s3:'28.869', driver:'Norris', year:2024 },
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
    sectors: { s1:'29.112', s2:'22.881', s3:'23.491', driver:'Verstappen', year:2024 },
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
    sectors: { s1:'19.885', s2:'22.045', s3:'30.979', driver:'Leclerc', year:2024 },
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
    sectors: { s1:'20.116', s2:'29.998', s3:'28.035', driver:'Verstappen', year:2024 },
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
    sectors: { s1:'21.225', s2:'19.889', s3:'25.664', driver:'Russell', year:2024 },
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
    sectors: { s1:'27.803', s2:'17.538', s3:'34.388', driver:'Piastri', year:2025 },
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
    sectors: { s1:'18.005', s2:'31.501', s3:'22.498', driver:'Norris', year:2024 },
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
    sectors: { s1:'40.112', s2:'25.334', s3:'26.440', driver:'Russell', year:2024 },
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
    sectors: { s1:'16.995', s2:'28.445', s3:'25.611', driver:'Norris', year:2024 },
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
    sectors: { s1:'23.882', s2:'22.664', s3:'14.108', driver:'Leclerc', year:2024 },
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
    sectors: { s1:'25.441', s2:'32.818', s3:'22.882', driver:'Leclerc', year:2024 },
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
    sectors: { s1:'22.551', s2:'34.119', s3:'27.415', driver:'Norris', year:2024 },
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
    sectors: { s1:'29.334', s2:'30.882', s3:'34.667', driver:'Verstappen', year:2024 },
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
    sectors: { s1:'19.551', s2:'37.445', s3:'22.001', driver:'Sainz', year:2024 },
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
    sectors: { s1:'25.112', s2:'27.338', s3:'14.005', driver:'Norris', year:2024 },
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
    sectors: { s1:'35.551', s2:'22.778', s3:'19.334', driver:'Leclerc', year:2024 },
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
    sectors: { s1:'27.884', s2:'33.452', s3:'21.116', driver:'Norris', year:2024 },
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
    sectors: { s1:'20.334', s2:'33.118', s3:'25.227', driver:'Norris', year:2024 },
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
  // ── McLaren F1 Team — 2025 WDC & WCC ──────────────────────────
  // Lando Norris: Won 2025 WDC → keeps #1 as defending champion
  { num:1,  code:'NOR', first:'Lando',     last:'Norris',     nat:'🇬🇧', team:'McLaren',          dob:'1999-11-13', wikiTitle:'Lando_Norris',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png',
    stats:{ wdc:1, wins:21, podiums:48, poles:16 } },
  { num:81, code:'PIA', first:'Oscar',     last:'Piastri',    nat:'🇦🇺', team:'McLaren',          dob:'2001-04-06', wikiTitle:'Oscar_Piastri',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png',
    stats:{ wdc:0, wins:8,  podiums:32, poles:5  } },
  // ── Scuderia Ferrari ───────────────────────────────────────────
  { num:16, code:'LEC', first:'Charles',   last:'Leclerc',    nat:'🇲🇨', team:'Ferrari',          dob:'1997-10-16', wikiTitle:'Charles_Leclerc',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png',
    stats:{ wdc:0, wins:8,  podiums:45, poles:26 } },
  { num:44, code:'HAM', first:'Lewis',     last:'Hamilton',   nat:'🇬🇧', team:'Ferrari',          dob:'1985-01-07', wikiTitle:'Lewis_Hamilton',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png',
    stats:{ wdc:7, wins:103,podiums:197,poles:104} },
  // ── Oracle Red Bull Racing ─────────────────────────────────────
  // Verstappen: 4× WDC, keeps #1 from 2021–2024; yielded to Norris 2025
  { num:33, code:'VER', first:'Max',       last:'Verstappen', nat:'🇳🇱', team:'Red Bull Racing',  dob:'1997-09-30', wikiTitle:'Max_Verstappen',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png',
    stats:{ wdc:4, wins:65, podiums:113,poles:40 } },
  { num:22, code:'TSU', first:'Yuki',      last:'Tsunoda',    nat:'🇯🇵', team:'Red Bull Racing',  dob:'2000-05-11', wikiTitle:'Yuki_Tsunoda',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png',
    stats:{ wdc:0, wins:0,  podiums:2,  poles:0  } },
  // ── Mercedes-AMG Petronas ──────────────────────────────────────
  { num:63, code:'RUS', first:'George',    last:'Russell',    nat:'🇬🇧', team:'Mercedes',         dob:'1998-02-15', wikiTitle:'George_Russell_(racing_driver)',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png',
    stats:{ wdc:0, wins:3,  podiums:21, poles:8  } },
  { num:12, code:'ANT', first:'Kimi',      last:'Antonelli',  nat:'🇮🇹', team:'Mercedes',         dob:'2006-08-25', wikiTitle:'Andrea_Kimi_Antonelli',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/A/ANDANT01_Andrea_Kimi_Antonelli/andant01.png',
    stats:{ wdc:0, wins:0,  podiums:1,  poles:1  } },
  // ── Aston Martin Aramco ────────────────────────────────────────
  { num:14, code:'ALO', first:'Fernando',  last:'Alonso',     nat:'🇪🇸', team:'Aston Martin',     dob:'1981-07-29', wikiTitle:'Fernando_Alonso',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png',
    stats:{ wdc:2, wins:32, podiums:106,poles:22 } },
  { num:18, code:'STR', first:'Lance',     last:'Stroll',     nat:'🇨🇦', team:'Aston Martin',     dob:'1998-10-29', wikiTitle:'Lance_Stroll',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png',
    stats:{ wdc:0, wins:0,  podiums:3,  poles:1  } },
  // ── BWT Alpine F1 Team ─────────────────────────────────────────
  { num:10, code:'GAS', first:'Pierre',    last:'Gasly',      nat:'🇫🇷', team:'Alpine',           dob:'1996-02-07', wikiTitle:'Pierre_Gasly',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png',
    stats:{ wdc:0, wins:1,  podiums:4,  poles:0  } },
  { num:43, code:'COL', first:'Franco',    last:'Colapinto',  nat:'🇦🇷', team:'Alpine',           dob:'2003-05-27', wikiTitle:'Franco_Colapinto',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png',
    stats:{ wdc:0, wins:0,  podiums:0,  poles:0  } },
  // ── MoneyGram Haas F1 Team ─────────────────────────────────────
  { num:87, code:'BEA', first:'Oliver',    last:'Bearman',    nat:'🇬🇧', team:'Haas',             dob:'2005-05-08', wikiTitle:'Oliver_Bearman',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png',
    stats:{ wdc:0, wins:0,  podiums:0,  poles:0  } },
  { num:31, code:'OCO', first:'Esteban',   last:'Ocon',       nat:'🇫🇷', team:'Haas',             dob:'1996-09-17', wikiTitle:'Esteban_Ocon',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png',
    stats:{ wdc:0, wins:1,  podiums:3,  poles:0  } },
  // ── Visa Cash App Racing Bulls ─────────────────────────────────
  { num:30, code:'LAW', first:'Liam',      last:'Lawson',     nat:'🇳🇿', team:'Racing Bulls',     dob:'2002-02-11', wikiTitle:'Liam_Lawson_(racing_driver)',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png',
    stats:{ wdc:0, wins:0,  podiums:0,  poles:0  } },
  { num:6,  code:'HAD', first:'Isack',     last:'Hadjar',     nat:'🇫🇷', team:'Racing Bulls',     dob:'2004-09-28', wikiTitle:'Isack_Hadjar',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png',
    stats:{ wdc:0, wins:0,  podiums:0,  poles:0  } },
  // ── Williams Racing ────────────────────────────────────────────
  { num:23, code:'ALB', first:'Alexander', last:'Albon',      nat:'🇹🇭', team:'Williams',         dob:'1996-03-23', wikiTitle:'Alexander_Albon',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png',
    stats:{ wdc:0, wins:0,  podiums:1,  poles:0  } },
  { num:55, code:'SAI', first:'Carlos',    last:'Sainz',      nat:'🇪🇸', team:'Williams',         dob:'1994-09-01', wikiTitle:'Carlos_Sainz_Jr.',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png',
    stats:{ wdc:0, wins:4,  podiums:30, poles:6  } },
  // ── Stake F1 Team Kick Sauber → Audi 2026 ─────────────────────
  { num:27, code:'HUL', first:'Nico',      last:'Hulkenberg',  nat:'🇩🇪', team:'Kick Sauber',      dob:'1987-08-19', wikiTitle:'Nico_Hülkenberg',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png',
    stats:{ wdc:0, wins:0,  podiums:0,  poles:1  } },
  { num:5,  code:'BOR', first:'Gabriel',   last:'Bortoleto',  nat:'🇧🇷', team:'Kick Sauber',      dob:'2004-10-14', wikiTitle:'Gabriel_Bortoleto',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/G/GABCOL01_Gabriel_Bortoleto/gabcol01.png',
    stats:{ wdc:0, wins:0,  podiums:0,  poles:0  } },
  // ── Cadillac Formula 1 Team ── NEW 11th team from 2026 ─────────
  { num:2,  code:'ILO', first:'Marcus',    last:'Ericsson',   nat:'🇸🇪', team:'Cadillac',         dob:'1990-09-02', wikiTitle:'Marcus_Ericsson',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/M/MARERI01_Marcus_Ericsson/mareri01.png',
    stats:{ wdc:0, wins:0,  podiums:0,  poles:0  } },
  { num:70, code:'POW', first:'Callum',    last:'Ilott',      nat:'🇬🇧', team:'Cadillac',         dob:'1998-11-11', wikiTitle:'Callum_Ilott',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/C/CALILO01_Callum_Ilott/calilo01.png',
    stats:{ wdc:0, wins:0,  podiums:0,  poles:0  } },
]

// ═══════════════════════════════════════════════════════════════
// CONSTRUCTORS (current)
// ═══════════════════════════════════════════════════════════════
const CONSTRUCTORS = [
  {
    id:'mclaren', name:'McLaren', fullName:'McLaren F1 Team',
    base:'Woking, United Kingdom', firstYear:1966, titles:9,
    ergastId:'mclaren', color:'#FF8000',
    chassis:'MCL39', engine:'Mercedes M15 V6 Hybrid',
    principal:'Andrea Stella', wikiTitle:'McLaren',
    drivers:['Lando Norris','Oscar Piastri'],
    notes:'2025 WCC champions. 9th constructors title, Norris won 2025 WDC.',
  },
  {
    id:'ferrari', name:'Ferrari', fullName:'Scuderia Ferrari HP',
    base:'Maranello, Italy', firstYear:1950, titles:16,
    ergastId:'ferrari', color:'#E8002D',
    chassis:'SF-25', engine:'Ferrari 066/13 V6 Hybrid',
    principal:'Frederic Vasseur', wikiTitle:'Scuderia_Ferrari',
    drivers:['Charles Leclerc','Lewis Hamilton'],
    notes:'Hamilton joined Ferrari for 2025, ending his 12-year stint at Mercedes.',
  },
  {
    id:'redbull', name:'Red Bull Racing', fullName:'Oracle Red Bull Racing',
    base:'Milton Keynes, United Kingdom', firstYear:2005, titles:6,
    ergastId:'red_bull', color:'#3671C6',
    chassis:'RB21', engine:'Red Bull Powertrains (Honda-derived) V6 Hybrid',
    principal:'Christian Horner', wikiTitle:'Red_Bull_Racing',
    drivers:['Max Verstappen','Yuki Tsunoda'],
    notes:'Red Bull developed their own in-house power unit (Red Bull Powertrains) in collaboration with Ford for 2026, ending the Honda partnership.',
  },
  {
    id:'mercedes', name:'Mercedes', fullName:'Mercedes-AMG Petronas F1 Team',
    base:'Brackley, United Kingdom', firstYear:1970, titles:8,
    ergastId:'mercedes', color:'#27F4D2',
    chassis:'W16', engine:'Mercedes-AMG F1 M16 V6 Hybrid',
    principal:'Toto Wolff', wikiTitle:'Mercedes-AMG_Petronas_F1_Team',
    drivers:['George Russell','Kimi Antonelli'],
    notes:'Hamilton departed to Ferrari. 18-year-old Antonelli promoted from F2.',
  },
  {
    id:'aston', name:'Aston Martin', fullName:'Aston Martin Aramco F1 Team',
    base:'Silverstone, United Kingdom', firstYear:2021, titles:0,
    ergastId:'aston_martin', color:'#229971',
    chassis:'AMR25', engine:'Mercedes-AMG M15 V6 Hybrid',
    principal:'Andy Cowell', wikiTitle:'Aston_Martin_in_Formula_One',
    drivers:['Fernando Alonso','Lance Stroll'],
    notes:'Alonso continues into 2026 aged 44. Andy Cowell replaced Mike Krack as TP.',
  },
  {
    id:'alpine', name:'Alpine', fullName:'BWT Alpine F1 Team',
    base:'Enstone, United Kingdom / Viry-Châtillon, France', firstYear:2021, titles:0,
    ergastId:'alpine', color:'#FF87BC',
    chassis:'A525', engine:'Renault E-Tech RE25 V6 Hybrid',
    principal:'Flavio Briatore', wikiTitle:'Alpine_F1_Team',
    drivers:['Pierre Gasly','Franco Colapinto'],
    notes:'Colapinto replaced Jack Doohan from Round 7 of 2025.',
  },
  {
    id:'haas', name:'Haas', fullName:'MoneyGram Haas F1 Team',
    base:'Kannapolis, USA / Banbury, UK', firstYear:2016, titles:0,
    ergastId:'haas', color:'#B6BABD',
    chassis:'VF-25', engine:'Ferrari 066/13 V6 Hybrid',
    principal:'Ayao Komatsu', wikiTitle:'Haas_F1_Team',
    drivers:['Oliver Bearman','Esteban Ocon'],
    notes:'Ocon joined from Alpine for 2025. Bearman #87 continues in his debut full season.',
  },
  {
    id:'williams', name:'Williams', fullName:'Williams Racing',
    base:'Grove, United Kingdom', firstYear:1977, titles:7,
    ergastId:'williams', color:'#64C4FF',
    chassis:'FW47', engine:'Mercedes-AMG M15 V6 Hybrid',
    principal:'James Vowles', wikiTitle:'Williams_Racing',
    drivers:['Alexander Albon','Carlos Sainz'],
    notes:'Sainz joined from Ferrari for 2025. Strong midfield recovery under Vowles.',
  },
  {
    id:'sauber', name:'Kick Sauber', fullName:'Stake F1 Team Kick Sauber → Audi 2026',
    base:'Hinwil, Switzerland', firstYear:1993, titles:0,
    ergastId:'sauber', color:'#52E252',
    chassis:'C45', engine:'Ferrari 066/13 V6 Hybrid',
    principal:'Jonathan Wheatley', wikiTitle:'Sauber_Motorsport',
    drivers:['Nico Hulkenberg','Gabriel Bortoleto'],
    notes:"Rebranding as Audi F1 Team in 2026 with Audi own PU. Sauber will be fully acquired by Audi.",
  },
  {
    id:'racingbulls', name:'Racing Bulls', fullName:'Visa Cash App Racing Bulls F1 Team',
    base:'Faenza, Italy', firstYear:2006, titles:0,
    ergastId:'rb', color:'#6692FF',
    chassis:'VCARB02', engine:'Red Bull Powertrains (Honda-derived) V6 Hybrid',
    principal:'Laurent Mekies', wikiTitle:'Racing_Bulls_(Formula_One_team)',
    drivers:['Liam Lawson','Isack Hadjar'],
    notes:'Lawson returned after being swapped from Red Bull Racing in 2025.',
  },
  {
    id:'cadillac', name:'Cadillac', fullName:'Cadillac Formula 1 Team',
    base:'Indianapolis, USA / Silverstone, UK', firstYear:2026, titles:0,
    ergastId:'cadillac', color:'#CC0000',
    chassis:'VGMF1-01', engine:'Ferrari V6 Hybrid (customer, transitioning to GM unit)',
    principal:'Graeme Lowdon', wikiTitle:'Andretti_Global',
    drivers:['Marcus Ericsson','Callum Ilott'],
    notes:'11th team on the F1 grid from 2026 season. Originally Andretti Global, now backed by General Motors/Cadillac. GM developing own PU for future seasons.',
  },
]

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
  { year:2025, driver:'Lando Norris',          team:'McLaren',       nationality:'🇬🇧' },
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
  { year:2025, team:'McLaren', nationality:'🇬🇧' },
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
  // Updated through end of 2025 season
  wins: [
    { driver:'Lewis Hamilton',    val:103, nat:'🇬🇧' },
    { driver:'Michael Schumacher',val:91,  nat:'🇩🇪' },
    { driver:'Max Verstappen',    val:65,  nat:'🇳🇱' },
    { driver:'Sebastian Vettel',  val:53,  nat:'🇩🇪' },
    { driver:'Alain Prost',       val:51,  nat:'🇫🇷' },
    { driver:'Lando Norris',      val:21,  nat:'🇬🇧' },
  ],
  poles: [
    { driver:'Lewis Hamilton',    val:104, nat:'🇬🇧' },
    { driver:'Michael Schumacher',val:68,  nat:'🇩🇪' },
    { driver:'Ayrton Senna',      val:65,  nat:'🇧🇷' },
    { driver:'Sebastian Vettel',  val:57,  nat:'🇩🇪' },
    { driver:'Max Verstappen',    val:40,  nat:'🇳🇱' },
    { driver:'Lando Norris',      val:16,  nat:'🇬🇧' },
  ],
  podiums: [
    { driver:'Lewis Hamilton',    val:197, nat:'🇬🇧' },
    { driver:'Michael Schumacher',val:155, nat:'🇩🇪' },
    { driver:'Sebastian Vettel',  val:122, nat:'🇩🇪' },
    { driver:'Max Verstappen',    val:113, nat:'🇳🇱' },
    { driver:'Fernando Alonso',   val:106, nat:'🇪🇸' },
    { driver:'Lando Norris',      val:48,  nat:'🇬🇧' },
  ],
  championships: [
    { driver:'Lewis Hamilton',    val:7, nat:'🇬🇧' },
    { driver:'Michael Schumacher',val:7, nat:'🇩🇪' },
    { driver:'Juan Manuel Fangio',val:5, nat:'🇦🇷' },
    { driver:'Alain Prost',       val:4, nat:'🇫🇷' },
    { driver:'Sebastian Vettel',  val:4, nat:'🇩🇪' },
    { driver:'Lando Norris',      val:1, nat:'🇬🇧' },
  ],
  constructorWins: [
    { team:'Ferrari',   val:248 },
    { team:'McLaren',   val:192 },
    { team:'Mercedes',  val:125 },
    { team:'Red Bull',  val:122 },
    { team:'Williams',  val:114 },
  ],
  constructorTitles: [
    { team:'Ferrari',   val:16 },
    { team:'McLaren',   val:9  },
    { team:'Williams',  val:9  },
    { team:'Mercedes',  val:8  },
    { team:'Red Bull',  val:6  },
  ],
};

// ═══════════════════════════════════════════════════════════════
// API HELPERS
// ═══════════════════════════════════════════════════════════════

async function fetchErgast(path) {
  const base = 'https://api.jolpi.ca/ergast/f1';
  const url = `${base}${path}.json?limit=200`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Ergast ${r.status}`);
  const j = await r.json();
  return j.MRData;
}

async function fetchWiki(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Wiki ${r.status}`);
  return r.json();
}

function teamColor(teamName) {
  if (!teamName) return 'var(--text-muted)';
  const t = teamName.toLowerCase();
  if (t.includes('mclaren'))      return '#FF8000';
  if (t.includes('ferrari'))      return '#E8002D';
  if (t.includes('red bull'))     return '#3671C6';
  if (t.includes('mercedes'))     return '#27F4D2';
  if (t.includes('aston'))        return '#229971';
  if (t.includes('alpine'))       return '#FF87BC';
  if (t.includes('williams'))     return '#64C4FF';
  if (t.includes('racing bulls') || t.includes('rb ') || t.includes('alphatauri') || t.includes('toro rosso')) return '#6692FF';
  if (t.includes('haas'))         return '#B6BABD';
  if (t.includes('sauber') || t.includes('alfa'))  return '#52E252';
  if (t.includes('cadillac') || t.includes('andretti')) return '#CC0000';
  if (t.includes('renault'))      return '#FFF500';
  if (t.includes('brawn'))        return '#80FF00';
  return 'var(--text-muted)';
}

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
