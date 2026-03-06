// js/app.js — main router, navigation, app shell
'use strict';

// ═══════════════════════════════════════════════════════════════
// TOP NAVIGATION
// ═══════════════════════════════════════════════════════════════
function TopNav({ section, setSection, isLive, nextRace }) {
  const links = [
    { id: 'live',          label: 'Live',            icon: '⏺' },
    { id: 'weekend',       label: 'Weekend',         icon: '📊' },
    { id: 'circuits',      label: 'Circuits',        icon: '🏟' },
    { id: 'drivers',       label: 'Drivers',         icon: '👤' },
    { id: 'constructors',  label: 'Constructors',    icon: '🔧' },
    { id: 'history',       label: 'History',         icon: '📖' },
  ];

  return React.createElement('nav', { className: 'topnav' },
    React.createElement('div', {
      className: 'nav-logo',
      onClick: () => setSection('home'),
      title: 'Go to Home',
    },
      React.createElement('div', { className: 'nav-mark' }, 'PW'),
      React.createElement('div', null,
        React.createElement('div', { className: 'nav-wordmark' }, 'PITWALL'),
        React.createElement('div', { className: 'nav-sub' }, 'F1 COMPANION')
      )
    ),
    React.createElement('div', { className: 'nav-links' },
      links.map(l =>
        React.createElement('button', {
          key: l.id,
          className: `nav-link ${section === l.id ? 'active' : ''}`, 'data-s': l.id,
          'data-section': l.id,
          onClick: () => setSection(l.id),
        },
          React.createElement('span', { className: 'ndot' }),
          React.createElement('span', null, l.label)
        )
      )
    ),
    React.createElement('div', { className: 'nav-right' },
      isLive && React.createElement('div', { className: 'live-pill' },
        React.createElement('div', { className: 'live-pill-dot' }),
        'LIVE'
      ),
      nextRace && React.createElement('div', { className: 'season-badge' }, nextRace)
    )
  );
}

// ═══════════════════════════════════════════════════════════════
// WELCOME / LANDING SECTION
// ═══════════════════════════════════════════════════════════════
function WelcomeBanner({ setSection, nextRaceInfo }) {
  return React.createElement('div', { style: { marginBottom: '28px' } },
    React.createElement('div', {
      style: {
        background: 'linear-gradient(135deg, rgba(232,0,45,.08) 0%, rgba(0,0,0,0) 60%)',
        border: '1px solid rgba(232,0,45,.15)',
        borderRadius: '12px', padding: '28px 32px', marginBottom: '16px',
        position: 'relative', overflow: 'hidden',
      }
    },
      React.createElement('div', { style: { position: 'absolute', top: 0, right: 0, bottom: 0, width: '40%', background: 'linear-gradient(90deg, transparent, rgba(232,0,45,.03))', pointerEvents: 'none' } }),
      React.createElement('div', { style: { position: 'relative', zIndex: 1 } },
        React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '4px', color: 'var(--red)', marginBottom: '8px', textTransform: 'uppercase' } }, 'Welcome to'),
        React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: '52px', fontWeight: 900, letterSpacing: '2px', lineHeight: 1, marginBottom: '6px' } }, 'PITWALL'),
        React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--text-secondary)', letterSpacing: '2px', marginBottom: '20px' } }, 'Your complete Formula 1 companion'),
        React.createElement('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
          [
            ['🏟 Circuits', 'circuits'],
            ['👤 Drivers', 'drivers'],
            ['🔧 Constructors', 'constructors'],
            ['📖 History', 'history'],
            ['📊 Weekend Analysis', 'weekend'],
          ].map(([label, id]) =>
            React.createElement('button', {
              key: id,
              className: 'btn btn-secondary',
              onClick: () => setSection(id),
              style: { fontSize: '11px' }
            }, label)
          )
        )
      )
    ),

    // Quick access grid
    React.createElement('div', { className: 'three-col' },
      React.createElement('div', { className: 'card', style: { cursor: 'pointer' }, onClick: () => setSection('circuits') },
        React.createElement('div', { style: { fontSize: '28px', marginBottom: '8px' } }, '🏟'),
        React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, marginBottom: '4px' } }, 'Circuits'),
        React.createElement('div', { style: { fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' } }, `${CIRCUITS.length} venues · Lap records, trivia, winning strategies, track characteristics`)
      ),
      React.createElement('div', { className: 'card', style: { cursor: 'pointer' }, onClick: () => setSection('drivers') },
        React.createElement('div', { style: { fontSize: '28px', marginBottom: '8px' } }, '👤'),
        React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, marginBottom: '4px' } }, 'Drivers'),
        React.createElement('div', { style: { fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' } }, `${CURRENT_DRIVERS.length} drivers · Profiles, career stats, race results, biographies`)
      ),
      React.createElement('div', { className: 'card', style: { cursor: 'pointer' }, onClick: () => setSection('history') },
        React.createElement('div', { style: { fontSize: '28px', marginBottom: '8px' } }, '🏆'),
        React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, marginBottom: '4px' } }, 'Champions'),
        React.createElement('div', { style: { fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' } }, 'Every F1 World Champion since 1950 · All-time records · Key milestones')
      )
    )
  );
}

