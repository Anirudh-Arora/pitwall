// js/encyclopedia.js
// Encyclopedia: Circuits · Drivers · Constructors · History · Records
'use strict';

// ═══════════════════════════════════════════════════════════════
// CIRCUITS PAGE
// ═══════════════════════════════════════════════════════════════
function CircuitsPage() {
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState(null);

  const filtered = CIRCUITS.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.country.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  if (selected) return React.createElement(CircuitDetail, { circuit: selected, onBack: () => setSelected(null) });

  return React.createElement('div', null,
    React.createElement('div', { className: 'sec-hdr' },
      React.createElement('div', null,
        React.createElement('div', { className: 'sec-title' }, 'CIRCUITS'),
        React.createElement('div', { className: 'sec-sub' }, `${CIRCUITS.length} Grand Prix venues`)
      )
    ),
    React.createElement('div', { className: 'search-wrap', style: { marginBottom: '20px', maxWidth: '360px' } },
      React.createElement('span', { className: 'search-icon' }, '🔍'),
      React.createElement('input', {
        className: 'search-input', placeholder: 'Search circuits, countries…',
        value: search, onChange: e => setSearch(e.target.value)
      })
    ),
    React.createElement('div', { className: 'gcards' },
      filtered.map(c => React.createElement(CircuitCard, { key: c.id, circuit: c, onClick: () => setSelected(c) }))
    )
  );
}

function CircuitSVG({ circuitId }) {
  const path = (typeof CIRCUIT_SVG_PATHS !== 'undefined' && CIRCUIT_SVG_PATHS[circuitId]) || null;
  if (!path) return React.createElement('div', { style: { fontSize: '11px', color: 'var(--t3)', textAlign: 'center' } }, '— map —');
  return React.createElement('svg', { viewBox: '0 0 200 140', style: { width: '100%', maxHeight: '100%' } },
    React.createElement('path', { d: path, className: 'trk-bg' }),
    React.createElement('path', { d: path, className: 'trk-fg' })
  );
}

