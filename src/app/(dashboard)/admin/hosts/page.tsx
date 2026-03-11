'use client';

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── ICONS ────────────────────────────────────────────────────────────────────
type IcProps = {
  p: string | string[];
  s?: number;
  sw?: number;
  fill?: string;
};

const Ic = ({ p, s = 14, sw = 2, fill = "none" }: IcProps) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {(Array.isArray(p) ? p : [p]).map((d, i) => (
      <path key={i} d={d} />
    ))}
  </svg>
);

const I = {
  Search:  () => <Ic p="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />,
  Plus:    () => <Ic p="M12 5v14M5 12h14" />,
  X:       () => <Ic p="M18 6L6 18M6 6l12 12" />,
  Swap:    () => <Ic p={["M8 3L4 7l4 4","M4 7h16","M16 21l4-4-4-4","M20 17H4"]} />,
  Eye:     () => <Ic p={["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"]} />,
  Shield:  () => <Ic p="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  Check:   () => <Ic p="M20 6L9 17l-5-5" />,
  Left:    () => <Ic p="M15 18l-6-6 6-6" />,
  Right:   () => <Ic p="M9 18l6-6-6-6" />,
  DLeft:   () => <Ic p={["M11 17l-5-5 5-5","M18 17l-5-5 5-5"]} />,
  DRight:  () => <Ic p={["M13 17l5-5-5-5","M6 17l5-5-5-5"]} />,
  User:    () => <Ic p={["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2","M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"]} />,
  Mail:    () => <Ic p={["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","M22 6l-10 7L2 6"]} />,
  Build:   () => <Ic p="M3 21h18M3 7l9-4 9 4M4 7v14M20 7v14M9 21v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4" />,
  Star:    () => <Ic p="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  Filter:  () => <Ic p="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />,
  Trend:   () => <Ic p="M22 7l-9.5 9.5-5-5L1 17" />,
  Clock:   () => <Ic p={["M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z","M12 6v6l4 2"]} />,
  ChevD:   () => <Ic p="M6 9l6 6 6-6" />,
  Calendar:() => <Ic p={["M8 2v4M16 2v4M3 10h18","M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"]} />,
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const AGENCIES = [
  { id:"AG1", name:"Stellar Talent",  tier:"ELITE",   status:"ACTIVE"   },
  { id:"AG2", name:"Neon Streamers",  tier:"PRO",     status:"ACTIVE"   },
  { id:"AG3", name:"Void Nexus",      tier:"STARTER", status:"INACTIVE" },
  { id:"AG4", name:"Aether Media",    tier:"PRO",     status:"ACTIVE"   },
  { id:"AG5", name:"Quantum Guild",   tier:"PRO",     status:"ACTIVE"   },
  { id:"AG6", name:"Solar Syndicate", tier:"ELITE",   status:"ACTIVE"   },
];

const TX_SOURCES = [
  "Live Stream Gift","Diamond Bonus","Agency Bonus","Viewer Tips",
  "Event Reward","Mission Complete","Weekly Payout","Top Streamer Bonus",
];
const rng = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;

function genTxs(hostId: string) {
  const txs = [], base = new Date("2024-01-01");
  for (let i = 0; i < 40; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + rng(0, 365));
    txs.push({
      id: `TX-${hostId}-${i}`,
      date: d.toISOString().split("T")[0],
      source: TX_SOURCES[rng(0, TX_SOURCES.length - 1)],
      coins: rng(1, 80) * 1000,
      diamonds: Math.random() > 0.4 ? rng(10, 500) : 0,
      viewer: `User_${rng(1000, 9999)}`,
      type: Math.random() > 0.3 ? "EARN" : "BONUS",
    });
  }
  return txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const INIT_HOSTS = [
  { id:"1",  name:"Luna Divine",   agencyId:"AG1", agency:"Stellar Talent",  followers:"125K", diamonds:85000,  coins:210000, level:45, roomName:"Luna World",    email:"luna@spark.live",   joinDate:"2023-03-12", liveDays:89,  totalHours:312, totalSecs:1123200 },
  { id:"2",  name:"Shadow Dancer", agencyId:"AG2", agency:"Neon Streamers",  followers:"42K",  diamonds:12000,  coins:85000,  level:22, roomName:"Shadow Zone",   email:"shadow@spark.live", joinDate:"2023-08-01", liveDays:34,  totalHours:98,  totalSecs:352800  },
  { id:"3",  name:"Cyber Queen",   agencyId:"AG1", agency:"Stellar Talent",  followers:"210K", diamonds:450000, coins:980000, level:68, roomName:"Queen Palace",  email:"cyber@spark.live",  joinDate:"2022-11-20", liveDays:210, totalHours:891, totalSecs:3207600 },
  { id:"4",  name:"Nova Spark",    agencyId:"AG4", agency:"Aether Media",    followers:"8K",   diamonds:2500,   coins:15000,  level:12, roomName:"Nova Stage",    email:"nova@spark.live",   joinDate:"2024-02-14", liveDays:12,  totalHours:28,  totalSecs:100800  },
  { id:"5",  name:"Zen Master",    agencyId:null,  agency:"Independent",     followers:"55K",  diamonds:34000,  coins:120000, level:31, roomName:"Zen Garden",    email:"zen@spark.live",    joinDate:"2023-05-30", liveDays:67,  totalHours:210, totalSecs:756000  },
  { id:"6",  name:"Storm Breaker", agencyId:"AG2", agency:"Neon Streamers",  followers:"33K",  diamonds:9800,   coins:56000,  level:19, roomName:"Storm Rift",    email:"storm@spark.live",  joinDate:"2023-10-05", liveDays:28,  totalHours:76,  totalSecs:273600  },
  { id:"7",  name:"Pixel Phoenix", agencyId:"AG5", agency:"Quantum Guild",   followers:"77K",  diamonds:61000,  coins:190000, level:37, roomName:"Phoenix Nest",  email:"pixel@spark.live",  joinDate:"2023-06-18", liveDays:78,  totalHours:228, totalSecs:820800  },
  { id:"8",  name:"Frost Byte",    agencyId:"AG4", agency:"Aether Media",    followers:"19K",  diamonds:7200,   coins:34000,  level:26, roomName:"Frost Chamber", email:"frost@spark.live",  joinDate:"2024-01-09", liveDays:19,  totalHours:52,  totalSecs:187200  },
  { id:"9",  name:"Omega Flash",   agencyId:"AG6", agency:"Solar Syndicate", followers:"98K",  diamonds:130000, coins:410000, level:52, roomName:"Omega Stage",   email:"omega@spark.live",  joinDate:"2022-12-01", liveDays:145, totalHours:510, totalSecs:1836000 },
  { id:"10", name:"Neon Viper",    agencyId:"AG3", agency:"Void Nexus",      followers:"14K",  diamonds:4100,   coins:22000,  level:15, roomName:"Viper Den",     email:"neon@spark.live",   joinDate:"2024-03-22", liveDays:8,   totalHours:19,  totalSecs:68400   },
  { id:"11", name:"Blaze Star",    agencyId:"AG6", agency:"Solar Syndicate", followers:"61K",  diamonds:44000,  coins:145000, level:41, roomName:"Blaze Arena",   email:"blaze@spark.live",  joinDate:"2023-01-15", liveDays:55,  totalHours:180, totalSecs:648000  },
  { id:"12", name:"Echo Pulse",    agencyId:"AG5", agency:"Quantum Guild",   followers:"29K",  diamonds:18000,  coins:67000,  level:28, roomName:"Echo Chamber",  email:"echo@spark.live",   joinDate:"2023-09-22", liveDays:42,  totalHours:120, totalSecs:432000  },
];

// Build TX_DB at module level (stable across renders)
const TX_DB: Record<string, ReturnType<typeof genTxs>> = {};
INIT_HOSTS.forEach(h => { TX_DB[h.id] = genTxs(h.id); });

// ─── UTILS ────────────────────────────────────────────────────────────────────
const fmt  = (n: number) => n >= 1e6 ? (n/1e6).toFixed(1)+"M" : n >= 1e3 ? (n/1e3).toFixed(1)+"K" : String(n);
const fmtN = (n: number) => n.toLocaleString();
const fmtT = (s: number) => { const h = Math.floor(s/3600), m = Math.floor((s%3600)/60); return h > 0 ? `${h}h ${m}m` : `${m}m`; };

const TIER: Record<string, {text:string,bg:string,border:string}> = {
  ELITE:       { text:"#facc15", bg:"rgba(250,204,21,0.12)",  border:"rgba(250,204,21,0.28)"  },
  PRO:         { text:"#38bdf8", bg:"rgba(56,189,248,0.12)",  border:"rgba(56,189,248,0.28)"  },
  STARTER:     { text:"#94a3b8", bg:"rgba(148,163,184,0.10)", border:"rgba(148,163,184,0.22)" },
  INDEPENDENT: { text:"#64748b", bg:"rgba(100,116,139,0.08)", border:"rgba(100,116,139,0.2)"  },
};
const agTierOf = (agencyId: string | null) =>
  agencyId ? (AGENCIES.find(a => a.id === agencyId)?.tier || "STARTER") : "INDEPENDENT";

// ─── PAGINATION ───────────────────────────────────────────────────────────────
interface PaginationProps { page: number; total: number; count: number; perPage: number; onChange: (p: number) => void; }
function Pagination({ page, total, count, perPage, onChange }: PaginationProps) {
  const start = count === 0 ? 0 : (page - 1) * perPage + 1;
  const end   = Math.min(page * perPage, count);
  const pages = useMemo(() => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1) as (number|string)[];
    if (page <= 4)  return [1,2,3,4,5,"…",total] as (number|string)[];
    if (page >= total - 3) return [1,"…",total-4,total-3,total-2,total-1,total] as (number|string)[];
    return [1,"…",page-1,page,page+1,"…",total] as (number|string)[];
  }, [page, total]);

  const base: React.CSSProperties = { height:30,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",border:"none",outline:"none" };
  const idle: React.CSSProperties = {...base,width:30,background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.45)",border:"1px solid rgba(255,255,255,0.08)"};
  const act:  React.CSSProperties = {...base,width:30,background:"rgba(0,255,255,0.14)",color:"#00ffff",border:"1px solid rgba(0,255,255,0.4)",boxShadow:"0 0 12px rgba(0,255,255,0.15)"};
  const dis:  React.CSSProperties = {...base,width:30,background:"rgba(255,255,255,0.02)",color:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.05)",cursor:"not-allowed"};

  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 20px",borderTop:"1px solid rgba(255,255,255,0.06)",background:"rgba(0,0,0,0.28)"}}>
      <span style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.18em",color:"rgba(255,255,255,0.28)"}}>
        {count === 0 ? "No results" : <><span style={{color:"#00ffff"}}>{start}–{end}</span> of {count}</>}
      </span>
      <div style={{display:"flex",gap:3,alignItems:"center"}}>
        <button style={page===1?dis:idle} disabled={page===1} onClick={()=>onChange(1)}><I.DLeft/></button>
        <button style={page===1?dis:idle} disabled={page===1} onClick={()=>onChange(page-1)}><I.Left/></button>
        {pages.map((p, i) =>
          p === "…"
            ? <span key={`e${i}`} style={{width:22,textAlign:"center",color:"rgba(255,255,255,0.22)",fontSize:13,userSelect:"none"}}>·</span>
            : <button key={p} style={page === p ? act : idle} onClick={() => onChange(Number(p))}>{p}</button>
        )}
        <button style={page===total?dis:idle} disabled={page===total} onClick={()=>onChange(page+1)}><I.Right/></button>
        <button style={page===total?dis:idle} disabled={page===total} onClick={()=>onChange(total)}><I.DRight/></button>
      </div>
      <span style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.18em",color:"rgba(255,255,255,0.28)"}}>
        pg <span style={{color:"#fff"}}>{page}/{total}</span>
      </span>
    </div>
  );
}

