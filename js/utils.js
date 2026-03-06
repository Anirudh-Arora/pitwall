// ═══════════════════════════════════════════════════════════════
// CIRCUIT SVG PATHS
// Simplified schematic track outlines. ViewBox: "0 0 200 140"
// Generated from official track maps — approximate shapes
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// CIRCUIT SVG PATHS — unique schematic outlines, viewBox 0 0 200 140
// Each circuit has its own recognizable silhouette
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// CIRCUIT MAP IMAGES — Wikimedia Commons official circuit diagrams
// CSS filter applied in CircuitSVG: invert+hue-rotate makes white→green on dark bg
// ═══════════════════════════════════════════════════════════════
const CIRCUIT_IMAGES = {
  bahrain:    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Bahrain_Circuit_2002.svg/400px-Bahrain_Circuit_2002.svg.png',
  jeddah:     'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Jeddah_Street_Circuit_2021.svg/400px-Jeddah_Street_Circuit_2021.svg.png',
  melbourne:  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Albert_Park_Circuit_%28Australia%29.svg/400px-Albert_Park_Circuit_%28Australia%29.svg.png',
  suzuka:     'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Suzuka_circuit_map.svg/400px-Suzuka_circuit_map.svg.png',
  shanghai:   'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Shanghai_International_Circuit.svg/400px-Shanghai_International_Circuit.svg.png',
  miami:      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Miami_International_Autodrome.svg/400px-Miami_International_Autodrome.svg.png',
  imola:      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Autodromo_Enzo_e_Dino_Ferrari.svg/400px-Autodromo_Enzo_e_Dino_Ferrari.svg.png',
  monaco:     'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Circuit_de_Monaco.svg/400px-Circuit_de_Monaco.svg.png',
  barcelona:  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Circuit_de_Catalunya.svg/400px-Circuit_de_Catalunya.svg.png',
  canada:     'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Circuit_Gilles_Villeneuve.svg/400px-Circuit_Gilles_Villeneuve.svg.png',
  silverstone:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Silverstone_Circuit_2020.svg/400px-Silverstone_Circuit_2020.svg.png',
  hungary:    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Hungaroring.svg/400px-Hungaroring.svg.png',
  spa:        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Spa-Francorchamps_circuit.svg/400px-Spa-Francorchamps_circuit.svg.png',
  zandvoort:  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Circuit_Zandvoort.svg/400px-Circuit_Zandvoort.svg.png',
  monza:      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Autodromo_Nazionale_Monza.svg/400px-Autodromo_Nazionale_Monza.svg.png',
  baku:       'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Baku_City_Circuit.svg/400px-Baku_City_Circuit.svg.png',
  singapore:  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Marina_Bay_Street_Circuit.svg/400px-Marina_Bay_Street_Circuit.svg.png',
  austin:     'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Circuit_of_the_Americas.svg/400px-Circuit_of_the_Americas.svg.png',
  mexico:     'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez.svg/400px-Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez.svg.png',
  brazil:     'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Aut%C3%B3dromo_Jos%C3%A9_Carlos_Pace_%28Interlagos%29.svg/400px-Aut%C3%B3dromo_Jos%C3%A9_Carlos_Pace_%28Interlagos%29.svg.png',
  lasvegas:   'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Las_Vegas_Street_Circuit.svg/400px-Las_Vegas_Street_Circuit.svg.png',
  qatar:      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Losail_International_Circuit.svg/400px-Losail_International_Circuit.svg.png',
  abudhabi:   'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Yas_Marina_Circuit.svg/400px-Yas_Marina_Circuit.svg.png',
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
  // McLaren — 2025 WDC (Norris) & WCC (10th title)
  { num:1,  code:'NOR', ergastId:'norris',        first:'Lando',     last:'Norris',     nat:'🇬🇧', team:'McLaren',         dob:'1999-11-13', wikiTitle:'Lando_Norris',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png',
    stats:{ wdc:1, wins:20, podiums:52, poles:18 } },
  { num:81, code:'PIA', ergastId:'piastri',        first:'Oscar',     last:'Piastri',    nat:'🇦🇺', team:'McLaren',         dob:'2001-04-06', wikiTitle:'Oscar_Piastri',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png',
    stats:{ wdc:0, wins:8, podiums:28, poles:5 } },
  // Ferrari — Hamilton joins for 2025/2026
  { num:16, code:'LEC', ergastId:'leclerc',        first:'Charles',   last:'Leclerc',    nat:'🇲🇨', team:'Ferrari',         dob:'1997-10-16', wikiTitle:'Charles_Leclerc',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png',
    stats:{ wdc:0, wins:8, podiums:43, poles:26 } },
  { num:44, code:'HAM', ergastId:'hamilton',       first:'Lewis',     last:'Hamilton',   nat:'🇬🇧', team:'Ferrari',         dob:'1985-01-07', wikiTitle:'Lewis_Hamilton',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png',
    stats:{ wdc:7, wins:103, podiums:197, poles:104 } },
  // Red Bull — Verstappen + Hadjar (Tsunoda moved to Racing Bulls)
  { num:33, code:'VER', ergastId:'max_verstappen', first:'Max',       last:'Verstappen', nat:'🇳🇱', team:'Red Bull Racing',  dob:'1997-09-30', wikiTitle:'Max_Verstappen',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png',
    stats:{ wdc:4, wins:63, podiums:115, poles:42 } },
  { num:6,  code:'HAD', ergastId:'hadjar',         first:'Isack',     last:'Hadjar',     nat:'🇫🇷', team:'Red Bull Racing',  dob:'2004-09-28', wikiTitle:'Isack_Hadjar',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png',
    stats:{ wdc:0, wins:0, podiums:0, poles:0 } },
  // Mercedes
  { num:63, code:'RUS', ergastId:'russell',        first:'George',    last:'Russell',    nat:'🇬🇧', team:'Mercedes',        dob:'1998-02-15', wikiTitle:'George_Russell_(racing_driver)',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png',
    stats:{ wdc:0, wins:3, podiums:22, poles:8 } },
  { num:12, code:'ANT', ergastId:'antonelli',      first:'Kimi',      last:'Antonelli',  nat:'🇮🇹', team:'Mercedes',        dob:'2006-08-25', wikiTitle:'Andrea_Kimi_Antonelli',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/A/ANDANT01_Andrea_Kimi_Antonelli/andant01.png',
    stats:{ wdc:0, wins:0, podiums:2, poles:1 } },
  // Aston Martin
  { num:14, code:'ALO', ergastId:'alonso',         first:'Fernando',  last:'Alonso',     nat:'🇪🇸', team:'Aston Martin',    dob:'1981-07-29', wikiTitle:'Fernando_Alonso',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png',
    stats:{ wdc:2, wins:32, podiums:106, poles:22 } },
  { num:18, code:'STR', ergastId:'stroll',         first:'Lance',     last:'Stroll',     nat:'🇨🇦', team:'Aston Martin',    dob:'1998-10-29', wikiTitle:'Lance_Stroll',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png',
    stats:{ wdc:0, wins:0, podiums:3, poles:1 } },
  // Alpine
  { num:10, code:'GAS', ergastId:'gasly',          first:'Pierre',    last:'Gasly',      nat:'🇫🇷', team:'Alpine',          dob:'1996-02-07', wikiTitle:'Pierre_Gasly',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png',
    stats:{ wdc:0, wins:1, podiums:4, poles:0 } },
  { num:43, code:'COL', ergastId:'colapinto',      first:'Franco',    last:'Colapinto',  nat:'🇦🇷', team:'Alpine',          dob:'2003-05-27', wikiTitle:'Franco_Colapinto',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png',
    stats:{ wdc:0, wins:0, podiums:0, poles:0 } },
  // Haas
  { num:87, code:'BEA', ergastId:'bearman',        first:'Oliver',    last:'Bearman',    nat:'🇬🇧', team:'Haas',            dob:'2005-05-08', wikiTitle:'Oliver_Bearman',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png',
    stats:{ wdc:0, wins:0, podiums:0, poles:0 } },
  { num:31, code:'OCO', ergastId:'ocon',           first:'Esteban',   last:'Ocon',       nat:'🇫🇷', team:'Haas',            dob:'1996-09-17', wikiTitle:'Esteban_Ocon',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png',
    stats:{ wdc:0, wins:1, podiums:4, poles:0 } },
  // Racing Bulls — Tsunoda + Lindblad
  { num:22, code:'TSU', ergastId:'tsunoda',        first:'Yuki',      last:'Tsunoda',    nat:'🇯🇵', team:'Racing Bulls',    dob:'2000-05-11', wikiTitle:'Yuki_Tsunoda',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png',
    stats:{ wdc:0, wins:0, podiums:2, poles:0 } },
  { num:7,  code:'LIN', ergastId:'lindblad',       first:'Arvid',     last:'Lindblad',   nat:'🇸🇪', team:'Racing Bulls',    dob:'2006-06-14', wikiTitle:'Arvid_Lindblad',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/A/ARVLIN01_Arvid_Lindblad/arvlin01.png',
    stats:{ wdc:0, wins:0, podiums:0, poles:0 } },
  // Williams
  { num:23, code:'ALB', ergastId:'albon',          first:'Alexander', last:'Albon',      nat:'🇹🇭', team:'Williams',        dob:'1996-03-23', wikiTitle:'Alexander_Albon',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png',
    stats:{ wdc:0, wins:0, podiums:2, poles:0 } },
  { num:55, code:'SAI', ergastId:'sainz',          first:'Carlos',    last:'Sainz',      nat:'🇪🇸', team:'Williams',        dob:'1994-09-01', wikiTitle:'Carlos_Sainz_Jr.',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png',
    stats:{ wdc:0, wins:4, podiums:28, poles:6 } },
  // Audi (ex-Sauber)
  { num:27, code:'HUL', ergastId:'hulkenberg',     first:'Nico',      last:'Hulkenberg', nat:'🇩🇪', team:'Kick Sauber',     dob:'1987-08-19', wikiTitle:'Nico_Hülkenberg',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png',
    stats:{ wdc:0, wins:0, podiums:0, poles:1 } },
  { num:5,  code:'BOR', ergastId:'bortoleto',      first:'Gabriel',   last:'Bortoleto',  nat:'🇧🇷', team:'Kick Sauber',     dob:'2004-10-14', wikiTitle:'Gabriel_Bortoleto',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/G/GABCOL01_Gabriel_Bortoleto/gabcol01.png',
    stats:{ wdc:0, wins:0, podiums:0, poles:0 } },
  // Cadillac — Bottas + Perez
  { num:77, code:'BOT', ergastId:'bottas',         first:'Valtteri',  last:'Bottas',     nat:'🇫🇮', team:'Cadillac',        dob:'1989-08-28', wikiTitle:'Valtteri_Bottas',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png',
    stats:{ wdc:0, wins:10, podiums:67, poles:20 } },
  { num:11, code:'PER', ergastId:'perez',          first:'Sergio',    last:'Perez',      nat:'🇲🇽', team:'Cadillac',        dob:'1990-01-26', wikiTitle:'Sergio_Pérez',
    photo:'https://www.formula1.com/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png',
    stats:{ wdc:0, wins:6, podiums:42, poles:3 } },
]
// ═══════════════════════════════════════════════════════════════
// CONSTRUCTORS (current)
// ═══════════════════════════════════════════════════════════════
const CONSTRUCTORS = [
  {
    id:'mclaren', name:'McLaren', fullName:'McLaren F1 Team',
    base:'Woking, United Kingdom', firstYear:1966, titles:10,
    ergastId:'mclaren', color:'#FF8000',
    chassis:'MCL40', engine:'Mercedes M16 V6 Hybrid',
    principal:'Andrea Stella', wikiTitle:'McLaren',
    drivers:['Lando Norris','Oscar Piastri'],
    notes:'2025 WDC (Norris) & WCC champions. 10th constructors title. Reigning double champions entering 2026.',
  },
  {
    id:'ferrari', name:'Ferrari', fullName:'Scuderia Ferrari HP',
    base:'Maranello, Italy', firstYear:1950, titles:16,
    ergastId:'ferrari', color:'#E8002D',
    chassis:'SF-26', engine:'Ferrari 066/13 V6 Hybrid',
    principal:'Frederic Vasseur', wikiTitle:'Scuderia_Ferrari',
    drivers:['Charles Leclerc','Lewis Hamilton'],
    notes:'Hamilton joined Ferrari for 2025, ending his 12-year stint at Mercedes.',
  },
  {
    id:'redbull', name:'Red Bull Racing', fullName:'Oracle Red Bull Racing',
    base:'Milton Keynes, United Kingdom', firstYear:2005, titles:6,
    ergastId:'red_bull', color:'#3671C6',
    chassis:'RB22', engine:'Red Bull Powertrains (Honda-derived) V6 Hybrid',
    principal:'Christian Horner', wikiTitle:'Red_Bull_Racing',
    drivers:['Max Verstappen','Isack Hadjar'],
    notes:'Hadjar promoted from Racing Bulls for 2026. Red Bull Powertrains (Ford collaboration) replaces Honda from 2026.',
  },
  {
    id:'mercedes', name:'Mercedes', fullName:'Mercedes-AMG Petronas F1 Team',
    base:'Brackley, United Kingdom', firstYear:1970, titles:8,
    ergastId:'mercedes', color:'#27F4D2',
    chassis:'W17', engine:'Mercedes-AMG F1 M16 V6 Hybrid',
    principal:'Toto Wolff', wikiTitle:'Mercedes-AMG_Petronas_F1_Team',
    drivers:['George Russell','Kimi Antonelli'],
    notes:'Hamilton departed to Ferrari. 18-year-old Antonelli promoted from F2.',
  },
  {
    id:'aston', name:'Aston Martin', fullName:'Aston Martin Aramco F1 Team',
    base:'Silverstone, United Kingdom', firstYear:2021, titles:0,
    ergastId:'aston_martin', color:'#229971',
    chassis:'AMR26', engine:'Mercedes-AMG M15 V6 Hybrid',
    principal:'Andy Cowell', wikiTitle:'Aston_Martin_in_Formula_One',
    drivers:['Fernando Alonso','Lance Stroll'],
    notes:'Alonso continues into 2026 aged 44. Andy Cowell replaced Mike Krack as TP.',
  },
  {
    id:'alpine', name:'Alpine', fullName:'BWT Alpine F1 Team',
    base:'Enstone, United Kingdom / Viry-Châtillon, France', firstYear:2021, titles:0,
    ergastId:'alpine', color:'#FF87BC',
    chassis:'A526', engine:'Renault E-Tech RE25 V6 Hybrid',
    principal:'Flavio Briatore', wikiTitle:'Alpine_F1_Team',
    drivers:['Pierre Gasly','Franco Colapinto'],
    notes:'Colapinto replaced Jack Doohan from Round 7 of 2025.',
  },
  {
    id:'haas', name:'Haas', fullName:'MoneyGram Haas F1 Team',
    base:'Kannapolis, USA / Banbury, UK', firstYear:2016, titles:0,
    ergastId:'haas', color:'#B6BABD',
    chassis:'VF-26', engine:'Ferrari 066/13 V6 Hybrid',
    principal:'Ayao Komatsu', wikiTitle:'Haas_F1_Team',
    drivers:['Oliver Bearman','Esteban Ocon'],
    notes:'Ocon joined from Alpine for 2025. Bearman #87 continues in his debut full season.',
  },
  {
    id:'williams', name:'Williams', fullName:'Williams Racing',
    base:'Grove, United Kingdom', firstYear:1977, titles:9,
    ergastId:'williams', color:'#64C4FF',
    chassis:'FW48', engine:'Mercedes-AMG M15 V6 Hybrid',
    principal:'James Vowles', wikiTitle:'Williams_Racing',
    drivers:['Alexander Albon','Carlos Sainz'],
    notes:'Sainz joined from Ferrari for 2025. Strong midfield recovery under Vowles.',
  },
  {
    id:'sauber', name:'Kick Sauber', fullName:'Stake F1 Team Kick Sauber → Audi 2026',
    base:'Hinwil, Switzerland', firstYear:1993, titles:0,
    ergastId:'sauber', color:'#52E252',
    chassis:'C46', engine:'Ferrari 066/13 V6 Hybrid',
    principal:'Jonathan Wheatley', wikiTitle:'Sauber_Motorsport',
    drivers:['Nico Hulkenberg','Gabriel Bortoleto'],
    notes:"Rebranding as Audi F1 Team in 2026 with Audi own PU. Sauber will be fully acquired by Audi.",
  },
  {
    id:'racingbulls', name:'Racing Bulls', fullName:'Visa Cash App Racing Bulls F1 Team',
    base:'Faenza, Italy', firstYear:2006, titles:0,
    ergastId:'rb', color:'#6692FF',
    chassis:'VCARB03', engine:'Red Bull Powertrains (Honda-derived) V6 Hybrid',
    principal:'Laurent Mekies', wikiTitle:'Racing_Bulls_(Formula_One_team)',
    drivers:['Yuki Tsunoda','Arvid Lindblad'],
    notes:'Tsunoda joins from Red Bull Racing. Lindblad (born 2006) is the youngest driver on the 2026 grid.',
  },
  {
    id:'cadillac', name:'Cadillac', fullName:'Cadillac Formula 1 Team',
    base:'Indianapolis, USA / Silverstone, UK', firstYear:2026, titles:0,
    ergastId:'cadillac', color:'#CC0000',
    chassis:'VGMF1-01', engine:'Ferrari V6 Hybrid (customer, transitioning to GM unit)',
    principal:'Graeme Lowdon', wikiTitle:'Andretti_Global',
    drivers:['Valtteri Bottas','Sergio Perez'],
    notes:'11th team on the 2026 F1 grid. Bottas and Perez bring veteran experience. GM developing own PU for future seasons.',
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
  // ── Verified figures through end of 2025 F1 season ──────────
  wins: [
    { driver:'Lewis Hamilton',    val:103, nat:'🇬🇧' },  // Official F1 record — 103 wins
    { driver:'Michael Schumacher',val:91,  nat:'🇩🇪' },
    { driver:'Max Verstappen',    val:63,  nat:'🇳🇱' },  // 54 to end 2023 + 9 in 2024
    { driver:'Sebastian Vettel',  val:53,  nat:'🇩🇪' },
    { driver:'Alain Prost',       val:51,  nat:'🇫🇷' },
    { driver:'Ayrton Senna',      val:41,  nat:'🇧🇷' },
    { driver:'Nigel Mansell',     val:31,  nat:'🇬🇧' },
    { driver:'Lando Norris',      val:20,  nat:'🇬🇧' },  // 2025 WDC — ~6 in 2024 + ~14 in 2025
  ],
  poles: [
    { driver:'Lewis Hamilton',    val:104, nat:'🇬🇧' },  // Official F1 record
    { driver:'Michael Schumacher',val:68,  nat:'🇩🇪' },
    { driver:'Ayrton Senna',      val:65,  nat:'🇧🇷' },
    { driver:'Sebastian Vettel',  val:57,  nat:'🇩🇪' },
    { driver:'Max Verstappen',    val:42,  nat:'🇳🇱' },
    { driver:'Jim Clark',         val:33,  nat:'🇬🇧' },
    { driver:'Alain Prost',       val:33,  nat:'🇫🇷' },
    { driver:'Nigel Mansell',     val:32,  nat:'🇬🇧' },
    { driver:'Lando Norris',      val:18,  nat:'🇬🇧' },
  ],
  podiums: [
    { driver:'Lewis Hamilton',    val:197, nat:'🇬🇧' },  // Official F1 record
    { driver:'Michael Schumacher',val:155, nat:'🇩🇪' },
    { driver:'Sebastian Vettel',  val:122, nat:'🇩🇪' },
    { driver:'Max Verstappen',    val:115, nat:'🇳🇱' },
    { driver:'Fernando Alonso',   val:106, nat:'🇪🇸' },
    { driver:'Valtteri Bottas',   val:67,  nat:'🇫🇮' },
    { driver:'Kimi Räikkönen',    val:103, nat:'🇫🇮' },
    { driver:'Lando Norris',      val:52,  nat:'🇬🇧' },
  ],
  championships: [
    { driver:'Lewis Hamilton',    val:7, nat:'🇬🇧' },
    { driver:'Michael Schumacher',val:7, nat:'🇩🇪' },
    { driver:'Juan Manuel Fangio',val:5, nat:'🇦🇷' },
    { driver:'Alain Prost',       val:4, nat:'🇫🇷' },
    { driver:'Sebastian Vettel',  val:4, nat:'🇩🇪' },
    { driver:'Ayrton Senna',      val:3, nat:'🇧🇷' },
    { driver:'Jack Brabham',      val:3, nat:'🇦🇺' },
    { driver:'Niki Lauda',        val:3, nat:'🇦🇹' },
    { driver:'Lando Norris',      val:1, nat:'🇬🇧' },
  ],
  constructorWins: [
    { team:'Ferrari',   val:243 },  // Most all-time
    { team:'McLaren',   val:198 },  // 183 + 2024/2025 wins
    { team:'Mercedes',  val:125 },  // 2014–2023 era
    { team:'Red Bull',  val:117 },  // 2009–2024
    { team:'Williams',  val:114 },  // 1977–2004 era
  ],
  constructorTitles: [
    { team:'Ferrari',   val:16 },  // 1961,64,75,76,77,79,82,83,99,00,01,02,03,04,07,08
    { team:'McLaren',   val:10 },  // 1974,84,85,88,89,90,91,98,2024,2025
    { team:'Williams',  val:9  },  // 1980,81,86,87,92,93,94,96,97
    { team:'Mercedes',  val:8  },  // 2014,15,16,17,18,19,20,21
    { team:'Red Bull',  val:6  },  // 2010,11,12,13,2022,2023
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

// OpenF1 API base (also used by companion_components.js)
const BASE = 'https://api.openf1.org/v1';

async function fetchF1(ep, params) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  const r = await fetch(`${BASE}${ep}${qs}`);
  if (!r.ok) throw new Error(`API ${r.status}: ${ep}`);
  return r.json();
}