function CircuitCard({ circuit: c, onClick }) {
  return React.createElement('div', { className: 'circuit-card', onClick },
    React.createElement('div', { className: 'cc-map' },
      React.createElement(CircuitSVG, { circuitId: c.id })
    ),
    React.createElement('div', { className: 'cc-head' },
      React.createElement('div', { className: 'cc-country' }, `${c.country} · ${c.city}`),
      React.createElement('div', { className: 'cc-name' }, c.name),
      React.createElement('div', { style: { marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' } },
        React.createElement('span', { className: 'badge b-dim' }, `${c.corners} corners`),
        React.createElement('span', { className: 'badge b-dim' }, `${c.drsZones} DRS zones`),
        React.createElement('span', { className: 'badge b-dim' }, `Since ${c.firstGP}`)
      )
    ),
    React.createElement('div', { className: 'cc-body' },
      [
        ['Length', `${c.length} km`],
        ['Laps', c.laps],
        ['Lap Record', c.lapRecord.time],
        ['Record Holder', c.lapRecord.driver],
        ['Record Year', c.lapRecord.year],
      ].map(([label, val]) =>
        React.createElement('div', { key: label, className: 'cc-row' },
          React.createElement('span', null, label),
          React.createElement('span', { className: 'cc-val' }, val)
        )
      )
    )
  );
}

function CircuitDetail({ circuit: c, onBack }) {
  const [tab, setTab] = React.useState('overview');
  const [wikiSummary, setWikiSummary] = React.useState(null);
  const [strategyData, setStrategyData] = React.useState(null);
  const [loadingStrategy, setLoadingStrategy] = React.useState(false);

  React.useEffect(() => {
    fetchWiki(c.wikiTitle).then(d => setWikiSummary(d)).catch(() => {});
  }, [c.id]);

  React.useEffect(() => {
    if (tab !== 'strategy' || strategyData) return;
    setLoadingStrategy(true);
    fetchErgast(`/circuits/${c.ergastId}/results/1`)
      .then(d => {
        const races = d.RaceTable?.Races || [];
        const last5 = races.slice(-5).reverse();
        setStrategyData(last5);
        setLoadingStrategy(false);
      })
      .catch(() => setLoadingStrategy(false));
  }, [tab, c.ergastId]);

  const char = c.characteristics;

  return React.createElement('div', null,
    React.createElement('button', {
      className: 'btn btn-ghost', style: { marginBottom: '16px' },
      onClick: onBack
    }, '← Back to Circuits'),

    // Hero
    React.createElement('div', { className: 'hero-card', style: { marginBottom: '16px' } },
      React.createElement('div', { className: 'hero-card-bg' }),
      React.createElement('div', { className: 'hero-card-content' },
        React.createElement('div', { className: 'hero-card-label' }, `${c.country} · ${c.city} · First GP ${c.firstGP}`),
        React.createElement('div', { className: 'hero-card-name' }, c.name),
        React.createElement('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' } },
          React.createElement('span', { className: 'badge b-red' }, `${c.length} km`),
          React.createElement('span', { className: 'badge b-dim' }, `${c.laps} laps`),
          React.createElement('span', { className: 'badge b-dim' }, `${c.corners} corners`),
          React.createElement('span', { className: 'badge b-amber' }, `${c.drsZones} DRS / Aero zones`)
        )
      )
    ),

    // Tabs
    React.createElement('div', { className: 'tabs' },
      [['overview','Overview'],['trivia','Trivia & Records'],['strategy','Winning Strategies'],['characteristics','Race Characteristics']].map(([k,l]) =>
        React.createElement('button', { key: k, className: `tab ${tab===k?'on':''}`, onClick: () => setTab(k) }, l)
      )
    ),

    tab === 'overview' && React.createElement('div', { className: 'g2', style: { alignItems: 'start' } },
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        React.createElement('div', { className: 'card' },
          React.createElement('div', { className: 'card-title', style: { marginBottom: '12px' } }, 'About'),
          React.createElement('p', { style: { fontSize: '14px', lineHeight: '1.7', color: 'var(--text-secondary)' } }, c.description)
        ),
        wikiSummary && React.createElement('div', { className: 'card' },
          React.createElement('div', { className: 'card-title', style: { marginBottom: '12px' } }, 'Wikipedia'),
          React.createElement('p', { style: { fontSize: '13px', lineHeight: '1.7', color: 'var(--text-secondary)' } }, wikiSummary.extract?.slice(0, 600) + '…'),
          React.createElement('a', {
            href: wikiSummary.content_urls?.desktop?.page, target: '_blank',
            style: { fontSize: '11px', color: 'var(--green)', letterSpacing: '1px', fontFamily: 'var(--font-display)', display: 'inline-block', marginTop: '8px' }
          }, 'READ MORE ON WIKIPEDIA →')
        )
      ),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        React.createElement('div', { className: 'card' },
          React.createElement('div', { className: 'card-title', style: { marginBottom: '12px' } }, 'Circuit Stats'),
          React.createElement('div', { className: 'stat-grid' },
            [
              ['LAP RECORD', c.lapRecord.time, 'accent'],
              ['LENGTH', `${c.length}km`, ''],
              ['LAPS', c.laps, ''],
              ['CORNERS', c.corners, ''],
              ['DRS ZONES', c.drsZones, ''],
              ['FIRST GP', c.firstGP, ''],
            ].map(([label, val, cls]) =>
              React.createElement('div', { key: label, className: 'scel' },
                React.createElement('div', { className: `stat-value ${cls}` }, val),
                React.createElement('div', { className: 'sl' }, label)
              )
            )
          )
        ),
        React.createElement('div', { className: 'card' },
          React.createElement('div', { className: 'card-title', style: { marginBottom: '10px' } }, 'Lap Record'),
          React.createElement('div', { style: { fontSize: '32px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--green)', marginBottom: '4px' } }, c.lapRecord.time),
          React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700 } }, c.lapRecord.driver),
          React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '1px' } }, c.lapRecord.year)
        )
      )
    ),

    tab === 'trivia' && React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
      c.trivia.map((t, i) =>
        React.createElement('div', { key: i, className: 'trivia-card' },
          React.createElement('div', { className: 'trivia-icon' }, ['🏁','💡','⚡','🎯','🏆','🌧'][i % 6]),
          React.createElement('div', { className: 'trivia-text' }, t)
        )
      )
    ),

    tab === 'strategy' && React.createElement('div', null,
      React.createElement('p', { style: { fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.6' } },
        'Historical race winners and their race details at this circuit. Use this to understand tyre strategy trends and what approach wins here.'
      ),
      loadingStrategy
        ? React.createElement('div', { className: 'loading' },
            React.createElement('div', { className: 'spin' }),
            'Loading race history…'
          )
        : strategyData && strategyData.length
          ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
              strategyData.map((race, i) => {
                const winner = race.Results?.[0];
                return React.createElement('div', { key: i, className: 'strat-card' },
                  React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } },
                    React.createElement('div', { className: 'strat-year' }, `${race.season} · Round ${race.round}`),
                    React.createElement('span', { className: 'badge b-dim' }, race.raceName)
                  ),
                  winner && React.createElement('div', null,
                    React.createElement('div', { className: 'strat-winner' },
                      `🥇 ${winner.Driver?.givenName} ${winner.Driver?.familyName}`
                    ),
                    React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '1px' } },
                      `${winner.Constructor?.name} · ${winner.Time?.time || 'Time N/A'} · Laps: ${winner.laps}`
                    )
                  )
                );
              })
            )
          : React.createElement('div', { className: 'empty' }, 'No strategy data available')
    ),

    tab === 'characteristics' && React.createElement('div', { className: 'g2eq', style: { alignItems: 'start' } },
      React.createElement('div', { className: 'card' },
        React.createElement('div', { className: 'card-title', style: { marginBottom: '14px' } }, 'Track Characteristics'),
        [
          ['Overtaking Difficulty', char.overtaking],
          ['Tyre Wear', char.tyre_wear],
          ['Downforce Level', char.downforce],
          ['Engine Power Sensitive', char.power_sensitive ? 'Yes' : 'No'],
        ].map(([label, val]) =>
          React.createElement('div', { key: label, className: 'drow' },
            React.createElement('span', { style: { fontSize: '13px', color: 'var(--text-secondary)' } }, label),
            React.createElement('span', { style: { fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, letterSpacing: '1px' } }, val)
          )
        )
      ),
      React.createElement('div', { className: 'card' },
        React.createElement('div', { className: 'card-title', style: { marginBottom: '14px' } }, 'Setup Implications'),
        React.createElement('div', { style: { fontSize: '13px', lineHeight: '1.8', color: 'var(--text-secondary)' } },
          char.power_sensitive
            ? '⚡ Power unit performance is critical here. Engine-heavy teams have a natural advantage on the long straights.'
            : '🔄 Aerodynamic and mechanical grip dominate. Power unit advantage is less decisive.',
          React.createElement('br'), React.createElement('br'),
          `🏎 Downforce: ${char.downforce} — `,
          char.downforce.includes('High') || char.downforce.includes('Very High')
            ? 'High-downforce setup required. Teams sacrifice top speed for cornering stability.'
            : char.downforce.includes('Low') || char.downforce.includes('Very Low')
            ? 'Low-drag setup preferred. Teams strip downforce for straight-line speed.'
            : 'Balanced medium-downforce setup. Most teams converge on similar configurations.',
          React.createElement('br'), React.createElement('br'),
          `🔴 Tyre wear: ${char.tyre_wear} — `,
          char.tyre_wear === 'High'
            ? 'Tyre management is decisive. Strategy calls around pit windows can swing the race by several places.'
            : char.tyre_wear === 'Low'
            ? 'Low tyre degradation allows more aggressive driving. One-stop strategies are common.'
            : 'Moderate tyre wear. Strategy options are relatively open.'
        )
      )
    )
  );
}