// ═══════════════════════════════════════════════════════════════
// GLOSSARY TOOLTIP HELPER
// ═══════════════════════════════════════════════════════════════
const GLOSSARY = {
  'DRS': 'Drag Reduction System — a moveable rear wing that reduces drag on straights when a car is within 1 second of the car ahead.',
  'Active Aero': '2026+ replacement for DRS. Wings actively change angle for straight-line speed (Straight Mode) or downforce in corners (Corner Mode).',
  'Overtake Mode': '2026 equivalent of DRS eligibility — deploys extra 0.5MJ of electrical energy when within 1s of car ahead.',
  'Undercut': 'Strategic move where a team pits earlier than rivals to gain track position via faster laps on fresh tyres.',
  'Overcut': 'Staying out longer to gain track position when the pitting car gets stuck in traffic.',
  'VSC': 'Virtual Safety Car — all cars must reduce speed by ~40% but no bunching occurs. Used for minor incidents.',
  'SC': 'Safety Car — physical car deployed on track. All cars bunch up behind it, neutralising gaps.',
  'Parc Fermé': 'Controlled area where no significant changes can be made to the car between qualifying and the race.',
  'ERS': 'Energy Recovery System — harvests energy from braking and the turbo, deploying as electrical power.',
  'KERS': 'Kinetic Energy Recovery System — predecessor to ERS, used 2009–2013.',
  'Degradation': 'Rate at which tyre performance decreases over a stint. High degradation forces earlier pit stops.',
  'Graining': 'Small pieces of rubber tearing off the tyre surface, reducing grip temporarily.',
  'Blistering': 'Heat damage causing rubber bubbles on tyre surface. Causes sudden loss of performance.',
  'Stint': 'Period of racing between pit stops on one set of tyres.',
  'Delta': 'Time difference between two cars, or a target lap time the driver must hit.',
  'Lap Record': 'Fastest lap ever set at a circuit in race conditions.',
  'Pole Position': 'Starting from the front of the grid after being fastest in qualifying.',
  'Points System': '25-18-15-12-10-8-6-4-2-1 for positions 1–10. 1 bonus point for fastest lap (if in top 10).',
  'Fastest Lap': 'Fastest lap set during the race — awards 1 bonus championship point if the driver finishes in the top 10.',
  'Sprint': 'Short 100km race held on Saturdays at selected weekends. Sets the grid for Sunday\'s main race.',
  'WDC': 'World Drivers\' Championship — awarded to the driver with most points over the season.',
  'WCC': 'World Constructors\' Championship — awarded to the team (both drivers combined) with most points.',
  'Ground Effect': 'Aerodynamic concept using the underfloor to generate downforce. Banned 1983, returned 2022.',
};