// ─── MODAL WRAPPER ────────────────────────────────────────────────────────────
interface ModalProps { open: boolean; onClose: () => void; children: React.ReactNode; accent?: string; maxW?: number; }
function Modal({ open, onClose, children, accent = "#00ffff", maxW = 480 }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            onClick={onClose}
            style={{position:"fixed",inset:0,zIndex:50,background:"rgba(0,0,0,0.88)",backdropFilter:"blur(14px)"}} />
          <div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16,pointerEvents:"none"}}>
            <motion.div initial={{opacity:0,scale:0.91,y:20}} animate={{opacity:1,scale:1,y:0}}
              exit={{opacity:0,scale:0.91,y:12}} transition={{type:"spring",stiffness:340,damping:28}}
              style={{width:"100%",maxWidth:maxW,position:"relative",pointerEvents:"auto",maxHeight:"94vh",overflowY:"auto"}}>
              <div style={{position:"absolute",inset:-1,borderRadius:24,background:`linear-gradient(135deg,${accent}28,transparent 60%)`,filter:"blur(6px)"}} />
              <div style={{position:"relative",borderRadius:24,border:`1px solid ${accent}22`,background:"#070b14",overflow:"hidden"}}>
                <motion.div animate={{x:["-100%","220%"]}} transition={{duration:2.8,repeat:Infinity,ease:"linear",repeatDelay:3.5}}
                  style={{position:"absolute",top:0,left:0,width:"40%",height:1,background:`linear-gradient(90deg,transparent,${accent},transparent)`,zIndex:10}} />
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function MHead({ icon, sup, title, onClose, accent = "#00ffff" }: {icon:React.ReactNode;sup:string;title:string;onClose:()=>void;accent?:string}) {
  return (
    <div style={{padding:"18px 22px 14px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:`linear-gradient(135deg,${accent}07,transparent 55%)`}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:11}}>
          <div style={{width:36,height:36,borderRadius:13,background:`${accent}14`,border:`1px solid ${accent}30`,display:"flex",alignItems:"center",justifyContent:"center",color:accent,boxShadow:`0 0 18px ${accent}20`}}>{icon}</div>
          <div>
            <p style={{fontSize:8,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.3em",color:`${accent}55`,margin:"0 0 2px"}}>{sup}</p>
            <h2 style={{fontSize:14,fontWeight:900,color:"#fff",letterSpacing:"-0.01em",margin:0}}>{title}</h2>
          </div>
        </div>
        <button onClick={onClose}
          style={{width:28,height:28,borderRadius:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",color:"rgba(255,255,255,0.35)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all .2s",outline:"none"}}
          onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background="rgba(255,55,55,0.15)";(e.currentTarget as HTMLButtonElement).style.color="#ff4444";}}
          onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.04)";(e.currentTarget as HTMLButtonElement).style.color="rgba(255,255,255,0.35)";}}>
          <I.X/>
        </button>
      </div>
    </div>
  );
}

// ─── ADD HOST MODAL ───────────────────────────────────────────────────────────
function AddHostModal({ open, onClose, onAdd }: {open:boolean;onClose:()=>void;onAdd:(h:any)=>void}) {
  const blank = {name:"",email:"",agency:"",roomName:"",level:"1"};
  const [form, setForm] = useState(blank);
  const [errs, setErrs] = useState<any>({});
  const [step, setStep] = useState(1);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    setForm(p => ({...p,[k]:e.target.value})); setErrs((p:any) => ({...p,[k]:""}));
  };
  const validate = () => {
    const e: any = {};
    if (!form.name.trim())  e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.roomName.trim()) e.roomName = "Required";
    setErrs(e); return !Object.keys(e).length;
  };
  const submit = () => {
    if (!validate()) return;
    const ag = AGENCIES.find(a => a.id === form.agency);
    const h = { id: String(Date.now()), name: form.name, email: form.email,
      agencyId: form.agency || null, agency: ag?.name ?? "Independent",
      roomName: form.roomName, level: +form.level || 1, followers: "0",
      diamonds: 0, coins: 0, joinDate: new Date().toISOString().split("T")[0],
      liveDays: 0, totalHours: 0, totalSecs: 0 };
    TX_DB[h.id] = []; onAdd(h); setForm(blank); setStep(1); setErrs({}); onClose();
  };
  const close = () => { setForm(blank); setStep(1); setErrs({}); onClose(); };

  const IS = (err?: string): React.CSSProperties => ({
    width:"100%",height:38,borderRadius:11,background:"rgba(255,255,255,0.04)",
    border:`1px solid ${err?"rgba(255,80,80,0.5)":"rgba(255,255,255,0.1)"}`,
    paddingLeft:30,paddingRight:10,fontSize:11,fontWeight:600,color:"#fff",
    outline:"none",fontFamily:"inherit",transition:"border-color .2s",boxSizing:"border-box",
  });
  const SS: React.CSSProperties = {width:"100%",height:38,borderRadius:11,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",paddingLeft:10,fontSize:11,fontWeight:600,color:"#fff",outline:"none",fontFamily:"inherit",appearance:"none",boxSizing:"border-box"};
  const LB: React.CSSProperties = {fontSize:8,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.25em",color:"rgba(255,255,255,0.3)",display:"block",margin:"0 0 5px"};

  return (
    <Modal open={open} onClose={close} accent="#00ffff" maxW={440}>
      <MHead icon={<I.Plus/>} sup="Host Registry" title="Register New Host" onClose={close} accent="#00ffff"/>
      <div style={{padding:"18px 22px"}}>
        {/* Steps */}
        <div style={{display:"flex",alignItems:"center",marginBottom:20}}>
          {[{n:1,l:"Identity"},{n:2,l:"Platform"},{n:3,l:"Confirm"}].map(({n,l},i) => (
            <React.Fragment key={n}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:step>=n?"rgba(0,255,255,0.18)":"rgba(255,255,255,0.05)",border:`1px solid ${step>=n?"rgba(0,255,255,0.5)":"rgba(255,255,255,0.1)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:900,color:step>=n?"#00ffff":"rgba(255,255,255,0.25)",transition:"all .3s"}}>
                  {step > n ? "✓" : n}
                </div>
                <span style={{fontSize:8,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",color:step>=n?"rgba(0,255,255,0.55)":"rgba(255,255,255,0.2)"}}>{l}</span>
              </div>
              {i < 2 && <div style={{flex:1,height:1,background:step>n?"rgba(0,255,255,0.3)":"rgba(255,255,255,0.08)",margin:"0 6px",marginBottom:14,transition:"background .3s"}} />}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{opacity:0,x:14}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-14}} style={{display:"flex",flexDirection:"column",gap:13}}>
              <div>
                <label style={LB}>Display Name *</label>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.2)",pointerEvents:"none"}}><I.User/></span>
                  <input value={form.name} onChange={set("name")} placeholder="e.g. Luna Divine" style={IS(errs.name)}
                    onFocus={e=>e.currentTarget.style.borderColor="rgba(0,255,255,0.4)"} onBlur={e=>e.currentTarget.style.borderColor=errs.name?"rgba(255,80,80,0.5)":"rgba(255,255,255,0.1)"} />
                </div>
                {errs.name && <p style={{fontSize:8,color:"#ff5555",margin:"4px 0 0"}}>{errs.name}</p>}
              </div>
              <div>
                <label style={LB}>Email Address *</label>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.2)",pointerEvents:"none"}}><I.Mail/></span>
                  <input value={form.email} onChange={set("email")} placeholder="host@platform.live" style={IS(errs.email)}
                    onFocus={e=>e.currentTarget.style.borderColor="rgba(0,255,255,0.4)"} onBlur={e=>e.currentTarget.style.borderColor=errs.email?"rgba(255,80,80,0.5)":"rgba(255,255,255,0.1)"} />
                </div>
                {errs.email && <p style={{fontSize:8,color:"#ff5555",margin:"4px 0 0"}}>{errs.email}</p>}
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="s2" initial={{opacity:0,x:14}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-14}} style={{display:"flex",flexDirection:"column",gap:13}}>
              <div>
                <label style={LB}>Room / Stream Name *</label>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.2)",pointerEvents:"none"}}><I.Star/></span>
                  <input value={form.roomName} onChange={set("roomName")} placeholder="e.g. Luna World Stage" style={IS(errs.roomName)}
                    onFocus={e=>e.currentTarget.style.borderColor="rgba(0,255,255,0.4)"} onBlur={e=>e.currentTarget.style.borderColor=errs.roomName?"rgba(255,80,80,0.5)":"rgba(255,255,255,0.1)"} />
                </div>
                {errs.roomName && <p style={{fontSize:8,color:"#ff5555",margin:"4px 0 0"}}>{errs.roomName}</p>}
              </div>
              <div>
                <label style={LB}>Assign Agency</label>
                <select value={form.agency} onChange={set("agency")} style={SS}>
                  <option value="">Independent (No Agency)</option>
                  {AGENCIES.map(a => <option key={a.id} value={a.id}>{a.name} — {a.tier}</option>)}
                </select>
              </div>
              <div>
                <label style={LB}>Starting Level</label>
                <select value={form.level} onChange={set("level")} style={SS}>
                  {[1,5,10,15,20].map(l => <option key={l} value={l}>Level {l}</option>)}
                </select>
              </div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="s3" initial={{opacity:0,x:14}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-14}} style={{display:"flex",flexDirection:"column",gap:7}}>
              <p style={{fontSize:8,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.22em",color:"rgba(255,255,255,0.25)",margin:"0 0 8px"}}>Confirm Details</p>
              {[["Name",form.name],["Email",form.email],["Room",form.roomName],["Agency",AGENCIES.find(a=>a.id===form.agency)?.name||"Independent"],["Level",`Level ${form.level}`]].map(([l,v]) => (
                <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",borderRadius:10,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)"}}>
                  <span style={{fontSize:9,textTransform:"uppercase",letterSpacing:"0.18em",color:"rgba(255,255,255,0.28)"}}>{l}</span>
                  <span style={{fontSize:11,fontWeight:700,color:"#00ffff"}}>{v || "—"}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{display:"flex",gap:8,marginTop:16}}>
          {step > 1 && <button onClick={()=>setStep(s=>s-1)} style={{padding:"0 16px",height:38,borderRadius:11,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>← Back</button>}
          {step < 3
            ? <button onClick={()=>{if(step===1&&!validate())return;setStep(s=>s+1);}} style={{flex:1,height:38,borderRadius:11,background:"rgba(0,255,255,0.1)",border:"1px solid rgba(0,255,255,0.3)",color:"#00ffff",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>Continue →</button>
            : <button onClick={submit} style={{flex:1,height:38,borderRadius:11,background:"rgba(0,255,255,0.1)",border:"1px solid rgba(0,255,255,0.3)",color:"#00ffff",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>✓ Register Host</button>
          }
        </div>
      </div>
    </Modal>
  );
}

// ─── TRANSFER MODAL ───────────────────────────────────────────────────────────
function TransferModal({ open, host, onClose, onTransfer }: {open:boolean;host:any;onClose:()=>void;onTransfer:(id:string,agId:string)=>void}) {
  const [sel, setSel] = useState("");
  if (!host) return null;
  return (
    <Modal open={open} onClose={onClose} accent="#22c55e" maxW={420}>
      <MHead icon={<I.Swap/>} sup="Super Admin · Agency Transfer" title="Transfer Host" onClose={onClose} accent="#22c55e"/>
      <div style={{padding:"18px 22px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderRadius:13,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",marginBottom:14}}>
          <div style={{width:36,height:36,borderRadius:11,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:11,color:"rgba(255,255,255,0.65)",flexShrink:0}}>
            {host.name.split(" ").map((n:string)=>n[0]).join("")}
          </div>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:13,color:"#fff"}}>{host.name}</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.32)",marginTop:1}}>{host.roomName}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:8,color:"rgba(255,255,255,0.2)",textTransform:"uppercase",letterSpacing:"0.12em"}}>Current</div>
            <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.45)",maxWidth:110,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{host.agency}</div>
          </div>
        </div>
        <p style={{fontSize:9,textAlign:"center",color:"rgba(34,197,94,0.45)",margin:"0 0 10px",letterSpacing:"0.1em"}}>↓ SELECT DESTINATION AGENCY</p>
        <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:210,overflowY:"auto"}}>
          {AGENCIES.filter(a => a.id !== host.agencyId).map(ag => {
            const on = sel === ag.id;
            return (
              <button key={ag.id} onClick={()=>setSel(ag.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 13px",borderRadius:11,background:on?"rgba(34,197,94,0.09)":"rgba(255,255,255,0.03)",border:`1px solid ${on?"rgba(34,197,94,0.4)":"rgba(255,255,255,0.07)"}`,cursor:"pointer",textAlign:"left",transition:"all .18s",fontFamily:"inherit",outline:"none"}}>
                <div style={{width:32,height:32,borderRadius:9,background:on?"rgba(34,197,94,0.15)":"rgba(255,255,255,0.06)",border:`1px solid ${on?"rgba(34,197,94,0.4)":"rgba(255,255,255,0.1)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:900,color:on?"#22c55e":"rgba(255,255,255,0.4)"}}>
                  {ag.name.split(" ").map(n=>n[0]).join("")}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,fontWeight:700,color:on?"#fff":"rgba(255,255,255,0.62)"}}>{ag.name}</div>
                  <div style={{fontSize:8,color:"rgba(255,255,255,0.25)",textTransform:"uppercase",letterSpacing:"0.12em"}}>{ag.tier}</div>
                </div>
                <span style={{fontSize:8,fontWeight:900,textTransform:"uppercase",padding:"2px 7px",borderRadius:5,background:ag.status==="ACTIVE"?"rgba(34,197,94,0.1)":"rgba(255,60,60,0.1)",border:`1px solid ${ag.status==="ACTIVE"?"rgba(34,197,94,0.3)":"rgba(255,60,60,0.3)"}`,color:ag.status==="ACTIVE"?"#22c55e":"#ff5555"}}>{ag.status}</span>
                {on && <span style={{color:"#22c55e",flexShrink:0}}><I.Check/></span>}
              </button>
            );
          })}
        </div>
        <div style={{display:"flex",gap:8,marginTop:14}}>
          <button disabled={!sel} onClick={()=>{if(sel){onTransfer(host.id,sel);setSel("");onClose();}}}
            style={{flex:1,height:38,borderRadius:11,background:sel?"rgba(34,197,94,0.1)":"rgba(255,255,255,0.03)",border:`1px solid ${sel?"rgba(34,197,94,0.35)":"rgba(255,255,255,0.07)"}`,color:sel?"#22c55e":"rgba(255,255,255,0.2)",fontSize:11,fontWeight:800,cursor:sel?"pointer":"not-allowed",fontFamily:"inherit"}}>✓ Confirm Transfer</button>
          <button onClick={onClose} style={{flex:1,height:38,borderRadius:11,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.4)",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── TRANSACTION MODAL (left card + right table) ──────────────────────────────
const TPP = 7;
function TransactionModal({ open, host, onClose }: {open:boolean;host:any;onClose:()=>void}) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo,   setDateTo]   = useState("");
  const [srcF,     setSrcF]     = useState("");
  const [srch,     setSrch]     = useState("");
  const [pg,       setPg]       = useState(1);

  // Reset filters when host changes
  React.useEffect(() => { setDateFrom(""); setDateTo(""); setSrcF(""); setSrch(""); setPg(1); }, [host?.id]);

  if (!host) return null;
  const allTxs = TX_DB[host.id] || [];
  const sources = Array.from(new Set(allTxs.map(t => t.source)));

  const filtered = allTxs.filter(tx => {
    if (dateFrom && tx.date < dateFrom) return false;
    if (dateTo   && tx.date > dateTo)   return false;
    if (srcF && tx.source !== srcF)     return false;
    if (srch && !tx.source.toLowerCase().includes(srch.toLowerCase()) && !tx.viewer.toLowerCase().includes(srch.toLowerCase())) return false;
    return true;
  });

  const totalPg = Math.max(1, Math.ceil(filtered.length / TPP));
  const safePg  = Math.min(pg, totalPg);
  const paged   = filtered.slice((safePg-1)*TPP, safePg*TPP);

  const sumCoins    = filtered.reduce((s,t) => s + t.coins, 0);
  const sumDiamonds = filtered.reduce((s,t) => s + t.diamonds, 0);
  const avgCoins    = filtered.length ? Math.round(sumCoins / filtered.length) : 0;
  const hasF        = dateFrom || dateTo || srcF || srch;

  const tier = agTierOf(host.agencyId);
  const ts   = TIER[tier] || TIER.INDEPENDENT;

  const IS2: React.CSSProperties = {height:32,borderRadius:9,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",color:"#fff",fontSize:9,fontWeight:600,outline:"none",fontFamily:"inherit",padding:"0 8px",boxSizing:"border-box" as const,colorScheme:"dark" as any};

  return (
    <Modal open={open} onClose={onClose} accent="#a855f7" maxW={1000}>
      <MHead icon={<I.Trend/>} sup="Host Transactions" title={`${host.name} — Earnings History`} onClose={onClose} accent="#a855f7"/>
      <div style={{padding:"16px 20px"}}>
        <div style={{display:"grid",gridTemplateColumns:"230px 1fr",gap:14,alignItems:"start"}}>

          {/* ── LEFT: Host Info Card ──────────────────────────────────── */}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {/* Profile block */}
            <div style={{borderRadius:16,border:"1px solid rgba(168,85,247,0.18)",background:"rgba(168,85,247,0.03)",overflow:"hidden",position:"relative"}}>
              <div style={{height:44,background:"linear-gradient(135deg,rgba(168,85,247,0.15),rgba(0,255,255,0.06))"}} />
              <div style={{padding:"0 14px 14px",marginTop:-22}}>
                <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,rgba(168,85,247,0.3),rgba(0,255,255,0.15))",border:"2px solid rgba(168,85,247,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,color:"#a855f7",marginBottom:8,boxShadow:"0 0 22px rgba(168,85,247,0.25)"}}>
                  {host.name.split(" ").map((n:string)=>n[0]).join("")}
                </div>
                <div style={{fontWeight:900,fontSize:15,color:"#fff",letterSpacing:"-0.01em"}}>{host.name}</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.36)",marginTop:1}}>{host.roomName}</div>
                <div style={{display:"flex",gap:5,marginTop:7,flexWrap:"wrap"}}>
                  <span style={{fontSize:8,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.1em",padding:"2px 7px",borderRadius:5,background:ts.bg,border:`1px solid ${ts.border}`,color:ts.text}}>{tier}</span>
                  <span style={{fontSize:8,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.1em",padding:"2px 7px",borderRadius:5,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.45)"}}>LVL {host.level}</span>
                </div>
              </div>
              <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",padding:"10px 14px",display:"flex",flexDirection:"column",gap:6}}>
                {([["Agency",host.agency,"rgba(255,255,255,0.55)"],["Followers",host.followers,"#00ffff"],["Email",host.email,"rgba(255,255,255,0.38)"],["Joined",host.joinDate,"rgba(255,255,255,0.42)"]] as [string,string,string][]).map(([l,v,c]) => (
                  <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:8,textTransform:"uppercase",letterSpacing:"0.12em",color:"rgba(255,255,255,0.22)"}}>{l}</span>
                    <span style={{fontSize:9,fontWeight:700,color:c,maxWidth:130,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"right"}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* All-time performance */}
            <div style={{borderRadius:14,border:"1px solid rgba(255,255,255,0.07)",background:"rgba(255,255,255,0.02)",padding:"11px 13px"}}>
              <p style={{fontSize:8,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.22em",color:"rgba(255,255,255,0.24)",margin:"0 0 9px"}}>All-Time Performance</p>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {([
                  ["💎 Diamonds", fmt(host.diamonds), "#bf00ff"],
                  ["🪙 Coins",    fmt(host.coins),    "#ffd700"],
                  ["📅 Live Days", String(host.liveDays), "#00ffff"],
                  ["⏱ Hours",    `${host.totalHours}h`, "#22c55e"],
                  ["⏰ Total Time", fmtT(host.totalSecs), "#f97316"],
                ] as [string,string,string][]).map(([l,v,c]) => (
                  <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 9px",borderRadius:9,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
                    <span style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>{l}</span>
                    <span style={{fontSize:13,fontWeight:900,color:c,textShadow:`0 0 12px ${c}50`}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Filter + Summary + Table ──────────────────────── */}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {/* Filters */}
            <div style={{borderRadius:14,border:"1px solid rgba(255,255,255,0.07)",background:"rgba(255,255,255,0.02)",padding:"11px 14px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:9}}>
                <div style={{display:"flex",alignItems:"center",gap:5,color:"rgba(255,255,255,0.3)",fontSize:8,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.22em"}}>
                  <I.Filter/> Date &amp; Source Filter
                </div>
                {hasF && <button onClick={()=>{setDateFrom("");setDateTo("");setSrcF("");setSrch("");setPg(1);}} style={{fontSize:8,fontWeight:700,color:"rgba(168,85,247,0.7)",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",textTransform:"uppercase",letterSpacing:"0.1em"}}>× Clear</button>}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1.2fr",gap:7}}>
                {[
                  {l:"From",    children:<input type="date" value={dateFrom} onChange={e=>{setDateFrom(e.target.value);setPg(1);}} style={{...IS2,width:"100%"}} />},
                  {l:"To",      children:<input type="date" value={dateTo}   onChange={e=>{setDateTo(e.target.value);setPg(1);}}   style={{...IS2,width:"100%"}} />},
                  {l:"Source",  children:<select value={srcF} onChange={e=>{setSrcF(e.target.value);setPg(1);}} style={{...IS2,width:"100%",appearance:"none"}}><option value="">All Sources</option>{sources.map(s=><option key={s} value={s}>{s}</option>)}</select>},
                  {l:"Search",  children:(
                    <div style={{position:"relative"}}>
                      <span style={{position:"absolute",left:6,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.22)",pointerEvents:"none"}}><I.Search/></span>
                      <input value={srch} onChange={e=>{setSrch(e.target.value);setPg(1);}} placeholder="Source or viewer…" style={{...IS2,width:"100%",paddingLeft:22,boxSizing:"border-box"}} />
                    </div>
                  )},
                ].map(({l,children}) => (
                  <div key={l}>
                    <label style={{fontSize:8,fontWeight:700,color:"rgba(255,255,255,0.22)",textTransform:"uppercase",letterSpacing:"0.14em",display:"block",marginBottom:4}}>{l}</label>
                    {children}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary stat boxes — live totals from filtered set */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7}}>
              {([
                {l:"Transactions",  v:fmtN(filtered.length), color:"#a855f7"},
                {l:"Total Coins",   v:fmt(sumCoins),          color:"#ffd700"},
                {l:"Total Diamonds",v:fmt(sumDiamonds),       color:"#bf00ff"},
                {l:"Avg / Tx",      v:fmt(avgCoins)+" 🪙",    color:"#22c55e"},
              ] as {l:string,v:string,color:string}[]).map(({l,v,color}) => (
                <motion.div key={l} layout
                  style={{borderRadius:12,border:`1px solid ${color}20`,background:`${color}08`,padding:"10px 12px"}}>
                  <div style={{fontSize:16,fontWeight:900,color,textShadow:`0 0 16px ${color}45`,lineHeight:1.1}}>{v}</div>
                  <div style={{fontSize:8,color:"rgba(255,255,255,0.26)",textTransform:"uppercase",letterSpacing:"0.14em",marginTop:4}}>{l}</div>
                </motion.div>
              ))}
            </div>

            {/* Transaction table */}
            <div style={{borderRadius:14,border:"1px solid rgba(255,255,255,0.07)",overflow:"hidden",background:"rgba(255,255,255,0.015)"}}>
              <div style={{display:"grid",gridTemplateColumns:"0.85fr 1.5fr 1fr 0.9fr 0.7fr 0.55fr",padding:"8px 14px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:"rgba(0,0,0,0.32)"}}>
                {["Date","Source","Viewer","Coins","Diamonds","Type"].map(h => (
                  <div key={h} style={{fontSize:8,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.18em",color:"rgba(255,255,255,0.26)"}}>{h}</div>
                ))}
              </div>
              <AnimatePresence initial={false}>
                {paged.length === 0
                  ? <div style={{padding:32,textAlign:"center",color:"rgba(255,255,255,0.22)",fontSize:12}}>No transactions found.</div>
                  : paged.map((tx, i) => (
                    <motion.div key={tx.id} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} transition={{delay:i*0.025}}
                      style={{display:"grid",gridTemplateColumns:"0.85fr 1.5fr 1fr 0.9fr 0.7fr 0.55fr",padding:"9px 14px",borderBottom:"1px solid rgba(255,255,255,0.04)",transition:"background .14s"}}
                      onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background="rgba(168,85,247,0.03)"}
                      onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background="transparent"}>
                      <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",fontWeight:600}}>{tx.date}</div>
                      <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.7)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",paddingRight:6}}>{tx.source}</div>
                      <div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>{tx.viewer}</div>
                      <div style={{display:"flex",alignItems:"center",gap:4}}>
                        <div style={{width:5,height:5,borderRadius:"50%",background:"#ffd700",boxShadow:"0 0 5px #ffd70070",flexShrink:0}} />
                        <span style={{fontSize:12,fontWeight:900,color:"#ffd700"}}>{fmt(tx.coins)}</span>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:4}}>
                        {tx.diamonds > 0
                          ? <><div style={{width:5,height:5,borderRadius:"50%",background:"#bf00ff",boxShadow:"0 0 5px #bf00ff70",flexShrink:0}} /><span style={{fontSize:12,fontWeight:900,color:"#bf00ff"}}>{fmt(tx.diamonds)}</span></>
                          : <span style={{fontSize:11,color:"rgba(255,255,255,0.16)"}}>—</span>}
                      </div>
                      <span style={{fontSize:8,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.07em",padding:"2px 6px",borderRadius:5,background:tx.type==="EARN"?"rgba(34,197,94,0.1)":"rgba(250,204,21,0.1)",border:`1px solid ${tx.type==="EARN"?"rgba(34,197,94,0.28)":"rgba(250,204,21,0.28)"}`,color:tx.type==="EARN"?"#22c55e":"#facc15",alignSelf:"center",display:"inline-block"}}>
                        {tx.type}
                      </span>
                    </motion.div>
                  ))
                }
              </AnimatePresence>
              <Pagination page={safePg} total={totalPg} count={filtered.length} perPage={TPP} onChange={p=>setPg(p)} />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ─── FILTER BAR ───────────────────────────────────────────────────────────────
function HostFilters({ f, onChange }: {f:any; onChange:(f:any)=>void}) {
  const SS: React.CSSProperties = {height:33,borderRadius:9,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",color:"rgba(255,255,255,0.7)",fontSize:10,fontWeight:700,outline:"none",fontFamily:"inherit",padding:"0 24px 0 9px",cursor:"pointer",appearance:"none",transition:"border-color .2s",boxSizing:"border-box",width:"100%"};
  const hasActive = f.agency || f.sortBy !== "name" || f.minDiamonds !== "0" || f.minCoins !== "0" || f.joinYear;
  const Sel = ({label,value,onChange:oc,children}:{label:string;value:string;onChange:(e:React.ChangeEvent<HTMLSelectElement>)=>void;children:React.ReactNode}) => (
    <div style={{display:"flex",flexDirection:"column",gap:3}}>
      <label style={{fontSize:8,fontWeight:900,textTransform:"uppercase" as const,letterSpacing:"0.18em",color:"rgba(255,255,255,0.24)",margin:0}}>{label}</label>
      <div style={{position:"relative"}}>
        <select value={value} onChange={oc} style={SS}
          onFocus={e=>e.currentTarget.style.borderColor="rgba(0,255,255,0.38)"}
          onBlur={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.09)"}>
          {children}
        </select>
        <span style={{position:"absolute",right:6,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.28)",pointerEvents:"none"}}><I.ChevD/></span>
      </div>
    </div>
  );
  return (
    <div style={{borderRadius:15,border:"1px solid rgba(255,255,255,0.07)",background:"rgba(255,255,255,0.02)",padding:"12px 16px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:6,color:"rgba(255,255,255,0.3)",fontSize:9,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.22em"}}>
          <I.Filter/>
          <span>Filters &amp; Sorting</span>
          {hasActive && <span style={{width:6,height:6,borderRadius:"50%",background:"#00ffff",boxShadow:"0 0 6px #00ffff",display:"inline-block",marginLeft:2}} />}
        </div>
        {hasActive && <button onClick={()=>onChange({agency:"",sortBy:"name",minDiamonds:"0",minCoins:"0",joinYear:"",page:1})} style={{fontSize:9,fontWeight:700,color:"rgba(0,255,255,0.6)",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",textTransform:"uppercase",letterSpacing:"0.12em"}}>× Reset all</button>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
        <Sel label="Agency" value={f.agency} onChange={e=>onChange({...f,agency:e.target.value,page:1})}>
          <option value="">All Agencies</option>
          {AGENCIES.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          <option value="NONE">Independent</option>
        </Sel>
        <Sel label="Sort By" value={f.sortBy} onChange={e=>onChange({...f,sortBy:e.target.value,page:1})}>
          {[["name","Name A–Z"],["diamonds","Diamonds ↓"],["coins","Coins ↓"],["level","Level ↓"],["liveDays","Live Days ↓"],["joinDate","Join Date ↓"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
        </Sel>
        <Sel label="Min Diamonds" value={f.minDiamonds} onChange={e=>onChange({...f,minDiamonds:e.target.value,page:1})}>
          <option value="0">Any Diamonds</option>
          <option value="1000">1K+</option>
          <option value="10000">10K+</option>
          <option value="50000">50K+</option>
          <option value="100000">100K+</option>
        </Sel>
        <Sel label="Min Coins" value={f.minCoins} onChange={e=>onChange({...f,minCoins:e.target.value,page:1})}>
          <option value="0">Any Coins</option>
          <option value="10000">10K+</option>
          <option value="50000">50K+</option>
          <option value="200000">200K+</option>
        </Sel>
        <Sel label="Join Year" value={f.joinYear} onChange={e=>onChange({...f,joinYear:e.target.value,page:1})}>
          <option value="">All Years</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </Sel>
      </div>
    </div>
  );
}

// ─── ACTION BUTTON ─────────────────────────────────────────────────────────────
function AB({ color, title, onClick, children }: {color:string;title:string;onClick:()=>void;children:React.ReactNode}) {
  const [h, setH] = useState(false);
  const rgb = color==="cyan"?"0,255,255":color==="green"?"34,197,94":color==="purple"?"168,85,247":"255,70,70";
  return (
    <button title={title} onClick={onClick}
      style={{width:30,height:30,borderRadius:9,background:h?`rgba(${rgb},0.18)`:`rgba(${rgb},0.06)`,border:`1px solid rgba(${rgb},${h?0.45:0.16})`,color:`rgba(${rgb},1)`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all .17s",outline:"none"}}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>{children}</button>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
const HPP = 5;

export default function HostManagementPage() {
  const [hosts,   setHosts]   = useState(INIT_HOSTS);
  const [search,  setSearch]  = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [txHost,  setTxHost]  = useState<any>(null);
  const [transH,  setTransH]  = useState<any>(null);
  const [f, setF] = useState({ agency:"", sortBy:"name", minDiamonds:"0", minCoins:"0", joinYear:"", page:1 });

  const filtered = useMemo(() => {
    let arr = hosts.filter(h => {
      const q = search.toLowerCase();
      if (q && !h.name.toLowerCase().includes(q) && !h.agency.toLowerCase().includes(q) && !h.roomName.toLowerCase().includes(q)) return false;
      if (f.agency === "NONE" && h.agencyId !== null) return false;
      if (f.agency && f.agency !== "NONE" && h.agencyId !== f.agency) return false;
      if (+h.diamonds < +f.minDiamonds) return false;
      if (+h.coins    < +f.minCoins)    return false;
      if (f.joinYear && !h.joinDate.startsWith(f.joinYear)) return false;
      return true;
    });
    arr.sort((a, b) => {
      if (f.sortBy === "name")     return a.name.localeCompare(b.name);
      if (f.sortBy === "joinDate") return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      return (b as any)[f.sortBy] - (a as any)[f.sortBy];
    });
    return arr;
  }, [hosts, search, f]);

  const totalPgs = Math.max(1, Math.ceil(filtered.length / HPP));
  const safePg   = Math.min(f.page, totalPgs);
  const paged    = filtered.slice((safePg-1)*HPP, safePg*HPP);

  const sumD = filtered.reduce((s,h) => s+h.diamonds, 0);
  const sumC = filtered.reduce((s,h) => s+h.coins, 0);
  const sumL = filtered.reduce((s,h) => s+h.liveDays, 0);
  const hasFilter = search || f.agency || f.minDiamonds !== "0" || f.minCoins !== "0" || f.joinYear;

  const handleAdd      = useCallback((h:any) => setHosts(p => [h,...p]), []);
  const handleTransfer = useCallback((hid:string, aid:string) => {
    const ag = AGENCIES.find(a => a.id === aid);
    setHosts(p => p.map(h => h.id === hid ? {...h, agencyId:aid, agency:ag?.name??h.agency} : h));
  }, []);

  const GS = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    select option { background: #0c1020; color: #fff; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 8px; }
    ::-webkit-scrollbar-thumb { background: rgba(0,255,255,0.18); border-radius: 8px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(0,255,255,0.38); }
    input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.5) brightness(1.2); }
    button { outline: none; }
  `;

  return (
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#060810",minHeight:"100vh",padding:"24px 22px",color:"#fff"}}>
      <style>{GS}</style>

      {/* HEADER */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:3}}>
            <div style={{width:3,height:22,borderRadius:4,background:"#00ffff",boxShadow:"0 0 10px rgba(0,255,255,0.7)"}} />
            <h1 style={{fontSize:20,fontWeight:900,color:"#fff",letterSpacing:"-0.02em"}}>Host Registry</h1>
          </div>
          <p style={{fontSize:9,color:"rgba(255,255,255,0.32)",letterSpacing:"0.14em",fontWeight:700,textTransform:"uppercase",paddingLeft:13}}>{hosts.length} Registered Hosts</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.25)",pointerEvents:"none"}}><I.Search/></span>
            <input value={search} onChange={e=>{setSearch(e.target.value);setF(fv=>({...fv,page:1}));}} placeholder="Search hosts, rooms…"
              style={{width:210,height:36,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:11,paddingLeft:30,paddingRight:10,fontSize:10,fontWeight:600,color:"#fff",outline:"none",fontFamily:"inherit",transition:"border-color .2s"}}
              onFocus={e=>e.currentTarget.style.borderColor="rgba(0,255,255,0.42)"}
              onBlur={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.09)"} />
          </div>
          <motion.button whileTap={{scale:0.95}} onClick={()=>setAddOpen(true)}
            style={{height:36,padding:"0 15px",borderRadius:11,border:"1px solid rgba(0,255,255,0.35)",background:"rgba(0,255,255,0.1)",color:"#00ffff",fontSize:10,fontWeight:900,letterSpacing:"0.08em",textTransform:"uppercase",display:"flex",alignItems:"center",gap:5,cursor:"pointer",boxShadow:"0 0 14px rgba(0,255,255,0.1)",fontFamily:"inherit"}}>
            <I.Plus/> Add Host
          </motion.button>
        </div>
      </div>

      {/* SEARCH RESULT SUMMARY BOXES */}
      <AnimatePresence>
        {hasFilter && (
          <motion.div initial={{opacity:0,y:-8,height:0}} animate={{opacity:1,y:0,height:"auto"}} exit={{opacity:0,y:-8,height:0}}
            style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:14,overflow:"hidden"}}>
            {([
              {l:"Matching Hosts", v:filtered.length,  color:"#00ffff"},
              {l:"Σ Diamonds",     v:fmt(sumD),          color:"#bf00ff"},
              {l:"Σ Coins",        v:fmt(sumC),          color:"#ffd700"},
              {l:"Σ Live Days",    v:sumL,               color:"#22c55e"},
            ] as {l:string,v:string|number,color:string}[]).map(({l,v,color},i)=>(
              <motion.div key={l} initial={{opacity:0,scale:0.94}} animate={{opacity:1,scale:1}} transition={{delay:i*0.04}}
                style={{borderRadius:11,border:`1px solid ${color}20`,background:`${color}07`,padding:"9px 13px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:7,color:"rgba(255,255,255,0.26)",textTransform:"uppercase",letterSpacing:"0.2em",marginBottom:3}}>{l}</div>
                  <div style={{fontSize:17,fontWeight:900,color,textShadow:`0 0 14px ${color}45`,lineHeight:1}}>{v}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL STATS */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:14}}>
        {([
          {l:"Total Hosts",   v:hosts.length,                               color:"#00ffff"},
          {l:"All Diamonds",  v:fmt(hosts.reduce((s,h)=>s+h.diamonds,0)),  color:"#bf00ff"},
          {l:"All Coins",     v:fmt(hosts.reduce((s,h)=>s+h.coins,0)),     color:"#ffd700"},
          {l:"All Live Days", v:hosts.reduce((s,h)=>s+h.liveDays,0),       color:"#22c55e"},
        ] as {l:string,v:string|number,color:string}[]).map(({l,v,color},i)=>(
          <motion.div key={l} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
            style={{borderRadius:12,border:"1px solid rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.025)",padding:"10px 14px"}}>
            <div style={{fontSize:8,color:"rgba(255,255,255,0.27)",textTransform:"uppercase",letterSpacing:"0.16em",marginBottom:3}}>{l}</div>
            <div style={{fontSize:17,fontWeight:900,color,textShadow:`0 0 12px ${color}38`}}>{v}</div>
          </motion.div>
        ))}
      </div>

      {/* FILTERS */}
      <div style={{marginBottom:12}}>
        <HostFilters f={f} onChange={setF} />
      </div>

      {/* HOST TABLE */}
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.08}}
        style={{borderRadius:20,border:"1px solid rgba(0,255,255,0.09)",overflow:"hidden",background:"rgba(255,255,255,0.015)"}}>
        {/* thead */}
        <div style={{display:"grid",gridTemplateColumns:"2fr 1.3fr 0.9fr 0.9fr 0.6fr 1.3fr",padding:"10px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:"rgba(0,0,0,0.35)"}}>
          {["Host Identity","Agency","💎 Diamonds","🪙 Coins","Lvl","Actions"].map(h=>(
            <div key={h} style={{fontSize:8,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.2em",color:"rgba(255,255,255,0.27)"}}>{h}</div>
          ))}
        </div>

        {/* rows */}
        <AnimatePresence initial={false}>
          {paged.length === 0
            ? <div style={{padding:44,textAlign:"center",color:"rgba(255,255,255,0.22)",fontSize:13}}>No hosts match your criteria.</div>
            : paged.map((host, idx) => {
              const tier = agTierOf(host.agencyId);
              const ts   = TIER[tier] || TIER.INDEPENDENT;
              return (
                <motion.div key={host.id} initial={{opacity:0,x:-5}} animate={{opacity:1,x:0}} exit={{opacity:0}} transition={{delay:idx*0.03}}
                  style={{display:"grid",gridTemplateColumns:"2fr 1.3fr 0.9fr 0.9fr 0.6fr 1.3fr",padding:"12px 20px",borderBottom:"1px solid rgba(255,255,255,0.04)",transition:"background .14s"}}
                  onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background="rgba(0,255,255,0.022)"}
                  onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background="transparent"}>
                  {/* Identity */}
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <div style={{width:36,height:36,borderRadius:11,background:"linear-gradient(135deg,rgba(0,255,255,0.14),rgba(191,0,255,0.1))",border:"1px solid rgba(0,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:11,color:"#00ffff",flexShrink:0}}>
                      {host.name.split(" ").map((n:string)=>n[0]).join("")}
                    </div>
                    <div>
                      <div style={{fontWeight:800,fontSize:13,color:"#fff"}}>{host.name}</div>
                      <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",marginTop:1}}>{host.roomName}</div>
                    </div>
                  </div>
                  {/* Agency */}
                  <div style={{display:"flex",flexDirection:"column",justifyContent:"center",gap:3}}>
                    <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.6)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:140}}>{host.agency}</div>
                    <span style={{fontSize:8,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.11em",padding:"2px 7px",borderRadius:5,display:"inline-flex",width:"fit-content",background:ts.bg,border:`1px solid ${ts.border}`,color:ts.text}}>{tier}</span>
                  </div>
                  {/* Diamonds */}
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <div style={{width:5,height:5,borderRadius:"50%",background:"#bf00ff",boxShadow:"0 0 7px #bf00ff",flexShrink:0}} />
                    <span style={{fontWeight:900,fontSize:14,color:"#bf00ff"}}>{fmt(host.diamonds)}</span>
                  </div>
                  {/* Coins */}
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <div style={{width:5,height:5,borderRadius:"50%",background:"#ffd700",boxShadow:"0 0 7px #ffd70070",flexShrink:0}} />
                    <span style={{fontWeight:900,fontSize:14,color:"#ffd700"}}>{fmt(host.coins)}</span>
                  </div>
                  {/* Level */}
                  <div style={{display:"flex",alignItems:"center"}}>
                    <div style={{width:30,height:30,borderRadius:9,background:"rgba(255,215,0,0.08)",border:"1px solid rgba(255,215,0,0.22)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:11,color:"#ffd700"}}>
                      {host.level}
                    </div>
                  </div>
                  {/* Actions */}
                  <div style={{display:"flex",alignItems:"center",gap:4}} onClick={e=>e.stopPropagation()}>
                    <AB color="purple" title="View Transactions"  onClick={()=>setTxHost(host)}><I.Trend/></AB>
                    <AB color="cyan"   title="Host Profile"       onClick={()=>setTxHost(host)}><I.Eye/></AB>
                    <AB color="green"  title="Transfer to Agency" onClick={()=>setTransH(host)}><I.Swap/></AB>
                    <AB color="red"    title="Security Audit"     onClick={()=>{}}><I.Shield/></AB>
                  </div>
                </motion.div>
              );
            })
          }
        </AnimatePresence>

        <Pagination page={safePg} total={totalPgs} count={filtered.length} perPage={HPP} onChange={p=>setF(fv=>({...fv,page:p}))} />
      </motion.div>

      {/* MODALS */}
      <AddHostModal      open={addOpen}    onClose={()=>setAddOpen(false)} onAdd={handleAdd} />
      <TransferModal     open={!!transH}   host={transH}                   onClose={()=>setTransH(null)} onTransfer={handleTransfer} />
      <TransactionModal  open={!!txHost}   host={txHost}                   onClose={()=>setTxHost(null)} />
    </div>
  );
}