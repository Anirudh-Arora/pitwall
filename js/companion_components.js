const { useState, useEffect, useCallback, useMemo, useRef } = React;
// Recharts lazy resolver — call at render time, not module parse time
function useRecharts() {
  // Recharts CDN loads synchronously before Babel parses these scripts
  // so window.Recharts should always be available immediately
  // Still use state as fallback in case of slow CDN
  const [rc, setRc] = React.useState(() => window.Recharts || null);
  React.useEffect(() => {
    // Immediately check (covers async Babel parse edge case)
    if (window.Recharts && !rc) { setRc(window.Recharts); return; }
    if (rc) return;
    // Poll as fallback — CDN may still be loading
    let attempts = 0;
    const t = setInterval(() => {
      attempts++;
      if (window.Recharts) { setRc(window.Recharts); clearInterval(t); }
      else if (attempts > 80) clearInterval(t); // give up after 8s
    }, 100);
    return () => clearInterval(t);
  }, [rc]);
  // Always try window.Recharts directly in case state update hasn't propagated
  return rc || window.Recharts || null;
}
// Keep destructured refs for non-chart code (fallback to empty)
const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
        AreaChart, Area, BarChart, Bar, ReferenceLine, Cell } = window.Recharts || {};

// ─── CONSTANTS ────────────────────────────────────────────────
const OWM_BASE = 'https://api.openweathermap.org/data/2.5';

const TEAM_COLORS = {
  'Red Bull Racing':'#3671C6','Oracle Red Bull Racing':'#3671C6',
  'Ferrari':'#E8002D','Scuderia Ferrari':'#E8002D','Scuderia Ferrari HP':'#E8002D',
  'McLaren':'#FF8000','McLaren F1 Team':'#FF8000',
  'Mercedes':'#27F4D2','Mercedes-AMG PETRONAS F1 Team':'#27F4D2','Mercedes-AMG':'#27F4D2',
  'Alpine':'#FF87BC','BWT Alpine F1 Team':'#FF87BC',
  'Aston Martin':'#229971','Aston Martin Aramco F1 Team':'#229971','Aston Martin Aramco Cognizant F1 Team':'#229971',
  'Haas':'#B6BABD','Haas F1 Team':'#B6BABD','MoneyGram Haas F1 Team':'#B6BABD',
  'RB':'#6692FF','Visa Cash App RB Formula One Team':'#6692FF','AlphaTauri':'#6692FF','Racing Bulls':'#6692FF',
  'Williams':'#64C4FF','Williams Racing':'#64C4FF',
  'Kick Sauber':'#52E252','Sauber':'#52E252','Alfa Romeo':'#52E252',
  'Cadillac':'#cc4400',
};

function getTeamColor(t) {
  if (!t) return '#666';
  for (const [k,v] of Object.entries(TEAM_COLORS)) {
    if (t.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(t.toLowerCase())) return v;
  }
  return '#666';
}

function fmt(s) {
  if (!s || isNaN(s)) return '—';
  const m = Math.floor(s/60), sec = (s%60).toFixed(3).padStart(6,'0');
  return `${m}:${sec}`;
}

function fmtGap(s) {
  if (s == null) return '—';
  if (typeof s === 'string') return s;
  if (Math.abs(s) > 90) return `+${Math.floor(Math.abs(s)/60)}L`;
  return `+${Math.abs(s).toFixed(3)}`;
}

function cleanLaps(laps, best) {
  if (!laps?.length) return [];
  const thr = best * 1.07;
  return laps.filter(l =>
    l.lap_duration > 0 && !l.is_pit_out_lap && l.lap_duration <= thr &&
    l.duration_sector_1 != null && l.duration_sector_2 != null && l.duration_sector_3 != null
  );
}

// ─── FETCH HELPERS ─────────────────────────────────────────────

// ─── WEEKEND SNAPSHOT (for AI) ─────────────────────────────────
function buildWeekendSnapshot(allSessionsLaps, qualiLaps, weekendStints, driversList) {
  const drMap = {};
  driversList.forEach(d => { drMap[d.driver_number] = d; });

  // Merge all session laps per driver
  const merged = {};
  allSessionsLaps.forEach(({ sessionName, lapsByDriver }) => {
    Object.entries(lapsByDriver).forEach(([num, laps]) => {
      if (!merged[num]) merged[num] = [];
      merged[num].push(...laps.map(l => ({...l, _session: sessionName})));
    });
  });

  // Quali grid
  const qb = {};
  qualiLaps.forEach(l => {
    if (!l.lap_duration) return;
    if (!qb[l.driver_number] || l.lap_duration < qb[l.driver_number]) qb[l.driver_number] = l.lap_duration;
  });
  const qualiGrid = Object.entries(qb).sort((a,b)=>a[1]-b[1]).map(([num,t],i) => {
    const d = drMap[num];
    return { position:i+1, driverNum:parseInt(num), name:d?.full_name||`#${num}`, team:d?.team_name||'', lapTime:t, gapToPole:0 };
  });
  if (qualiGrid.length) { const pole = qualiGrid[0].lapTime; qualiGrid.forEach(x => { x.gapToPole = x.lapTime - pole; }); }

  // Per-driver stats
  const stats = {};
  Object.entries(merged).forEach(([num, laps]) => {
    const d = drMap[parseInt(num)];
    const times = laps.map(l=>l.lap_duration).filter(Boolean).sort((a,b)=>a-b);
    if (!times.length) return;
    const mean = times.reduce((s,t)=>s+t,0)/times.length;
    const stdev = Math.sqrt(times.reduce((s,t)=>s+Math.pow(t-mean,2),0)/times.length);
    const longRunLaps = laps.filter((l,i) => {
      const same = laps.filter(x=>x._session===l._session);
      return same.indexOf(l) >= 4;
    }).map(l=>l.lap_duration).filter(Boolean);
    const longRunPace = longRunLaps.length >= 3 ? longRunLaps.reduce((s,t)=>s+t,0)/longRunLaps.length : null;
    const s1s = laps.filter(l=>l.duration_sector_1).map(l=>l.duration_sector_1);
    const s2s = laps.filter(l=>l.duration_sector_2).map(l=>l.duration_sector_2);
    const s3s = laps.filter(l=>l.duration_sector_3).map(l=>l.duration_sector_3);
    let degradation = 'Low';
    if (longRunLaps.length >= 5) {
      const slope = (longRunLaps[longRunLaps.length-1]-longRunLaps[0])/longRunLaps.length;
      if (slope > .15) degradation = 'High'; else if (slope > .07) degradation = 'Medium';
    }
    const compounds = [...new Set(weekendStints.filter(s=>s.driver_number===parseInt(num)).map(s=>s.compound).filter(Boolean))];
    stats[num] = {
      name: d?.full_name||`#${num}`, team: d?.team_name||'',
      best: times[0], median: times[Math.floor(times.length/2)], stdev, longRunPace, degradation,
      s1Best: s1s.length ? Math.min(...s1s) : null,
      s2Best: s2s.length ? Math.min(...s2s) : null,
      s3Best: s3s.length ? Math.min(...s3s) : null,
      totalLaps: laps.length, compounds,
      qualiPos: qualiGrid.find(x=>x.driverNum===parseInt(num))?.position || 99,
    };
  });

  return { qualiGrid, driverStats: stats };
}

// ─── GROQ AI ───────────────────────────────────────────────────
async function callGroqPreRace(key, snap, meeting) {
  const { qualiGrid, driverStats } = snap;
  const qualiDone = qualiGrid.length > 0;

  const qualiSection = qualiDone
    ? `QUALIFYING GRID (completed):\n${qualiGrid.slice(0,15).map(d=>`P${d.position}: ${d.name} (${d.team}) — ${fmt(d.lapTime)}, +${d.gapToPole.toFixed(3)}s`).join('\n')}`
    : `QUALIFYING STATUS: Has NOT taken place yet. Do NOT invent or assume a qualifying grid. Set gridPosition to null for all drivers.`;

  const prompt = `You are a data-driven F1 race strategist analysing ${meeting}.
${qualiDone ? 'Qualifying has completed. Predict the top 3 race finishers.' : 'Qualifying has NOT happened yet. Based ONLY on practice data below, predict the top 3 likely race contenders. Be explicit that these are practice-based projections only.'}

${qualiSection}

LONG RUN RACE PACE (5+ lap stints in practice, most reliable race pace indicator):
${Object.values(driverStats).filter(d=>d.longRunPace).sort((a,b)=>a.longRunPace-b.longRunPace).slice(0,15).map(d=>`${d.name} (${d.team}): ${fmt(d.longRunPace)} avg, degradation:${d.degradation}, ${d.totalLaps} total laps`).join('\n')}

TYRE COMPOUNDS USED + DEGRADATION:
${Object.values(driverStats).sort((a,b)=>(a.qualiPos||99)-(b.qualiPos||99)).slice(0,15).map(d=>`${d.name}: ${d.degradation} deg, compounds:${d.compounds.join('/')}`).join('\n')}

SECTOR STRENGTHS (best sectors across all practice sessions):
${Object.values(driverStats).sort((a,b)=>(a.qualiPos||99)-(b.qualiPos||99)).slice(0,15).map(d=>`${d.name}: S1=${d.s1Best?.toFixed(3)||'?'} S2=${d.s2Best?.toFixed(3)||'?'} S3=${d.s3Best?.toFixed(3)||'?'} consistency±${d.stdev?.toFixed(3)||'?'}s`).join('\n')}

Return EXACTLY a JSON array with 3 objects, NO markdown, NO preamble:
[{"name":"...","team":"...","gridPosition":${qualiDone ? 'N (from qualifying grid above)' : 'null (qualifying not done)'},"reasoning":"2-3 sentences citing specific numbers from the data above","confidence":"High"|"Medium"|"Speculative","winProbability":N}]
winProbability 0-100, must sum to roughly 100 across the 3. JSON only.`;

  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},
    body: JSON.stringify({ model:'llama-3.3-70b-versatile', max_tokens:1200, messages:[{role:'user',content:prompt}] })
  });
  if (!r.ok) throw new Error(`Groq ${r.status} — check your key`);
  const d = await r.json();
  return JSON.parse(d.choices[0].message.content.trim().replace(/```json|```/g,'').trim());
}

async function callGroqLiveUpdate(key, predictions, liveSnap, meeting) {
  const prompt = `You are a live F1 race analyst for ${meeting}.

PRE-RACE PREDICTIONS (from FP1+FP2+FP3+Qualifying):
${predictions.map((p,i)=>`Predicted P${i+1}: ${p.name} (${p.team}), grid P${p.gridPosition}, ${p.confidence} confidence`).join('\n')}

CURRENT LIVE STATE:
${liveSnap.map(d=>`P${d.position}: ${d.name} — gap:${d.gap}, stops:${d.stops}, tyre:${d.tyre}(${d.tyreAge} laps), lap:${d.lap}`).join('\n')}

For each driver in top 8, return updated win probability and one-sentence live assessment.
Return EXACTLY a JSON array, NO markdown:
[{"name":"...","currentPosition":N,"winProbability":N,"trend":"up"|"down"|"stable","assessment":"..."}]
JSON only.`;

  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},
    body: JSON.stringify({ model:'llama-3.3-70b-versatile', max_tokens:900, messages:[{role:'user',content:prompt}] })
  });
  if (!r.ok) throw new Error(`Groq live ${r.status}`);
  const d = await r.json();
  return JSON.parse(d.choices[0].message.content.trim().replace(/```json|```/g,'').trim());
}

