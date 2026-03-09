'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import {
    Search, Plus, ShieldCheck, ChevronRight,
    Users, Radio, Building2, Eye, Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type Level = 'admin' | 'agency' | 'host' | 'user';

// ── Mock Data ─────────────────────────────────────────────────────────────────
const mockAdmins = [
    { id: 'A1', name: 'Zion Sentinel',  email: 'zion@spark.live',     level: 99, status: 'ACTIVE',   lastActive: '2 mins ago', agencyCount: 3 },
    { id: 'A2', name: 'Oracle Tech',    email: 'oracle@spark.live',   level: 85, status: 'ACTIVE',   lastActive: '1 hour ago', agencyCount: 2 },
    { id: 'A3', name: 'Vanguard X',     email: 'vanguard@spark.live', level: 78, status: 'INACTIVE', lastActive: '3 days ago', agencyCount: 1 },
    { id: 'A4', name: 'Cipher Zero',    email: 'cipher@spark.live',   level: 92, status: 'ACTIVE',   lastActive: 'Just now',   agencyCount: 4 },
];

const mockAgencies: Record<string, any[]> = {
    A1: [
        { id: 'AG1', name: 'Nebula Agency',  email: 'nebula@spark.live',  hostCount: 5, status: 'ACTIVE',   revenue: 128400 },
        { id: 'AG2', name: 'Void Corp',       email: 'void@spark.live',    hostCount: 3, status: 'ACTIVE',   revenue: 74200  },
        { id: 'AG3', name: 'Phantom Guild',   email: 'phantom@spark.live', hostCount: 2, status: 'INACTIVE', revenue: 12000  },
    ],
    A2: [
        { id: 'AG4', name: 'Solar Syndicate', email: 'solar@spark.live',   hostCount: 6, status: 'ACTIVE',   revenue: 215000 },
        { id: 'AG5', name: 'Apex Unit',       email: 'apex@spark.live',    hostCount: 4, status: 'ACTIVE',   revenue: 98000  },
    ],
    A3: [{ id: 'AG6', name: 'Dark Matter',    email: 'dark@spark.live',    hostCount: 2, status: 'INACTIVE', revenue: 8500   }],
    A4: [
        { id: 'AG7', name: 'Quantum Flux',    email: 'quantum@spark.live', hostCount: 7, status: 'ACTIVE',   revenue: 312000 },
        { id: 'AG8', name: 'Nova Collective', email: 'nova@spark.live',    hostCount: 5, status: 'ACTIVE',   revenue: 187000 },
    ],
};

const mockHosts: Record<string, any[]> = {
    AG1: [
        { id: 'H1', name: 'Alpha Stream', email: 'alpha@spark.live',   roomName: 'Galaxy Room',  userCount: 142, status: 'LIVE',    earnings: 34200 },
        { id: 'H2', name: 'Beta Wave',    email: 'beta@spark.live',    roomName: 'Neon Den',     userCount: 0,   status: 'OFFLINE', earnings: 18700 },
        { id: 'H3', name: 'Gamma Force',  email: 'gamma@spark.live',   roomName: 'Cyber Lounge', userCount: 89,  status: 'LIVE',    earnings: 28900 },
    ],
    AG2: [
        { id: 'H4', name: 'Delta Node',   email: 'delta@spark.live',   roomName: 'Void Space',   userCount: 0,   status: 'OFFLINE', earnings: 9400  },
        { id: 'H5', name: 'Epsilon X',    email: 'epsilon@spark.live', roomName: 'Pulse Arena',  userCount: 201, status: 'LIVE',    earnings: 51200 },
    ],
    AG4: [{ id: 'H6', name: 'Solar Host',   email: 'sh@spark.live',  roomName: 'Sun Chamber',   userCount: 312, status: 'LIVE',    earnings: 78000 }],
    AG7: [{ id: 'H7', name: 'Quantum Host', email: 'qh@spark.live',  roomName: 'Quantum Rift',  userCount: 0,   status: 'OFFLINE', earnings: 44100 }],
};