// ═══════════════════════════════════════════════════════════════
// DRIVERS PAGE
// ═══════════════════════════════════════════════════════════════
function DriversPage() {
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState(null);
  const [filter, setFilter] = React.useState('current');

  if (selected) return React.createElement(DriverDetail, { driver: selected, onBack: () => setSelected(null) });

  const filtered = CURRENT_DRIVERS.filter(d =>
    !search ||
    d.first.toLowerCase().includes(search.toLowerCase()) ||
    d.last.toLowerCase().includes(search.toLowerCase()) ||
    d.team.toLowerCase().includes(search.toLowerCase()) ||
    String(d.num).includes(search)
  );

  return React.createElement('div', null,
    React.createElement('div', { className: 'sec-hdr' },
      React.createElement('div', null,
        React.createElement('div', { className: 'sec-title' }, 'DRIVERS'),
        React.createElement('div', { className: 'sec-sub' }, '2026 Grid')
      )
    ),
    React.createElement('div', { style: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' } },
      React.createElement('div', { className: 'search-wrap', style: { flex: 1, minWidth: '200px', maxWidth: '360px' } },
        React.createElement('span', { className: 'search-icon' }, '🔍'),
        React.createElement('input', {
          className: 'search-input', placeholder: 'Search drivers, teams…',
          value: search, onChange: e => setSearch(e.target.value)
        })
      )
    ),
    React.createElement('div', { className: 'gcards' },
      filtered.map(d => React.createElement(DriverCard, { key: d.num, driver: d, onClick: () => setSelected(d) }))
    )
  );
}

function DriverCard({ driver: d, onClick }) {
  const color = teamColor(d.team);
  const age = new Date().getFullYear() - parseInt(d.dob);
  return React.createElement('div', {
    className: 'driver-card', onClick,
    style: { '--team-color': color }
  },
    React.createElement('div', { className: 'driver-card-top' },
      React.createElement('div', { className: 'driver-card-num' }, d.num),
      React.createElement('div', { className: 'driver-card-name' }, `${d.first} ${d.last}`),
      React.createElement('div', { className: 'driver-card-team' }, `${d.nat} · ${d.team}`)
    ),
    React.createElement('div', { className: 'driver-card-stats' },
      React.createElement('div', { className: 'driver-card-stat' },
        React.createElement('div', { className: 'driver-card-stat-val' }, `#${d.num}`),
        React.createElement('div', { className: 'driver-card-stat-label' }, 'Number')
      ),
      React.createElement('div', { className: 'driver-card-stat' },
        React.createElement('div', { className: 'driver-card-stat-val' }, d.code),
        React.createElement('div', { className: 'driver-card-stat-label' }, 'Code')
      ),
      React.createElement('div', { className: 'driver-card-stat' },
        React.createElement('div', { className: 'driver-card-stat-val' }, age),
        React.createElement('div', { className: 'driver-card-stat-label' }, 'Age')
      )
    )
  );
}

function DriverDetail({ driver: d, onBack }) {
  const [tab, setTab] = React.useState('profile');
  const [ergastData, setErgastData] = React.useState(null);
  const [wikiData, setWikiData] = React.useState(null);
  const color = teamColor(d.team);

  React.useEffect(() => {
    // Try to load driver stats from Ergast via Jolpica
    fetchErgast(`/drivers/${d.code.toLowerCase()}/results`)
      .then(data => {
        const races = data.RaceTable?.Races || [];
        const wins = races.filter(r => r.Results?.[0]?.position === '1').length;
        const podiums = races.filter(r => ['1','2','3'].includes(r.Results?.[0]?.position)).length;
        const poles = races.filter(r => r.Results?.[0]?.grid === '1').length;
        setErgastData({ wins, podiums, poles, races: races.length, recentRaces: races.slice(-10).reverse() });
      })
      .catch(() => {});
    fetchWiki(d.wikiTitle).then(setWikiData).catch(() => {});
  }, [d.code]);

  const age = Math.floor((new Date() - new Date(d.dob)) / (365.25 * 24 * 3600 * 1000));

  return React.createElement('div', null,
    React.createElement('button', { className: 'btn btn-ghost', style: { marginBottom: '16px' }, onClick: onBack }, '← Back to Drivers'),

    React.createElement('div', { className: 'hero-card', style: { marginBottom: '16px' } },
      React.createElement('div', { className: 'hero-card-bg', style: { background: `linear-gradient(135deg, ${color}33 0%, transparent 70%)` } }),
      React.createElement('div', { className: 'hero-card-content' },
        React.createElement('div', { className: 'hero-card-label' }, `${d.nat} · ${d.team} · #${d.num}`),
        React.createElement('div', { className: 'hero-card-name', style: { color } }, `${d.first} ${d.last}`),
        React.createElement('div', { style: { display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' } },
          React.createElement('span', { className: 'badge b-dim' }, `Born ${fmtDate(d.dob)}`),
          React.createElement('span', { className: 'badge b-dim' }, `Age ${age}`),
          React.createElement('span', { className: 'badge b-dim' }, d.code)
        )
      )
    ),

    React.createElement('div', { className: 'tabs' },
      [['profile','Profile'],['stats','Career Stats'],['results','Recent Results']].map(([k,l]) =>
        React.createElement('button', { key: k, className: `tab ${tab===k?'on':''}`, onClick: () => setTab(k) }, l)
      )
    ),

    tab === 'profile' && React.createElement('div', { className: 'g2', style: { alignItems: 'start' } },
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        wikiData
          ? React.createElement('div', { className: 'card' },
              React.createElement('div', { className: 'card-title', style: { marginBottom: '12px' } }, 'Biography'),
              React.createElement('p', { style: { fontSize: '13px', lineHeight: '1.75', color: 'var(--text-secondary)' } },
                wikiData.extract?.slice(0, 900) + (wikiData.extract?.length > 900 ? '…' : '')
              ),
              React.createElement('a', {
                href: wikiData.content_urls?.desktop?.page, target: '_blank',
                style: { fontSize: '11px', color: 'var(--green)', letterSpacing: '1px', fontFamily: 'var(--font-display)', display: 'inline-block', marginTop: '8px' }
              }, 'READ MORE ON WIKIPEDIA →')
            )
          : React.createElement('div', { className: 'card' },
              React.createElement('div', { className: 'loading' },
                React.createElement('div', { className: 'spin' }), 'Loading biography…'
              )
            )
      ),
      React.createElement('div', { className: 'card' },
        React.createElement('div', { className: 'card-title', style: { marginBottom: '12px' } }, 'Driver Info'),
        [
          ['Full Name', `${d.first} ${d.last}`],
          ['Nationality', d.nat],
          ['Date of Birth', fmtDate(d.dob)],
          ['Age', age],
          ['Car Number', `#${d.num}`],
          ['Short Code', d.code],
          ['Team', d.team],
        ].map(([label, val]) =>
          React.createElement('div', { key: label, className: 'drow' },
            React.createElement('span', { style: { fontSize: '12px', color: 'var(--text-muted)' } }, label),
            React.createElement('span', { style: { fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700 } }, val)
          )
        )
      )
    ),

    tab === 'stats' && (ergastData
      ? React.createElement('div', null,
          React.createElement('div', { className: 'stat-grid', style: { marginBottom: '16px' } },
            [
              ['RACES', ergastData.races, ''],
              ['WINS', ergastData.wins, 'accent'],
              ['PODIUMS', ergastData.podiums, ''],
              ['POLES', ergastData.poles, ''],
            ].map(([label, val, cls]) =>
              React.createElement('div', { key: label, className: 'scel' },
                React.createElement('div', { className: `stat-value lg ${cls}` }, val),
                React.createElement('div', { className: 'sl' }, label)
              )
            )
          )
        )
      : React.createElement('div', { className: 'loading' },
          React.createElement('div', { className: 'spin' }), 'Loading career data…'
        )
    ),

    tab === 'results' && (ergastData?.recentRaces?.length
      ? React.createElement('div', { className: 'card card-flush' },
          React.createElement('table', { className: 'data-table' },
            React.createElement('thead', null,
              React.createElement('tr', null,
                ['Year','Race','Pos','Grid','Points','Team'].map(h =>
                  React.createElement('th', { key: h }, h)
                )
              )
            ),
            React.createElement('tbody', null,
              ergastData.recentRaces.map((race, i) => {
                const r = race.Results?.[0];
                const pos = r?.positionText;
                return React.createElement('tr', { key: i },
                  React.createElement('td', { className: 'mono' }, race.season),
                  React.createElement('td', { className: 'name' }, race.raceName),
                  React.createElement('td', { className: 'mono', style: { color: pos === '1' ? 'var(--gold)' : pos === '2' ? 'var(--silver)' : pos === '3' ? 'var(--bronze)' : 'inherit' } }, pos || '—'),
                  React.createElement('td', { className: 'mono' }, r?.grid || '—'),
                  React.createElement('td', { className: 'mono', style: { color: 'var(--green)' } }, r?.points || '0'),
                  React.createElement('td', null, r?.Constructor?.name || '—')
                );
              })
            )
          )
        )
      : React.createElement('div', { className: 'loading' },
          React.createElement('div', { className: 'spin' }), 'Loading results…'
        )
    )
  );
}

// ═══════════════════════════════════════════════════════════════
// CONSTRUCTORS PAGE
// ═══════════════════════════════════════════════════════════════
function ConstructorsPage() {
  const [selected, setSelected] = React.useState(null);
  if (selected) return React.createElement(ConstructorDetail, { constructor: selected, onBack: () => setSelected(null) });

  return React.createElement('div', null,
    React.createElement('div', { className: 'sec-hdr' },
      React.createElement('div', null,
        React.createElement('div', { className: 'sec-title' }, 'CONSTRUCTORS'),
        React.createElement('div', { className: 'sec-sub' }, 'Current & historic F1 teams')
      )
    ),
    React.createElement('div', { className: 'gcards' },
      CONSTRUCTORS.map(c => React.createElement(ConstructorCard, { key: c.id, constructor: c, onClick: () => setSelected(c) }))
    )
  );
}

function ConstructorCard({ constructor: c, onClick }) {
  return React.createElement('div', {
    className: 'constructor-card', onClick,
    style: { '--team-color': c.color }
  },
    React.createElement('div', { className: 'constructor-card-header' },
      React.createElement('div', { className: 'constructor-card-name' }, c.name),
      React.createElement('div', { className: 'constructor-card-base' }, `${c.base} · Since ${c.firstYear}`)
    ),
    React.createElement('div', { className: 'constructor-card-body' },
      [
        [c.titles, 'WCC TITLES'],
        [c.chassis, 'CHASSIS'],
        [c.power, 'POWER UNIT'],
      ].map(([val, label]) =>
        React.createElement('div', { key: label, className: 'constructor-card-stat' },
          React.createElement('div', { style: { fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700 } }, val),
          React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', color: 'var(--text-dim)', marginTop: '3px' } }, label)
        )
      )
    )
  );
}

function ConstructorDetail({ constructor: c, onBack }) {
  const [tab, setTab] = React.useState('overview');
  const [ergastData, setErgastData] = React.useState(null);
  const [wikiData, setWikiData] = React.useState(null);

  React.useEffect(() => {
    fetchErgast(`/constructors/${c.ergastId}/results`)
      .then(data => {
        const races = data.RaceTable?.Races || [];
        const wins = races.filter(r => r.Results?.some(r2 => r2.position === '1')).length;
        const poles = races.filter(r => r.Results?.some(r2 => r2.grid === '1')).length;
        setErgastData({ wins, poles, races: races.length, recent: races.slice(-8).reverse() });
      })
      .catch(() => {});
    fetchWiki(c.wikiTitle).then(setWikiData).catch(() => {});
  }, [c.id]);

  return React.createElement('div', null,
    React.createElement('button', { className: 'btn btn-ghost', style: { marginBottom: '16px' }, onClick: onBack }, '← Back to Constructors'),

    React.createElement('div', { className: 'hero-card', style: { marginBottom: '16px' } },
      React.createElement('div', { className: 'hero-card-bg', style: { background: `linear-gradient(135deg, ${c.color}22 0%, transparent 70%)` } }),
      React.createElement('div', { className: 'hero-card-content' },
        React.createElement('div', { className: 'hero-card-label' }, `${c.base} · Est. ${c.firstYear}`),
        React.createElement('div', { className: 'hero-card-name', style: { color: c.color } }, c.name),
        React.createElement('div', { style: { display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' } },
          React.createElement('span', { className: 'badge b-gold' }, `${c.titles} WCC Titles`),
          React.createElement('span', { className: 'badge b-dim' }, c.chassis),
          React.createElement('span', { className: 'badge b-dim' }, c.power)
        )
      )
    ),

    React.createElement('div', { className: 'tabs' },
      [['overview','Overview'],['stats','Statistics'],['drivers','2026 Drivers']].map(([k,l]) =>
        React.createElement('button', { key: k, className: `tab ${tab===k?'on':''}`, onClick: () => setTab(k) }, l)
      )
    ),

    tab === 'overview' && React.createElement('div', { className: 'g2', style: { alignItems: 'start' } },
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        wikiData
          ? React.createElement('div', { className: 'card' },
              React.createElement('div', { className: 'card-title', style: { marginBottom: '12px' } }, 'About'),
              React.createElement('p', { style: { fontSize: '13px', lineHeight: '1.75', color: 'var(--text-secondary)' } },
                wikiData.extract?.slice(0, 900) + '…'
              ),
              React.createElement('a', {
                href: wikiData.content_urls?.desktop?.page, target: '_blank',
                style: { fontSize: '11px', color: 'var(--green)', letterSpacing: '1px', fontFamily: 'var(--font-display)', display: 'inline-block', marginTop: '8px' }
              }, 'READ MORE ON WIKIPEDIA →')
            )
          : React.createElement('div', { className: 'loading' }, React.createElement('div', { className: 'spin' }), 'Loading…')
      ),
      React.createElement('div', { className: 'card' },
        React.createElement('div', { className: 'card-title', style: { marginBottom: '12px' } }, 'Team Info'),
        [
          ['Full Name', c.name],
          ['Base', c.base],
          ['Founded', c.firstYear],
          ['Chassis', c.chassis],
          ['Power Unit', c.power],
          ['WCC Titles', c.titles],
        ].map(([label, val]) =>
          React.createElement('div', { key: label, className: 'drow' },
            React.createElement('span', { style: { fontSize: '12px', color: 'var(--text-muted)' } }, label),
            React.createElement('span', { style: { fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700 } }, val)
          )
        )
      )
    ),

    tab === 'stats' && (ergastData
      ? React.createElement('div', null,
          React.createElement('div', { className: 'stat-grid', style: { marginBottom: '16px' } },
            [
              ['RACE ENTRIES', ergastData.races, ''],
              ['WINS', ergastData.wins, 'accent'],
              ['POLES', ergastData.poles, ''],
              ['WCC TITLES', c.titles, ''],
            ].map(([label, val, cls]) =>
              React.createElement('div', { key: label, className: 'scel' },
                React.createElement('div', { className: `stat-value lg ${cls}` }, val),
                React.createElement('div', { className: 'sl' }, label)
              )
            )
          )
        )
      : React.createElement('div', { className: 'loading' }, React.createElement('div', { className: 'spin' }), 'Loading…')
    ),

    tab === 'drivers' && React.createElement('div', { className: 'gcards-sm' },
      CURRENT_DRIVERS.filter(d => d.team === c.name || d.team.includes(c.name.split(' ')[0])).map(d =>
        React.createElement('div', { key: d.num, className: 'card card-sm' },
          React.createElement('div', { style: { fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 700, color: c.color, marginBottom: '6px' } }, `#${d.num}`),
          React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800 } }, `${d.first} ${d.last}`),
          React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px', marginTop: '2px' } }, d.nat)
        )
      )
    )
  );
}