function GlossaryPage() {
  const [search, setSearch] = React.useState('');
  const entries = Object.entries(GLOSSARY).filter(([term]) =>
    !search || term.toLowerCase().includes(search.toLowerCase())
  );

  return React.createElement('div', null,
    React.createElement('div', { className: 'sec-hdr' },
      React.createElement('div', null,
        React.createElement('div', { className: 'sec-title' }, 'GLOSSARY'),
        React.createElement('div', { className: 'sec-sub' }, 'F1 terminology explained')
      )
    ),
    React.createElement('div', { className: 'search-wrap', style: { marginBottom: '20px', maxWidth: '360px' } },
      React.createElement('span', { className: 'search-icon' }, '🔍'),
      React.createElement('input', {
        className: 'search-input', placeholder: 'Search terms…',
        value: search, onChange: e => setSearch(e.target.value)
      })
    ),
    React.createElement('div', { className: 'two-col-equal', style: { alignItems: 'start' } },
      entries.slice(0, Math.ceil(entries.length / 2)).map(([term, def]) =>
        React.createElement('div', { key: term, className: 'card card-sm', style: { marginBottom: '8px' } },
          React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' } }, term),
          React.createElement('div', { style: { fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' } }, def)
        )
      ),
      entries.slice(Math.ceil(entries.length / 2)).map(([term, def]) =>
        React.createElement('div', { key: term, className: 'card card-sm', style: { marginBottom: '8px' } },
          React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' } }, term),
          React.createElement('div', { style: { fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' } }, def)
        )
      )
    )
  );
}

// ═══════════════════════════════════════════════════════════════
// SEASON STANDINGS (Live via OpenF1 / Ergast)
// ═══════════════════════════════════════════════════════════════
function StandingsWidget() {
  const [tab, setTab] = React.useState('drivers');
  const [drivers, setDrivers] = React.useState([]);
  const [teams, setTeams] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const year = new Date().getFullYear();
    Promise.all([
      fetchErgast(`/${year}/driverStandings`).catch(() => null),
      fetchErgast(`/${year}/constructorStandings`).catch(() => null),
    ]).then(([dData, cData]) => {
      const dStandings = dData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
      const cStandings = cData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];
      setDrivers(dStandings);
      setTeams(cStandings);
      setLoading(false);
    });
  }, []);

  if (loading) return React.createElement('div', { className: 'loading' }, React.createElement('div', { className: 'spin' }), 'Loading standings…');

  return React.createElement('div', { className: 'card' },
    React.createElement('div', { className: 'card-header' },
      React.createElement('div', { className: 'card-title' }, `${new Date().getFullYear()} Standings`),
      React.createElement('div', { className: 'mode-tgl' },
        React.createElement('button', { className: `mode-btn ${tab==='drivers'?'active':''}`, onClick: () => setTab('drivers') }, 'WDC'),
        React.createElement('button', { className: `mode-btn ${tab==='teams'?'active':''}`, onClick: () => setTab('teams') }, 'WCC'),
      )
    ),
    tab === 'drivers' && drivers.length > 0
      ? drivers.slice(0, 10).map((d, i) => {
          const maxPts = parseFloat(drivers[0]?.points || 1);
          const pts = parseFloat(d.points);
          const color = teamColor(d.Constructors?.[0]?.name);
          return React.createElement('div', { key: i, style: { marginBottom: '8px' } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' } },
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                React.createElement('span', { className: 'standings-pos' }, d.position),
                React.createElement('div', { style: { width: '3px', height: '16px', borderRadius: '2px', background: color } }),
                React.createElement('span', { style: { fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700 } }, `${d.Driver?.givenName?.[0]}. ${d.Driver?.familyName}`)
              ),
              React.createElement('span', { className: 'standings-pts' }, pts)
            ),
            React.createElement('div', { className: 'progress-bar' },
              React.createElement('div', { className: 'progress-fill', style: { width: `${(pts/maxPts)*100}%`, background: color } })
            )
          );
        })
      : tab === 'teams' && teams.length > 0
        ? teams.slice(0, 10).map((t, i) => {
            const maxPts = parseFloat(teams[0]?.points || 1);
            const pts = parseFloat(t.points);
            const color = teamColor(t.Constructor?.name);
            return React.createElement('div', { key: i, style: { marginBottom: '8px' } },
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' } },
                React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                  React.createElement('span', { className: 'standings-pos' }, t.position),
                  React.createElement('div', { style: { width: '3px', height: '16px', borderRadius: '2px', background: color } }),
                  React.createElement('span', { style: { fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700 } }, t.Constructor?.name)
                ),
                React.createElement('span', { className: 'standings-pts' }, pts)
              ),
              React.createElement('div', { className: 'progress-bar' },
                React.createElement('div', { className: 'progress-fill', style: { width: `${(pts/maxPts)*100}%`, background: color } })
              )
            );
          })
        : React.createElement('div', { className: 'empty' }, 'No standings data yet')
  );
}

