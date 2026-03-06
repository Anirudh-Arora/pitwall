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

function CircuitSVG({ circuitId, size }) {
  // Try new CIRCUIT_SVG_PATHS first, then fall back to old CIRCUIT_SVG
  const paths = typeof CIRCUIT_SVG_PATHS !== 'undefined' ? CIRCUIT_SVG_PATHS : (typeof CIRCUIT_SVG !== 'undefined' ? CIRCUIT_SVG : {});
  const path = paths[circuitId] || null;
  if (!path) return React.createElement('div', { style: { fontSize:'11px', color:'var(--t3)', textAlign:'center', padding:'20px' } }, '— map unavailable —');
  const w = size || 140;
  const h = Math.round(w * 0.7);
  return React.createElement('svg', {
    viewBox: '0 0 200 140',
    style: { width: w+'px', height: h+'px', maxWidth:'100%' },
    xmlns: 'http://www.w3.org/2000/svg'
  },
    React.createElement('path', { d: path, fill:'none', stroke:'var(--b2)', strokeWidth:7, strokeLinecap:'round', strokeLinejoin:'round' }),
    React.createElement('path', { d: path, fill:'none', stroke:'var(--green)', strokeWidth:3.5, strokeLinecap:'round', strokeLinejoin:'round',
      style:{ filter:'drop-shadow(0 0 6px rgba(0,232,168,.5))' }
    })
  );
}

