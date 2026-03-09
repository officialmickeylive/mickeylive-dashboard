'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Search, Plus, Briefcase, Users, TrendingUp, Settings, Check, Eye, ChevronRight, Radio, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type Level = 'agency' | 'host' | 'user';

const mockAgencies = [
    { id: '1', name: 'Stellar Talent',  owner: 'Cassandra Nova', hosts: 42, earnings: 12500, status: 'ACTIVE',   tier: 'ELITE'   },
    { id: '2', name: 'Neon Streamers',  owner: 'Leo Flux',        hosts: 18, earnings: 4200,  status: 'ACTIVE',   tier: 'PRO'     },
    { id: '3', name: 'Void Nexus',      owner: 'Sylas Vane',      hosts: 5,  earnings: 900,   status: 'INACTIVE', tier: 'STARTER' },
    { id: '4', name: 'Aether Media',    owner: 'Luna Ray',         hosts: 31, earnings: 8700,  status: 'ACTIVE',   tier: 'PRO'     },
];

const mockHosts: Record<string, any[]> = {
    '1': [
        { id: 'H1', name: 'Alpha Stream', email: 'alpha@spark.live', roomName: 'Galaxy Room',  userCount: 142, status: 'LIVE',    earnings: 3400 },
        { id: 'H2', name: 'Beta Wave',    email: 'beta@spark.live',  roomName: 'Neon Den',     userCount: 0,   status: 'OFFLINE', earnings: 1870 },
        { id: 'H3', name: 'Gamma Force',  email: 'gamma@spark.live', roomName: 'Cyber Lounge', userCount: 89,  status: 'LIVE',    earnings: 2890 },
    ],
    '2': [
        { id: 'H4', name: 'Delta Node',  email: 'delta@spark.live',   roomName: 'Void Space',  userCount: 0,   status: 'OFFLINE', earnings: 940  },
        { id: 'H5', name: 'Epsilon X',   email: 'epsilon@spark.live', roomName: 'Pulse Arena', userCount: 201, status: 'LIVE',    earnings: 5120 },
    ],
    '3': [{ id: 'H6', name: 'Solar Host', email: 'sh@spark.live', roomName: 'Sun Chamber', userCount: 0, status: 'OFFLINE', earnings: 450 }],
    '4': [
        { id: 'H7', name: 'Quantum Host', email: 'qh@spark.live',   roomName: 'Quantum Rift', userCount: 312, status: 'LIVE',    earnings: 7800 },
        { id: 'H8', name: 'Nova Spark',   email: 'nova@spark.live',  roomName: 'Nova Stage',   userCount: 0,   status: 'OFFLINE', earnings: 3200 },
    ],
};

const mockUsers: Record<string, any[]> = {
    H1: [
        { id: 'U1', name: 'Nebula Knight',  email: 'nk@void.com',  joinType: 'CURRENT',  coins: 8400,  diamonds: 120,  level: 28, lastSeen: 'Now'    },
        { id: 'U2', name: 'Void Walker',    email: 'vw@null.ptr',  joinType: 'PAST',     coins: 1200,  diamonds: 0,    level: 8,  lastSeen: '2h ago'  },
        { id: 'U3', name: 'Solar Flare',    email: 'sf@nova.org',  joinType: 'UPCOMING', coins: 45000, diamonds: 2100, level: 56, lastSeen: 'Sched.'  },
    ],
    H3: [{ id: 'U4', name: 'Storm Rider', email: 'sr@storm.io',  joinType: 'CURRENT', coins: 3200, diamonds: 80,  level: 22, lastSeen: 'Now' }],
    H5: [{ id: 'U5', name: 'Pulse King',  email: 'pk@pulse.net', joinType: 'CURRENT', coins: 9800, diamonds: 310, level: 38, lastSeen: 'Now' }],
    H7: [
        { id: 'U6', name: 'Cyber Ghost',   email: 'cg@cyber.io',  joinType: 'CURRENT',  coins: 5500,  diamonds: 200, level: 33, lastSeen: 'Now'   },
        { id: 'U7', name: 'Pixel Warrior', email: 'pw@pixel.net', joinType: 'PAST',     coins: 2100,  diamonds: 45,  level: 19, lastSeen: '1d ago' },
    ],
};

