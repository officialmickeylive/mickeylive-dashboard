'use client';

import React, { useState, useMemo } from 'react';

// ─── INLINE ICONS ─────────────────────────────────────────────────────────────
const Ic = ({ p, s = 14, sw = 2 }: { p: string | string[]; s?: number; sw?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(p) ? p : [p]).map((d, i) => <path key={i} d={d} />)}
  </svg>
);
const I = {
  Search:   () => <Ic p="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />,
  X:        () => <Ic p="M18 6L6 18M6 6l12 12" />,
  Users:    () => <Ic p={["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2","M23 21v-2a4 4 0 0 0-3-3.87","M16 3.13a4 4 0 0 1 0 7.75","M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"]} />,
  UserX:    () => <Ic p={["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2","M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z","M22 10l-6 6","M16 10l6 6"]} />,
  Monitor:  () => <Ic p={["M8 21h8","M12 17v4","M2 3h20v14H2z"]} />,
  Shield:   () => <Ic p="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  Left:     () => <Ic p="M15 18l-6-6 6-6" />,
  Right:    () => <Ic p="M9 18l6-6-6-6" />,
  DLeft:    () => <Ic p={["M11 17l-5-5 5-5","M18 17l-5-5 5-5"]} />,
  DRight:   () => <Ic p={["M13 17l5-5-5-5","M6 17l5-5-5-5"]} />,
  Filter:   () => <Ic p="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />,
  Radio:    () => <Ic p={["M5 12.55a11 11 0 0 1 14.08 0","M1.42 9a16 16 0 0 1 21.16 0","M8.53 16.11a6 6 0 0 1 6.95 0","M12 20h.01"]} />,
  ChevD:    () => <Ic p="M6 9l6 6 6-6" />,
  Video:    () => <Ic p={["M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.6C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z","M9.75 15.02l5.75-3.02-5.75-3.02v6.04z"]} />,
  Crown:    () => <Ic p="M3 20h18M5 20V8l7-5 7 5v12" />,
  Bell:     () => <Ic p={["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 0 1-3.46 0"]} />,
  Kick:     () => <Ic p={["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2","M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z","M20 8l4 4-4 4"]} />,
  Eye:      () => <Ic p={["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"]} />,
  Mic:      () => <Ic p={["M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z","M19 10v2a7 7 0 0 1-14 0v-2","M12 19v4","M8 23h8"]} />,
  Sword:    () => <Ic p="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l2-2M19 13l-2 2M3 21l9-9" />,
};

// ─── DATA ──────────────────────────────────────────────────────────────────────
const CATEGORIES = ['CHAT','GAMING','TALENT','MUSIC','RELAX','DANCE','COMEDY'];
const ROOM_TYPES = ['SOLO_LIVE','PK_BATTLE','MULTI_LIVE','TALENT_SHOW'];

function genAudience(roomId: string, count: number) {
  const names = ['NebulaDrift','VoidWalker','SolarFlare','CyberGhost','AlphaDark','StormRider','PulseKing','NeonBlade','DarkMatter','WaveRider','BinaryStorm','ZeroFlux','NovaCrest','FrostShard','PulseWave','EchoLight','StarBurst','MoonRider','CosmicDust','NightHawk','CrimsonTide','IceBreaker','FireStorm','ThunderBolt','SilverFox','GoldenEagle','IronWill','SteelHeart','DiamondCut','RubyRed'];
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push({
      id: `${roomId}-AUD-${i}`,
      name: names[i % names.length] + '_' + (i + 1),
      type: i < Math.floor(count * 0.3) ? 'VIP' : 'GUEST',
      level: Math.floor(Math.random() * 60) + 1,
      coins: Math.floor(Math.random() * 50000),
      diamonds: i < Math.floor(count * 0.3) ? Math.floor(Math.random() * 800) : 0,
      joinedMins: Math.floor(Math.random() * 60) + 1,
      country: ['US','UK','JP','KR','IN','BR','DE','FR','CA','AU'][i % 10],
    });
  }
  return arr;
}