function CircuitCard({ circuit: c, onClick }) {
  return React.createElement('div', { className: 'circuit-card', onClick },
    React.createElement('div', { className: 'cc-map' },
      React.createElement(CircuitSVG, { circuitId: c.id, size: 130 })
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
        // Circuit SVG map with sector callouts
        React.createElement('div', { className: 'card card-flush' },
          React.createElement('div', { style: { padding:'14px 16px 12px', borderBottom:'1px solid var(--b0)' } },
            React.createElement('div', { className:'card-title' }, 'Circuit Map')
          ),
          React.createElement('div', { style: { display:'flex', gap:0, alignItems:'stretch' } },
            React.createElement('div', { style: { flex:1, padding:'16px', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--s2)', minHeight:'160px' } },
              React.createElement(CircuitSVG, { circuitId: c.id, size: 180 })
            ),
            c.sectors && React.createElement('div', { style: { width:'150px', borderLeft:'1px solid var(--b0)', padding:'12px' } },
              React.createElement('div', { style: { fontFamily:'var(--fh)', fontSize:'9px', fontWeight:700, letterSpacing:'2px', color:'var(--t3)', textTransform:'uppercase', marginBottom:'8px' } }, 'Sector Bests'),
              [['S1', c.sectors.s1, 'var(--green)'], ['S2', c.sectors.s2, 'var(--amber)'], ['S3', c.sectors.s3, 'var(--blue)']].map(([s, t, col]) =>
                React.createElement('div', { key: s, style: { padding:'6px 0', borderBottom:'1px solid var(--b0)' } },
                  React.createElement('div', { style: { display:'flex', justifyContent:'space-between', alignItems:'center' } },
                    React.createElement('span', { style: { fontFamily:'var(--fh)', fontSize:'10px', fontWeight:700, color: col, letterSpacing:'1px' } }, s),
                    React.createElement('span', { style: { fontFamily:'var(--fm)', fontSize:'13px', fontWeight:700, color:'var(--t1)' } }, t)
                  )
                )
              ),
              React.createElement('div', { style: { marginTop:'8px', fontFamily:'var(--fh)', fontSize:'9px', color:'var(--t3)', letterSpacing:'1px' } }, `${c.sectors.driver} ${c.sectors.year}`)
            )
          )
        ),
        // About
        React.createElement('div', { className: 'card' },
          React.createElement('div', { className: 'card-title', style: { marginBottom: '12px' } }, 'About'),
          React.createElement('p', { style: { fontSize: '13px', lineHeight: '1.75', color: 'var(--text-secondary)' } }, c.description)
        ),
        wikiSummary && React.createElement('div', { className: 'card' },
          React.createElement('div', { className: 'card-title', style: { marginBottom: '12px' } }, 'Wikipedia'),
          React.createElement('p', { style: { fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)' } }, wikiSummary.extract?.slice(0, 500) + '…'),
          React.createElement('a', {
            href: wikiSummary.content_urls?.desktop?.page, target: '_blank',
            style: { fontSize: '11px', color: 'var(--green)', letterSpacing: '1px', fontFamily: 'var(--font-display)', display: 'inline-block', marginTop: '8px' }
          }, 'READ MORE ON WIKIPEDIA →')
        )
      ),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        // Big lap record card
        React.createElement('div', { className: 'card', style: { background: 'linear-gradient(135deg, rgba(0,232,168,.06) 0%, var(--s1) 60%)' } },
          React.createElement('div', { className: 'card-title', style: { marginBottom: '10px' } }, 'Lap Record'),
          React.createElement('div', { style: { fontFamily:'var(--fm)', fontSize:'36px', fontWeight:700, color:'var(--green)', letterSpacing:'-1px', marginBottom:'4px' } }, c.lapRecord.time),
          React.createElement('div', { style: { fontFamily:'var(--fh)', fontSize:'17px', fontWeight:700, color:'var(--t1)' } }, c.lapRecord.driver),
          React.createElement('div', { style: { fontFamily:'var(--fh)', fontSize:'11px', color:'var(--t3)', letterSpacing:'1px', textTransform:'uppercase' } }, `Set in ${c.lapRecord.year}`)
        ),
        // Stats grid
        React.createElement('div', { className: 'card' },
          React.createElement('div', { className: 'card-title', style: { marginBottom: '12px' } }, 'Circuit Stats'),
          React.createElement('div', { style: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' } },
            [
              ['LENGTH', `${c.length} km`],
              ['LAPS', c.laps],
              ['CORNERS', c.corners],
              ['DRS/AERO', c.drsZones + ' zones'],
              ['FIRST GP', c.firstGP],
              ['COUNTRY', c.country],
            ].map(([label, val]) =>
              React.createElement('div', { key: label, className: 'scel' },
                React.createElement('div', { style: { fontFamily:'var(--fm)', fontSize:'18px', fontWeight:700, color:'var(--t1)' } }, val),
                React.createElement('div', { className: 'sl' }, label)
              )
            )
          )
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
  const age = Math.floor((new Date() - new Date(d.dob)) / (365.25 * 24 * 3600 * 1000));
  const s = d.stats || {};
  return React.createElement('div', {
    className: 'driver-card', onClick,
    style: { '--tc': color, borderTopColor: color }
  },
    // Photo + number header
    React.createElement('div', { className: 'dc-header', style: { borderLeft: `4px solid ${color}`, position:'relative', overflow:'hidden', background:`linear-gradient(135deg,${color}18 0%,transparent 60%)`, padding:'14px 14px 10px', minHeight:'90px' } },
      d.photo && React.createElement('img', {
        src: d.photo,
        style: { position:'absolute', right:0, bottom:0, height:'90px', objectFit:'contain', objectPosition:'bottom right', opacity:0.6 },
        onError: e => e.target.style.display = 'none',
      }),
      React.createElement('div', { style: { fontFamily:'var(--fm)', fontSize:'52px', fontWeight:700, color: color + '30', lineHeight:1, position:'absolute', right:'10px', top:'4px' } }, d.num),
      React.createElement('div', { style: { fontFamily:'var(--fh)', fontSize:'11px', fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', color:'var(--t3)', marginBottom:'4px' } }, `${d.nat} · ${d.team}`),
      React.createElement('div', { style: { fontFamily:'var(--fh)', fontSize:'22px', fontWeight:700, lineHeight:1.1, position:'relative', zIndex:1 } }, `${d.first} ${d.last}`),
      React.createElement('div', { style: { marginTop:'6px', display:'flex', gap:'5px', flexWrap:'wrap' } },
        React.createElement('span', { className:'badge b-dim' }, `#${d.num}`),
        d.stats?.wdc > 0 && React.createElement('span', { className:'badge b-gold' }, `${d.stats.wdc}× WDC`),
      )
    ),
    // Quick stats bar
    React.createElement('div', { style: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', borderTop:'1px solid var(--b0)' } },
      [['WINS', s.wins||0], ['PODS', s.podiums||0], ['POLES', s.poles||0], ['AGE', age]].map(([label, val]) =>
        React.createElement('div', { key: label, style: { padding:'8px 6px', textAlign:'center', borderRight:'1px solid var(--b0)' },
          className: label !== 'AGE' ? '' : '' },
          React.createElement('div', { style: { fontFamily:'var(--fm)', fontSize:'14px', fontWeight:700, color:'var(--t1)' } }, val),
          React.createElement('div', { style: { fontFamily:'var(--fh)', fontSize:'9px', fontWeight:600, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--t3)', marginTop:'2px' } }, label)
        )
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
    // Use ergastId (e.g. 'norris', 'max_verstappen') — falls back to pre-loaded stats
    const ergastId = d.ergastId || d.code.toLowerCase();
    fetchErgast(`/drivers/${ergastId}/results`)
      .then(data => {
        const races = data.RaceTable?.Races || [];
        // Count across all races (driver appears in Results[0] only if we filtered by driver)
        const wins = races.filter(r => r.Results?.some(res => res.position === '1')).length;
        const podiums = races.filter(r => r.Results?.some(res => ['1','2','3'].includes(res.position))).length;
        const poles = races.filter(r => r.Results?.some(res => res.grid === '1')).length;
        setErgastData({ wins, podiums, poles, races: races.length, recentRaces: races.slice(-10).reverse() });
      })
      .catch(() => {
        // Fallback: use pre-loaded stats from CURRENT_DRIVERS if available
        if (d.stats) {
          setErgastData({ wins: d.stats.wins, podiums: d.stats.podiums, poles: d.stats.poles, races: '—', recentRaces: [] });
        }
      });
    fetchWiki(d.wikiTitle).then(setWikiData).catch(() => {});
  }, [d.code, d.ergastId]);

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

    tab === 'stats' && React.createElement('div', null,
      // Show pre-loaded stats immediately while ergast loads
      d.stats && !ergastData && React.createElement('div', { className: 'card', style: { marginBottom: '12px', background: 'rgba(255,215,0,.04)', border: '1px solid rgba(255,215,0,.15)' } },
        React.createElement('div', { style: { fontSize:'11px', color:'var(--text-muted)', fontFamily:'var(--font-display)', letterSpacing:'1px', marginBottom:'8px' } }, 'CAREER STATS (pre-season data)'),
        React.createElement('div', { className: 'stat-grid' },
          [['WDC TITLES', d.stats.wdc||0, 'accent'], ['WINS', d.stats.wins||0, ''], ['PODIUMS', d.stats.podiums||0, ''], ['POLES', d.stats.poles||0, '']].map(([label, val, cls]) =>
            React.createElement('div', { key: label, className: 'scel' },
              React.createElement('div', { className: `stat-value ${cls}` }, val),
              React.createElement('div', { className: 'sl' }, label)
            )
          )
        )
      ),
      ergastData
        ? React.createElement('div', null,
            React.createElement('div', { className: 'card-title', style: { marginBottom:'12px' } }, 'Historical Stats (from Ergast)'),
            React.createElement('div', { className: 'stat-grid', style: { marginBottom: '16px' } },
              [
                ['RACE ENTRIES', ergastData.races, ''],
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
            React.createElement('div', { className: 'spin' }), 'Loading full career data from Ergast…'
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
    style: { '--tc': c.color, borderTopColor: c.color }
  },
    React.createElement('div', { style: { padding:'16px 16px 12px', borderLeft:`3px solid ${c.color}` } },
      React.createElement('div', { style: { fontFamily:'var(--fh)', fontSize:'20px', fontWeight:700, lineHeight:1.1 } }, c.name),
      React.createElement('div', { style: { fontSize:'11px', color:'var(--t2)', marginTop:'3px' } }, c.base),
      React.createElement('div', { style: { marginTop:'8px', display:'flex', gap:'5px', flexWrap:'wrap' } },
        c.titles > 0 && React.createElement('span', { className:'badge b-gold' }, `${c.titles}× WCC`),
        React.createElement('span', { className:'badge b-dim' }, `Est. ${c.firstYear}`),
        c.firstYear === 2026 && React.createElement('span', { className:'badge b-red' }, 'NEW')
      )
    ),
    React.createElement('div', { style: { display:'grid', gridTemplateColumns:'1fr 1fr', borderTop:'1px solid var(--b0)' } },
      [
        [c.chassis, 'CHASSIS'],
        [c.engine?.split(' ')[0] + ' ' + (c.engine?.split(' ')[1]||''), 'ENGINE'],
      ].map(([val, label]) =>
        React.createElement('div', { key: label, style: { padding:'9px 12px', borderRight:'1px solid var(--b0)', overflow:'hidden' } },
          React.createElement('div', { style: { fontFamily:'var(--fm)', fontSize:'13px', fontWeight:700, color:'var(--t1)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' } }, val),
          React.createElement('div', { style: { fontFamily:'var(--fh)', fontSize:'9px', fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', color:'var(--t3)', marginTop:'2px' } }, label)
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
          React.createElement('span', { className: 'badge b-dim' }, (c.engine||c.power||'').split(' ').slice(0,2).join(' '))
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
          ['Full Name', c.fullName || c.name],
          ['Base', c.base],
          ['Founded', c.firstYear],
          ['Chassis', c.chassis],
          ['Power Unit', c.engine || c.power],
          ['Team Principal', c.principal || '—'],
          ['WCC Titles', c.titles],
          ['2026 Drivers', (c.drivers||[]).join(' & ')],
        ].concat(c.notes ? [['Notes', c.notes]] : []).map(([label, val]) =>
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
        Math.floor(c.year / 10) * 10 === parseInt(decadeFilter.replace('s',''));
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
              background: c.year === 2025 ? 'rgba(245,200,66,.06)' : c.year === 2024 ? 'rgba(255,37,71,.03)' : 'transparent',
              transition: 'background .15s', cursor: 'default',
              alignItems: 'center',
            },
            onMouseEnter: e => { e.currentTarget.style.background = 'var(--bg-elevated)'; },
            onMouseLeave: e => { e.currentTarget.style.background = c.year === 2025 ? 'rgba(245,200,66,.06)' : c.year === 2024 ? 'rgba(255,37,71,.03)' : 'transparent'; }
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
            const isActive = CURRENT_DRIVERS.some(d => (d.first + ' ' + d.last) === row.driver);
            return React.createElement('div', { key: i, style: { marginBottom: '12px' } },
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' } },
                React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                  React.createElement('span', { style: { fontFamily:'var(--fm)', fontSize:'11px', color:'var(--t3)', width:'18px', textAlign:'right', flexShrink:0 } }, i + 1),
                  row.nat && React.createElement('span', { style: { fontSize:'14px' } }, row.nat),
                  React.createElement('span', { style: { fontFamily:'var(--fh)', fontSize:'15px', fontWeight:700, color: isActive ? 'var(--t1)' : 'var(--t2)' } }, row.driver || row.team),
                  isActive && React.createElement('span', { className:'badge b-green', style: { fontSize:'8px' } }, 'ACTIVE')
                ),
                React.createElement('span', { style: { fontFamily:'var(--fm)', fontSize:'18px', fontWeight:700, color: i === 0 ? accent : 'var(--t1)' } }, row.val)
              ),
              React.createElement('div', { style: { height:'5px', background:'var(--b1)', borderRadius:'3px', overflow:'hidden' } },
                React.createElement('div', { style: { height:'100%', width:`${pct}%`, borderRadius:'3px', background: i === 0 ? accent : 'var(--b2)', transition:'width .6s' } })
              )
            );
          })
        )
      )
    )
  );
}