// ═══════════════════════════════════════════════════════════════
// NEXT RACE COUNTDOWN
// ═══════════════════════════════════════════════════════════════
function NextRaceCountdown({ meetings }) {
  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!meetings?.length) return null;
  const next = meetings.find(m => new Date(m.date_start) > now);
  if (!next) return null;

  const diff = new Date(next.date_start) - now;
  const days = Math.floor(diff / (24*3600*1000));
  const hrs  = Math.floor((diff % (24*3600*1000)) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  return React.createElement('div', { className: 'card', style: { marginBottom: '16px' } },
    React.createElement('div', { className: 'card-header', style: { marginBottom: '12px' } },
      React.createElement('div', { className: 'card-title' }, 'Next Race'),
      React.createElement('span', { className: 'badge b-red' }, 'UPCOMING')
    ),
    React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, marginBottom: '4px' } }, next.meeting_name),
    React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '16px' } },
      `${next.location} · ${new Date(next.date_start).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}`
    ),
    React.createElement('div', { className: 'cd-wrap' },
      [[days,'DAYS'],[hrs,'HRS'],[mins,'MIN'],[secs,'SEC']].map(([val, label], i) =>
        React.createElement(React.Fragment, { key: label },
          i > 0 && React.createElement('div', { className: 'cd-sep' }, ':'),
          React.createElement('div', { className: 'cd-unit' },
            React.createElement('div', { className: 'cd-num' }, String(val).padStart(2, '0')),
            React.createElement('div', { className: 'cd-lbl' }, label)
          )
        )
      )
    )
  );
}