const mockUsers: Record<string, any[]> = {
    H1: [
        { id: 'U1', name: 'Nebula Knight',  email: 'nk@void.com',  joinType: 'CURRENT',  coins: 8400,  diamonds: 120,  level: 28, lastSeen: 'Now'       },
        { id: 'U2', name: 'Void Walker',    email: 'vw@null.ptr',  joinType: 'CURRENT',  coins: 1200,  diamonds: 0,    level: 8,  lastSeen: 'Now'       },
        { id: 'U3', name: 'Solar Flare',    email: 'sf@nova.org',  joinType: 'PAST',     coins: 45000, diamonds: 2100, level: 56, lastSeen: '2h ago'    },
        { id: 'U4', name: 'Cyber Phantom',  email: 'cp@ghost.net', joinType: 'PAST',     coins: 0,     diamonds: 5,    level: 15, lastSeen: '1d ago'    },
        { id: 'U5', name: 'Alpha Draconis', email: 'ad@matrix.io', joinType: 'UPCOMING', coins: 15200, diamonds: 450,  level: 42, lastSeen: 'Scheduled' },
    ],
    H3: [{ id: 'U6', name: 'Storm Rider', email: 'sr@storm.io',  joinType: 'CURRENT', coins: 3200, diamonds: 80,  level: 22, lastSeen: 'Now' }],
    H5: [{ id: 'U7', name: 'Pulse King',  email: 'pk@pulse.net', joinType: 'CURRENT', coins: 9800, diamonds: 310, level: 38, lastSeen: 'Now' }],
};

// ── Status Dot ────────────────────────────────────────────────────────────────
function StatusDot({ status }: { status: string }) {
    const isGreen    = status === 'ACTIVE' || status === 'LIVE' || status === 'CURRENT';
    const isUpcoming = status === 'UPCOMING';
    return (
        <div className="flex items-center gap-1.5">
            <div className={cn("w-1.5 h-1.5 rounded-full",
                isGreen ? "bg-neon-green shadow-[0_0_6px_rgba(0,255,100,0.6)]"
                : isUpcoming ? "bg-neon-gold" : "bg-neon-red")} />
            <span className={cn("text-[10px] font-black uppercase tracking-wider",
                isGreen ? "text-neon-green" : isUpcoming ? "text-neon-gold" : "text-neon-red")}>
                {status}
            </span>
        </div>
    );
}

// ── Universal Detail Panel ────────────────────────────────────────────────────
const PANEL_CFG: Record<string, { color: string; rgb: string; icon: React.ReactNode; label: string }> = {
    admin:  { color: 'neon-purple', rgb: '191,0,255',  icon: <ShieldCheck size={12} />, label: 'Admin'  },
    agency: { color: 'neon-gold',   rgb: '255,215,0',  icon: <Building2  size={12} />, label: 'Agency' },
    host:   { color: 'neon-cyan',   rgb: '0,255,255',  icon: <Radio      size={12} />, label: 'Host'   },
    user:   { color: 'neon-green',  rgb: '0,255,100',  icon: <Users      size={12} />, label: 'User'   },
};