// ─── HOOKS ─────────────────────────────────────────────────────
function useLivePoll(sessionKey, enabled) {
  const [positions, setPositions] = useState([]);
  const [intervals, setIntervals] = useState([]);
  const [raceControl, setRaceControl] = useState([]);
  const [pits, setPits] = useState([]);
  const [weather, setWeather] = useState(null);
  const [stints, setStints] = useState([]);
  const [carData, setCarData] = useState({});
  const [teamRadio, setTeamRadio] = useState([]);
  const [liveLaps, setLiveLaps] = useState([]);
  const [location, setLocation] = useState([]);
  const rcSeen = useRef(new Set());
  const radioSeen = useRef(new Set());

  const poll = useCallback(async (ep, setter, mode) => {
    if (!sessionKey) return;
    try {
      const data = await fetchF1(ep, { session_key: sessionKey });
      if (mode === 'rc') {
        setter(prev => {
          const nx = data.filter(m => !rcSeen.current.has(m.message+m.date));
          nx.forEach(m => rcSeen.current.add(m.message+m.date));
          return nx.length ? [...nx.reverse(),...prev].slice(0,50) : prev;
        });
      } else if (mode === 'radio') {
        setter(prev => {
          const nx = data.filter(m => !radioSeen.current.has(m.recording_url+m.date));
          nx.forEach(m => radioSeen.current.add(m.recording_url+m.date));
          return nx.length ? [...nx.reverse(),...prev].slice(0,20) : prev;
        });
      } else if (mode === 'car') {
        setter(prev => { const m={...prev}; data.forEach(d=>{m[d.driver_number]=d;}); return m; });
      } else setter(data);
    } catch {}
  }, [sessionKey]);

  useEffect(() => {
    if (!enabled || !sessionKey) return;
    poll('/position', setPositions);
    poll('/intervals', setIntervals);
    poll('/race_control', msgs => { msgs.forEach(m=>rcSeen.current.add(m.message+m.date)); setRaceControl(msgs.slice().reverse().slice(0,50)); });
    poll('/pit', setPits);
    poll('/weather', w => setWeather(w?.length ? w[w.length-1] : null));
    poll('/stints', setStints);
    poll('/car_data', setCarData, 'car');
    poll('/team_radio', msgs => { msgs.forEach(m=>radioSeen.current.add(m.recording_url+m.date)); setTeamRadio(msgs.slice().reverse().slice(0,20)); });
    poll('/laps', setLiveLaps);
    poll('/location', setLocation);

    const timers = [
      setInterval(() => poll('/position', setPositions), 5000),
      setInterval(() => poll('/intervals', setIntervals), 5000),
      setInterval(() => poll('/race_control', setRaceControl, 'rc'), 5000),
      setInterval(() => poll('/pit', setPits), 10000),
      setInterval(() => poll('/weather', w => setWeather(w?.length ? w[w.length-1] : null)), 15000),
      setInterval(() => poll('/stints', setStints), 15000),
      setInterval(() => poll('/car_data', setCarData, 'car'), 3000),
      setInterval(() => poll('/team_radio', setTeamRadio, 'radio'), 10000),
      setInterval(() => poll('/laps', setLiveLaps), 15000),
      setInterval(() => poll('/location', setLocation), 2000),
    ];
    return () => timers.forEach(clearInterval);
  }, [enabled, sessionKey, poll]);

  return { positions, intervals, raceControl, pits, weather, stints, carData, teamRadio, liveLaps, location };
}