// ── Status Dot ────────────────────────────────────────────────────────────────
function StatusDot({ status }: { status: string }) {
    const green    = status === 'ACTIVE' || status === 'LIVE' || status === 'CURRENT';
    const upcoming = status === 'UPCOMING';
    return (
        <div className="flex items-center gap-1.5">
            <div className={cn("w-1.5 h-1.5 rounded-full", green ? "bg-neon-green shadow-[0_0_6px_rgba(0,255,100,0.6)]" : upcoming ? "bg-neon-gold" : "bg-neon-red")} />
            <span className={cn("text-[10px] font-black uppercase tracking-wider", green ? "text-neon-green" : upcoming ? "text-neon-gold" : "text-neon-red")}>{status}</span>
        </div>
    );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────
const PANEL_CFG: Record<string, { color: string; rgb: string; label: string }> = {
    agency: { color: 'neon-green',  rgb: '0,255,100',  label: 'Agency' },
    host:   { color: 'neon-cyan',   rgb: '0,255,255',  label: 'Host'   },
    user:   { color: 'neon-purple', rgb: '191,0,255',  label: 'User'   },
};

function getPanelRows(item: any, level: string) {
    if (level === 'agency') return [
        { label: 'Owner',    value: item.owner,                          color: 'text-text-primary' },
        { label: 'Tier',     value: item.tier,                           color: 'text-neon-gold'    },
        { label: 'Hosts',    value: item.hosts,                          color: 'text-text-primary' },
        { label: 'Revenue',  value: `$${item.earnings?.toLocaleString()}`, color: 'text-neon-green' },
        { label: 'Status',   value: item.status,                         color: item.status === 'ACTIVE' ? 'text-neon-green' : 'text-neon-red' },
    ];
    if (level === 'host') return [
        { label: 'Room',       value: item.roomName,                          color: 'text-neon-cyan'    },
        { label: 'Status',     value: item.status,                            color: item.status === 'LIVE' ? 'text-neon-green' : 'text-neon-red' },
        { label: 'Live Users', value: item.userCount,                         color: 'text-text-primary' },
        { label: 'Earnings',   value: `$${item.earnings?.toLocaleString()}`,  color: 'text-neon-gold'    },
    ];
    return [
        { label: 'Join Type', value: item.joinType, color: item.joinType === 'CURRENT' ? 'text-neon-green' : item.joinType === 'UPCOMING' ? 'text-neon-gold' : 'text-text-muted' },
        { label: 'Level',     value: `LVL ${item.level}`,                    color: 'text-neon-cyan'    },
        { label: 'Coins',     value: item.coins?.toLocaleString(),           color: 'text-neon-gold'    },
        { label: 'Diamonds',  value: item.diamonds?.toLocaleString(),        color: 'text-neon-purple'  },
        { label: 'Last Seen', value: item.lastSeen,                          color: 'text-text-muted'   },
    ];
}

function DetailPanel({ item, level, onClose }: { item: any; level: string; onClose: () => void }) {
    const cfg = PANEL_CFG[level];
    return (
        <AnimatePresence>
            {item && (
                <motion.div key={item.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    style={{ width: 264, boxShadow: `0 0 28px rgba(${cfg.rgb},0.07)` }}
                    className={`shrink-0 rounded-xl border border-${cfg.color}/20 bg-dark-bg overflow-hidden`}
                >
                    <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
                        className={`absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-${cfg.color} to-transparent z-10`} />
                    <div className={`relative p-4 border-b border-card-border bg-gradient-to-br from-${cfg.color}/5 to-transparent`}>
                        <div className="flex items-start justify-between mb-3">
                            <span className={`text-[9px] font-black uppercase tracking-widest text-${cfg.color}/70`}>{cfg.label} Profile</span>
                            <button onClick={onClose} className="w-6 h-6 rounded-md bg-white/5 hover:bg-neon-red/20 hover:text-neon-red border border-card-border text-text-muted text-xs transition-all flex items-center justify-center">✕</button>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-xl bg-${cfg.color}/10 border border-${cfg.color}/30 flex items-center justify-center text-${cfg.color} font-black text-sm`}
                                style={{ boxShadow: `0 0 14px rgba(${cfg.rgb},0.15)` }}>
                                {item.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div>
                                <div className="font-black text-text-primary text-sm leading-tight">{item.name}</div>
                                {item.email && <div className="text-[10px] text-text-muted mt-0.5">{item.email}</div>}
                            </div>
                        </div>
                    </div>
                    <div className="p-4 space-y-2">
                        {getPanelRows(item, level).map(({ label, value, color }) => (
                            <div key={label} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-card-border hover:border-white/10 transition-all">
                                <span className="text-[9px] uppercase tracking-widest text-text-muted">{label}</span>
                                <span className={cn("text-xs font-black", color)}>{value}</span>
                            </div>
                        ))}
                        {level === 'user' && (
                            <div className="pt-1">
                                <div className="flex justify-between mb-1">
                                    <span className="text-[9px] uppercase tracking-widest text-text-muted">XP</span>
                                    <span className="text-[9px] text-neon-gold font-bold">{(item.level % 10) * 10}%</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(item.level % 10) * 10}%` }} transition={{ duration: 0.8 }}
                                        className="h-full bg-gradient-to-r from-neon-gold/60 to-neon-gold" />
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────
function Breadcrumb({ items, onNavigate }: { items: { label: string }[]; onNavigate: (i: number) => void }) {
    return (
        <div className="flex items-center gap-1 flex-wrap mb-4">
            {items.map((item, idx) => {
                const isLast = idx === items.length - 1;
                return (
                    <React.Fragment key={idx}>
                        <motion.button initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                            onClick={() => !isLast && onNavigate(idx)}
                            className={cn("flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                isLast ? "bg-neon-green/10 border border-neon-green/30 text-neon-green cursor-default"
                                       : "bg-white/5 border border-card-border text-text-muted hover:text-neon-green hover:border-neon-green/20 cursor-pointer"
                            )}>
                            {item.label}
                        </motion.button>
                        {!isLast && <ChevronRight size={12} className="text-text-muted/40" />}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

function EyeBtn({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
    return (
        <button onClick={onClick} title="View Details"
            className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all border border-transparent hover:border-neon-cyan/30">
            <Eye size={14} />
        </button>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AgencyManagementPage() {
    const [search, setSearch]                   = useState('');
    const [isOnboardModalOpen, setIsOnboardModal] = useState(false);
    const [level, setLevel]                     = useState<Level>('agency');
    const [selectedAgency, setSelectedAgency]   = useState<any>(null);
    const [selectedHost, setSelectedHost]       = useState<any>(null);
    const [panelItem, setPanelItem]             = useState<any>(null);

    const openPanel  = (e: React.MouseEvent, item: any) => { e.stopPropagation(); setPanelItem(item); };
    const closePanel = () => setPanelItem(null);

    const drillInto = (e: React.MouseEvent, next: Level, setter: (v: any) => void, item: any) => {
        e.stopPropagation(); setter(item); setLevel(next); setSearch(''); setPanelItem(null);
    };

    const breadcrumbs = [
        { label: 'Agency List' },
        ...(selectedAgency ? [{ label: selectedAgency.name }] : []),
        ...(selectedHost   ? [{ label: selectedHost.name   }] : []),
    ];

    const navigateTo = (idx: number) => {
        closePanel();
        if (idx === 0) { setLevel('agency'); setSelectedAgency(null); setSelectedHost(null); }
        if (idx === 1) { setLevel('host');   setSelectedHost(null); }
    };

    const currentData = (() => {
        if (level === 'agency') return mockAgencies;
        if (level === 'host')   return mockHosts[selectedAgency?.id] ?? [];
        return mockUsers[selectedHost?.id] ?? [];
    })();

    const filtered = currentData.filter((r: any) =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );

    // ── Columns ───────────────────────────────────────────────────────────────
    const agencyColumns: Column<any>[] = [
        {
            header: 'Agency / Corporate',
            accessor: (a) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-neon-green">
                        <Briefcase size={18} />
                    </div>
                    <div>
                        <div className="font-bold text-text-primary text-sm">{a.name}</div>
                        <div className="text-[10px] text-text-muted">Owner: {a.owner}</div>
                    </div>
                </div>
            )
        },
        { header: 'Tier', accessor: (a) => (
            <NeonBadge variant={a.tier === 'ELITE' ? 'gold' : a.tier === 'PRO' ? 'cyan' : 'muted'}>{a.tier}</NeonBadge>
        )},
        { header: 'Hosts',   accessor: (a) => <div className="flex items-center gap-1.5"><Users size={13} className="text-neon-cyan" /><span className="text-text-primary font-bold">{a.hosts}</span></div> },
        { header: 'Revenue', accessor: (a) => <div className="flex items-center gap-1.5"><TrendingUp size={13} className="text-neon-green" /><span className="text-neon-green font-black text-xs">${a.earnings.toLocaleString()}</span></div> },
        { header: 'Status',  accessor: (a) => <StatusDot status={a.status} /> },
        {
            header: 'Actions',
            accessor: (a) => (
                <div className="flex items-center gap-1">
                    <EyeBtn onClick={(e) => openPanel(e, a)} />
                    <button onClick={(e) => drillInto(e, 'host', setSelectedAgency, a)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neon-green/10 hover:bg-neon-green/20 border border-neon-green/20 hover:border-neon-green/40 text-neon-green text-[10px] font-black uppercase tracking-widest transition-all">
                        <Radio size={11} /><ChevronRight size={10} />
                    </button>
                </div>
            )
        },
    ];

    const hostColumns: Column<any>[] = [
        {
            header: 'Host',
            accessor: (h) => (
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan font-black text-xs">
                            {h.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        {h.status === 'LIVE' && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-neon-green border border-dark-bg shadow-[0_0_6px_rgba(0,255,100,0.8)]" />}
                    </div>
                    <div>
                        <div className="font-bold text-text-primary text-sm">{h.name}</div>
                        <div className="text-[10px] text-text-muted">{h.roomName}</div>
                    </div>
                </div>
            )
        },
        { header: 'Status',     accessor: (h) => <StatusDot status={h.status} /> },
        { header: 'Live Users', accessor: (h) => <span className={cn("font-black text-sm", h.userCount > 0 ? "text-neon-green" : "text-text-muted")}>{h.userCount}</span> },
        { header: 'Earnings',   accessor: (h) => <span className="text-neon-gold font-black text-xs">${h.earnings.toLocaleString()}</span> },
        {
            header: 'Actions',
            accessor: (h) => (
                <div className="flex items-center gap-1">
                    <EyeBtn onClick={(e) => openPanel(e, h)} />
                    <button onClick={(e) => drillInto(e, 'user', setSelectedHost, h)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/20 hover:border-neon-cyan/40 text-neon-cyan text-[10px] font-black uppercase tracking-widest transition-all">
                        <Users size={11} /><ChevronRight size={10} />
                    </button>
                </div>
            )
        },
    ];

    const userColumns: Column<any>[] = [
        {
            header: 'User',
            accessor: (u) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-card-border flex items-center justify-center text-text-primary font-black text-xs">
                        {u.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                        <div className="font-bold text-text-primary text-sm">{u.name}</div>
                        <div className="text-[10px] text-text-muted">{u.email}</div>
                    </div>
                </div>
            )
        },
        { header: 'Join Type', accessor: (u) => (
            <span className={cn("px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border",
                u.joinType === 'CURRENT'  ? "text-neon-green  border-neon-green/30  bg-neon-green/10"  :
                u.joinType === 'UPCOMING' ? "text-neon-gold   border-neon-gold/30   bg-neon-gold/10"   :
                                            "text-text-muted  border-card-border    bg-white/5"
            )}>{u.joinType}</span>
        )},
        { header: 'Level',    accessor: (u) => <span className="text-neon-cyan   font-black text-xs">LVL {u.level}</span> },
        { header: 'Coins',    accessor: (u) => <span className="text-neon-gold   font-black text-xs">{u.coins.toLocaleString()}</span> },
        { header: 'Diamonds', accessor: (u) => <span className="text-neon-purple font-black text-xs">{u.diamonds}</span> },
        { header: 'Last Seen',accessor: (u) => <span className="text-[10px] text-text-muted">{u.lastSeen}</span> },
        { header: 'Detail',   accessor: (u) => <EyeBtn onClick={(e) => openPanel(e, u)} /> },
    ];

    const colMap = { agency: agencyColumns, host: hostColumns, user: userColumns };

    const titleMap: Record<Level, { title: string; desc: string }> = {
        agency: { title: 'Agency Infrastructure',                         desc: 'Management and revenue tracking of registered agency units' },
        host:   { title: `Hosts — ${selectedAgency?.name}`,              desc: 'All hosts registered under this agency'                     },
        user:   { title: `Users — ${selectedHost?.roomName}`,            desc: 'Current, past and upcoming room participants'               },
    };

    return (
        <PageContainer>
            <PageHeader
                title={titleMap[level].title}
                description={titleMap[level].desc}
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-56">
                            <NeonInput placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search size={16} />} className="h-10" />
                        </div>
                        {level === 'agency' && (
                            <GlowButton variant="green" size="sm" className="flex items-center gap-2" onClick={() => setIsOnboardModal(true)}>
                                <Plus size={16} /> Onboard Agency
                            </GlowButton>
                        )}
                    </div>
                }
            />

            {breadcrumbs.length > 1 && <Breadcrumb items={breadcrumbs} onNavigate={navigateTo} />}

            <div className="flex gap-4 items-start">
                <motion.div key={level} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                    className="flex-1 glass-card p-1 rounded-2xl border border-neon-green/10 min-w-0">
                    <NeonTable columns={colMap[level]} data={filtered} onRowClick={(row) => setPanelItem(row)} />
                    {filtered.length === 0 && <div className="py-16 text-center text-text-muted text-sm">No records found.</div>}
                </motion.div>
                <DetailPanel item={panelItem} level={level} onClose={closePanel} />
            </div>

            <NeonModal isOpen={isOnboardModalOpen} onClose={() => setIsOnboardModal(false)} title="Onboard New Agency"
                description="Register a new management entity to oversee hosts and collect commission." variant="green"
                actions={<GlowButton variant="green" onClick={() => setIsOnboardModal(false)} className="flex items-center gap-2"><Check size={16} /> Establish Agency</GlowButton>}
            >
                <div className="space-y-4">
                    <NeonInput label="Agency Registered Name" placeholder="e.g. Stellar Talent" icon={<Briefcase size={16} />} />
                    <NeonInput label="Owner Principal Name"   placeholder="e.g. Cassandra Nova"  icon={<Users size={16} />} />
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Agency Tier Classification</label>
                        <select className="w-full bg-dark-bg/50 border border-card-border rounded-lg h-10 px-3 text-sm text-text-primary focus:outline-none focus:border-neon-green/50 transition-all">
                            <option value="STARTER">Starter Tier</option>
                            <option value="PRO">Pro Tier</option>
                            <option value="ELITE">Elite Syndicate</option>
                        </select>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}