function getPanelRows(item: any, level: string) {
    if (level === 'admin')  return [
        { label: 'Security Level', value: `LVL ${item.level}`,                  color: 'text-neon-gold'    },
        { label: 'Agencies',       value: item.agencyCount,                      color: 'text-text-primary' },
        { label: 'Status',         value: item.status,                           color: item.status === 'ACTIVE'   ? 'text-neon-green' : 'text-neon-red' },
        { label: 'Last Active',    value: item.lastActive,                       color: 'text-text-muted'   },
    ];
    if (level === 'agency') return [
        { label: 'Total Hosts',    value: item.hostCount,                        color: 'text-text-primary' },
        { label: 'Revenue',        value: `$${item.revenue?.toLocaleString()}`,  color: 'text-neon-green'   },
        { label: 'Status',         value: item.status,                           color: item.status === 'ACTIVE'   ? 'text-neon-green' : 'text-neon-red' },
    ];
    if (level === 'host')   return [
        { label: 'Room Name',      value: item.roomName,                         color: 'text-neon-cyan'    },
        { label: 'Status',         value: item.status,                           color: item.status === 'LIVE'     ? 'text-neon-green' : 'text-neon-red' },
        { label: 'Live Users',     value: item.userCount,                        color: 'text-text-primary' },
        { label: 'Earnings',       value: `$${item.earnings?.toLocaleString()}`, color: 'text-neon-gold'    },
    ];
    return [
        { label: 'Join Type',      value: item.joinType,                         color: item.joinType === 'CURRENT' ? 'text-neon-green' : item.joinType === 'UPCOMING' ? 'text-neon-gold' : 'text-text-muted' },
        { label: 'Level',          value: `LVL ${item.level}`,                   color: 'text-neon-cyan'    },
        { label: 'Coins',          value: item.coins?.toLocaleString(),          color: 'text-neon-gold'    },
        { label: 'Diamonds',       value: item.diamonds?.toLocaleString(),       color: 'text-neon-purple'  },
        { label: 'Last Seen',      value: item.lastSeen,                         color: 'text-text-muted'   },
    ];
}