const ROOMS_RAW = [
  { id:'RM-501', title:'Late Night Chill & Chat',         host:'Luna Divine',    hostId:'H1', type:'SOLO_LIVE',    viewers:1247, category:'CHAT',   status:'ACTIVE',  startedMins:45,  pk: null },
  { id:'RM-502', title:'Epic PK Battle: Shadow vs Cipher',host:'Shadow Dancer',  hostId:'H2', type:'PK_BATTLE',   viewers:4512, category:'GAMING', status:'ACTIVE',  startedMins:22,  pk:'vs Cipher_X' },
  { id:'RM-503', title:'Talent Show Extravaganza',         host:'Cyber Queen',    hostId:'H3', type:'MULTI_LIVE',  viewers:8934, category:'TALENT', status:'ACTIVE',  startedMins:78,  pk: null },
  { id:'RM-504', title:'Chill Vibes — No Toxicity',        host:'Zen Master',     hostId:'H4', type:'SOLO_LIVE',   viewers:541,  category:'RELAX',  status:'FLAGGED', startedMins:120, pk: null },
  { id:'RM-505', title:'Music Request Night',              host:'Nova Spark',     hostId:'H5', type:'SOLO_LIVE',   viewers:3102, category:'MUSIC',  status:'ACTIVE',  startedMins:33,  pk: null },
  { id:'RM-506', title:'Hip-Hop Dance Battle',             host:'Pixel Phoenix',  hostId:'H6', type:'PK_BATTLE',   viewers:2780, category:'DANCE',  status:'ACTIVE',  startedMins:15,  pk:'vs GrooveKing' },
  { id:'RM-507', title:'Stand-Up Comedy Hour',             host:'Omega Flash',    hostId:'H7', type:'SOLO_LIVE',   viewers:1890, category:'COMEDY', status:'ACTIVE',  startedMins:55,  pk: null },
  { id:'RM-508', title:'Gaming Marathon: Final Boss',      host:'Frost Byte',     hostId:'H8', type:'SOLO_LIVE',   viewers:998,  category:'GAMING', status:'ACTIVE',  startedMins:200, pk: null },
  { id:'RM-509', title:'Acoustic Session — Live Covers',   host:'Echo Pulse',     hostId:'H9', type:'SOLO_LIVE',   viewers:622,  category:'MUSIC',  status:'ACTIVE',  startedMins:40,  pk: null },
  { id:'RM-510', title:'Talent Collab Night',              host:'Blaze Star',     hostId:'H10',type:'MULTI_LIVE',  viewers:5600, category:'TALENT', status:'FLAGGED', startedMins:90,  pk: null },
  { id:'RM-511', title:'Quiz Night — Win Diamonds!',       host:'Storm Breaker',  hostId:'H11',type:'TALENT_SHOW', viewers:7200, category:'CHAT',   status:'ACTIVE',  startedMins:18,  pk: null },
  { id:'RM-512', title:'Midnight Rave Stream',             host:'Neon Viper',     hostId:'H12',type:'SOLO_LIVE',   viewers:330,  category:'DANCE',  status:'ACTIVE',  startedMins:8,   pk: null },
];

const AUDIENCE_DB: Record<string, ReturnType<typeof genAudience>> = {};
ROOMS_RAW.forEach(r => { AUDIENCE_DB[r.id] = genAudience(r.id, Math.min(50, Math.floor(r.viewers / 30) + 5)); });

// ─── UTILS ─────────────────────────────────────────────────────────────────────
const fmt  = (n: number) => n >= 1e6 ? (n/1e6).toFixed(1)+'M' : n >= 1e3 ? (n/1e3).toFixed(1)+'K' : String(n);
const fmtMins = (m: number) => m >= 60 ? `${Math.floor(m/60)}h ${m%60}m` : `${m}m`;

const TYPE_STYLE: Record<string, { text: string; bg: string; border: string; label: string }> = {
  SOLO_LIVE:    { text:'#00ffff', bg:'rgba(0,255,255,0.1)',   border:'rgba(0,255,255,0.25)',   label:'Solo Live'   },
  PK_BATTLE:    { text:'#ff4444', bg:'rgba(255,68,68,0.1)',   border:'rgba(255,68,68,0.28)',   label:'PK Battle'   },
  MULTI_LIVE:   { text:'#a855f7', bg:'rgba(168,85,247,0.1)', border:'rgba(168,85,247,0.28)', label:'Multi Live'  },
  TALENT_SHOW:  { text:'#ffd700', bg:'rgba(255,215,0,0.1)',  border:'rgba(255,215,0,0.28)',  label:'Talent Show' },
};
const CAT_COLOR: Record<string, string> = {
  CHAT:'#00ffff',GAMING:'#ff4444',TALENT:'#a855f7',MUSIC:'#22c55e',
  RELAX:'#38bdf8',DANCE:'#f97316',COMEDY:'#ffd700',
};