// ═══════════════════════════════════════════════════════════════
// 1. CIRCUIT POSITION TRACKER
// ═══════════════════════════════════════════════════════════════
function CircuitTracker({ location, positions, drivers, practiceSession, enabled }) {
  const [trackPoints, setTrackPoints] = useState(null);
  const [normParams, setNormParams] = useState(null);
  const [loadStatus, setLoadStatus] = useState('idle');
  const W = 520, H = 340, PAD = 32;

  const normalize = useCallback((px, py, p) => ({
    x: PAD + (px - p.minX) * p.scale,
    y: H - PAD - (py - p.minY) * p.scale,
  }), []);

  useEffect(() => {
    if (!practiceSession?.session_key || !practiceSession?.date_start) return;
    setLoadStatus('loading');
    setTrackPoints(null);
    setNormParams(null);

    // Fetch only a narrow 5-minute window from session start — ~1-2 laps, small payload
    const t0 = new Date(practiceSession.date_start);
    const t1 = new Date(t0.getTime() + 5 * 60 * 1000);
    const iso = d => d.toISOString().slice(0, 19); // "2025-03-14T01:30:00"

    fetchF1('/location', {
      session_key: practiceSession.session_key,
      date_gt: iso(t0),
      date_lt: iso(t1),
    })
    .then(data => {
      if (!data?.length) { setLoadStatus('error'); return; }
      const valid = data.filter(d => d.x != null && d.y != null);
      if (!valid.length) { setLoadStatus('error'); return; }

      // Group by driver, pick the one with most points for cleanest line
      const byDriver = {};
      valid.forEach(d => { (byDriver[d.driver_number] = byDriver[d.driver_number] || []).push(d); });
      const pts = Object.values(byDriver).sort((a,b) => b.length - a.length)[0];
      pts.sort((a,b) => a.date > b.date ? 1 : -1);

      // Deduplicate near-identical consecutive points (GPS jitter)
      const clean = pts.filter((d,i) => {
        if (i === 0) return true;
        const p = pts[i-1];
        return Math.hypot(d.x - p.x, d.y - p.y) > 1;
      });

      const xs = clean.map(d => d.x), ys = clean.map(d => d.y);
      const minX = Math.min(...xs), maxX = Math.max(...xs);
      const minY = Math.min(...ys), maxY = Math.max(...ys);
      const scale = Math.min((W - PAD*2) / (maxX - minX || 1), (H - PAD*2) / (maxY - minY || 1));
      const params = { minX, minY, scale };

      // Downsample to ~400 points max
      const step = Math.max(1, Math.floor(clean.length / 400));
      const normalized = clean.filter((_, i) => i % step === 0).map(d => normalize(d.x, d.y, params));

      setNormParams(params);
      setTrackPoints(normalized);
      setLoadStatus('done');
    })
    .catch(() => setLoadStatus('error'));
  }, [practiceSession?.session_key, normalize]);

  const driverMap = useMemo(() => {
    const m = {}; drivers?.forEach(d => { m[d.driver_number] = d; }); return m;
  }, [drivers]);

  const latestRacePos = useMemo(() => {
    const m = {};
    positions?.forEach(p => { if (!m[p.driver_number] || p.date > m[p.driver_number].date) m[p.driver_number] = p; });
    return m;
  }, [positions]);

  const driverDots = useMemo(() => {
    if (!location?.length || !normParams) return {};
    const latest = {};
    location.forEach(d => {
      if (d.x == null || d.y == null) return;
      if (!latest[d.driver_number] || d.date > latest[d.driver_number].date) latest[d.driver_number] = d;
    });
    const dots = {};
    Object.entries(latest).forEach(([num, d]) => { dots[num] = normalize(d.x, d.y, normParams); });
    return dots;
  }, [location, normParams, normalize]);

  const pathD = useMemo(() => {
    if (!trackPoints?.length) return null;
    return 'M ' + trackPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ') + ' Z';
  }, [trackPoints]);

  return (
    <div style={{ position:'relative', background:'var(--bg-elevated)', borderRadius:'6px', overflow:'hidden' }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ display:'block' }}>
        {pathD ? (
          <>
            <path d={pathD} fill="none" stroke="#1a1a1a" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
            <path d={pathD} fill="none" stroke="#2c2c2c" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
            <path d={pathD} fill="none" stroke="#404040" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <path d={pathD} fill="none" stroke="#5a5a5a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : (
          <text x={W/2} y={H/2} textAnchor="middle" fill="#3a3a3a"
            fontFamily="var(--font-head)" fontSize="12" letterSpacing="3">
            {loadStatus==='loading' ? 'LOADING CIRCUIT GPS...' :
             loadStatus==='error'   ? 'GPS DATA UNAVAILABLE FOR THIS SESSION' :
             'AWAITING SESSION'}
          </text>
        )}

        {/* Driver dots — only shown when live */}
        {pathD && enabled && Object.entries(driverDots).map(([num, pos]) => {
          const d = driverMap[parseInt(num)];
          const color = getTeamColor(d?.team_name);
          const rPos = latestRacePos[parseInt(num)]?.position;
          return (
            <g key={num}>
              {rPos <= 3 && <circle cx={pos.x} cy={pos.y} r={11} fill="none" stroke={color} strokeWidth={1.5} opacity={0.3} />}
              <circle cx={pos.x} cy={pos.y} r={5} fill={color} stroke="#000" strokeWidth={1.5} opacity={0.95} />
              <text x={pos.x} y={pos.y-8} textAnchor="middle" fill={color}
                fontFamily="var(--font-head)" fontSize="9" fontWeight="700">
                {d?.name_acronym || ''}
              </text>
            </g>
          );
        })}

        {/* Overlay when track loaded but live not enabled */}
        {pathD && !enabled && (
          <>
            <rect x={W/2-150} y={H/2-13} width={300} height={22} rx={3} fill="rgba(8,8,8,0.8)" />
            <text x={W/2} y={H/2+3} textAnchor="middle" fill="#555"
              fontFamily="var(--font-head)" fontSize="10" letterSpacing="2">
              ENABLE LIVE TRACKING FOR DRIVER POSITIONS
            </text>
          </>
        )}
      </svg>

      {practiceSession && (
        <div style={{position:'absolute',top:8,left:10,fontFamily:'var(--font-head)',fontSize:'9px',letterSpacing:'2px',color:'var(--text-dim)'}}>
          TRACK · {practiceSession.session_name?.toUpperCase()}
        </div>
      )}
      {enabled && pathD && (
        <div style={{position:'absolute',top:8,right:10,display:'flex',alignItems:'center',gap:'4px',fontFamily:'var(--font-head)',fontSize:'9px',letterSpacing:'1px',color:'var(--accent-green)'}}>
          <div style={{width:'5px',height:'5px',borderRadius:'50%',background:'var(--accent-green)',animation:'pulse-red 1.5s infinite'}}/>
          GPS LIVE · 2s
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 2. LAP-BY-LAP POSITION HISTORY
// ═══════════════════════════════════════════════════════════════
function PositionHistory({ positions, drivers }) {
  const driverMap = useMemo(() => {
    const m = {}; if (drivers) drivers.forEach(d => { m[d.driver_number] = d; }); return m;
  }, [drivers]);

  // Build position data by lap (infer lap from position timestamp ordering)
  const { chartData, driverNums } = useMemo(() => {
    if (!positions?.length) return { chartData: [], driverNums: [] };
    // Group position entries by driver, sorted by date
    const byDriver = {};
    positions.forEach(p => {
      if (!byDriver[p.driver_number]) byDriver[p.driver_number] = [];
      byDriver[p.driver_number].push(p);
    });
    Object.values(byDriver).forEach(arr => arr.sort((a,b) => a.date > b.date ? 1 : -1));
    // Downsample: take position snapshots at regular intervals
    const maxLen = Math.max(...Object.values(byDriver).map(a=>a.length));
    const step = Math.max(1, Math.floor(maxLen / 60));
    const snapshots = [];
    for (let i = 0; i < maxLen; i += step) {
      const snap = { lap: Math.round((i/maxLen)*70)+1 };
      Object.entries(byDriver).forEach(([num, arr]) => {
        const idx = Math.min(i, arr.length-1);
        snap[num] = arr[idx]?.position;
      });
      snapshots.push(snap);
    }
    const topDrivers = Object.keys(byDriver);
    return { chartData: snapshots, driverNums: topDrivers };
  }, [positions]);

  if (!chartData.length) return <div className="empty">Position history builds as race progresses</div>;
  const _RC = useRecharts();
  if (!_RC) return <div style={{padding:'32px 20px',textAlign:'center',color:'var(--t3)',fontSize:'12px',fontFamily:'var(--fh)',letterSpacing:'1px',textTransform:'uppercase'}}>⏳ Loading chart library…<div style={{fontSize:'10px',marginTop:'6px',color:'var(--t4)'}}>Recharts CDN</div></div>;
  const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, BarChart, Bar, ReferenceLine, Cell } = _RC;

  return (
    <div style={{ height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{top:5,right:16,left:-10,bottom:5}}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="lap" stroke="var(--text-dim)" tick={{fill:'var(--text-dim)',fontSize:10,fontFamily:'var(--font-data)'}} label={{value:'Lap',position:'insideBottom',offset:-2,fill:'var(--text-dim)',fontSize:10}} />
          <YAxis reversed domain={[1,20]} stroke="var(--text-dim)" tick={{fill:'var(--text-dim)',fontSize:10,fontFamily:'var(--font-data)'}} tickCount={10} label={{value:'Position',angle:-90,position:'insideLeft',fill:'var(--text-dim)',fontSize:10}} />
          <Tooltip contentStyle={{background:'var(--bg-elevated)',border:'1px solid var(--border)',borderRadius:'4px'}}
            labelStyle={{color:'var(--text-secondary)',fontFamily:'var(--font-head)',fontSize:'11px'}}
            itemStyle={{fontFamily:'var(--font-data)',fontSize:'10px'}}
            formatter={(v,name) => [v ? `P${v}` : '—', driverMap[name]?.last_name || name]}
            labelFormatter={l => `~Lap ${l}`} />
          <Legend formatter={v => driverMap[v]?.last_name || v} wrapperStyle={{fontFamily:'var(--font-data)',fontSize:'10px',paddingTop:'6px'}} />
          {driverNums.map(num => {
            const d = driverMap[num];
            return <Line key={num} type="monotone" dataKey={num} stroke={getTeamColor(d?.team_name)} dot={false} strokeWidth={1.5} connectNulls />;
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 3. GAP EVOLUTION CHART
// ═══════════════════════════════════════════════════════════════
function GapEvolution({ intervals, positions, drivers }) {
  const driverMap = useMemo(() => {
    const m = {}; if (drivers) drivers.forEach(d => { m[d.driver_number] = d; }); return m;
  }, [drivers]);

  const { chartData, top8 } = useMemo(() => {
    if (!intervals?.length || !positions?.length) return { chartData: [], top8: [] };
    // Find top 8 by latest position
    const latestPos = {};
    positions.forEach(p => { if (!latestPos[p.driver_number] || p.date > latestPos[p.driver_number].date) latestPos[p.driver_number] = p; });
    const top8 = Object.values(latestPos).sort((a,b)=>a.position-b.position).slice(1,9).map(p=>p.driver_number); // skip leader

    // Group intervals by driver, sort by date
    const byDriver = {};
    intervals.forEach(iv => {
      if (!top8.includes(iv.driver_number)) return;
      if (!byDriver[iv.driver_number]) byDriver[iv.driver_number] = [];
      byDriver[iv.driver_number].push(iv);
    });
    Object.values(byDriver).forEach(arr => arr.sort((a,b) => a.date > b.date ? 1 : -1));

    const maxLen = Math.max(...Object.values(byDriver).map(a=>a.length), 1);
    const step = Math.max(1, Math.floor(maxLen/60));
    const snapshots = [];
    for (let i = 0; i < maxLen; i += step) {
      const snap = { lap: Math.round((i/maxLen)*70)+1 };
      top8.forEach(num => {
        const arr = byDriver[num];
        if (!arr) return;
        const idx = Math.min(i, arr.length-1);
        const gap = arr[idx]?.gap_to_leader;
        snap[num] = typeof gap === 'number' ? parseFloat(gap.toFixed(2)) : null;
      });
      snapshots.push(snap);
    }
    return { chartData: snapshots, top8 };
  }, [intervals, positions]);

  if (!chartData.length) return <div className="empty">Gap data builds as race progresses</div>;
  const _RC = useRecharts();
  if (!_RC) return <div style={{padding:'32px 20px',textAlign:'center',color:'var(--t3)',fontSize:'12px',fontFamily:'var(--fh)',letterSpacing:'1px',textTransform:'uppercase'}}>⏳ Loading chart library…<div style={{fontSize:'10px',marginTop:'6px',color:'var(--t4)'}}>Recharts CDN</div></div>;
  const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, BarChart, Bar, ReferenceLine, Cell } = _RC;

  return (
    <div style={{ height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{top:5,right:16,left:0,bottom:5}}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="lap" stroke="var(--text-dim)" tick={{fill:'var(--text-dim)',fontSize:10,fontFamily:'var(--font-data)'}} label={{value:'Lap',position:'insideBottom',offset:-2,fill:'var(--text-dim)',fontSize:10}} />
          <YAxis stroke="var(--text-dim)" tick={{fill:'var(--text-dim)',fontSize:10,fontFamily:'var(--font-data)'}} tickFormatter={v=>`+${v}s`} width={52} />
          <Tooltip contentStyle={{background:'var(--bg-elevated)',border:'1px solid var(--border)',borderRadius:'4px'}}
            labelStyle={{color:'var(--text-secondary)',fontFamily:'var(--font-head)',fontSize:'11px'}}
            itemStyle={{fontFamily:'var(--font-data)',fontSize:'10px'}}
            formatter={(v,name) => [v != null ? `+${v}s` : '—', driverMap[name]?.last_name || name]}
            labelFormatter={l => `~Lap ${l}`} />
          <Legend formatter={v => driverMap[v]?.last_name || v} wrapperStyle={{fontFamily:'var(--font-data)',fontSize:'10px',paddingTop:'6px'}} />
          {top8.map(num => {
            const d = driverMap[num];
            return <Line key={num} type="monotone" dataKey={num} stroke={getTeamColor(d?.team_name)} dot={false} strokeWidth={1.5} connectNulls />;
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 4. HEAD-TO-HEAD COMPARISON
// ═══════════════════════════════════════════════════════════════
function HeadToHead({ allDriverLaps, drivers, weekendSessionsLaps }) {
  const [selA, setSelA] = useState(null);
  const [selB, setSelB] = useState(null);

  const driverMap = useMemo(() => {
    const m = {}; if (drivers) drivers.forEach(d => { m[d.driver_number] = d; }); return m;
  }, [drivers]);

  const driverList = useMemo(() => Object.keys(allDriverLaps).map(Number), [allDriverLaps]);

  const comparison = useMemo(() => {
    if (!selA || !selB) return null;
    // Aggregate laps across all weekend sessions for both drivers
    const lapsByDriver = {};
    if (weekendSessionsLaps?.length) {
      weekendSessionsLaps.forEach(({ sessionName, lapsByDriver: lbd }) => {
        [selA, selB].forEach(num => {
          if (!lapsByDriver[num]) lapsByDriver[num] = [];
          if (lbd[num]) lapsByDriver[num].push(...lbd[num].map(l=>({...l,_session:sessionName})));
        });
      });
    } else {
      [selA, selB].forEach(num => { lapsByDriver[num] = allDriverLaps[num] || []; });
    }
    const stats = {};
    [selA, selB].forEach(num => {
      const laps = lapsByDriver[num] || [];
      const times = laps.map(l=>l.lap_duration).filter(Boolean).sort((a,b)=>a-b);
      if (!times.length) return;
      const mean = times.reduce((s,t)=>s+t,0)/times.length;
      const stdev = Math.sqrt(times.reduce((s,t)=>s+Math.pow(t-mean,2),0)/times.length);
      const s1s = laps.filter(l=>l.duration_sector_1).map(l=>l.duration_sector_1);
      const s2s = laps.filter(l=>l.duration_sector_2).map(l=>l.duration_sector_2);
      const s3s = laps.filter(l=>l.duration_sector_3).map(l=>l.duration_sector_3);
      stats[num] = { best:times[0], mean, stdev, total:times.length,
        s1:s1s.length?Math.min(...s1s):null, s2:s2s.length?Math.min(...s2s):null, s3:s3s.length?Math.min(...s3s):null };
    });
    // Build chart data: interleave lap times
    const lapA = (lapsByDriver[selA]||[]).sort((a,b)=>a.lap_number-b.lap_number);
    const lapB = (lapsByDriver[selB]||[]).sort((a,b)=>a.lap_number-b.lap_number);
    const chartData = [];
    const maxN = Math.max(lapA.length, lapB.length);
    const step = Math.max(1, Math.floor(maxN/60));
    for (let i = 0; i < maxN; i += step) {
      chartData.push({ idx: i+1, A: lapA[i]?.lap_duration||null, B: lapB[i]?.lap_duration||null });
    }
    return { stats, chartData };
  }, [selA, selB, allDriverLaps, weekendSessionsLaps]);

  const colorA = getTeamColor(driverMap[selA]?.team_name);
  const colorB = getTeamColor(driverMap[selB]?.team_name);

  const StatRow = ({ label, valA, valB, fmtFn, lowerBetter=true }) => {
    if (valA == null && valB == null) return null;
    const better = lowerBetter ? (valA < valB ? 'A' : valB < valA ? 'B' : '=') : (valA > valB ? 'A' : valB > valA ? 'B' : '=');
    return (
      <div style={{display:'grid',gridTemplateColumns:'1fr 100px 1fr',gap:'6px',alignItems:'center',padding:'5px 0',borderBottom:'1px solid var(--border)'}}>
        <span style={{fontFamily:'var(--font-data)',fontSize:'12px',textAlign:'right',color: better==='A'?'var(--accent-green)':'var(--text-primary)',fontWeight:better==='A'?700:400}}>{fmtFn(valA)}</span>
        <span style={{fontFamily:'var(--font-head)',fontSize:'10px',letterSpacing:'1px',color:'var(--text-dim)',textAlign:'center',textTransform:'uppercase'}}>{label}</span>
        <span style={{fontFamily:'var(--font-data)',fontSize:'12px',textAlign:'left',color: better==='B'?'var(--accent-amber)':'var(--text-primary)',fontWeight:better==='B'?700:400}}>{fmtFn(valB)}</span>
      </div>
    );
  };

  return (
    <div>
      {/* Driver selector */}
      <div style={{display:'flex',gap:'12px',marginBottom:'14px',alignItems:'center',flexWrap:'wrap'}}>
        <div>
          <div style={{fontFamily:'var(--font-head)',fontSize:'9px',letterSpacing:'2px',color:'var(--accent-green)',marginBottom:'5px'}}>DRIVER A</div>
          <div style={{display:'flex',gap:'5px',flexWrap:'wrap'}}>
            {driverList.map(num => {
              const d = driverMap[num];
              return (
                <button key={num} className={`driver-pill ${selA===num?'sel-a':''}`}
                  style={{borderLeftColor:getTeamColor(d?.team_name)}}
                  onClick={()=>setSelA(selA===num?null:num)}>
                  {d?.last_name||`#${num}`}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{fontSize:'18px',color:'var(--text-dim)'}}>vs</div>
        <div>
          <div style={{fontFamily:'var(--font-head)',fontSize:'9px',letterSpacing:'2px',color:'var(--accent-amber)',marginBottom:'5px'}}>DRIVER B</div>
          <div style={{display:'flex',gap:'5px',flexWrap:'wrap'}}>
            {driverList.map(num => {
              const d = driverMap[num];
              return (
                <button key={num} className={`driver-pill ${selB===num?'sel-b':''}`}
                  onClick={()=>setSelB(selB===num?null:num)}>
                  {d?.last_name||`#${num}`}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {!selA || !selB ? (
        <div className="empty">Select two drivers to compare</div>
      ) : !comparison ? (
        <div className="empty">No data available for selected drivers</div>
      ) : (
        <div>
          {/* Names row */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 100px 1fr',marginBottom:'10px'}}>
            <div style={{textAlign:'right'}}>
              <div style={{fontFamily:'var(--font-head)',fontSize:'16px',fontWeight:700,color:colorA}}>{driverMap[selA]?.last_name}</div>
              <div style={{fontFamily:'var(--font-head)',fontSize:'10px',color:'var(--text-secondary)'}}>{driverMap[selA]?.team_name?.split(' ')[0]}</div>
            </div>
            <div style={{textAlign:'center',fontFamily:'var(--font-head)',fontSize:'10px',letterSpacing:'2px',color:'var(--text-dim)',paddingTop:'8px'}}>VS</div>
            <div style={{textAlign:'left'}}>
              <div style={{fontFamily:'var(--font-head)',fontSize:'16px',fontWeight:700,color:colorB}}>{driverMap[selB]?.last_name}</div>
              <div style={{fontFamily:'var(--font-head)',fontSize:'10px',color:'var(--text-secondary)'}}>{driverMap[selB]?.team_name?.split(' ')[0]}</div>
            </div>
          </div>

          {/* Stats */}
          <div style={{marginBottom:'14px'}}>
            <StatRow label="Best Lap" valA={comparison.stats[selA]?.best} valB={comparison.stats[selB]?.best} fmtFn={fmt} />
            <StatRow label="Avg Pace" valA={comparison.stats[selA]?.mean} valB={comparison.stats[selB]?.mean} fmtFn={fmt} />
            <StatRow label="Consistency ±" valA={comparison.stats[selA]?.stdev} valB={comparison.stats[selB]?.stdev} fmtFn={v=>v?`${v.toFixed(3)}s`:'—'} />
            <StatRow label="Best S1" valA={comparison.stats[selA]?.s1} valB={comparison.stats[selB]?.s1} fmtFn={v=>v?v.toFixed(3):'—'} />
            <StatRow label="Best S2" valA={comparison.stats[selA]?.s2} valB={comparison.stats[selB]?.s2} fmtFn={v=>v?v.toFixed(3):'—'} />
            <StatRow label="Best S3" valA={comparison.stats[selA]?.s3} valB={comparison.stats[selB]?.s3} fmtFn={v=>v?v.toFixed(3):'—'} />
            <StatRow label="Laps" valA={comparison.stats[selA]?.total} valB={comparison.stats[selB]?.total} fmtFn={v=>v||'—'} lowerBetter={false} />
          </div>

          {/* Lap time overlay chart */}
          {comparison.chartData.length > 0 && ResponsiveContainer && (
            <div style={{height:200}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparison.chartData} margin={{top:5,right:10,left:0,bottom:5}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="idx" stroke="var(--text-dim)" tick={{fill:'var(--text-dim)',fontSize:9,fontFamily:'var(--font-data)'}} label={{value:'Lap',position:'insideBottom',offset:-2,fill:'var(--text-dim)',fontSize:9}} />
                  <YAxis stroke="var(--text-dim)" tick={{fill:'var(--text-dim)',fontSize:9,fontFamily:'var(--font-data)'}} tickFormatter={fmt} width={64}
                    domain={[dataMin => Math.max(0, dataMin * 0.998), dataMax => dataMax * 1.002]} />
                  <Tooltip contentStyle={{background:'var(--bg-elevated)',border:'1px solid var(--border)',borderRadius:'4px'}}
                    formatter={(v,name) => [fmt(v), name==='A'?driverMap[selA]?.last_name:driverMap[selB]?.last_name]} />
                  <Line type="monotone" dataKey="A" stroke={colorA} dot={false} strokeWidth={2} name="A" />
                  <Line type="monotone" dataKey="B" stroke={colorB} dot={false} strokeWidth={2} name="B" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 5. PACE PROGRESSION (FP1→FP2→FP3→QUALI)
// ═══════════════════════════════════════════════════════════════
function PaceProgression({ weekendSessionsLaps, drivers }) {
  const driverMap = useMemo(() => {
    const m = {}; if (drivers) drivers.forEach(d => { m[d.driver_number] = d; }); return m;
  }, [drivers]);

  const { sessions, chartData, driverNums } = useMemo(() => {
    if (!weekendSessionsLaps?.length) return { sessions:[], chartData:[], driverNums:[] };
    const sessions = weekendSessionsLaps.map(s => s.sessionName);
    // Build: per driver, per session → best lap
    const allNums = new Set();
    const bestPerSession = weekendSessionsLaps.map(({ sessionName, lapsByDriver }) => {
      const bests = {};
      Object.entries(lapsByDriver).forEach(([num, laps]) => {
        const times = laps.map(l=>l.lap_duration).filter(Boolean);
        if (times.length) { bests[num] = Math.min(...times); allNums.add(parseInt(num)); }
      });
      return { session: sessionName, bests };
    });
    // Top 10 drivers by overall best lap
    const overallBest = {};
    allNums.forEach(num => {
      const times = bestPerSession.map(s=>s.bests[num]).filter(Boolean);
      if (times.length) overallBest[num] = Math.min(...times);
    });
    const top10 = Object.entries(overallBest).sort((a,b)=>a[1]-b[1]).map(x=>parseInt(x[0]));
    // Chart: x=session, y=best lap per driver
    const chartData = bestPerSession.map(({ session, bests }) => {
      const pt = { session };
      top10.forEach(num => { pt[num] = bests[num] || null; });
      return pt;
    });
    return { sessions, chartData, driverNums: top10 };
  }, [weekendSessionsLaps]);

  if (!chartData.length) return <div className="empty">Loading session data...</div>;
  const _RC = useRecharts();
  if (!_RC) return <div style={{padding:'32px 20px',textAlign:'center',color:'var(--t3)',fontSize:'12px',fontFamily:'var(--fh)',letterSpacing:'1px',textTransform:'uppercase'}}>⏳ Loading chart library…<div style={{fontSize:'10px',marginTop:'6px',color:'var(--t4)'}}>Recharts CDN</div></div>;
  const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, BarChart, Bar, ReferenceLine, Cell } = _RC;

  return (
    <div style={{height:280}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{top:5,right:16,left:0,bottom:5}}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="session" stroke="var(--text-dim)" tick={{fill:'var(--text-dim)',fontSize:10,fontFamily:'var(--font-head)',letterSpacing:'1px'}} />
          <YAxis stroke="var(--text-dim)" tick={{fill:'var(--text-dim)',fontSize:10,fontFamily:'var(--font-data)'}} tickFormatter={fmt} width={66}
            domain={[dataMin => Math.max(0, dataMin * 0.998), dataMax => dataMax * 1.002]} />
          <Tooltip contentStyle={{background:'var(--bg-elevated)',border:'1px solid var(--border)',borderRadius:'4px'}}
            labelStyle={{color:'var(--text-secondary)',fontFamily:'var(--font-head)',fontSize:'11px'}}
            itemStyle={{fontFamily:'var(--font-data)',fontSize:'10px'}}
            formatter={(v,name) => [fmt(v), driverMap[name]?.last_name || name]} />
          <Legend formatter={v => driverMap[v]?.last_name || v} wrapperStyle={{fontFamily:'var(--font-data)',fontSize:'10px',paddingTop:'6px'}} />
          {driverNums.map(num => {
            const d = driverMap[num];
            return <Line key={num} type="monotone" dataKey={num} stroke={getTeamColor(d?.team_name)} dot={{r:4,fill:getTeamColor(d?.team_name)}} strokeWidth={2} connectNulls />;
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 7. OVERTAKE PROBABILITY
// ═══════════════════════════════════════════════════════════════
function OvertakePanel({ positions, intervals, carData, drivers, stints }) {
  const driverMap = useMemo(() => {
    const m = {}; if (drivers) drivers.forEach(d => { m[d.driver_number] = d; }); return m;
  }, [drivers]);

  const overtakePairs = useMemo(() => {
    if (!positions?.length || !intervals?.length) return [];
    const latestPos = {};
    positions.forEach(p => { if (!latestPos[p.driver_number] || p.date > latestPos[p.driver_number].date) latestPos[p.driver_number] = p; });
    const sorted = Object.values(latestPos).sort((a,b)=>a.position-b.position);
    const latestIv = {};
    intervals.forEach(iv => { latestIv[iv.driver_number] = iv; });
    const latestStint = {};
    (stints||[]).forEach(s => { if (!latestStint[s.driver_number] || s.stint_number > latestStint[s.driver_number].stint_number) latestStint[s.driver_number] = s; });

    const pairs = [];
    for (let i = 0; i < Math.min(sorted.length-1, 10); i++) {
      const behind = sorted[i+1], ahead = sorted[i];
      const iv = latestIv[behind.driver_number];
      const gapToAhead = typeof iv?.gap_to_leader === 'number' && typeof latestIv[ahead.driver_number]?.gap_to_leader === 'number'
        ? Math.abs(iv.gap_to_leader - latestIv[ahead.driver_number].gap_to_leader)
        : null;
      const carBehind = carData?.[behind.driver_number];
      const carAhead = carData?.[ahead.driver_number];
      const speedDelta = (carBehind?.speed && carAhead?.speed) ? carBehind.speed - carAhead.speed : null;
      const drsOpen = carBehind?.drs >= 10;
      const tyreAdvantage = (() => {
        const sB = latestStint[behind.driver_number], sA = latestStint[ahead.driver_number];
        if (!sB || !sA) return 0;
        const compOrder = ['S','M','H'];
        const iB = compOrder.indexOf(sB.compound?.charAt(0)||'H');
        const iA = compOrder.indexOf(sA.compound?.charAt(0)||'H');
        return iB > iA ? -1 : iB < iA ? 1 : 0; // fresher/softer = advantage
      })();

      // Score 0-100
      let score = 0;
      if (gapToAhead != null) {
        if (gapToAhead < 0.5) score += 40; else if (gapToAhead < 1.0) score += 25; else if (gapToAhead < 2.0) score += 10;
      }
      if (drsOpen) score += 25;
      if (speedDelta != null && speedDelta > 5) score += Math.min(20, speedDelta/2);
      if (tyreAdvantage > 0) score += 15;
      score = Math.min(99, Math.round(score));

      const dBehind = driverMap[behind.driver_number];
      const dAhead = driverMap[ahead.driver_number];
      pairs.push({
        pos: i+1, behindNum: behind.driver_number, aheadNum: ahead.driver_number,
        behindName: dBehind?.last_name||`#${behind.driver_number}`,
        aheadName: dAhead?.last_name||`#${ahead.driver_number}`,
        behindColor: getTeamColor(dBehind?.team_name),
        aheadColor: getTeamColor(dAhead?.team_name),
        score, gapToAhead: gapToAhead?.toFixed(3), drsOpen, speedDelta: speedDelta?.toFixed(0), tyreAdvantage,
      });
    }
    return pairs.sort((a,b)=>b.score-a.score).slice(0,6);
  }, [positions, intervals, carData, drivers, stints]);

  if (!overtakePairs.length) return <div className="empty">Awaiting live race data...</div>;

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
      {overtakePairs.map((pair, i) => {
        const cls = pair.score >= 60 ? 'ot-high' : pair.score >= 35 ? 'ot-med' : 'ot-low';
        return (
          <div key={i} className="ot-row">
            <div className={`ot-prob ${cls}`}>{pair.score}%</div>
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:'5px',marginBottom:'3px'}}>
                <span style={{fontFamily:'var(--font-head)',fontSize:'12px',fontWeight:700,color:pair.behindColor}}>{pair.behindName}</span>
                <span style={{fontFamily:'var(--font-head)',fontSize:'10px',color:'var(--text-dim)'}}>attacks</span>
                <span style={{fontFamily:'var(--font-head)',fontSize:'12px',fontWeight:700,color:pair.aheadColor}}>{pair.aheadName}</span>
              </div>
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                {pair.gapToAhead && <span style={{fontFamily:'var(--font-data)',fontSize:'10px',color:'var(--text-secondary)'}}>Gap:{pair.gapToAhead}s</span>}
                {pair.drsOpen && <span style={{fontFamily:'var(--font-head)',fontSize:'10px',color:'var(--accent-green)',letterSpacing:'1px'}}>DRS✓</span>}
                {pair.speedDelta > 0 && <span style={{fontFamily:'var(--font-data)',fontSize:'10px',color:'var(--text-secondary)'}}>+{pair.speedDelta}km/h</span>}
                {pair.tyreAdvantage > 0 && <span style={{fontFamily:'var(--font-head)',fontSize:'10px',color:'var(--accent-amber)'}}>TYRE ADV</span>}
              </div>
            </div>
            <div style={{height:'4px',width:'60px',background:'var(--border)',borderRadius:'2px',overflow:'hidden',alignSelf:'center'}}>
              <div style={{height:'100%',width:`${pair.score}%`,background:pair.score>=60?'var(--accent-red)':pair.score>=35?'var(--accent-amber)':'#555',borderRadius:'2px'}}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 8. WEATHER WIDGET (OpenWeatherMap)
// ═══════════════════════════════════════════════════════════════
function WeatherWidget({ meeting, owmKey }) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!owmKey || !meeting) return;
    setLoading(true); setError(null);
    const { country_code, location } = meeting;
    fetch(`${OWM_BASE}/forecast?q=${encodeURIComponent(location)}&appid=${owmKey}&units=metric&cnt=6`)
      .then(r => { if (!r.ok) throw new Error(`OWM ${r.status}`); return r.json(); })
      .then(d => { setForecast(d); setLoading(false); })
      .catch(e => { setError('Weather unavailable'); setLoading(false); });
  }, [owmKey, meeting]);

  if (!owmKey) return (
    <div style={{padding:'10px',textAlign:'center'}}>
      <div style={{fontFamily:'var(--font-head)',fontSize:'10px',letterSpacing:'2px',color:'var(--text-dim)',marginBottom:'6px'}}>ENTER OWM KEY FOR FORECAST</div>
      <div style={{fontSize:'11px',color:'var(--text-secondary)',fontFamily:'var(--font-body)'}}>Free at openweathermap.org/api</div>
    </div>
  );
  if (loading) return <div className="loading" style={{padding:'20px'}}><div className="spin"/>Loading forecast...</div>;
  if (error || !forecast?.list) return <div style={{fontSize:'11px',color:'var(--text-secondary)',fontFamily:'var(--font-head)',letterSpacing:'1px',textAlign:'center',padding:'10px'}}>{error||'No forecast data'}</div>;

  const periods = forecast.list.slice(0,6);
  const rainChances = periods.map(p => Math.round((p.pop||0)*100));
  const maxRainChance = Math.max(...rainChances);

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
        <div style={{fontFamily:'var(--font-head)',fontSize:'11px',letterSpacing:'1px',color:'var(--text-secondary)'}}>{forecast.city?.name}</div>
        {maxRainChance >= 40 && (
          <div style={{fontFamily:'var(--font-head)',fontSize:'10px',letterSpacing:'1px',color:'var(--accent-blue)',animation:'pulse-blue 1.5s infinite'}}>
            🌧 RAIN RISK {maxRainChance}%
          </div>
        )}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'4px'}}>
        {periods.map((p,i) => {
          const time = new Date(p.dt*1000).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
          const temp = Math.round(p.main?.temp);
          const rain = Math.round((p.pop||0)*100);
          const icon = p.weather?.[0]?.main;
          const emoji = icon?.includes('Rain')?'🌧':icon?.includes('Cloud')?'☁️':icon?.includes('Snow')?'❄️':'☀️';
          return (
            <div key={i} style={{background:'var(--bg-elevated)',borderRadius:'4px',padding:'7px 4px',textAlign:'center',borderTop:`2px solid ${rain>=60?'var(--accent-blue)':rain>=30?'var(--accent-amber)':'var(--border)'}`}}>
              <div style={{fontFamily:'var(--font-head)',fontSize:'9px',color:'var(--text-dim)',letterSpacing:'1px'}}>{time}</div>
              <div style={{fontSize:'18px',margin:'3px 0'}}>{emoji}</div>
              <div style={{fontFamily:'var(--font-data)',fontSize:'11px',fontWeight:700}}>{temp}°C</div>
              {rain > 0 && <div style={{fontFamily:'var(--font-head)',fontSize:'9px',color:'var(--accent-blue)',letterSpacing:'1px'}}>{rain}%</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 9. DRIVER PERFORMANCE RATINGS
// ═══════════════════════════════════════════════════════════════
function PerformanceRatings({ weekendSessionsLaps, qualiLaps, drivers }) {
  const driverMap = useMemo(() => {
    const m = {}; if (drivers) drivers.forEach(d => { m[d.driver_number] = d; }); return m;
  }, [drivers]);

  const ratings = useMemo(() => {
    if (!weekendSessionsLaps?.length) return [];
    // Merge all practice laps
    const merged = {};
    weekendSessionsLaps.filter(s => !s.sessionName?.toLowerCase().includes('qualif')).forEach(({ lapsByDriver }) => {
      Object.entries(lapsByDriver).forEach(([num, laps]) => {
        if (!merged[num]) merged[num] = [];
        merged[num].push(...laps);
      });
    });
    // Quali bests
    const qBest = {};
    qualiLaps.forEach(l => { if (l.lap_duration && (!qBest[l.driver_number] || l.lap_duration < qBest[l.driver_number])) qBest[l.driver_number] = l.lap_duration; });
    const qualiGrid = Object.entries(qBest).sort((a,b)=>a[1]-b[1]);
    const pole = qualiGrid[0]?.[1] || 1;
    const qualiRank = {};
    qualiGrid.forEach(([num,t],i) => { qualiRank[num] = { pos: i+1, time: t, gapPct: (t-pole)/pole*100 }; });
    // Team pace (average long run by team)
    const teamPace = {};
    Object.entries(merged).forEach(([num, laps]) => {
      const d = driverMap[parseInt(num)];
      const team = d?.team_name;
      if (!team) return;
      const times = laps.slice(4).map(l=>l.lap_duration).filter(Boolean);
      if (!times.length) return;
      const avg = times.reduce((s,t)=>s+t,0)/times.length;
      if (!teamPace[team]) teamPace[team] = [];
      teamPace[team].push(avg);
    });
    const teamAvg = {};
    Object.entries(teamPace).forEach(([team, avgs]) => { teamAvg[team] = avgs.reduce((s,t)=>s+t,0)/avgs.length; });
    const allTeamAvgs = Object.values(teamAvg).filter(Boolean);
    const bestTeamPace = allTeamAvgs.length ? Math.min(...allTeamAvgs) : 1;

    const result = [];
    Object.entries(merged).forEach(([num, laps]) => {
      const d = driverMap[parseInt(num)];
      if (!d) return;
      const times = laps.map(l=>l.lap_duration).filter(Boolean).sort((a,b)=>a-b);
      if (!times.length) return;
      const mean = times.reduce((s,t)=>s+t,0)/times.length;
      const stdev = Math.sqrt(times.reduce((s,t)=>s+Math.pow(t-mean,2),0)/times.length);
      const longRunTimes = laps.slice(4).map(l=>l.lap_duration).filter(Boolean);
      const longRunPace = longRunTimes.length >= 3 ? longRunTimes.reduce((s,t)=>s+t,0)/longRunTimes.length : null;
      const tPace = teamAvg[d.team_name];

      // 1. Qualifying extraction: how close to pole relative to expected car pace
      const q = qualiRank[num];
      const qualScore = q ? Math.max(0, 100 - q.gapPct * 25) : null;
      // 2. Race pace score: long run pace vs best car
      const paceScore = longRunPace ? Math.max(0, 100 - (longRunPace - bestTeamPace) / bestTeamPace * 1000) : null;
      // 3. Consistency: lower stdev = better
      const maxStdev = 2.0;
      const consistencyScore = Math.max(0, 100 - (stdev/maxStdev)*100);
      // 4. vs Teammate: comparing to team average pace
      const vsTmScore = (longRunPace && tPace) ? Math.max(0, 100 - (longRunPace - tPace) / tPace * 500) : null;

      const overall = [qualScore, paceScore, consistencyScore, vsTmScore].filter(Boolean);
      const overallScore = overall.length ? Math.round(overall.reduce((s,x)=>s+x,0)/overall.length) : null;

      result.push({
        num: parseInt(num), name: d.last_name || d.full_name?.split(' ').pop(), fullName: d.full_name, team: d.team_name,
        qualScore: qualScore ? Math.round(qualScore) : null,
        paceScore: paceScore ? Math.round(paceScore) : null,
        consistencyScore: Math.round(consistencyScore),
        vsTmScore: vsTmScore ? Math.round(vsTmScore) : null,
        overallScore, qualiPos: q?.pos, totalLaps: laps.length,
      });
    });
    return result.filter(r=>r.overallScore != null).sort((a,b)=>b.overallScore-a.overallScore);
  }, [weekendSessionsLaps, qualiLaps, drivers, driverMap]);

  if (!ratings.length) return <div className="empty">Loading performance data...</div>;

  const RatingBar = ({ value, color }) => (
    <div className="rating-bar" style={{width:'80px'}}>
      <div className="rating-fill" style={{width:`${value||0}%`, background: color || (value>=80?'var(--accent-green)':value>=60?'var(--accent-amber)':'#e07070')}} />
    </div>
  );

  return (
    <div style={{overflowX:'auto'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontFamily:'var(--font-head)',fontSize:'11px'}}>
        <thead>
          <tr style={{fontSize:'9px',letterSpacing:'2px',color:'var(--text-dim)',textTransform:'uppercase',borderBottom:'1px solid var(--border)'}}>
            <th style={{padding:'5px 8px',textAlign:'left'}}>#</th>
            <th style={{padding:'5px 8px',textAlign:'left'}}>Driver</th>
            <th style={{padding:'5px 8px',textAlign:'center'}}>Overall</th>
            <th style={{padding:'5px 8px',textAlign:'center'}}>Quali</th>
            <th style={{padding:'5px 8px',textAlign:'center'}}>Race Pace</th>
            <th style={{padding:'5px 8px',textAlign:'center'}}>Consistency</th>
            <th style={{padding:'5px 8px',textAlign:'center'}}>vs Teammate</th>
          </tr>
        </thead>
        <tbody>
          {ratings.map((r,i) => {
            const color = getTeamColor(r.team);
            const medal = i===0?'🥇':i===1?'🥈':i===2?'🥉':'';
            return (
              <tr key={r.num} style={{borderBottom:'1px solid var(--border)',borderLeft:`3px solid ${color}`}}>
                <td style={{padding:'6px 8px',color:'var(--text-dim)',fontFamily:'var(--font-data)',fontSize:'11px'}}>{medal||i+1}</td>
                <td style={{padding:'6px 8px'}}>
                  <div style={{fontWeight:700,fontSize:'12px'}}>{r.name}</div>
                  <div style={{fontSize:'9px',color:'var(--text-secondary)',letterSpacing:'1px'}}>{r.team?.split(' ')[0]}</div>
                </td>
                <td style={{padding:'6px 8px',textAlign:'center'}}>
                  <div style={{fontFamily:'var(--font-data)',fontSize:'14px',fontWeight:700,color:r.overallScore>=80?'var(--accent-green)':r.overallScore>=60?'var(--accent-amber)':'#e07070'}}>{r.overallScore}</div>
                </td>
                <td style={{padding:'6px 8px',textAlign:'center'}}>
                  <div>{r.qualScore ?? '—'}</div>
                  {r.qualScore != null && <RatingBar value={r.qualScore} />}
                </td>
                <td style={{padding:'6px 8px',textAlign:'center'}}>
                  <div>{r.paceScore ?? '—'}</div>
                  {r.paceScore != null && <RatingBar value={r.paceScore} />}
                </td>
                <td style={{padding:'6px 8px',textAlign:'center'}}>
                  <div>{r.consistencyScore}</div>
                  <RatingBar value={r.consistencyScore} />
                </td>
                <td style={{padding:'6px 8px',textAlign:'center'}}>
                  <div>{r.vsTmScore ?? '—'}</div>
                  {r.vsTmScore != null && <RatingBar value={r.vsTmScore} />}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── WEATHER STRIP ─────────────────────────────────────────────
function WeatherStrip({ weather }) {
  const dirs = ['N','NE','E','SE','S','SW','W','NW'];
  const dir = weather?.wind_direction != null ? dirs[Math.round(weather.wind_direction/45)%8] : null;
  return (
    <div className="weather-strip">
      <div style={{fontFamily:'var(--font-head)',fontSize:'9px',letterSpacing:'2px',color:'var(--text-dim)',marginRight:'4px'}}>LIVE WEATHER</div>
      {[
        ['🌡 Track', weather?.track_temperature != null ? `${weather.track_temperature}°C` : '—'],
        ['Air', weather?.air_temperature != null ? `${weather.air_temperature}°C` : '—'],
        ['💨', weather?.wind_speed != null ? `${weather.wind_speed}km/h ${dir||''}` : '—'],
        ['💧', weather?.humidity != null ? `${weather.humidity}%` : '—'],
        ['hPa', weather?.pressure != null ? `${weather.pressure}` : '—'],
      ].map(([label, val]) => (
        <div key={label} className="w-item">
          <span className="w-label">{label}</span>
          <span className="w-value">{val}</span>
        </div>
      ))}
      {weather?.rainfall
        ? <span className="w-rain">🌧 RAIN</span>
        : weather ? <span style={{fontFamily:'var(--font-head)',fontSize:'10px',color:'var(--text-dim)',letterSpacing:'1px'}}>☀️ DRY</span>
        : <span style={{fontFamily:'var(--font-head)',fontSize:'10px',color:'var(--text-dim)',letterSpacing:'1px'}}>Awaiting weather...</span>}
    </div>
  );
}

// ─── RACE CONTROL ──────────────────────────────────────────────
function RaceControl({ messages }) {
  function cat(m) {
    const t = (m.message||'').toLowerCase(), f = m.flag;
    if (f==='RED'||t.includes('red flag')) return {cls:'rc-red',icon:'🔴'};
    if (f==='YELLOW'||t.includes('yellow')) return {cls:'rc-yellow',icon:'🟡'};
    if (t.includes('safety car')||t.includes('vsc')||f==='SC') return {cls:'rc-sc',icon:'🟠'};
    if (t.includes('penalty')||t.includes('investigation')||t.includes('noted')) return {cls:'rc-penalty',icon:'🟣'};
    return {cls:'',icon:'⚪'};
  }
  if (!messages?.length) return <div className="empty">No race control messages yet</div>;
  return (
    <div className="rc-feed">
      {messages.slice(0,20).map((m,i) => {
        const {cls,icon} = cat(m);
        return (
          <div key={i} className={`rc-msg ${cls}`}>
            <span style={{fontSize:'14px'}}>{icon}</span>
            <div style={{flex:1}}>
              <div style={{fontFamily:'var(--font-data)',fontSize:'10px',color:'var(--text-dim)'}}>{m.date?new Date(m.date).toLocaleTimeString():''} {m.lap_number?`LAP ${m.lap_number}`:''}</div>
              <div style={{fontSize:'12px',lineHeight:1.4}}>{m.message}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── PIT TRACKER ───────────────────────────────────────────────
function PitTracker({ pits, drivers, stints, currentLap }) {
  const driverMap = useMemo(() => { const m={}; drivers?.forEach(d=>{m[d.driver_number]=d;}); return m; }, [drivers]);
  const pitsByDriver = useMemo(() => { const m={}; pits?.forEach(p=>{if(!m[p.driver_number])m[p.driver_number]=[];m[p.driver_number].push(p);}); return m; }, [pits]);
  const latestStint = useMemo(() => { const m={}; stints?.forEach(s=>{if(!m[s.driver_number]||s.stint_number>m[s.driver_number].stint_number)m[s.driver_number]=s;}); return m; }, [stints]);
  const nums = Object.keys(pitsByDriver).length ? Object.keys(pitsByDriver) : (drivers?.map(d=>d.driver_number).slice(0,22)||[]);
  if (!nums.length) return <div className="empty">No pit data yet</div>;
  return (
    <div className="pit-grid">
      {nums.map(num => {
        const d = driverMap[num], stops = pitsByDriver[num]||[], stint = latestStint[num];
        const laps = stint&&currentLap ? currentLap-(stint.lap_start||0) : null;
        const warn = laps && laps >= 15;
        return (
          <div key={num} className={`pit-card ${warn?'warn':''}`} style={{borderLeftColor:getTeamColor(d?.team_name)}}>
            <div style={{fontFamily:'var(--font-head)',fontSize:'11px',fontWeight:700}}>{d?.last_name||`#${num}`}</div>
            <div style={{fontFamily:'var(--font-data)',fontSize:'18px',fontWeight:700}}>{stops.length}<span style={{fontSize:'10px',color:'var(--text-dim)',fontWeight:400}}> stops</span></div>
            {stops.length > 0 && <div style={{fontFamily:'var(--font-head)',fontSize:'10px',color:'var(--text-secondary)'}}>Last: {stops[stops.length-1].pit_duration?`${Number(stops[stops.length-1].pit_duration).toFixed(1)}s`:'—'}</div>}
            {laps != null && <div style={{fontFamily:'var(--font-head)',fontSize:'10px',color:warn?'var(--accent-amber)':'var(--text-secondary)'}}>{laps} on tyre</div>}
          </div>
        );
      })}
    </div>
  );
}

// ─── TIMING TOWER ──────────────────────────────────────────────
function TimingTower({ positions, intervals, drivers, stints, pits }) {
  const prevRef = useRef({});
  const driverMap = useMemo(() => { const m={}; drivers?.forEach(d=>{m[d.driver_number]=d;}); return m; }, [drivers]);
  const ivMap = useMemo(() => { const m={}; intervals?.forEach(iv=>{m[iv.driver_number]=iv;}); return m; }, [intervals]);
  const stintMap = useMemo(() => { const m={}; stints?.forEach(s=>{if(!m[s.driver_number]||s.stint_number>m[s.driver_number].stint_number)m[s.driver_number]=s;}); return m; }, [stints]);
  const pitMap = useMemo(() => { const m={}; pits?.forEach(p=>{m[p.driver_number]=(m[p.driver_number]||0)+1;}); return m; }, [pits]);
  const sorted = useMemo(() => {
    if (!positions?.length) return [];
    const latest={};
    positions.forEach(p=>{if(!latest[p.driver_number]||p.date>latest[p.driver_number].date)latest[p.driver_number]=p;});
    return Object.values(latest).sort((a,b)=>a.position-b.position);
  }, [positions]);

  return (
    <div>
      <div className="tower-row tower-header">
        <span>POS</span><span>#</span><span>DRIVER</span><span>GAP</span><span>TYRE</span><span>STOPS</span><span></span>
      </div>
      {sorted.length ? sorted.map(p => {
        const d=driverMap[p.driver_number], iv=ivMap[p.driver_number], stint=stintMap[p.driver_number];
        const stops=pitMap[p.driver_number]||0, color=getTeamColor(d?.team_name);
        const prev=prevRef.current[p.driver_number];
        const delta = prev!==undefined ? prev-p.position : 0;
        prevRef.current[p.driver_number]=p.position;
        const gap = p.position===1?'LEADER':(iv?fmtGap(iv.gap_to_leader):'—');
        const tyre = stint?.compound?.charAt(0)||'?';
        return (
          <div key={p.driver_number} className={`tower-row ${delta>0?'pos-gained':delta<0?'pos-lost':''}`} style={{borderLeftColor:color}}>
            <span style={{fontFamily:'var(--font-data)',fontSize:'14px',fontWeight:700}}>{p.position}</span>
            <span style={{fontFamily:'var(--font-data)',fontSize:'11px',color:'var(--text-secondary)'}}>{p.driver_number}</span>
            <div>
              <div style={{fontFamily:'var(--font-head)',fontSize:'13px',fontWeight:600}}>{d?d.last_name||d.full_name?.split(' ').pop()||p.driver_number:`#${p.driver_number}`}</div>
              <div style={{fontFamily:'var(--font-head)',fontSize:'9px',color:'var(--text-dim)',letterSpacing:'1px'}}>{d?.team_name?.split(' ')[0]}</div>
            </div>
            <span style={{fontFamily:'var(--font-data)',fontSize:'12px',color:'var(--accent-green)'}}>{gap}</span>
            <span className={`tyre-badge tyre-${tyre}`}>{tyre}{stint?.lap_start?` L${stint.lap_start}`:''}</span>
            <span style={{fontFamily:'var(--font-data)',color:'var(--text-secondary)',fontSize:'12px'}}>{stops}</span>
            <span style={{fontFamily:'var(--font-head)',fontSize:'11px',color:delta>0?'var(--accent-green)':delta<0?'var(--accent-red)':'transparent',fontWeight:700}}>{delta>0?`▲${delta}`:delta<0?`▼${Math.abs(delta)}`:''}</span>
          </div>
        );
      }) : <div className="empty">Awaiting live position data...</div>}
    </div>
  );
}

// ─── LAP TIME CHART ────────────────────────────────────────────
function LapTimeChart({ allDriverLaps, drivers }) {
  const driverMap = useMemo(() => { const m={}; drivers?.forEach(d=>{m[d.driver_number]=d;}); return m; }, [drivers]);

  const allNums = useMemo(() =>
    Object.entries(allDriverLaps||{}).map(([num,laps])=>({num,count:laps.length})).sort((a,b)=>b.count-a.count).map(x=>x.num)
  , [allDriverLaps]);

  const [selected, setSelected] = useState(new Set());
  const [showAll, setShowAll] = useState(true);
  const [lapFrom, setLapFrom] = useState('');
  const [lapTo, setLapTo] = useState('');

  useEffect(() => { setSelected(new Set()); setShowAll(true); setLapFrom(''); setLapTo(''); }, [allNums.join(',')]);

  const activeNums = showAll ? allNums : allNums.filter(n => selected.has(n));

  const toggleDriver = (num) => {
    if (showAll) { setShowAll(false); setSelected(new Set([num])); }
    else {
      setSelected(prev => {
        const next = new Set(prev);
        if (next.has(num)) { next.delete(num); if (!next.size) setShowAll(true); }
        else next.add(num);
        return next;
      });
    }
  };

  // Full chart data (all laps)
  const { allChartData, maxLap } = useMemo(() => {
    if (!allDriverLaps || !activeNums.length) return { allChartData:[], maxLap:0 };
    const byLap = {};
    activeNums.forEach(num => {
      (allDriverLaps[num]||[]).forEach(lap => {
        if (!lap.lap_duration) return;
        if (!byLap[lap.lap_number]) byLap[lap.lap_number] = { lap: lap.lap_number };
        byLap[lap.lap_number][num] = lap.lap_duration;
      });
    });
    const sorted = Object.values(byLap).sort((a,b)=>a.lap-b.lap);
    return { allChartData: sorted, maxLap: sorted.length ? sorted[sorted.length-1].lap : 0 };
  }, [allDriverLaps, activeNums]);

  // Apply lap window filter
  const from = lapFrom !== '' ? parseInt(lapFrom) : 1;
  const to   = lapTo   !== '' ? parseInt(lapTo)   : maxLap;
  const chartData = allChartData.filter(d => d.lap >= from && d.lap <= to);

  // Y axis domain from visible data only
  const { yMin, yMax } = useMemo(() => {
    const allT = [];
    chartData.forEach(row => activeNums.forEach(num => { if (row[num]) allT.push(row[num]); }));
    if (!allT.length) return { yMin: 0, yMax: 120 };
    const s = [...allT].sort((a,b)=>a-b);
    const pad = Math.max((s[s.length-1]-s[0])*0.15, 1.0);
    return { yMin: s[0]-pad, yMax: s[s.length-1]+pad };
  }, [chartData, activeNums]);

  if (!allNums.length) return <div className="empty">No lap data available</div>;
  const _RC = useRecharts();
  if (!_RC) return <div style={{padding:'32px 20px',textAlign:'center',color:'var(--t3)',fontSize:'12px',fontFamily:'var(--fh)',letterSpacing:'1px',textTransform:'uppercase'}}>⏳ Loading chart library…<div style={{fontSize:'10px',marginTop:'6px',color:'var(--t4)'}}>Recharts CDN</div></div>;
  const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, BarChart, Bar, ReferenceLine, Cell } = _RC;

  const inputStyle = {
    width:'54px', padding:'3px 6px', background:'var(--bg-secondary)', border:'1px solid var(--border)',
    borderRadius:'3px', color:'var(--text-primary)', fontFamily:'var(--font-data)', fontSize:'11px',
    outline:'none', textAlign:'center',
  };

  return (
    <div>
      {/* ── Driver filter pills ── */}
      <div style={{display:'flex',flexWrap:'wrap',gap:'5px',marginBottom:'10px',alignItems:'center'}}>
        <button onClick={() => { setShowAll(true); setSelected(new Set()); }}
          style={{
            padding:'3px 10px', fontFamily:'var(--font-head)', fontSize:'10px', fontWeight:700,
            letterSpacing:'1.5px', textTransform:'uppercase', cursor:'pointer', borderRadius:'3px',
            border: showAll ? '1px solid var(--accent-green)' : '1px solid var(--border)',
            background: showAll ? 'rgba(0,210,190,.12)' : 'var(--bg-elevated)',
            color: showAll ? 'var(--accent-green)' : 'var(--text-secondary)', transition:'all .15s',
          }}>ALL</button>
        <div style={{width:'1px',height:'18px',background:'var(--border)',margin:'0 2px'}}/>
        {allNums.map(num => {
          const d = driverMap[num];
          const color = getTeamColor(d?.team_name);
          const isActive = showAll || selected.has(num);
          return (
            <button key={num} onClick={() => toggleDriver(num)}
              style={{
                padding:'3px 9px', fontFamily:'var(--font-head)', fontSize:'10px', fontWeight:700,
                letterSpacing:'1px', cursor:'pointer', borderRadius:'3px', transition:'all .15s',
                border: isActive ? `1px solid ${color}` : '1px solid var(--border)',
                background: isActive ? `${color}22` : 'var(--bg-elevated)',
                color: isActive ? color : 'var(--text-dim)',
              }}>
              {d?.name_acronym || d?.last_name || `#${num}`}
            </button>
          );
        })}
      </div>

      {/* ── Lap window controls ── */}
      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px',flexWrap:'wrap'}}>
        <span style={{fontFamily:'var(--font-head)',fontSize:'10px',letterSpacing:'2px',color:'var(--text-dim)',textTransform:'uppercase'}}>Lap Window</span>
        <input style={inputStyle} type="number" min="1" max={maxLap} placeholder="1"
          value={lapFrom} onChange={e => setLapFrom(e.target.value)} />
        <span style={{fontFamily:'var(--font-head)',fontSize:'11px',color:'var(--text-dim)'}}>→</span>
        <input style={inputStyle} type="number" min="1" max={maxLap} placeholder={maxLap||'—'}
          value={lapTo} onChange={e => setLapTo(e.target.value)} />
        {(lapFrom !== '' || lapTo !== '') && (
          <button onClick={() => { setLapFrom(''); setLapTo(''); }}
            style={{padding:'3px 8px',fontFamily:'var(--font-head)',fontSize:'9px',fontWeight:700,
              letterSpacing:'1px',cursor:'pointer',borderRadius:'3px',border:'1px solid var(--border)',
              background:'var(--bg-elevated)',color:'var(--text-secondary)',transition:'all .15s'}}>
            RESET
          </button>
        )}
        {maxLap > 0 && (
          <span style={{fontFamily:'var(--font-data)',fontSize:'10px',color:'var(--text-dim)',marginLeft:'4px'}}>
            {chartData.length} laps shown
            {(lapFrom !== '' || lapTo !== '') && ` (${from}–${Math.min(to, maxLap)} of ${maxLap})`}
          </span>
        )}
        {/* Quick zoom buttons */}
        {maxLap >= 20 && (
          <div style={{display:'flex',gap:'4px',marginLeft:'4px'}}>
            {[['First 10','1','10'],['Last 10',String(Math.max(1,maxLap-9)),String(maxLap)],['First half','1',String(Math.floor(maxLap/2))],['Second half',String(Math.floor(maxLap/2)+1),String(maxLap)]].map(([label,f,t])=>(
              <button key={label} onClick={()=>{setLapFrom(f);setLapTo(t);}}
                style={{padding:'2px 7px',fontFamily:'var(--font-head)',fontSize:'9px',fontWeight:700,
                  letterSpacing:'1px',cursor:'pointer',borderRadius:'3px',border:'1px solid var(--border)',
                  background:'var(--bg-elevated)',color:'var(--text-dim)',transition:'all .15s',whiteSpace:'nowrap'}}>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Chart ── */}
      {chartData.length ? (
        <div style={{height:320}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{top:5,right:16,left:0,bottom:20}}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="lap" stroke="var(--text-dim)"
                tick={{fill:'var(--text-dim)',fontSize:10,fontFamily:'var(--font-data)'}}
                label={{value:'Lap',position:'insideBottom',offset:-10,fill:'var(--text-dim)',fontSize:10}}
                domain={[from, Math.min(to, maxLap)]} type="number" />
              <YAxis stroke="var(--text-dim)"
                tick={{fill:'var(--text-dim)',fontSize:10,fontFamily:'var(--font-data)'}}
                tickFormatter={fmt} width={66} domain={[yMin, yMax]} tickCount={6} />
              <Tooltip
                contentStyle={{background:'var(--bg-elevated)',border:'1px solid var(--border)',borderRadius:'4px'}}
                labelStyle={{color:'var(--text-secondary)',fontFamily:'var(--font-head)',fontSize:'11px'}}
                itemStyle={{fontFamily:'var(--font-data)',fontSize:'10px'}}
                formatter={(v,name) => [fmt(v), driverMap[name]?.last_name||name]}
                labelFormatter={l=>`Lap ${l}`}
                itemSorter={item => item.value} />
              {activeNums.length <= 6 && (
                <Legend formatter={v => driverMap[v]?.last_name||v}
                  wrapperStyle={{fontFamily:'var(--font-data)',fontSize:'10px',paddingTop:'8px'}} />
              )}
              {activeNums.map(num => (
                <Line key={num} type="monotone" dataKey={num}
                  stroke={getTeamColor(driverMap[num]?.team_name)}
                  dot={activeNums.length <= 3 && chartData.length <= 30
                    ? {r:3,fill:getTeamColor(driverMap[num]?.team_name)} : false}
                  strokeWidth={activeNums.length <= 3 ? 2.5 : activeNums.length <= 6 ? 2 : 1.5}
                  connectNulls={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="empty">No laps in selected window</div>
      )}

      {!showAll && selected.size > 0 && (
        <div style={{marginTop:'8px',fontFamily:'var(--font-head)',fontSize:'10px',color:'var(--text-dim)',letterSpacing:'1px'}}>
          {selected.size} driver{selected.size>1?'s':''} selected · click ALL to reset
        </div>
      )}
    </div>
  );
}

// ─── SECTOR ANALYSIS ───────────────────────────────────────────
function SectorAnalysis({ allDriverLaps, drivers }) {
  const driverMap = useMemo(() => { const m={}; drivers?.forEach(d=>{m[d.driver_number]=d;}); return m; }, [drivers]);
  const rows = useMemo(() => {
    if (!allDriverLaps) return [];
    return Object.entries(allDriverLaps).map(([num,laps]) => {
      const s1s=laps.filter(l=>l.duration_sector_1).map(l=>l.duration_sector_1);
      const s2s=laps.filter(l=>l.duration_sector_2).map(l=>l.duration_sector_2);
      const s3s=laps.filter(l=>l.duration_sector_3).map(l=>l.duration_sector_3);
      const d=driverMap[num];
      return { num, name:d?.last_name||d?.full_name?.split(' ').pop()||`#${num}`, color:getTeamColor(d?.team_name),
        s1:s1s.length?Math.min(...s1s):null, s2:s2s.length?Math.min(...s2s):null, s3:s3s.length?Math.min(...s3s):null };
    }).filter(d=>d.s1||d.s2||d.s3).sort((a,b)=>{
      const tA = (a.s1||999)+(a.s2||999)+(a.s3||999);
      const tB = (b.s1||999)+(b.s2||999)+(b.s3||999);
      return tA - tB;
    });
  }, [allDriverLaps, driverMap]);
  if (!rows.length) return <div className="empty">No sector data</div>;
  const minS1=Math.min(...rows.map(d=>d.s1||99).filter(x=>x<99));
  const minS2=Math.min(...rows.map(d=>d.s2||99).filter(x=>x<99));
  const minS3=Math.min(...rows.map(d=>d.s3||99).filter(x=>x<99));
  const maxS1=Math.max(...rows.map(d=>d.s1||0));
  const maxS2=Math.max(...rows.map(d=>d.s2||0));
  const maxS3=Math.max(...rows.map(d=>d.s3||0));
  function cls(v,min,max){ if(!v)return''; const p=(v-min)/(max-min||1); return p<.15?'s-best':p<.5?'s-mid':'s-slow'; }
  return (
    <div style={{overflowX:'auto'}}>
      <table className="sector-table">
        <thead><tr><th style={{textAlign:'left'}}>Driver</th><th>Sector 1</th><th>Sector 2</th><th>Sector 3</th><th>Theoretical</th></tr></thead>
        <tbody>
          {rows.map(d => {
            const theo=(d.s1||0)+(d.s2||0)+(d.s3||0);
            return (
              <tr key={d.num}>
                <td style={{textAlign:'left',borderLeft:`3px solid ${d.color}`,paddingLeft:'10px',fontFamily:'var(--font-head)',fontWeight:600}}>{d.name}</td>
                <td className={cls(d.s1,minS1,maxS1)}>{d.s1?d.s1.toFixed(3):'—'}</td>
                <td className={cls(d.s2,minS2,maxS2)}>{d.s2?d.s2.toFixed(3):'—'}</td>
                <td className={cls(d.s3,minS3,maxS3)}>{d.s3?d.s3.toFixed(3):'—'}</td>
                <td style={{fontFamily:'var(--font-data)',fontSize:'11px',color:'var(--text-secondary)'}}>{theo?fmt(theo):'—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── TYRE STRATEGY ─────────────────────────────────────────────
function TyreStrategy({ stints, drivers }) {
  const driverMap = useMemo(() => { const m={}; drivers?.forEach(d=>{m[d.driver_number]=d;}); return m; }, [drivers]);
  if (!stints?.length) return <div className="empty">No stint data</div>;
  const byDriver={};
  stints.forEach(s=>{if(!byDriver[s.driver_number])byDriver[s.driver_number]=[];byDriver[s.driver_number].push(s);});
  const maxLap=Math.max(...stints.map(s=>(s.lap_start||0)+(s.lap_end||0)-s.lap_start||0), 70);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'4px'}}>
      {Object.entries(byDriver).slice(0,18).map(([num,s]) => {
        const d=driverMap[num];
        const sorted=s.sort((a,b)=>a.stint_number-b.stint_number);
        return (
          <div key={num} className="strategy-row">
            <div className="strategy-name">{d?.last_name||`#${num}`}</div>
            <div className="strategy-bar">
              {sorted.map((st,i) => {
                const len=Math.max(1,(st.lap_end||maxLap)-(st.lap_start||0));
                const pct=(len/maxLap*100).toFixed(1);
                const c=st.compound?.charAt(0)||'?';
                return (
                  <div key={i} className={`stint-block stint-${c}`} style={{flexBasis:`${pct}%`,flexGrow:0,flexShrink:0}}
                    title={`${st.compound} laps ${st.lap_start}-${st.lap_end||'?'}`}>
                    {pct>6?c:''}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── QUALI RESULTS ─────────────────────────────────────────────
function QualiResults({ qualiLaps, drivers }) {
  const driverMap = useMemo(() => { const m={}; drivers?.forEach(d=>{m[d.driver_number]=d;}); return m; }, [drivers]);
  const grid = useMemo(() => {
    const best={};
    qualiLaps.forEach(l => { if(!l.lap_duration)return; if(!best[l.driver_number]||l.lap_duration<best[l.driver_number])best[l.driver_number]=l.lap_duration; });
    const sorted=Object.entries(best).sort((a,b)=>a[1]-b[1]);
    const pole=sorted[0]?.[1]||0;
    return sorted.map(([num,t],i) => ({ pos:i+1, num, t, gap:t-pole }));
  }, [qualiLaps]);
  if (!grid.length) return <div className="empty">No qualifying data</div>;
  return (
    <div>
      <div className="quali-row" style={{borderBottom:'1px solid var(--border-bright)',fontFamily:'var(--font-head)',fontSize:'9px',letterSpacing:'2px',color:'var(--text-dim)',textTransform:'uppercase'}}>
        <span>P</span><span>Driver</span><span>Time</span><span>Gap</span><span>Team</span>
      </div>
      {grid.map(({pos,num,t,gap}) => {
        const d=driverMap[num];
        const color=getTeamColor(d?.team_name);
        const pCls=pos===1?'q-p1':pos===2?'q-p2':pos===3?'q-p3':'';
        return (
          <div key={num} className="quali-row" style={{borderLeftColor:color}}>
            <span className={`${pCls}`} style={{fontFamily:'var(--font-data)',fontWeight:700}}>{pos===1?'P':''}{pos}</span>
            <div><div style={{fontFamily:'var(--font-head)',fontWeight:600,fontSize:'13px'}}>{d?.last_name||d?.full_name?.split(' ').pop()||`#${num}`}</div><div className="q-team" style={{fontFamily:'var(--font-head)',fontSize:'10px',color:'var(--text-secondary)'}}>{d?.team_name?.split(' ')[0]}</div></div>
            <span style={{fontFamily:'var(--font-data)',fontSize:'12px'}}>{fmt(t)}</span>
            <span className="q-gap" style={{fontFamily:'var(--font-data)',fontSize:'11px',color:'var(--text-secondary)'}}>{pos===1?'POLE':`+${gap.toFixed(3)}`}</span>
            <span style={{fontFamily:'var(--font-head)',fontSize:'10px',color:color,display:'flex',alignItems:'center',gap:'4px'}}><span style={{width:'8px',height:'8px',borderRadius:'50%',background:color,display:'inline-block'}}></span>{d?.team_name?.split(' ')[0]}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── RACE RESULTS ──────────────────────────────────────────────
function RaceResults({ results, loading }) {
  if (loading) return <div className="loading"><div className="spin"/>Loading results...</div>;
  if (!results?.length) return <div className="empty">Race results not available yet</div>;
  return (
    <div>
      {results.slice(0,20).map((r,i) => {
        const d=r.driver, color=getTeamColor(d?.team_name);
        const medal=i===0?'🏆':i===1?'🥈':i===2?'🥉':'';
        return (
          <div key={r.driver_number} style={{display:'grid',gridTemplateColumns:'32px 1fr 60px',alignItems:'center',padding:'7px 10px',borderBottom:'1px solid var(--border)',borderLeft:`3px solid ${color}`}}>
            <span style={{fontFamily:'var(--font-data)',fontSize:'14px',fontWeight:700,color:i<3?'#ffd700':'var(--text-secondary)'}}>{medal||r.position}</span>
            <div><div style={{fontFamily:'var(--font-head)',fontSize:'13px',fontWeight:700}}>{d?.last_name||d?.full_name?.split(' ').pop()||`#${r.driver_number}`}</div><div style={{fontFamily:'var(--font-head)',fontSize:'10px',color:'var(--text-secondary)'}}>{d?.team_name?.split(' ').slice(0,2).join(' ')}</div></div>
            <span style={{fontFamily:'var(--font-data)',fontSize:'10px',color:'var(--text-dim)',textAlign:'right'}}>#{r.driver_number}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── CAR TELEMETRY ─────────────────────────────────────────────
function CarTelemetry({ carData, drivers, positions, sessionYear }) {
  const driverMap = useMemo(() => { const m={}; drivers?.forEach(d=>{m[d.driver_number]=d;}); return m; }, [drivers]);
  const ordered = useMemo(() => {
    if (!positions?.length) return Object.keys(carData).map(Number);
    const lat={};
    positions.forEach(p=>{if(!lat[p.driver_number]||p.date>lat[p.driver_number].date)lat[p.driver_number]=p;});
    return Object.values(lat).sort((a,b)=>a.position-b.position).map(p=>p.driver_number);
  }, [positions, carData]);
  if (!Object.keys(carData).length) return <div className="empty">Awaiting telemetry...</div>;
  const aa = isActiveAeroEra(sessionYear || new Date().getFullYear());
  function aeroLabel(v) {
    if (v>=10) return { label: aa ? 'STRAIGHT' : 'OPEN',  color:'var(--accent-green)' };
    if (v===8)  return { label: aa ? 'OVERTAKE' : 'AVAIL', color:'#f5d000' };
    return       { label: aa ? 'CORNER' : 'OFF',  color:'var(--text-dim)' };
  }
  const colHeader = aa ? 'AERO' : 'DRS';
  return (
    <div style={{overflowX:'auto'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontFamily:'var(--font-data)',fontSize:'11px'}}>
        <thead>
          <tr style={{fontFamily:'var(--font-head)',fontSize:'9px',letterSpacing:'2px',color:'var(--text-dim)',textTransform:'uppercase'}}>
            <th style={{padding:'4px 7px',textAlign:'left'}}>Driver</th>
            <th style={{padding:'4px 7px',textAlign:'right'}}>Speed</th>
            <th style={{padding:'4px 7px',textAlign:'right'}}>RPM</th>
            <th style={{padding:'4px 7px',textAlign:'right'}}>Gear</th>
            <th style={{padding:'4px 7px',textAlign:'right'}}>Throttle</th>
            <th style={{padding:'4px 7px',textAlign:'right'}}>Brake</th>
            <th style={{padding:'4px 7px',textAlign:'center'}}>{colHeader}</th>
          </tr>
        </thead>
        <tbody>
          {ordered.slice(0,20).map(num => {
            const d=driverMap[num], tel=carData[num];
            if (!tel) return null;
            const color=getTeamColor(d?.team_name), aero=aeroLabel(tel.drs);
            return (
              <tr key={num} style={{borderBottom:'1px solid var(--border)',borderLeft:`3px solid ${color}`}}>
                <td style={{padding:'4px 7px',fontFamily:'var(--font-head)',fontWeight:700,fontSize:'11px'}}>{d?.last_name||d?.name_acronym||`#${num}`}</td>
                <td style={{padding:'4px 7px',textAlign:'right'}}>{tel.speed!=null?`${tel.speed}km/h`:'—'}</td>
                <td style={{padding:'4px 7px',textAlign:'right',color:'var(--text-secondary)'}}>{tel.rpm!=null?tel.rpm.toLocaleString():'—'}</td>
                <td style={{padding:'4px 7px',textAlign:'right',color:'var(--accent-amber)',fontWeight:700,fontSize:'13px'}}>{tel.n_gear??'—'}</td>
                <td style={{padding:'4px 7px',textAlign:'right'}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end',gap:'3px'}}>
                    <div style={{width:'36px',height:'5px',background:'var(--border)',borderRadius:'2px',overflow:'hidden'}}>
                      <div style={{width:`${tel.throttle||0}%`,height:'100%',background:'var(--accent-green)',borderRadius:'2px'}}/>
                    </div>
                    <span style={{color:'var(--text-secondary)',fontSize:'9px',width:'26px'}}>{tel.throttle||0}%</span>
                  </div>
                </td>
                <td style={{padding:'4px 7px',textAlign:'right'}}>
                  <span style={{color:tel.brake>0?'var(--accent-red)':'var(--text-dim)',fontWeight:tel.brake>0?700:400}}>{tel.brake>0?'●':'○'}</span>
                </td>
                <td style={{padding:'4px 7px',textAlign:'center'}}>
                  <span style={{color:aero.color,fontFamily:'var(--font-head)',fontSize:'9px',fontWeight:700,letterSpacing:'1px'}}
                    title={getAeroLabel(tel.drs, sessionYear)?.tip || ''}>
                    {aero.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

}

// ─── TEAM RADIO ────────────────────────────────────────────────
function TeamRadio({ messages, drivers }) {
  const driverMap = useMemo(() => { const m={}; drivers?.forEach(d=>{m[d.driver_number]=d;}); return m; }, [drivers]);
  if (!messages?.length) return <div className="empty">No team radio messages yet</div>;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'5px',maxHeight:'280px',overflowY:'auto'}}>
      {messages.slice(0,12).map((msg,i) => {
        const d=driverMap[msg.driver_number], color=getTeamColor(d?.team_name);
        return (
          <div key={i} style={{display:'flex',alignItems:'center',gap:'8px',padding:'7px 10px',background:'var(--bg-elevated)',borderRadius:'4px',borderLeft:`3px solid ${color}`,animation:'slideIn .3s ease-out'}}>
            <div style={{minWidth:'70px'}}>
              <div style={{fontFamily:'var(--font-head)',fontSize:'11px',fontWeight:700}}>{d?.last_name||`#${msg.driver_number}`}</div>
              <div style={{fontFamily:'var(--font-data)',fontSize:'9px',color:'var(--text-dim)'}}>{msg.date?new Date(msg.date).toLocaleTimeString():''}</div>
            </div>
            <div style={{flex:1}}>
              {msg.recording_url
                ? <audio controls src={msg.recording_url} style={{height:'26px',width:'100%',filter:'invert(.8) hue-rotate(180deg)'}} />
                : <span style={{fontFamily:'var(--font-body)',fontSize:'11px',color:'var(--text-secondary)'}}>Radio message</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── PREDICTION PANEL ──────────────────────────────────────────
function PredictionPanel({ predictions, loading, error, onGenerate, groqKeySet, groqKey, setGroqKey, weekendDataReady, weekendDataLoading }) {
  if (!groqKeySet) return (
    <div style={{padding:'16px',background:'var(--bg-elevated)',borderRadius:'5px',border:'1px solid var(--border)'}}>
      <div style={{fontFamily:'var(--font-head)',fontSize:'14px',fontWeight:700,letterSpacing:'2px',marginBottom:'8px'}}>🤖 AI RACE ANALYST</div>
      <div style={{fontSize:'12px',color:'var(--text-secondary)',marginBottom:'12px',lineHeight:1.6}}>
        Powered by all FP + Qualifying data. Get a free Groq key at <strong>console.groq.com</strong> — it's instant and free.
      </div>
      <input className="groq-input" type="password" placeholder="gsk_..." value={groqKey} onChange={e=>setGroqKey(e.target.value)} />
      <button className="btn btn-primary" onClick={onGenerate} disabled={!groqKey}>Activate AI Analyst</button>
    </div>
  );
  if (loading) return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'12px',padding:'36px'}}>
      <div className="ai-dots"><div className="ai-dot"/><div className="ai-dot"/><div className="ai-dot"/></div>
      <div style={{fontFamily:'var(--font-head)',fontSize:'12px',letterSpacing:'2px',color:'var(--text-secondary)'}}>ANALYSING FP1+FP2+FP3+QUALIFYING...</div>
    </div>
  );
  if (error) return (
    <div>
      <div className="error-state" style={{marginBottom:'10px'}}>{error}</div>
      <button className="btn btn-secondary" onClick={onGenerate}>Retry</button>
    </div>
  );
  if (!predictions?.length) return (
    <div style={{textAlign:'center',padding:'20px'}}>
      {weekendDataLoading
        ? <div className="loading" style={{justifyContent:'center'}}><div className="spin"/>Loading session data...</div>
        : <button className="btn btn-primary" onClick={onGenerate} disabled={!weekendDataReady}>{weekendDataReady?'Generate Race Predictions':'Waiting for session data...'}</button>}
    </div>
  );
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontFamily:'var(--font-head)',fontSize:'11px',color:'var(--text-secondary)',letterSpacing:'2px'}}>TOP 3 PREDICTIONS</div>
        <button className="btn btn-secondary" style={{fontSize:'9px',padding:'3px 8px'}} onClick={onGenerate}>↻ REFRESH</button>
      </div>
      {predictions.map((p,i) => {
        const color=getTeamColor(p.team);
        return (
          <div key={i} style={{background:'var(--bg-elevated)',borderRadius:'5px',padding:'12px',borderLeft:`3px solid ${color}`,position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',right:8,top:4,fontFamily:'var(--font-head)',fontSize:'52px',fontWeight:900,color:'var(--border)',lineHeight:1,zIndex:0}}>{i+1}</div>
            <div style={{position:'relative',zIndex:1}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'6px'}}>
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                    <span style={{fontFamily:'var(--font-head)',fontSize:'14px',fontWeight:800,color:'var(--text-dim)'}}>P{i+1}</span>
                    <span style={{fontFamily:'var(--font-head)',fontSize:'15px',fontWeight:700}}>{p.name}</span>
                  </div>
                  <div style={{fontFamily:'var(--font-head)',fontSize:'10px',color:'var(--text-secondary)'}}>{p.team}{p.gridPosition ? ` · Grid P${p.gridPosition}` : ' · Practice projection'}</div>
                </div>
                {p.winProbability != null && (
                  <div style={{textAlign:'right'}}>
                    <div style={{fontFamily:'var(--font-data)',fontSize:'20px',fontWeight:700,color}}>{p.winProbability}%</div>
                    <div style={{fontFamily:'var(--font-head)',fontSize:'8px',letterSpacing:'1px',color:'var(--text-dim)'}}>WIN PROB</div>
                  </div>
                )}
              </div>
              {p.winProbability != null && (
                <div style={{height:'3px',background:'var(--border)',borderRadius:'2px',marginBottom:'8px',overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${p.winProbability}%`,background:color,borderRadius:'2px'}}/>
                </div>
              )}
              <div style={{fontSize:'12px',lineHeight:1.5,color:'var(--text-secondary)',fontFamily:'var(--font-body)',marginBottom:'8px'}}>{p.reasoning}</div>
              <span className={`conf-badge conf-${p.confidence?.toLowerCase()}`}>{p.confidence}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── LIVE ANALYST PANEL ────────────────────────────────────────
function LiveAnalystPanel({ predictions, liveProbs, positions, driverMap, onUpdate, updating, updateError, groqKeySet }) {
  const latestPos = useMemo(() => {
    if (!positions?.length) return {};
    const m={};
    positions.forEach(p=>{if(!m[p.driver_number]||p.date>m[p.driver_number].date)m[p.driver_number]=p;});
    return m;
  }, [positions]);
  const findPos = name => {
    const found = Object.values(driverMap).find(d =>
      d.full_name?.toLowerCase().includes(name.toLowerCase().split(' ').pop()) ||
      d.last_name?.toLowerCase().includes(name.toLowerCase().split(' ').pop())
    );
    return found ? latestPos[found.driver_number]?.position || null : null;
  };
  if (!predictions?.length) return (
    <div className="card">
      <div className="card-title">AI Race Analyst</div>
      <div className="empty" style={{padding:'16px 0'}}>Generate predictions in Pre-Race mode first.</div>
    </div>
  );
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
      <div className="card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
          <div className="card-title" style={{margin:0}}>Pre-Race Predictions</div>
          <div style={{fontFamily:'var(--font-head)',fontSize:'8px',letterSpacing:'1px',color:'var(--text-dim)'}}>FP+QUALI</div>
        </div>
        {predictions.map((pred,i) => {
          const color=getTeamColor(pred.team), actual=findPos(pred.name);
          const ld=liveProbs?.find(x=>x.name?.toLowerCase().includes(pred.name.toLowerCase().split(' ').pop()));
          let si=null;
          if (actual!=null) {
            const p=i+1;
            if (actual<=p) si={icon:'▲',color:'var(--accent-green)',label:`P${actual}`};
            else if (actual<=p+2) si={icon:'▷',color:'var(--accent-amber)',label:`P${actual}`};
            else si={icon:'▼',color:'var(--accent-red)',label:`P${actual}`};
          }
          return (
            <div key={i} style={{background:'var(--bg-elevated)',borderRadius:'4px',padding:'9px 10px',borderLeft:`3px solid ${color}`,marginBottom:'6px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                    <span style={{fontFamily:'var(--font-head)',fontSize:'14px',fontWeight:800,color:'var(--text-dim)'}}>P{i+1}</span>
                    <span style={{fontFamily:'var(--font-head)',fontSize:'13px',fontWeight:700}}>{pred.name.split(' ').pop()}</span>
                  </div>
                  <div style={{fontFamily:'var(--font-head)',fontSize:'9px',color:'var(--text-secondary)'}}>{pred.team}{pred.gridPosition ? ` · Grid P${pred.gridPosition}` : ' · Practice projection'}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  {si && <div style={{fontFamily:'var(--font-head)',fontSize:'12px',fontWeight:700,color:si.color}}>{si.icon} {si.label}</div>}
                  {ld?.winProbability!=null && <div style={{fontFamily:'var(--font-data)',fontSize:'10px',color:'var(--accent-green)'}}>{ld.winProbability}%</div>}
                </div>
              </div>
              {pred.winProbability!=null && (
                <div style={{height:'3px',background:'var(--border)',borderRadius:'2px',marginTop:'6px',overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${pred.winProbability}%`,background:color,borderRadius:'2px'}}/>
                </div>
              )}
              {ld && <div style={{marginTop:'5px',fontSize:'11px',color:'var(--text-secondary)',fontFamily:'var(--font-body)',lineHeight:1.4,borderTop:'1px solid var(--border)',paddingTop:'5px'}}>{ld.assessment}</div>}
              <span className={`conf-badge conf-${pred.confidence?.toLowerCase()}`} style={{marginTop:'5px',display:'inline-flex'}}>{pred.confidence}</span>
            </div>
          );
        })}
      </div>
      {groqKeySet && positions.length>0 && (
        <div className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
            <div className="card-title" style={{margin:0}}>Live Win Probability</div>
            <button className="btn btn-secondary" style={{fontSize:'9px',padding:'3px 7px',opacity:updating?.5:1}} onClick={onUpdate} disabled={updating}>{updating?'…':'↻ UPDATE'}</button>
          </div>
          {updateError && <div style={{fontSize:'10px',color:'var(--accent-red)',marginBottom:'6px',fontFamily:'var(--font-head)'}}>{updateError}</div>}
          {liveProbs?.length ? (
            <div style={{display:'flex',flexDirection:'column',gap:'5px'}}>
              {[...liveProbs].sort((a,b)=>b.winProbability-a.winProbability).map((d,i) => {
                const de=Object.values(driverMap).find(x=>x.full_name?.toLowerCase().includes(d.name?.toLowerCase().split(' ').pop())||x.last_name?.toLowerCase().includes(d.name?.toLowerCase().split(' ').pop()));
                const color=getTeamColor(de?.team_name);
                const tc=d.trend==='up'?'var(--accent-green)':d.trend==='down'?'var(--accent-red)':'var(--text-dim)';
                const ti=d.trend==='up'?'▲':d.trend==='down'?'▼':'—';
                return (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:'6px'}}>
                    <span style={{fontFamily:'var(--font-head)',fontSize:'10px',color:'var(--text-dim)',width:'18px',textAlign:'right'}}>P{d.currentPosition}</span>
                    <div style={{width:'3px',height:'22px',background:color,borderRadius:'2px',flexShrink:0}}/>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2px'}}>
                        <span style={{fontFamily:'var(--font-head)',fontSize:'11px',fontWeight:600}}>{d.name?.split(' ').pop()}</span>
                        <div style={{display:'flex',alignItems:'center',gap:'3px'}}>
                          <span style={{color:tc,fontSize:'9px'}}>{ti}</span>
                          <span style={{fontFamily:'var(--font-data)',fontSize:'11px',fontWeight:700}}>{d.winProbability}%</span>
                        </div>
                      </div>
                      <div style={{height:'3px',background:'var(--border)',borderRadius:'2px',overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${Math.min(d.winProbability,100)}%`,background:color,transition:'width .8s ease'}}/>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{fontSize:'11px',color:'var(--text-dim)',fontFamily:'var(--font-head)',textAlign:'center',padding:'10px 0'}}>Press UPDATE to get live win probabilities</div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