// ═══════════════════════════════════════════════════════════════
// 2026 ACTIVE AERO EXPLAINER CARD
// ═══════════════════════════════════════════════════════════════
function ActiveAeroCard() {
  const year = new Date().getFullYear();
  if (year < 2026) return null;

  return React.createElement('div', {
    className: 'card',
    style: { borderColor: 'rgba(232,0,45,.2)', background: 'rgba(232,0,45,.04)', marginBottom: '16px' }
  },
    React.createElement('div', { className: 'card-header', style: { marginBottom: '10px' } },
      React.createElement('div', { className: 'card-title' }, '2026 — Active Aero Era'),
      React.createElement('span', { className: 'badge b-red' }, 'NEW')
    ),
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
      [
        ['🔵 Corner Mode', 'Wings closed — maximum downforce. Used in all corners. Replaces DRS-closed.', 'aero-off'],
        ['🟢 Straight Mode', 'Wings open — minimum drag. Used on straights. Replaces DRS-open.', 'aero-open'],
        ['🟡 Overtake Mode', 'Within 1s at detection point: +0.5MJ ERS boost available. Replaces DRS eligible.', 'aero-avail'],
        ['🟣 ERS Boost', 'Driver-controlled electrical deployment — usable anywhere on track.', 'aero-boost'],
      ].map(([label, desc, cls]) =>
        React.createElement('div', { key: label, style: { display: 'flex', gap: '10px', alignItems: 'flex-start' } },
          React.createElement('span', { className: `aero-badge ${cls}`, style: { flexShrink: 0, marginTop: '2px' } }, label.split(' ').slice(1).join(' ')),
          React.createElement('span', { style: { fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' } }, desc)
        )
      )
    )
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP ROOT
// ═══════════════════════════════════════════════════════════════
function App() {
  const [section, setSection] = React.useState('home');
  const [meetings, setMeetings] = React.useState([]);

  // Load meetings for countdown widget
  React.useEffect(() => {
    const year = new Date().getFullYear();
    fetchF1('/meetings', { year })
      .then(data => setMeetings(data || []))
      .catch(() => {});
  }, []);

  const isLive = section === 'live';

  const renderSection = () => {
    switch(section) {
      case 'home':         return renderHome();
      case 'live':         return React.createElement('div', { id: 'live-mount' });
      case 'weekend':      return React.createElement('div', { id: 'weekend-mount' });
      case 'circuits':     return React.createElement(CircuitsPage, null);
      case 'drivers':      return React.createElement(DriversPage, null);
      case 'constructors': return React.createElement(ConstructorsPage, null);
      case 'history':      return React.createElement(HistoryPage, null);
      case 'glossary':     return React.createElement(GlossaryPage, null);
      default:             return renderHome();
    }
  };

  const renderHome = () => React.createElement('div', null,
    React.createElement(WelcomeBanner, { setSection, nextRaceInfo: null }),
    React.createElement('div', { className: 'two-col', style: { alignItems: 'start' } },
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        React.createElement(ActiveAeroCard, null),
        React.createElement('div', { className: 'card' },
          React.createElement('div', { className: 'card-title', style: { marginBottom: '14px' } }, 'Quick Links'),
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } },
            [
              ['📊 Weekend Analysis', 'weekend', 'Lap times, sectors, head-to-head, AI race analyst'],
              ['⏺ Live Race Mode', 'live', 'Live timing, circuit tracker, telemetry, team radio'],
              ['🏟 Circuit Guide', 'circuits', 'All 24 circuits — trivia, records, strategies'],
              ['👤 Driver Profiles', 'drivers', 'Full grid profiles and career statistics'],
              ['🔧 Constructor Guide', 'constructors', 'Team histories, stats and 2026 lineup'],
              ['📖 F1 History', 'history', 'Champions since 1950, milestones, all-time records'],
              ['💬 F1 Glossary', 'glossary', 'Every technical term explained simply'],
            ].map(([label, id, desc]) =>
              React.createElement('div', {
                key: id, onClick: () => setSection(id),
                style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 'var(--radius)', cursor: 'pointer', transition: 'background .15s', background: 'var(--bg-elevated)', border: '1px solid var(--border)' },
                onMouseEnter: e => { e.currentTarget.style.borderColor = 'var(--border-bright)'; },
                onMouseLeave: e => { e.currentTarget.style.borderColor = 'var(--border)'; }
              },
                React.createElement('div', null,
                  React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700 } }, label),
                  React.createElement('div', { style: { fontSize: '12px', color: 'var(--text-muted)', marginTop: '1px' } }, desc)
                ),
                React.createElement('span', { style: { color: 'var(--text-dim)', fontSize: '16px' } }, '›')
              )
            )
          )
        )
      ),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        React.createElement(NextRaceCountdown, { meetings }),
        React.createElement(StandingsWidget, null)
      )
    )
  );

  return React.createElement('div', { className: 'shell' },
    React.createElement(TopNav, { section, setSection, isLive }),
    React.createElement('div', { className: 'content' },
      renderSection()
    )
  );
}