function DetailPanel({ item, level, onClose }: { item: any; level: string; onClose: () => void }) {
    const cfg = PANEL_CFG[level];
    const barPct = level === 'admin' ? item?.level : (item?.level % 10) * 10;
    const showBar = level === 'admin' || level === 'user';

    return (
        <AnimatePresence>
            {item && (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    style={{ width: 272, boxShadow: `0 0 30px rgba(${cfg.rgb},0.07)` }}
                    className={`shrink-0 rounded-xl border border-${cfg.color}/20 bg-dark-bg overflow-hidden`}
                >
                    {/* scanline */}
                    <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
                        className={`absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-${cfg.color} to-transparent z-10`}
                    />

                    {/* Header */}
                    <div className={`relative p-4 border-b border-card-border bg-gradient-to-br from-${cfg.color}/5 to-transparent`}>
                        <div className="flex items-start justify-between mb-3">
                            <span className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-${cfg.color}/70`}>
                                {cfg.icon} {cfg.label} Profile
                            </span>
                            <button
                                onClick={onClose}
                                className="w-6 h-6 rounded-md bg-white/5 hover:bg-neon-red/20 hover:text-neon-red border border-card-border text-text-muted text-xs transition-all flex items-center justify-center"
                            >✕</button>
                        </div>
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-12 h-12 rounded-xl bg-${cfg.color}/10 border border-${cfg.color}/30 flex items-center justify-center text-${cfg.color} font-black text-sm`}
                                style={{ boxShadow: `0 0 14px rgba(${cfg.rgb},0.15)` }}
                            >
                                {item.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div>
                                <div className="font-black text-text-primary text-sm leading-tight">{item.name}</div>
                                <div className="text-[10px] text-text-muted mt-0.5">{item.email}</div>
                            </div>
                        </div>
                    </div>

                    {/* Rows */}
                    <div className="p-4 space-y-2">
                        {getPanelRows(item, level).map(({ label, value, color }) => (
                            <div key={label} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-card-border hover:border-white/10 transition-all">
                                <span className="text-[9px] uppercase tracking-widest text-text-muted">{label}</span>
                                <span className={cn("text-xs font-black", color)}>{value}</span>
                            </div>
                        ))}

                        {showBar && (
                            <div className="pt-1">
                                <div className="flex justify-between mb-1">
                                    <span className="text-[9px] uppercase tracking-widest text-text-muted">
                                        {level === 'admin' ? 'Security Bar' : 'XP Progress'}
                                    </span>
                                    <span className={`text-[9px] font-bold text-${cfg.color}`}>{barPct}%</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${barPct}%` }}
                                        transition={{ duration: 0.8 }}
                                        className={`h-full bg-gradient-to-r from-${cfg.color}/60 to-${cfg.color}`}
                                    />
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
function Breadcrumb({ items, onNavigate }: { items: { label: string; icon: React.ReactNode }[]; onNavigate: (i: number) => void }) {
    return (
        <div className="flex items-center gap-1 flex-wrap">
            {items.map((item, idx) => {
                const isLast = idx === items.length - 1;
                return (
                    <React.Fragment key={idx}>
                        <motion.button
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => !isLast && onNavigate(idx)}
                            className={cn(
                                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                isLast
                                    ? "bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan cursor-default"
                                    : "bg-white/5 border border-card-border text-text-muted hover:text-neon-cyan hover:border-neon-cyan/20 cursor-pointer"
                            )}
                        >
                            {item.icon}{item.label}
                        </motion.button>
                        {!isLast && <ChevronRight size={12} className="text-text-muted/40" />}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

// ── Eye Button ────────────────────────────────────────────────────────────────
function EyeBtn({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
    return (
        <button
            title="View Details"
            onClick={onClick}
            className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all border border-transparent hover:border-neon-cyan/30"
        >
            <Eye size={14} />
        </button>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminManagementPage() {
    const [search, setSearch]                 = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [level, setLevel]                   = useState<Level>('admin');
    const [selectedAdmin, setSelectedAdmin]   = useState<any>(null);
    const [selectedAgency, setSelectedAgency] = useState<any>(null);
    const [selectedHost, setSelectedHost]     = useState<any>(null);
    const [panelItem, setPanelItem]           = useState<any>(null);

    const openPanel  = (e: React.MouseEvent, item: any) => { e.stopPropagation(); setPanelItem(item); };
    const closePanel = () => setPanelItem(null);

    const drillInto = (e: React.MouseEvent, next: Level, setter: (v: any) => void, item: any) => {
        e.stopPropagation();
        setter(item);
        setLevel(next);
        setSearch('');
        setPanelItem(null);
    };

    const breadcrumbs = [
        { label: 'Admin List', icon: <Home size={10} className="mr-1" /> },
        ...(selectedAdmin  ? [{ label: selectedAdmin.name,  icon: <ShieldCheck size={10} className="mr-1" /> }] : []),
        ...(selectedAgency ? [{ label: selectedAgency.name, icon: <Building2   size={10} className="mr-1" /> }] : []),
        ...(selectedHost   ? [{ label: selectedHost.name,   icon: <Radio       size={10} className="mr-1" /> }] : []),
    ];

    const navigateTo = (idx: number) => {
        closePanel();
        if (idx === 0) { setLevel('admin');  setSelectedAdmin(null); setSelectedAgency(null); setSelectedHost(null); }
        if (idx === 1) { setLevel('agency'); setSelectedAgency(null); setSelectedHost(null); }
        if (idx === 2) { setLevel('host');   setSelectedHost(null); }
    };

    const currentData = (() => {
        if (level === 'admin')  return mockAdmins;
        if (level === 'agency') return mockAgencies[selectedAdmin?.id]  ?? [];
        if (level === 'host')   return mockHosts[selectedAgency?.id]    ?? [];
        return mockUsers[selectedHost?.id] ?? [];
    })();

    const filtered = currentData.filter((r: any) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.email?.toLowerCase().includes(search.toLowerCase())
    );

    // ── Column Definitions ────────────────────────────────────────────────────
    const adminColumns: Column<any>[] = [
        {
            header: 'Admin Identity',
            accessor: (a) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple font-black text-xs">
                        {a.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                        <div className="font-bold text-text-primary text-sm flex items-center gap-1.5">
                            {a.name} <ShieldCheck size={12} className="text-neon-cyan" />
                        </div>
                        <div className="text-[10px] text-text-muted">{a.email}</div>
                    </div>
                </div>
            )
        },
        { header: 'Level',       accessor: (a) => <span className="text-neon-gold font-black text-xs">LVL {a.level}</span> },
        { header: 'Agencies',    accessor: (a) => <span className="text-text-primary font-bold">{a.agencyCount}</span> },
        { header: 'Status',      accessor: (a) => <StatusDot status={a.status} /> },
        { header: 'Last Active', accessor: (a) => <span className="text-[10px] text-text-muted italic">{a.lastActive}</span> },
        {
            header: 'Actions',
            accessor: (a) => (
                <div className="flex items-center gap-1">
                    <EyeBtn onClick={(e) => openPanel(e, a)} />
                    <button
                        title="View Agencies"
                        onClick={(e) => drillInto(e, 'agency', setSelectedAdmin, a)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neon-purple/10 hover:bg-neon-purple/20 border border-neon-purple/20 hover:border-neon-purple/40 text-neon-purple text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                        <Building2 size={11} /><ChevronRight size={10} />
                    </button>
                </div>
            )
        },
    ];

    const agencyColumns: Column<any>[] = [
        {
            header: 'Agency',
            accessor: (a) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-gold/10 border border-neon-gold/20 flex items-center justify-center text-neon-gold font-black text-xs">
                        {a.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                        <div className="font-bold text-text-primary text-sm">{a.name}</div>
                        <div className="text-[10px] text-text-muted">{a.email}</div>
                    </div>
                </div>
            )
        },
        { header: 'Hosts',   accessor: (a) => <span className="text-text-primary font-bold">{a.hostCount}</span> },
        { header: 'Revenue', accessor: (a) => <span className="text-neon-green font-black text-xs">${a.revenue.toLocaleString()}</span> },
        { header: 'Status',  accessor: (a) => <StatusDot status={a.status} /> },
        {
            header: 'Actions',
            accessor: (a) => (
                <div className="flex items-center gap-1">
                    <EyeBtn onClick={(e) => openPanel(e, a)} />
                    <button
                        title="View Hosts"
                        onClick={(e) => drillInto(e, 'host', setSelectedAgency, a)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neon-gold/10 hover:bg-neon-gold/20 border border-neon-gold/20 hover:border-neon-gold/40 text-neon-gold text-[10px] font-black uppercase tracking-widest transition-all"
                    >
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
                        {h.status === 'LIVE' && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-neon-green border border-dark-bg shadow-[0_0_6px_rgba(0,255,100,0.8)]" />
                        )}
                    </div>
                    <div>
                        <div className="font-bold text-text-primary text-sm">{h.name}</div>
                        <div className="text-[10px] text-text-muted">{h.roomName}</div>
                    </div>
                </div>
            )
        },
        { header: 'Status',    accessor: (h) => <StatusDot status={h.status} /> },
        { header: 'Live Users',accessor: (h) => <span className={cn("font-black text-sm", h.userCount > 0 ? "text-neon-green" : "text-text-muted")}>{h.userCount}</span> },
        { header: 'Earnings',  accessor: (h) => <span className="text-neon-gold font-black text-xs">${h.earnings.toLocaleString()}</span> },
        {
            header: 'Actions',
            accessor: (h) => (
                <div className="flex items-center gap-1">
                    <EyeBtn onClick={(e) => openPanel(e, h)} />
                    <button
                        title="View Users"
                        onClick={(e) => drillInto(e, 'user', setSelectedHost, h)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/20 hover:border-neon-cyan/40 text-neon-cyan text-[10px] font-black uppercase tracking-widest transition-all"
                    >
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
        {
            header: 'Join Type',
            accessor: (u) => (
                <span className={cn(
                    "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border",
                    u.joinType === 'CURRENT'  ? "text-neon-green  border-neon-green/30  bg-neon-green/10"  :
                    u.joinType === 'UPCOMING' ? "text-neon-gold   border-neon-gold/30   bg-neon-gold/10"   :
                                                "text-text-muted  border-card-border    bg-white/5"
                )}>{u.joinType}</span>
            )
        },
        { header: 'Level',    accessor: (u) => <span className="text-neon-cyan   font-black text-xs">LVL {u.level}</span> },
        { header: 'Coins',    accessor: (u) => <span className="text-neon-gold   font-black text-xs">{u.coins.toLocaleString()}</span> },
        { header: 'Diamonds', accessor: (u) => <span className="text-neon-purple font-black text-xs">{u.diamonds}</span> },
        { header: 'Last Seen',accessor: (u) => <span className="text-[10px] text-text-muted">{u.lastSeen}</span> },
        { header: 'Detail',   accessor: (u) => <EyeBtn onClick={(e) => openPanel(e, u)} /> },
    ];

    const colMap = { admin: adminColumns, agency: agencyColumns, host: hostColumns, user: userColumns };

    const levelMeta: Record<Level, { title: string; desc: string }> = {
        admin:  { title: 'Admin Control Matrix',                   desc: 'High-level security permissions and admin oversight' },
        agency: { title: `Agencies — ${selectedAdmin?.name}`,      desc: 'All agencies managed by this admin'                  },
        host:   { title: `Hosts — ${selectedAgency?.name}`,        desc: 'All hosts registered in this agency'                 },
        user:   { title: `Users — ${selectedHost?.roomName}`,      desc: 'Current, past and upcoming room participants'        },
    };

    return (
        <PageContainer>
            <PageHeader
                title={levelMeta[level].title}
                description={levelMeta[level].desc}
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-56">
                            <NeonInput
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                icon={<Search size={16} />}
                                className="h-10"
                            />
                        </div>
                        {level === 'admin' && (
                            <GlowButton variant="cyan" size="sm" className="flex items-center gap-2" onClick={() => setIsAddModalOpen(true)}>
                                <Plus size={16} /> Deploy Admin
                            </GlowButton>
                        )}
                    </div>
                }
            />

            {/* Breadcrumb */}
            {breadcrumbs.length > 1 && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                    <Breadcrumb items={breadcrumbs} onNavigate={navigateTo} />
                </motion.div>
            )}

            {/* Table + Detail Panel */}
            <div className="flex gap-4 items-start">
                <motion.div
                    key={level}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 glass-card p-1 rounded-2xl border border-neon-purple/10 min-w-0"
                >
                    <NeonTable
                        columns={colMap[level]}
                        data={filtered}
                        onRowClick={(row) => setPanelItem(row)}
                    />
                    {filtered.length === 0 && (
                        <div className="py-16 text-center text-text-muted text-sm">No records found.</div>
                    )}
                </motion.div>

                <DetailPanel item={panelItem} level={level} onClose={closePanel} />
            </div>

            {/* Deploy Admin Modal */}
            <NeonModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Deploy New Admin"
                description="Provision a new high-level clearance administrator account."
                variant="cyan"
                actions={
                    <GlowButton variant="cyan" onClick={() => setIsAddModalOpen(false)} className="flex items-center gap-2">
                        <ShieldCheck size={16} /> Provision Admin
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <NeonInput label="Admin Alias"        placeholder="e.g. Cipher Zero"         />
                    <NeonInput label="Contact Email"      type="email"   placeholder="admin@spark.live"     />
                    <NeonInput label="Security Level"     type="number"  placeholder="Enter level (1-100)"  />
                    <p className="text-xs text-neon-gold flex items-center gap-2 pt-1 border-t border-white/5">
                        <ShieldCheck size={14} /> Requires Super Admin confirmation.
                    </p>
                </div>
            </NeonModal>
        </PageContainer>
    );
}