// ═══════════════════════════════════════════════════════════════
// HISTORY PAGE
// ═══════════════════════════════════════════════════════════════
function HistoryPage() {
  const [tab, setTab] = React.useState('champions');
  const [search, setSearch] = React.useState('');
  const [decadeFilter, setDecadeFilter] = React.useState('all');

  const decades = ['all', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

  const filteredChampions = CHAMPIONS_DATA
    .slice()
    .reverse()
    .filter(c => {
      const matchSearch = !search ||
        c.driver.toLowerCase().includes(search.toLowerCase()) ||
        c.team.toLowerCase().includes(search.toLowerCase()) ||
        String(c.year).includes(search);
      const matchDecade = decadeFilter === 'all' ||
        Math.floor(c.year / 10) * 10 === parseInt(decadeFilter);
      return matchSearch && matchDecade;
    });

  return React.createElement('div', null,
    React.createElement('div', { className: 'sec-hdr' },
      React.createElement('div', null,
        React.createElement('div', { className: 'sec-title' }, 'HISTORY'),
        React.createElement('div', { className: 'sec-sub' }, 'Formula 1 since 1950')
      )
    ),
    React.createElement('div', { className: 'tabs' },
      [['champions','Champions'],['milestones','Milestones'],['records','All-Time Records']].map(([k,l]) =>
        React.createElement('button', { key: k, className: `tab ${tab===k?'on':''}`, onClick: () => setTab(k) }, l)
      )
    ),

    // ── Champions ──
    tab === 'champions' && React.createElement('div', null,
      React.createElement('div', { style: { display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' } },
        React.createElement('div', { className: 'search-wrap', style: { flex: 1, minWidth: '200px', maxWidth: '300px' } },
          React.createElement('span', { className: 'search-icon' }, '🔍'),
          React.createElement('input', { className: 'search-input', placeholder: 'Search driver, team, year…', value: search, onChange: e => setSearch(e.target.value) })
        ),
        React.createElement('div', { style: { display: 'flex', gap: '4px', flexWrap: 'wrap' } },
          decades.map(d =>
            React.createElement('button', {
              key: d, onClick: () => setDecadeFilter(d),
              className: 'btn', style: {
                padding: '4px 9px', fontSize: '10px',
                background: decadeFilter === d ? 'var(--red)' : 'var(--bg-elevated)',
                color: decadeFilter === d ? '#fff' : 'var(--text-muted)',
                border: `1px solid ${decadeFilter === d ? 'var(--red)' : 'var(--border)'}`,
              }
            }, d === 'all' ? 'ALL' : d)
          )
        )
      ),

      React.createElement('div', { className: 'card card-flush' },
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '52px 1fr 1fr 80px', gap: '10px', padding: '7px 14px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', color: 'var(--text-dim)' } },
          ['YEAR', 'DRIVER CHAMPION', 'CONSTRUCTOR CHAMPION', ''].map(h => React.createElement('span', { key: h }, h))
        ),
        filteredChampions.map((c, i) => {
          const wcc = WCC_DATA.find(w => w.year === c.year);
          const isMulti = i === 0 || filteredChampions[i-1]?.driver !== c.driver;
          return React.createElement('div', {
            key: c.year,
            style: {
              display: 'grid', gridTemplateColumns: '52px 1fr 1fr 80px', gap: '10px',
              padding: '9px 14px', borderBottom: '1px solid var(--border)',
              background: c.year >= 2020 ? 'rgba(255,215,0,.02)' : 'transparent',
              transition: 'background .15s', cursor: 'default',
              alignItems: 'center',
            },
            onMouseEnter: e => { e.currentTarget.style.background = 'var(--bg-elevated)'; },
            onMouseLeave: e => { e.currentTarget.style.background = c.year >= 2020 ? 'rgba(255,215,0,.02)' : 'transparent'; }
          },
            React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' } }, c.year),
            React.createElement('div', null,
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
                React.createElement('span', null, c.nationality),
                React.createElement('span', { style: { fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 800 } }, c.driver),
                c.note && React.createElement('span', { className: 'badge b-amber', style: { fontSize: '8px' } }, c.note)
              )
            ),
            React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--text-secondary)' } },
              wcc ? `${wcc.nationality} ${wcc.team}` : '—'
            ),
            React.createElement('div', { style: { display: 'flex', gap: '3px', flexWrap: 'wrap' } },
              c.driver === 'Michael Schumacher' && React.createElement('span', { className: 'badge b-gold', style: { fontSize: '8px' } }, '7×'),
              c.driver === 'Lewis Hamilton' && React.createElement('span', { className: 'badge b-gold', style: { fontSize: '8px' } }, '7×'),
              c.driver === 'Ayrton Senna' && React.createElement('span', { className: 'badge b-purple', style: { fontSize: '8px' } }, 'Legend'),
              c.driver === 'Juan Manuel Fangio' && React.createElement('span', { className: 'badge b-gold', style: { fontSize: '8px' } }, '5×')
            )
          );
        })
      )
    ),

    // ── Milestones ──
    tab === 'milestones' && React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '0' } },
      F1_MILESTONES.map((m, i) =>
        React.createElement('div', { key: i, style: { display: 'flex', gap: '0', position: 'relative' } },
          React.createElement('div', { style: { width: '80px', flexShrink: 0, paddingTop: '14px', textAlign: 'right', paddingRight: '20px' } },
            React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: m.year >= 2026 ? 'var(--red)' : 'var(--text-muted)' } }, m.year)
          ),
          React.createElement('div', { style: { width: '2px', background: i === F1_MILESTONES.length - 1 ? 'transparent' : 'var(--border)', flexShrink: 0, position: 'relative' } },
            React.createElement('div', { style: { position: 'absolute', top: '18px', left: '-4px', width: '10px', height: '10px', borderRadius: '50%', background: m.year >= 2026 ? 'var(--red)' : 'var(--border-bright)', border: '2px solid var(--bg-base)' } })
          ),
          React.createElement('div', { style: { flex: 1, paddingLeft: '20px', paddingBottom: '24px', paddingTop: '10px' } },
            React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 800, marginBottom: '5px' } }, m.event),
            React.createElement('div', { style: { fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)' } }, m.desc),
            m.year >= 2026 && React.createElement('span', { className: 'badge b-red', style: { marginTop: '6px' } }, '2026 REGULATION')
          )
        )
      )
    ),

    // ── All-Time Records ──
    tab === 'records' && React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
      [
        ['Most Race Wins (Drivers)', ALL_TIME_RECORDS.wins, 'var(--gold)'],
        ['Most Pole Positions', ALL_TIME_RECORDS.poles, 'var(--green)'],
        ['Most Podiums', ALL_TIME_RECORDS.podiums, 'var(--blue)'],
        ['Most Championships (Drivers)', ALL_TIME_RECORDS.championships, 'var(--red)'],
        ['Most Constructor Wins', ALL_TIME_RECORDS.constructorWins, 'var(--amber)'],
        ['Most Constructor Titles', ALL_TIME_RECORDS.constructorTitles, 'var(--purple)'],
      ].map(([title, data, accent]) =>
        React.createElement('div', { key: title, className: 'card' },
          React.createElement('div', { className: 'card-title', style: { marginBottom: '14px' } }, title),
          data.map((row, i) => {
            const maxVal = data[0].val;
            const pct = (row.val / maxVal) * 100;
            return React.createElement('div', { key: i, style: { marginBottom: '10px' } },
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' } },
                React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                  React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)', width: '18px', textAlign: 'right' } }, i + 1),
                  React.createElement('span', { style: { fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700 } }, row.driver || row.team)
                ),
                React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, color: i === 0 ? accent : 'var(--text-primary)' } }, row.val)
              ),
              React.createElement('div', { className: 'progress-bar' },
                React.createElement('div', { className: 'progress-fill', style: { width: `${pct}%`, background: i === 0 ? accent : 'var(--border-bright)' } })
              )
            );
          })
        )
      )
    )
  );
}