// ─── PAGINATION ────────────────────────────────────────────────────────────────
function Pagination({ page, total, count, perPage, onChange }: { page:number; total:number; count:number; perPage:number; onChange:(p:number)=>void; }) {
  const start = count === 0 ? 0 : (page - 1) * perPage + 1;
  const end   = Math.min(page * perPage, count);
  const pages = useMemo(() => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1) as (number|string)[];
    if (page <= 4)  return [1,2,3,4,5,'…',total] as (number|string)[];
    if (page >= total - 3) return [1,'…',total-4,total-3,total-2,total-1,total] as (number|string)[];
    return [1,'…',page-1,page,page+1,'…',total] as (number|string)[];
  }, [page, total]);
  const b: React.CSSProperties = { height:28,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:900,cursor:'pointer',fontFamily:'inherit',transition:'all .15s',border:'none',outline:'none' };
  const idle = {...b,width:28,background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.4)',border:'1px solid rgba(255,255,255,0.08)'};
  const act  = {...b,width:28,background:'rgba(0,255,255,0.14)',color:'#00ffff',border:'1px solid rgba(0,255,255,0.4)',boxShadow:'0 0 10px rgba(0,255,255,0.15)'};
  const dis  = {...b,width:28,background:'rgba(255,255,255,0.02)',color:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.04)',cursor:'not-allowed'};
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 18px',borderTop:'1px solid rgba(255,255,255,0.06)',background:'rgba(0,0,0,0.25)'}}>
      <span style={{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.18em',color:'rgba(255,255,255,0.28)'}}>
        {count===0?'No results':<><span style={{color:'#00ffff'}}>{start}–{end}</span> of {count}</>}
      </span>
      <div style={{display:'flex',gap:3,alignItems:'center'}}>
        <button style={page===1?dis:idle} disabled={page===1} onClick={()=>onChange(1)}><I.DLeft/></button>
        <button style={page===1?dis:idle} disabled={page===1} onClick={()=>onChange(page-1)}><I.Left/></button>
        {pages.map((p,i) => p==='…'
          ? <span key={`e${i}`} style={{width:20,textAlign:'center',color:'rgba(255,255,255,0.2)',fontSize:12,userSelect:'none'}}>·</span>
          : <button key={p} style={page===p?act:idle} onClick={()=>onChange(Number(p))}>{p}</button>
        )}
        <button style={page===total?dis:idle} disabled={page===total} onClick={()=>onChange(page+1)}><I.Right/></button>
        <button style={page===total?dis:idle} disabled={page===total} onClick={()=>onChange(total)}><I.DRight/></button>
      </div>
      <span style={{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.18em',color:'rgba(255,255,255,0.28)'}}>
        pg <span style={{color:'#fff'}}>{page}/{total}</span>
      </span>
    </div>
  );
}

// ─── ROOM DETAIL MODAL ─────────────────────────────────────────────────────────
const APPP = 8;
function RoomDetailModal({ room, open, onClose }: { room: typeof ROOMS_RAW[0] | null; open: boolean; onClose: () => void }) {
  const [kicked,    setKicked]    = useState<string[]>([]);
  const [typeF,     setTypeF]     = useState('');
  const [countryF,  setCountryF]  = useState('');
  const [searchF,   setSearchF]   = useState('');
  const [sortBy,    setSortBy]    = useState('joinedMins');
  const [pg,        setPg]        = useState(1);
  const [confirmId, setConfirmId] = useState<string|null>(null);

  React.useEffect(() => { setKicked([]); setTypeF(''); setCountryF(''); setSearchF(''); setSortBy('joinedMins'); setPg(1); setConfirmId(null); }, [room?.id]);

  if (!room || !open) return null;

  const allAudience = AUDIENCE_DB[room.id] || [];

  const filtered = allAudience
    .filter(a => !kicked.includes(a.id))
    .filter(a => !typeF    || a.type === typeF)
    .filter(a => !countryF || a.country === countryF)
    .filter(a => !searchF  || a.name.toLowerCase().includes(searchF.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name')      return a.name.localeCompare(b.name);
      if (sortBy === 'level')     return b.level - a.level;
      if (sortBy === 'coins')     return b.coins - a.coins;
      if (sortBy === 'diamonds')  return b.diamonds - a.diamonds;
      return a.joinedMins - b.joinedMins; // newest first
    });

  const totalPg   = Math.max(1, Math.ceil(filtered.length / APPP));
  const safePg    = Math.min(pg, totalPg);
  const paged     = filtered.slice((safePg-1)*APPP, safePg*APPP);
  const vipCount  = filtered.filter(a => a.type === 'VIP').length;
  const guestCount= filtered.filter(a => a.type === 'GUEST').length;
  const hasF      = typeF || countryF || searchF || sortBy !== 'joinedMins';

  const handleKick = (id: string) => { setKicked(p => [...p, id]); setConfirmId(null); };

  const IS: React.CSSProperties = { height:30,borderRadius:9,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.09)',color:'#fff',fontSize:9,fontWeight:700,outline:'none',fontFamily:'inherit',padding:'0 8px',boxSizing:'border-box' as const };
  const SS: React.CSSProperties = { ...IS, appearance:'none' as any, paddingRight:20 };
  const ts  = TYPE_STYLE[room.type] || TYPE_STYLE.SOLO_LIVE;

  return (
    <>
      {/* Backdrop */}
      {open && <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:50,background:'rgba(0,0,0,0.88)',backdropFilter:'blur(14px)'}} />}

      {/* Modal */}
      {open && (
        <div style={{position:'fixed',inset:0,zIndex:51,display:'flex',alignItems:'center',justifyContent:'center',padding:16,pointerEvents:'none'}}>
          <div style={{width:'100%',maxWidth:900,maxHeight:'94vh',overflowY:'auto',pointerEvents:'auto',position:'relative'}}>
            <div style={{position:'absolute',inset:-1,borderRadius:22,background:'linear-gradient(135deg,rgba(0,255,255,0.18),transparent 60%)',filter:'blur(6px)'}} />
            <div style={{position:'relative',borderRadius:22,border:'1px solid rgba(0,255,255,0.18)',background:'#070b14',overflow:'hidden'}}>

              {/* Scan line */}
              <div style={{position:'absolute',top:0,left:0,width:'35%',height:1,background:'linear-gradient(90deg,transparent,#00ffff,transparent)',animation:'scan 3s linear infinite',zIndex:10}} />
              <style>{`@keyframes scan{0%{transform:translateX(-100%)}100%{transform:translateX(320%)}}`}</style>

              {/* Header */}
              <div style={{padding:'18px 22px',borderBottom:'1px solid rgba(255,255,255,0.06)',background:'linear-gradient(135deg,rgba(0,255,255,0.06),transparent 55%)'}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12}}>
                  <div style={{display:'flex',alignItems:'center',gap:12,flex:1}}>
                    {/* Live badge */}
                    <div style={{position:'relative',flexShrink:0}}>
                      <div style={{width:44,height:44,borderRadius:13,background:'rgba(0,255,255,0.1)',border:'1px solid rgba(0,255,255,0.25)',display:'flex',alignItems:'center',justifyContent:'center',color:'#00ffff',boxShadow:'0 0 18px rgba(0,255,255,0.2)'}}>
                        <I.Video/>
                      </div>
                      <span style={{position:'absolute',top:-4,right:-4,width:10,height:10,borderRadius:'50%',background:'#ff4444',border:'2px solid #070b14',boxShadow:'0 0 8px rgba(255,68,68,0.8)',animation:'pulse 1.5s ease-in-out infinite'}} />
                      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.3);opacity:0.7}}`}</style>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:900,fontSize:15,color:'#fff',letterSpacing:'-0.01em',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{room.title}</div>
                      <div style={{fontSize:9,color:'rgba(255,255,255,0.4)',marginTop:2,display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                        <span style={{display:'flex',alignItems:'center',gap:4}}><I.Mic/>{room.host}</span>
                        <span>·</span>
                        <span style={{display:'flex',alignItems:'center',gap:4,color:'rgba(255,100,100,0.7)'}}>🔴 LIVE {fmtMins(room.startedMins)}</span>
                        {room.pk && <><span>·</span><span style={{color:'#ff4444',fontWeight:700,display:'flex',alignItems:'center',gap:4}}><I.Sword/>{room.pk}</span></>}
                      </div>
                    </div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
                    {/* Type badge */}
                    <span style={{fontSize:8,fontWeight:900,textTransform:'uppercase',letterSpacing:'0.12em',padding:'3px 9px',borderRadius:6,background:ts.bg,border:`1px solid ${ts.border}`,color:ts.text}}>{ts.label}</span>
                    <span style={{fontSize:8,fontWeight:900,textTransform:'uppercase',letterSpacing:'0.12em',padding:'3px 9px',borderRadius:6,background:room.status==='FLAGGED'?'rgba(255,68,68,0.1)':'rgba(34,197,94,0.1)',border:`1px solid ${room.status==='FLAGGED'?'rgba(255,68,68,0.3)':'rgba(34,197,94,0.3)'}`,color:room.status==='FLAGGED'?'#ff4444':'#22c55e'}}>{room.status}</span>
                    <button onClick={onClose} style={{width:28,height:28,borderRadius:9,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',color:'rgba(255,255,255,0.35)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',outline:'none'}}
                      onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(255,55,55,0.15)';(e.currentTarget as HTMLButtonElement).style.color='#ff4444';}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(255,255,255,0.04)';(e.currentTarget as HTMLButtonElement).style.color='rgba(255,255,255,0.35)';}}>
                      <I.X/>
                    </button>
                  </div>
                </div>

                {/* Quick stats row */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8,marginTop:14}}>
                  {[
                    {l:'Total Viewers',  v:fmt(room.viewers),              c:'#00ffff'},
                    {l:'In Room Now',    v:filtered.length,                 c:'#22c55e'},
                    {l:'VIP Members',    v:vipCount,                        c:'#ffd700'},
                    {l:'Guests',         v:guestCount,                      c:'#94a3b8'},
                    {l:'Kicked',         v:kicked.length,                   c:'#ff4444'},
                  ].map(({l,v,c}) => (
                    <div key={l} style={{borderRadius:11,border:`1px solid ${c}20`,background:`${c}07`,padding:'9px 12px'}}>
                      <div style={{fontSize:16,fontWeight:900,color:c,lineHeight:1}}>{v}</div>
                      <div style={{fontSize:8,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.14em',marginTop:3}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div style={{padding:'12px 22px',borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(0,0,0,0.2)'}}>
                <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                  <div style={{display:'flex',alignItems:'center',gap:5,color:'rgba(255,255,255,0.28)',fontSize:8,fontWeight:900,textTransform:'uppercase',letterSpacing:'0.2em',flexShrink:0}}>
                    <I.Filter/> Filter
                  </div>
                  {/* Search */}
                  <div style={{position:'relative',flex:'1 1 160px',minWidth:140}}>
                    <span style={{position:'absolute',left:7,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.22)',pointerEvents:'none'}}><I.Search/></span>
                    <input value={searchF} onChange={e=>{setSearchF(e.target.value);setPg(1);}} placeholder="Search by name…"
                      style={{...IS,width:'100%',paddingLeft:24,boxSizing:'border-box'}}
                      onFocus={e=>e.currentTarget.style.borderColor='rgba(0,255,255,0.4)'}
                      onBlur={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.09)'} />
                  </div>
                  {/* Type filter */}
                  <div style={{position:'relative',flex:'0 0 110px'}}>
                    <select value={typeF} onChange={e=>{setTypeF(e.target.value);setPg(1);}} style={{...SS,width:'100%'}}>
                      <option value="">All Types</option>
                      <option value="VIP">VIP Only</option>
                      <option value="GUEST">Guest Only</option>
                    </select>
                    <span style={{position:'absolute',right:6,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.25)',pointerEvents:'none'}}><I.ChevD/></span>
                  </div>
                  {/* Sort */}
                  <div style={{position:'relative',flex:'0 0 130px'}}>
                    <select value={sortBy} onChange={e=>{setSortBy(e.target.value);setPg(1);}} style={{...SS,width:'100%'}}>
                      <option value="joinedMins">Newest First</option>
                      <option value="level">Level ↓</option>
                      <option value="coins">Coins ↓</option>
                      <option value="diamonds">Diamonds ↓</option>
                      <option value="name">Name A–Z</option>
                    </select>
                    <span style={{position:'absolute',right:6,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.25)',pointerEvents:'none'}}><I.ChevD/></span>
                  </div>
                  {hasF && (
                    <button onClick={()=>{setTypeF('');setCountryF('');setSearchF('');setSortBy('joinedMins');setPg(1);}}
                      style={{fontSize:8,fontWeight:700,color:'rgba(0,255,255,0.6)',background:'none',border:'none',cursor:'pointer',fontFamily:'inherit',textTransform:'uppercase',letterSpacing:'0.12em',flexShrink:0}}>
                      × Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Audience Table */}
              <div>
                {/* thead */}
                <div style={{display:'grid',gridTemplateColumns:'2fr 0.8fr 0.7fr 0.9fr 0.9fr 0.6fr 0.8fr',padding:'8px 22px',borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(0,0,0,0.3)'}}>
                  {['Viewer','Type','Country','Level','Coins','Diamonds','Action'].map(h => (
                    <div key={h} style={{fontSize:8,fontWeight:900,textTransform:'uppercase',letterSpacing:'0.2em',color:'rgba(255,255,255,0.25)'}}>{h}</div>
                  ))}
                </div>

                {paged.length === 0
                  ? <div style={{padding:36,textAlign:'center',color:'rgba(255,255,255,0.22)',fontSize:12}}>No viewers match your filters.</div>
                  : paged.map((aud, idx) => (
                    <div key={aud.id}
                      style={{display:'grid',gridTemplateColumns:'2fr 0.8fr 0.7fr 0.9fr 0.9fr 0.6fr 0.8fr',padding:'9px 22px',borderBottom:'1px solid rgba(255,255,255,0.04)',transition:'background .14s',background:confirmId===aud.id?'rgba(255,68,68,0.05)':'transparent'}}
                      onMouseEnter={e=>{if(confirmId!==aud.id)(e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.02)';}}
                      onMouseLeave={e=>{if(confirmId!==aud.id)(e.currentTarget as HTMLDivElement).style.background='transparent';}}>
                      {/* Name */}
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <div style={{width:28,height:28,borderRadius:9,background:aud.type==='VIP'?'rgba(255,215,0,0.15)':'rgba(255,255,255,0.07)',border:`1px solid ${aud.type==='VIP'?'rgba(255,215,0,0.3)':'rgba(255,255,255,0.1)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:900,color:aud.type==='VIP'?'#ffd700':'rgba(255,255,255,0.4)',flexShrink:0}}>
                          {aud.name.slice(0,2).toUpperCase()}
                        </div>
                        <span style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.75)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{aud.name}</span>
                      </div>
                      {/* Type */}
                      <div style={{display:'flex',alignItems:'center'}}>
                        <span style={{fontSize:8,fontWeight:900,textTransform:'uppercase',letterSpacing:'0.1em',padding:'2px 7px',borderRadius:5,background:aud.type==='VIP'?'rgba(255,215,0,0.1)':'rgba(255,255,255,0.05)',border:`1px solid ${aud.type==='VIP'?'rgba(255,215,0,0.28)':'rgba(255,255,255,0.1)'}`,color:aud.type==='VIP'?'#ffd700':'rgba(255,255,255,0.4)'}}>
                          {aud.type==='VIP'?'👑 VIP':'Guest'}
                        </span>
                      </div>
                      {/* Country */}
                      <div style={{display:'flex',alignItems:'center',fontSize:10,color:'rgba(255,255,255,0.45)',fontWeight:700}}>{aud.country}</div>
                      {/* Level */}
                      <div style={{display:'flex',alignItems:'center',gap:5}}>
                        <div style={{width:24,height:24,borderRadius:7,background:'rgba(56,189,248,0.1)',border:'1px solid rgba(56,189,248,0.22)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:900,color:'#38bdf8'}}>{aud.level}</div>
                      </div>
                      {/* Coins */}
                      <div style={{display:'flex',alignItems:'center',gap:4}}>
                        <div style={{width:5,height:5,borderRadius:'50%',background:'#ffd700',flexShrink:0}} />
                        <span style={{fontSize:11,fontWeight:800,color:'#ffd700'}}>{fmt(aud.coins)}</span>
                      </div>
                      {/* Diamonds */}
                      <div style={{display:'flex',alignItems:'center',gap:4}}>
                        {aud.diamonds > 0
                          ? <><div style={{width:5,height:5,borderRadius:'50%',background:'#bf00ff',flexShrink:0}} /><span style={{fontSize:11,fontWeight:800,color:'#bf00ff'}}>{fmt(aud.diamonds)}</span></>
                          : <span style={{fontSize:11,color:'rgba(255,255,255,0.15)'}}>—</span>}
                      </div>
                      {/* Action — kick */}
                      <div style={{display:'flex',alignItems:'center'}}>
                        {confirmId === aud.id ? (
                          <div style={{display:'flex',gap:4}}>
                            <button onClick={()=>handleKick(aud.id)}
                              style={{height:24,padding:'0 8px',borderRadius:7,background:'rgba(255,68,68,0.2)',border:'1px solid rgba(255,68,68,0.5)',color:'#ff4444',fontSize:8,fontWeight:900,cursor:'pointer',fontFamily:'inherit',letterSpacing:'0.05em'}}>
                              Kick
                            </button>
                            <button onClick={()=>setConfirmId(null)}
                              style={{width:24,height:24,borderRadius:7,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.4)',fontSize:9,fontWeight:900,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center'}}>
                              <I.X/>
                            </button>
                          </div>
                        ) : (
                          <button onClick={()=>setConfirmId(aud.id)} title="Kick from room"
                            style={{width:28,height:28,borderRadius:8,background:'rgba(255,68,68,0.07)',border:'1px solid rgba(255,68,68,0.18)',color:'#ff5555',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all .17s'}}
                            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(255,68,68,0.18)';(e.currentTarget as HTMLButtonElement).style.borderColor='rgba(255,68,68,0.45)';}}
                            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(255,68,68,0.07)';(e.currentTarget as HTMLButtonElement).style.borderColor='rgba(255,68,68,0.18)';}}>
                            <I.Kick/>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                }

                <Pagination page={safePg} total={totalPg} count={filtered.length} perPage={APPP} onChange={p=>{setPg(p);setConfirmId(null);}} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
const RPPP = 6;
export default function RoomManagementPage() {
  const [rooms,       setRooms]       = useState(ROOMS_RAW);
  const [search,      setSearch]      = useState('');
  const [typeF,       setTypeF]       = useState('');
  const [categoryF,   setCategoryF]   = useState('');
  const [statusF,     setStatusF]     = useState('');
  const [sortBy,      setSortBy]      = useState('viewers');
  const [page,        setPage]        = useState(1);
  const [activeRoom,  setActiveRoom]  = useState<typeof ROOMS_RAW[0] | null>(null);
  const [modalOpen,   setModalOpen]   = useState(false);

  const filtered = useMemo(() => {
    let arr = rooms.filter(r => {
      const q = search.toLowerCase();
      if (q && !r.title.toLowerCase().includes(q) && !r.host.toLowerCase().includes(q) && !r.id.toLowerCase().includes(q)) return false;
      if (typeF     && r.type     !== typeF)     return false;
      if (categoryF && r.category !== categoryF) return false;
      if (statusF   && r.status   !== statusF)   return false;
      return true;
    });
    arr.sort((a, b) => {
      if (sortBy === 'title')      return a.title.localeCompare(b.title);
      if (sortBy === 'startedMins')return b.startedMins - a.startedMins;
      return b.viewers - a.viewers;
    });
    return arr;
  }, [rooms, search, typeF, categoryF, statusF, sortBy]);

  const totalPgs  = Math.max(1, Math.ceil(filtered.length / RPPP));
  const safePg    = Math.min(page, totalPgs);
  const paged     = filtered.slice((safePg-1)*RPPP, safePg*RPPP);
  const hasFilter = search || typeF || categoryF || statusF || sortBy !== 'viewers';

  const totalViewers   = rooms.reduce((s, r) => s + r.viewers, 0);
  const pkCount        = rooms.filter(r => r.type === 'PK_BATTLE').length;
  const flaggedCount   = rooms.filter(r => r.status === 'FLAGGED').length;
  const sumFiltered    = filtered.reduce((s,r) => s+r.viewers, 0);

  const openRoom = (r: typeof ROOMS_RAW[0]) => { setActiveRoom(r); setModalOpen(true); };

  const SS: React.CSSProperties = {height:34,borderRadius:10,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.09)',color:'rgba(255,255,255,0.7)',fontSize:9,fontWeight:700,outline:'none',fontFamily:'inherit',padding:'0 22px 0 9px',cursor:'pointer',appearance:'none' as any,transition:'border-color .2s',boxSizing:'border-box' as const};

  const GS = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    select option { background: #0c1020; color: #fff; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 8px; }
    ::-webkit-scrollbar-thumb { background: rgba(0,255,255,0.18); border-radius: 8px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(0,255,255,0.38); }
    button { outline: none; }
    @keyframes lp { 0%,100%{opacity:1}50%{opacity:.4} }
  `;

  return (
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:'#060810',minHeight:'100vh',padding:'24px 22px',color:'#fff'}}>
      <style>{GS}</style>

      {/* HEADER */}
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:22,flexWrap:'wrap',gap:12}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
            <div style={{width:3,height:22,borderRadius:4,background:'#ff4444',boxShadow:'0 0 10px rgba(255,68,68,0.7)'}} />
            <h1 style={{fontSize:20,fontWeight:900,color:'#fff',letterSpacing:'-0.02em'}}>Live Room Control</h1>
            {/* pulsing LIVE indicator */}
            <span style={{display:'flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:20,background:'rgba(255,68,68,0.1)',border:'1px solid rgba(255,68,68,0.3)'}}>
              <span style={{width:6,height:6,borderRadius:'50%',background:'#ff4444',boxShadow:'0 0 6px #ff4444',animation:'lp 1.4s ease-in-out infinite',display:'inline-block'}} />
              <span style={{fontSize:8,fontWeight:900,color:'#ff4444',textTransform:'uppercase',letterSpacing:'0.2em'}}>{rooms.length} Live</span>
            </span>
          </div>
          <p style={{fontSize:9,color:'rgba(255,255,255,0.32)',letterSpacing:'0.14em',fontWeight:700,textTransform:'uppercase',paddingLeft:13}}>Real-time Streaming Oversight</p>
        </div>
        {/* Search */}
        <div style={{position:'relative'}}>
          <span style={{position:'absolute',left:9,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.25)',pointerEvents:'none'}}><I.Search/></span>
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search room, host, ID…"
            style={{width:220,height:36,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:11,paddingLeft:30,paddingRight:10,fontSize:10,fontWeight:600,color:'#fff',outline:'none',fontFamily:'inherit',transition:'border-color .2s'}}
            onFocus={e=>e.currentTarget.style.borderColor='rgba(255,68,68,0.45)'}
            onBlur={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.09)'} />
        </div>
      </div>

      {/* GLOBAL STATS */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:14}}>
        {[
          {l:'Active Streams', v:rooms.length,        color:'#00ffff', sub:'live instances'},
          {l:'Total Viewers',  v:fmt(totalViewers),   color:'#a855f7', sub:'concurrent'},
          {l:'PK Battles',     v:pkCount,             color:'#ff4444', sub:'active battles'},
          {l:'Flagged Rooms',  v:flaggedCount,        color:'#ffd700', sub:'need review'},
        ].map(({l,v,color,sub},i) => (
          <div key={l} style={{borderRadius:13,border:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,255,255,0.025)',padding:'12px 16px',position:'relative',overflow:'hidden'}}>
            <div style={{fontSize:8,color:'rgba(255,255,255,0.28)',textTransform:'uppercase',letterSpacing:'0.16em',marginBottom:3}}>{l}</div>
            <div style={{fontSize:20,fontWeight:900,color,textShadow:`0 0 14px ${color}40`}}>{v}</div>
            <div style={{fontSize:8,color:'rgba(255,255,255,0.2)',marginTop:2}}>{sub}</div>
            <div style={{position:'absolute',top:0,right:0,width:2,height:'100%',background:color,boxShadow:`0 0 10px ${color}80`}} />
          </div>
        ))}
      </div>

      {/* FILTER RESULT SUMMARY (when active) */}
      {hasFilter && (
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:7,marginBottom:12}}>
          {[
            {l:'Matching Rooms',  v:filtered.length,    color:'#00ffff'},
            {l:'Combined Viewers',v:fmt(sumFiltered),   color:'#a855f7'},
            {l:'PK Battles Match',v:filtered.filter(r=>r.type==='PK_BATTLE').length, color:'#ff4444'},
          ].map(({l,v,color}) => (
            <div key={l} style={{borderRadius:11,border:`1px solid ${color}1e`,background:`${color}07`,padding:'9px 13px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontSize:8,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.18em'}}>{l}</div>
              <div style={{fontSize:17,fontWeight:900,color,textShadow:`0 0 12px ${color}45`}}>{v}</div>
            </div>
          ))}
        </div>
      )}

      {/* FILTER BAR */}
      <div style={{borderRadius:15,border:'1px solid rgba(255,255,255,0.07)',background:'rgba(255,255,255,0.02)',padding:'12px 16px',marginBottom:12}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
          <div style={{display:'flex',alignItems:'center',gap:6,color:'rgba(255,255,255,0.3)',fontSize:9,fontWeight:900,textTransform:'uppercase',letterSpacing:'0.22em'}}>
            <I.Filter/> Filters &amp; Sorting
            {hasFilter && <span style={{width:6,height:6,borderRadius:'50%',background:'#ff4444',boxShadow:'0 0 6px #ff4444',display:'inline-block',marginLeft:2}} />}
          </div>
          {hasFilter && <button onClick={()=>{setSearch('');setTypeF('');setCategoryF('');setStatusF('');setSortBy('viewers');setPage(1);}} style={{fontSize:9,fontWeight:700,color:'rgba(255,68,68,0.7)',background:'none',border:'none',cursor:'pointer',fontFamily:'inherit',textTransform:'uppercase',letterSpacing:'0.12em'}}>× Reset all</button>}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
          {[
            {label:'Room Type',value:typeF,onChange:(v:string)=>{setTypeF(v);setPage(1);},options:[['','All Types'],['SOLO_LIVE','Solo Live'],['PK_BATTLE','PK Battle'],['MULTI_LIVE','Multi Live'],['TALENT_SHOW','Talent Show']]},
            {label:'Category', value:categoryF,onChange:(v:string)=>{setCategoryF(v);setPage(1);},options:[['','All Categories'],...CATEGORIES.map(c=>[c,c])]},
            {label:'Status',   value:statusF,onChange:(v:string)=>{setStatusF(v);setPage(1);},options:[['','All Status'],['ACTIVE','Active'],['FLAGGED','Flagged']]},
            {label:'Sort By',  value:sortBy,onChange:(v:string)=>{setSortBy(v);setPage(1);},options:[['viewers','Viewers ↓'],['startedMins','Longest Live'],['title','Title A–Z']]},
          ].map(({label,value,onChange,options}) => (
            <div key={label} style={{display:'flex',flexDirection:'column',gap:3}}>
              <label style={{fontSize:8,fontWeight:900,textTransform:'uppercase' as const,letterSpacing:'0.18em',color:'rgba(255,255,255,0.24)'}}>{label}</label>
              <div style={{position:'relative'}}>
                <select value={value} onChange={e=>onChange(e.target.value)} style={{...SS,width:'100%'}}
                  onFocus={e=>e.currentTarget.style.borderColor='rgba(255,68,68,0.38)'}
                  onBlur={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.09)'}>
                  {options.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <span style={{position:'absolute',right:6,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.28)',pointerEvents:'none'}}><I.ChevD/></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROOM TABLE */}
      <div style={{borderRadius:20,border:'1px solid rgba(255,68,68,0.1)',overflow:'hidden',background:'rgba(255,255,255,0.015)'}}>
        {/* thead */}
        <div style={{display:'grid',gridTemplateColumns:'2.5fr 1fr 1fr 0.8fr 0.8fr 1.2fr',padding:'10px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(0,0,0,0.35)'}}>
          {['Stream Identity','Type','Viewers','Category','Status','Actions'].map(h => (
            <div key={h} style={{fontSize:8,fontWeight:900,textTransform:'uppercase',letterSpacing:'0.2em',color:'rgba(255,255,255,0.27)'}}>{h}</div>
          ))}
        </div>

        {paged.length === 0
          ? <div style={{padding:44,textAlign:'center',color:'rgba(255,255,255,0.22)',fontSize:13}}>No live rooms match your filters.</div>
          : paged.map((room, idx) => {
            const ts = TYPE_STYLE[room.type] || TYPE_STYLE.SOLO_LIVE;
            const catColor = CAT_COLOR[room.category] || '#fff';
            return (
              <div key={room.id}
                style={{display:'grid',gridTemplateColumns:'2.5fr 1fr 1fr 0.8fr 0.8fr 1.2fr',padding:'13px 20px',borderBottom:'1px solid rgba(255,255,255,0.04)',transition:'background .14s',cursor:'pointer'}}
                onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='rgba(255,68,68,0.025)'}
                onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}
                onClick={() => openRoom(room)}>
                {/* Identity */}
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{position:'relative',flexShrink:0}}>
                    <div style={{width:38,height:38,borderRadius:11,background:'rgba(255,68,68,0.1)',border:'1px solid rgba(255,68,68,0.22)',display:'flex',alignItems:'center',justifyContent:'center',color:'#ff7777'}}>
                      <I.Video/>
                    </div>
                    {/* live pulse */}
                    <span style={{position:'absolute',top:-3,right:-3,width:9,height:9,borderRadius:'50%',background:'#ff4444',border:'2px solid #060810',boxShadow:'0 0 7px rgba(255,68,68,0.8)',animation:'lp 1.4s ease-in-out infinite'}} />
                  </div>
                  <div style={{minWidth:0}}>
                    <div style={{fontWeight:800,fontSize:13,color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:280}}>{room.title}</div>
                    <div style={{fontSize:9,color:'rgba(255,255,255,0.38)',marginTop:1,display:'flex',alignItems:'center',gap:5}}>
                      <I.Mic/>
                      <span>{room.host}</span>
                      <span style={{color:'rgba(255,255,255,0.2)'}}>·</span>
                      <span style={{color:'rgba(255,150,150,0.6)'}}>{room.id}</span>
                      <span style={{color:'rgba(255,255,255,0.2)'}}>·</span>
                      <span>{fmtMins(room.startedMins)}</span>
                    </div>
                  </div>
                </div>
                {/* Type */}
                <div style={{display:'flex',alignItems:'center'}}>
                  <span style={{fontSize:8,fontWeight:900,textTransform:'uppercase',letterSpacing:'0.1em',padding:'3px 8px',borderRadius:6,background:ts.bg,border:`1px solid ${ts.border}`,color:ts.text}}>{ts.label}</span>
                </div>
                {/* Viewers */}
                <div style={{display:'flex',flexDirection:'column',justifyContent:'center',gap:4}}>
                  <div style={{display:'flex',alignItems:'center',gap:5}}>
                    <I.Users/>
                    <span style={{fontSize:13,fontWeight:900,color:'#00ffff'}}>{fmt(room.viewers)}</span>
                  </div>
                  <div style={{height:3,width:60,background:'rgba(255,255,255,0.07)',borderRadius:4,overflow:'hidden'}}>
                    <div style={{height:'100%',background:'#00ffff',width:`${Math.min(100,(room.viewers/10000)*100)}%`,borderRadius:4}} />
                  </div>
                </div>
                {/* Category */}
                <div style={{display:'flex',alignItems:'center',gap:5}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:catColor,flexShrink:0}} />
                  <span style={{fontSize:10,fontWeight:700,color:catColor}}>{room.category}</span>
                </div>
                {/* Status */}
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:room.status==='ACTIVE'?'#22c55e':'#ff4444',boxShadow:`0 0 7px ${room.status==='ACTIVE'?'#22c55e':'#ff4444'}`}} />
                  <span style={{fontSize:9,fontWeight:900,textTransform:'uppercase',letterSpacing:'0.12em',color:room.status==='ACTIVE'?'#22c55e':'#ff4444'}}>{room.status}</span>
                </div>
                {/* Actions */}
                <div style={{display:'flex',alignItems:'center',gap:5}} onClick={e=>e.stopPropagation()}>
                  <button title="View Audience" onClick={e=>{e.stopPropagation();openRoom(room);}}
                    style={{width:30,height:30,borderRadius:9,background:'rgba(0,255,255,0.07)',border:'1px solid rgba(0,255,255,0.18)',color:'#00ffff',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all .17s'}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(0,255,255,0.18)';}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(0,255,255,0.07)';}}>
                    <I.Users/>
                  </button>
                  <button title="Monitor Stream"
                    style={{width:30,height:30,borderRadius:9,background:'rgba(168,85,247,0.07)',border:'1px solid rgba(168,85,247,0.18)',color:'#a855f7',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all .17s'}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(168,85,247,0.18)';}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(168,85,247,0.07)';}}>
                    <I.Monitor/>
                  </button>
                  <button title="Security Flag"
                    style={{width:30,height:30,borderRadius:9,background:'rgba(255,68,68,0.07)',border:'1px solid rgba(255,68,68,0.18)',color:'#ff5555',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all .17s'}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(255,68,68,0.18)';}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(255,68,68,0.07)';}}>
                    <I.Shield/>
                  </button>
                </div>
              </div>
            );
          })
        }

        <Pagination page={safePg} total={totalPgs} count={filtered.length} perPage={RPPP} onChange={p=>setPage(p)} />
      </div>

      {/* ROOM DETAIL MODAL */}
      <RoomDetailModal room={activeRoom} open={modalOpen} onClose={()=>setModalOpen(false)} />
    </div>
  );
}