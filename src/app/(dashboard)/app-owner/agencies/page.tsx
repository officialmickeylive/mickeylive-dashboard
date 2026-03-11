'use client';

import React, { useState, useMemo } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import {
    Search, Plus, Briefcase, Users, TrendingUp, Radio,
    ChevronRight, Eye, Home, ChevronLeft, ChevronsLeft, ChevronsRight,
    Check, X, Filter, ArrowUpRight, ArrowDownLeft, ArrowRightLeft, Building2,
    AtSign, Mail, Calendar,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type Level = 'agency' | 'host';
const ITEMS_PER_PAGE = 5;

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const mockAdmins = [
    { id: 'ADM1', name: 'Zion Sentinel',  email: 'zion@spark.live'     },
    { id: 'ADM2', name: 'Oracle Tech',    email: 'oracle@spark.live'   },
    { id: 'ADM3', name: 'Cipher Zero',    email: 'cipher@spark.live'   },
    { id: 'ADM4', name: 'Titan Echo',     email: 'titan@spark.live'    },
];

const mockAgencies = [
    { id: 'AG1', name: 'Stellar Talent',  email: 'stellar@spark.live',  owner: 'Cassandra Nova', adminId: 'ADM1', hosts: 42, earnings: 125000, status: 'ACTIVE',   tier: 'ELITE',   joinDate: '2022-03-10' },
    { id: 'AG2', name: 'Neon Streamers',  email: 'neon@spark.live',     owner: 'Leo Flux',        adminId: 'ADM1', hosts: 18, earnings: 42000,  status: 'ACTIVE',   tier: 'PRO',     joinDate: '2022-07-14' },
    { id: 'AG3', name: 'Void Nexus',      email: 'void@spark.live',     owner: 'Sylas Vane',      adminId: 'ADM2', hosts: 5,  earnings: 9000,   status: 'INACTIVE', tier: 'STARTER', joinDate: '2023-01-22' },
    { id: 'AG4', name: 'Aether Media',    email: 'aether@spark.live',   owner: 'Luna Ray',         adminId: 'ADM2', hosts: 31, earnings: 87000,  status: 'ACTIVE',   tier: 'PRO',     joinDate: '2022-11-05' },
    { id: 'AG5', name: 'Quantum Guild',   email: 'quantum@spark.live',  owner: 'Rex Nova',         adminId: 'ADM3', hosts: 24, earnings: 63000,  status: 'ACTIVE',   tier: 'PRO',     joinDate: '2023-04-18' },
    { id: 'AG6', name: 'Dark Collective', email: 'dark@spark.live',     owner: 'Shadow X',         adminId: 'ADM3', hosts: 8,  earnings: 15000,  status: 'INACTIVE', tier: 'STARTER', joinDate: '2023-08-30' },
    { id: 'AG7', name: 'Solar Syndicate', email: 'solar@spark.live',    owner: 'Helio Prime',      adminId: 'ADM4', hosts: 55, earnings: 210000, status: 'ACTIVE',   tier: 'ELITE',   joinDate: '2022-05-01' },
    { id: 'AG8', name: 'Frost Circuit',   email: 'frost@spark.live',    owner: 'Cryo Wolf',        adminId: 'ADM4', hosts: 14, earnings: 38000,  status: 'ACTIVE',   tier: 'PRO',     joinDate: '2021-12-20' },
];

const mockHosts: Record<string, any[]> = {
    AG1: [
        { id: 'H1', name: 'Alpha Stream', email: 'alpha@spark.live', agencyId: 'AG1', roomName: 'Galaxy Room',  userCount: 142, status: 'LIVE',    earnings: 34200, totalHours: 312, activeDays: 28, joinDate: '2023-04-01' },
        { id: 'H2', name: 'Beta Wave',    email: 'beta@spark.live',  agencyId: 'AG1', roomName: 'Neon Den',     userCount: 0,   status: 'OFFLINE', earnings: 18700, totalHours: 180, activeDays: 17, joinDate: '2023-06-15' },
        { id: 'H3', name: 'Gamma Force',  email: 'gamma@spark.live', agencyId: 'AG1', roomName: 'Cyber Lounge', userCount: 89,  status: 'LIVE',    earnings: 28900, totalHours: 240, activeDays: 22, joinDate: '2023-07-20' },
    ],
    AG2: [
        { id: 'H4', name: 'Delta Node',   email: 'delta@spark.live',   agencyId: 'AG2', roomName: 'Void Space',  userCount: 0,   status: 'OFFLINE', earnings: 9400,  totalHours: 95,  activeDays: 10, joinDate: '2023-09-10' },
        { id: 'H5', name: 'Epsilon X',    email: 'epsilon@spark.live', agencyId: 'AG2', roomName: 'Pulse Arena', userCount: 201, status: 'LIVE',    earnings: 51200, totalHours: 420, activeDays: 38, joinDate: '2023-03-05' },
    ],
    AG3: [{ id: 'H6', name: 'Solar Host',   email: 'sh@spark.live',  agencyId: 'AG3', roomName: 'Sun Chamber',  userCount: 0,   status: 'OFFLINE', earnings: 4500,  totalHours: 55,  activeDays: 8,  joinDate: '2023-11-01' }],
    AG4: [
        { id: 'H7', name: 'Quantum Host', email: 'qh@spark.live',    agencyId: 'AG4', roomName: 'Quantum Rift', userCount: 312, status: 'LIVE',    earnings: 78000, totalHours: 510, activeDays: 45, joinDate: '2022-11-20' },
        { id: 'H8', name: 'Nova Spark',   email: 'nova@spark.live',  agencyId: 'AG4', roomName: 'Nova Stage',   userCount: 0,   status: 'OFFLINE', earnings: 32000, totalHours: 290, activeDays: 26, joinDate: '2023-02-14' },
    ],
    AG5: [{ id: 'H9',  name: 'Storm Rider',  email: 'storm@spark.live',  agencyId: 'AG5', roomName: 'Storm Basin',  userCount: 77,  status: 'LIVE',    earnings: 22000, totalHours: 210, activeDays: 19, joinDate: '2023-05-05' }],
    AG7: [{ id: 'H10', name: 'Solar Titan',   email: 'titan@spark.live',  agencyId: 'AG7', roomName: 'Sun Arena',    userCount: 420, status: 'LIVE',    earnings: 96000, totalHours: 680, activeDays: 60, joinDate: '2022-06-01' }],
};



const historyData: Record<string, any[]> = {
    U1: [
        { id: 'T1', date: '2024-03-15', type: 'COIN_BUY',     desc: 'Purchased 2000 coins',      amount: +2000,  currency: 'coins'    },
        { id: 'T2', date: '2024-03-12', type: 'DIAMOND_EARN', desc: 'Diamond reward — live',     amount: +80,    currency: 'diamonds' },
        { id: 'T3', date: '2024-03-10', type: 'COIN_SPEND',   desc: 'Gift sent to host',         amount: -500,   currency: 'coins'    },
        { id: 'T4', date: '2024-03-08', type: 'COIN_BUY',     desc: 'Purchased 1000 coins',      amount: +1000,  currency: 'coins'    },
        { id: 'T5', date: '2024-03-05', type: 'DIAMOND_EARN', desc: 'Leaderboard bonus',         amount: +40,    currency: 'diamonds' },
    ],
    U3: [
        { id: 'T1', date: '2024-03-14', type: 'COIN_BUY',     desc: 'Purchased 10000 coins',     amount: +10000, currency: 'coins'    },
        { id: 'T2', date: '2024-03-11', type: 'DIAMOND_EARN', desc: 'VIP stream bonus',          amount: +200,   currency: 'diamonds' },
        { id: 'T3', date: '2024-03-09', type: 'COIN_SPEND',   desc: 'Super gift to host',        amount: -3000,  currency: 'coins'    },
    ],
    H1: [
        { id: 'E1', date: '2024-03-15', type: 'LIVE_EARN',    desc: 'Galaxy Room — 4h session',  amount: +1200,  currency: 'coins'    },
        { id: 'E2', date: '2024-03-13', type: 'GIFT_EARN',    desc: 'Gift income from viewers',  amount: +3400,  currency: 'coins'    },
        { id: 'E3', date: '2024-03-11', type: 'LIVE_EARN',    desc: 'Galaxy Room — 6h session',  amount: +1800,  currency: 'coins'    },
        { id: 'E4', date: '2024-03-09', type: 'BONUS',        desc: 'Weekly performance bonus',  amount: +800,   currency: 'coins'    },
    ],
    H5: [
        { id: 'E1', date: '2024-03-15', type: 'LIVE_EARN',    desc: 'Pulse Arena — 8h session',  amount: +2400,  currency: 'coins'    },
        { id: 'E2', date: '2024-03-14', type: 'GIFT_EARN',    desc: 'Top viewer gift',           amount: +5800,  currency: 'coins'    },
        { id: 'E3', date: '2024-03-13', type: 'BONUS',        desc: 'Top host bonus',            amount: +1200,  currency: 'coins'    },
    ],
    AG1: [
        { id: 'R1', date: '2024-03-15', type: 'HOST_EARN',    desc: 'Alpha Stream commission',   amount: +3400,  currency: 'coins'    },
        { id: 'R2', date: '2024-03-14', type: 'HOST_EARN',    desc: 'Gamma Force commission',    amount: +2100,  currency: 'coins'    },
        { id: 'R3', date: '2024-03-12', type: 'BONUS',        desc: 'Agency performance bonus',  amount: +5000,  currency: 'coins'    },
        { id: 'R4', date: '2024-03-10', type: 'HOST_EARN',    desc: 'Beta Wave commission',      amount: +900,   currency: 'coins'    },
    ],
    AG4: [
        { id: 'R1', date: '2024-03-15', type: 'HOST_EARN',    desc: 'Quantum Host commission',   amount: +7800,  currency: 'coins'    },
        { id: 'R2', date: '2024-03-13', type: 'BONUS',        desc: 'Top agency reward',         amount: +10000, currency: 'coins'    },
    ],
};

const HMETA: Record<string, { label: string; tc: string; bg: string; bc: string }> = {
    COIN_BUY:    { label: 'Buy',        tc: 'text-neon-gold',   bg: 'bg-neon-gold/10',   bc: 'border-neon-gold/30'   },
    COIN_SPEND:  { label: 'Spend',      tc: 'text-neon-red',    bg: 'bg-neon-red/10',    bc: 'border-neon-red/30'    },
    DIAMOND_EARN:{ label: 'Diamond',    tc: 'text-neon-purple', bg: 'bg-neon-purple/10', bc: 'border-neon-purple/30' },
    LIVE_EARN:   { label: 'Live',       tc: 'text-neon-cyan',   bg: 'bg-neon-cyan/10',   bc: 'border-neon-cyan/30'   },
    GIFT_EARN:   { label: 'Gift',       tc: 'text-neon-green',  bg: 'bg-neon-green/10',  bc: 'border-neon-green/30'  },
    BONUS:       { label: 'Bonus',      tc: 'text-amber-400',   bg: 'bg-amber-400/10',   bc: 'border-amber-400/30'   },
    HOST_EARN:   { label: 'Commission', tc: 'text-neon-green',  bg: 'bg-neon-green/10',  bc: 'border-neon-green/30'  },
};

const LC: Record<Level, { color: string; rgb: string; tw: string }> = {
    agency: { color: 'neon-green',  rgb: '0,255,100',  tw: 'text-neon-green'  },
    host:   { color: 'neon-cyan',   rgb: '0,255,255',  tw: 'text-neon-cyan'   },
};

// ─────────────────────────────────────────────────────────────────────────────
// STATUS DOT
// ─────────────────────────────────────────────────────────────────────────────
function StatusDot({ status }: { status: string }) {
    const g = ['ACTIVE','LIVE','CURRENT'].includes(status);
    const u = status === 'UPCOMING';
    return (
        <div className="flex items-center gap-1.5">
            <div className={cn('w-1.5 h-1.5 rounded-full', g ? 'bg-neon-green shadow-[0_0_6px_rgba(0,255,100,0.6)]' : u ? 'bg-neon-gold' : 'bg-neon-red')} />
            <span className={cn('text-[10px] font-black uppercase tracking-wider', g ? 'text-neon-green' : u ? 'text-neon-gold' : 'text-neon-red')}>{status}</span>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED LABEL / ROW
// ─────────────────────────────────────────────────────────────────────────────
function SLabel({ text }: { text: string }) {
    return <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/25">{text}</p>;
}
function IRow({ label, value, vc = 'text-white/55' }: { label: string; value: string; vc?: string }) {
    return (
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[9px] uppercase tracking-widest text-white/25">{label}</span>
            <span className={cn('text-[11px] font-black truncate ml-2 max-w-[180px]', vc)}>{value}</span>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }: {
    currentPage: number; totalPages: number; totalItems: number; itemsPerPage: number; onPageChange: (p: number) => void;
}) {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end   = Math.min(currentPage * itemsPerPage, totalItems);
    const pages: (number | '...')[] = useMemo(() => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
        if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    }, [currentPage, totalPages]);
    const btn  = 'w-7 h-7 rounded-lg border transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed';
    const idle = 'bg-white/[0.03] border-card-border text-text-muted hover:bg-neon-green/10 hover:border-neon-green/30 hover:text-neon-green';
    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-card-border">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted hidden sm:block">
                Showing <span className="text-neon-green">{start}–{end}</span> of {totalItems}
            </span>
            <div className="flex items-center gap-1 mx-auto sm:mx-0">
                <button disabled={currentPage === 1} onClick={() => onPageChange(1)} className={cn(btn, idle)}><ChevronsLeft size={11} /></button>
                <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className={cn(btn, idle)}><ChevronLeft size={11} /></button>
                {pages.map((p, i) => p === '...'
                    ? <span key={`e${i}`} className="w-7 flex items-center justify-center text-[10px] text-text-muted">···</span>
                    : <motion.button key={p} whileTap={{ scale: 0.92 }} onClick={() => onPageChange(p as number)}
                        className={cn(btn, 'text-[10px] font-black', currentPage === p
                            ? 'bg-neon-green/20 border-neon-green/50 text-neon-green shadow-[0_0_10px_rgba(0,255,100,0.2)]'
                            : idle)}>
                        {p}
                      </motion.button>
                )}
                <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} className={cn(btn, idle)}><ChevronRight size={11} /></button>
                <button disabled={currentPage === totalPages} onClick={() => onPageChange(totalPages)} className={cn(btn, idle)}><ChevronsRight size={11} /></button>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted hidden sm:block">
                Page <span className="text-text-primary">{currentPage}/{totalPages}</span>
            </span>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// BREADCRUMB
// ─────────────────────────────────────────────────────────────────────────────
function Breadcrumb({ items, onNavigate }: { items: { label: string; icon: React.ReactNode }[]; onNavigate: (i: number) => void }) {
    return (
        <div className="flex items-center gap-1 flex-wrap">
            {items.map((item, idx) => {
                const isLast = idx === items.length - 1;
                return (
                    <React.Fragment key={idx}>
                        <motion.button initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                            onClick={() => !isLast && onNavigate(idx)}
                            className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                                isLast ? 'bg-neon-green/10 border border-neon-green/30 text-neon-green cursor-default'
                                       : 'bg-white/5 border border-card-border text-text-muted hover:text-neon-green hover:border-neon-green/20 cursor-pointer')}>
                            {item.icon}{item.label}
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
        <button title="View Details" onClick={onClick}
            className="p-2 rounded-lg bg-white/5 hover:bg-neon-green/20 hover:text-neon-green transition-all border border-transparent hover:border-neon-green/30">
            <Eye size={14} />
        </button>
    );
}

function TransferBtn({ onClick, color = 'neon-green' }: { onClick: (e: React.MouseEvent) => void; color?: string }) {
    return (
        <button title="Transfer" onClick={onClick}
            className={`p-2 rounded-lg bg-white/5 hover:bg-${color}/20 hover:text-${color} transition-all border border-transparent hover:border-${color}/30`}>
            <ArrowRightLeft size={14} />
        </button>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// HISTORY SECTION (reusable inside modals)
// ─────────────────────────────────────────────────────────────────────────────
function HistorySection({ entityId, histLabel }: { entityId: string; histLabel: string }) {
    const [from, setFrom] = useState('');
    const [to, setTo]     = useState('');
    const rawHist  = historyData[entityId] ?? [];
    const hist     = useMemo(() => rawHist.filter((h: any) => {
        const d = new Date(h.date);
        if (from && d < new Date(from)) return false;
        if (to   && d > new Date(to))   return false;
        return true;
    }), [rawHist, from, to]);

    return (
        <div className="px-5 pb-6">
            <div className="flex items-center justify-between mb-3">
                <SLabel text={histLabel} />
                <span className="text-[8px] font-bold text-white/20">{hist.length} records</span>
            </div>
            <div className="mb-3 flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <Filter size={10} className="text-white/25 flex-shrink-0" />
                <div className="flex-1 grid grid-cols-2 gap-x-4">
                    <div>
                        <p className="text-[7px] uppercase tracking-widest text-white/20 mb-1">From</p>
                        <input type="date" value={from} onChange={e => setFrom(e.target.value)}
                            className="w-full bg-transparent text-[11px] font-bold text-white/60 focus:outline-none border-b border-white/10 focus:border-neon-green/40 pb-0.5 transition-colors" />
                    </div>
                    <div>
                        <p className="text-[7px] uppercase tracking-widest text-white/20 mb-1">To</p>
                        <input type="date" value={to} onChange={e => setTo(e.target.value)}
                            className="w-full bg-transparent text-[11px] font-bold text-white/60 focus:outline-none border-b border-white/10 focus:border-neon-green/40 pb-0.5 transition-colors" />
                    </div>
                </div>
                {(from || to) && (
                    <button onClick={() => { setFrom(''); setTo(''); }}
                        className="w-6 h-6 flex-shrink-0 rounded-lg bg-white/[0.05] hover:bg-red-500/20 hover:text-red-400 border border-white/[0.08] text-white/25 transition-all flex items-center justify-center">
                        <X size={9} />
                    </button>
                )}
            </div>
            {hist.length === 0 ? (
                <div className="py-10 text-center text-white/20 text-xs">No records in selected range.</div>
            ) : (
                <div className="space-y-2">
                    {hist.map((h: any, i: number) => {
                        const m   = HMETA[h.type] ?? { label: h.type, tc: 'text-white/40', bg: 'bg-white/5', bc: 'border-white/10' };
                        const pos = h.amount > 0;
                        return (
                            <motion.div key={h.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                                className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all">
                                <span className={cn('px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-wider border flex-shrink-0', m.tc, m.bg, m.bc)}>
                                    {m.label}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-bold text-white/75 truncate">{h.desc}</p>
                                    <p className="text-[9px] text-white/25 mt-0.5">
                                        {new Date(h.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                                {h.amount !== null && (
                                    <div className={cn('flex items-center gap-0.5 font-black text-xs flex-shrink-0', pos ? 'text-neon-green' : 'text-neon-red')}>
                                        {pos ? <ArrowUpRight size={11} /> : <ArrowDownLeft size={11} />}
                                        {Math.abs(h.amount).toLocaleString()}
                                        <span className="text-[8px] opacity-40 ml-0.5">{h.currency}</span>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// DETAIL MODAL — Agency / Host / User
// ─────────────────────────────────────────────────────────────────────────────
function DetailModal({ item, level, isOpen, onClose }: { item: any; level: Level; isOpen: boolean; onClose: () => void }) {
    const lc       = LC[level];
    const initials = item?.name?.split(' ').map((n: string) => n[0]).join('') ?? '';

    const stats = useMemo(() => {
        if (!item) return [];
        if (level === 'agency') return [
            { label: 'Hosts',    value: `${item.hosts}`,                              icon: '📡', tc: 'text-neon-cyan'   },
            { label: 'Revenue',  value: `$${item.earnings?.toLocaleString() ?? 0}`,  icon: '📈', tc: 'text-neon-gold'   },
            { label: 'Status',   value: item.status,                                  icon: '⚡', tc: item.status === 'ACTIVE' ? 'text-neon-green' : 'text-neon-red' },
        ];
        if (level === 'host') return [
            { label: 'Earned',      value: `$${item.earnings?.toLocaleString() ?? 0}`, icon: '💰', tc: 'text-neon-gold'   },
            { label: 'Live Hrs',    value: `${item.totalHours ?? 0}h`,                 icon: '⏱',  tc: 'text-neon-cyan'   },
            { label: 'Days Active', value: `${item.activeDays ?? 0}d`,                 icon: '📅', tc: 'text-neon-green'  },
            { label: 'Live Users',  value: `${item.userCount ?? 0}`,                   icon: '👥', tc: 'text-neon-purple' },
        ]
    }, [item, level]);

    const histLabel = level === 'agency' ? 'Revenue History' : level === 'host' ? 'Earning History' : 'Transaction History';

    return (
        <AnimatePresence>
            {isOpen && item && (
                <>
                    <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6 pointer-events-none">
                        <motion.div key="mc"
                            initial={{ opacity: 0, y: 64 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 64 }}
                            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                            className="pointer-events-auto w-full sm:max-w-[480px] relative">
                            <div className="absolute -inset-px rounded-t-[28px] sm:rounded-2xl"
                                style={{ background: `linear-gradient(to bottom, rgba(${lc.rgb},0.2), transparent)`, filter: 'blur(8px)' }} />
                            <div className="relative rounded-t-[28px] sm:rounded-2xl border border-white/10 bg-[#080a10] flex flex-col overflow-hidden"
                                style={{ maxHeight: '92dvh', boxShadow: `0 0 80px rgba(${lc.rgb},0.12)` }}>
                                <motion.div animate={{ x: ['-100%','200%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 6 }}
                                    className={`absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-${lc.color} to-transparent z-20 pointer-events-none`} />
                                <div className="flex justify-center pt-3 sm:hidden">
                                    <div className="w-10 h-1 rounded-full bg-white/15" />
                                </div>
                                {/* Header */}
                                <div className="relative px-5 pt-4 pb-5"
                                    style={{ background: `linear-gradient(135deg, rgba(${lc.rgb},0.08) 0%, transparent 60%)` }}>
                                    <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
                                        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '22px 22px' }} />
                                    <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.06]" />
                                    <div className="relative flex items-center justify-between mb-4">
                                        <span className={cn('text-[8px] font-black uppercase tracking-[0.35em] opacity-50', lc.tw)}>{level} · profile</span>
                                        <button onClick={onClose}
                                            className="w-7 h-7 rounded-xl bg-white/[0.06] hover:bg-red-500/20 hover:text-red-400 border border-white/[0.08] text-white/30 transition-all flex items-center justify-center">
                                            <X size={13} />
                                        </button>
                                    </div>
                                    <div className="relative flex items-center gap-4">
                                        <div className={cn('w-[60px] h-[60px] rounded-2xl flex items-center justify-center font-black text-xl flex-shrink-0 border-2', lc.tw, `border-${lc.color}/40 bg-${lc.color}/10`)}
                                            style={{ boxShadow: `0 0 24px rgba(${lc.rgb},0.18)` }}>
                                            {initials}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-white text-[17px] leading-tight truncate">{item.name}</p>
                                            <p className="text-[11px] text-white/35 mt-0.5 truncate">{item.email}</p>
                                            {item.joinDate && (
                                                <p className="flex items-center gap-1 text-[9px] text-white/25 mt-1.5">
                                                    <Calendar size={8} />
                                                    Joined {new Date(item.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            )}
                                        </div>
                                        {item.status && <StatusDot status={item.status} />}
                                    </div>
                                </div>
                                {/* Body */}
                                <div className="flex-1 overflow-y-auto overscroll-contain">
                                    {/* Stats */}
                                    {/* <div className="px-5 pt-5 pb-4">
                                        <SLabel text="Overview" />
                                        <div className={cn('grid gap-2 mt-3', stats.length === 4 ? 'grid-cols-4' : 'grid-cols-3')}>
                                            {stats.map(({ label, value, icon, tc }) => (
                                                <div key={label} className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.06] transition-all">
                                                    <span className="text-2xl leading-none">{icon}</span>
                                                    <span className={cn('text-[13px] font-black leading-none', tc)}>{value}</span>
                                                    <span className="text-[7px] uppercase tracking-widest text-white/25 text-center px-1 leading-snug">{label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div> */}
                                    {/* Details */}
                                    <div className="px-5 pb-4 space-y-1.5">
                                        <SLabel text="Details" />
                                        <div className="mt-3 space-y-1.5">
                                            {level === 'agency' && <>
                                                <IRow label="Owner"  value={item.owner}  vc="text-white/60" />
                                                <IRow label="Tier"   value={item.tier}   vc="text-neon-gold" />
                                            </>}
                                            {level === 'host' && <>
                                                <IRow label="Room"   value={item.roomName} vc="text-neon-cyan" />
                                                <IRow label="Status" value={item.status}   vc={item.status === 'LIVE' ? 'text-neon-green' : 'text-neon-red'} />
                                            </>}
            
                                        </div>
                                    </div>
                                    {/* History */}
                                    <HistorySection entityId={item.id} histLabel={histLabel} />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// AGENCY TRANSFER MODAL  (transfer agency to another admin)
// ─────────────────────────────────────────────────────────────────────────────
function AgencyTransferModal({ agency, isOpen, onClose, onTransfer }: {
    agency: any; isOpen: boolean; onClose: () => void; onTransfer: (agencyId: string, adminId: string) => void;
}) {
    const [selectedAdmin, setSelectedAdmin] = useState('');
    const currentAdmin = mockAdmins.find(a => a.id === agency?.adminId);

    return (
        <AnimatePresence>
            {isOpen && agency && (
                <>
                    <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div initial={{ opacity: 0, scale: 0.93, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.93 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                            className="pointer-events-auto w-full max-w-md relative">
                            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-neon-green/20 to-transparent blur-md" />
                            <div className="relative rounded-2xl border border-neon-green/20 bg-[#080a10] overflow-hidden">
                                <motion.div animate={{ x: ['-100%','200%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
                                    className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-neon-green to-transparent z-10" />
                                {/* Header */}
                                <div className="relative px-6 py-4 border-b border-card-border flex items-center justify-between"
                                    style={{ background: 'linear-gradient(135deg, rgba(0,255,100,0.06) 0%, transparent 60%)' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center shadow-[0_0_14px_rgba(0,255,100,0.15)]">
                                            <ArrowRightLeft size={16} className="text-neon-green" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-neon-green/50">Agency Transfer</p>
                                            <h2 className="text-sm font-black text-text-primary">Transfer to Admin</h2>
                                        </div>
                                    </div>
                                    <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red border border-card-border text-text-muted transition-all flex items-center justify-center"><X size={13} /></button>
                                </div>
                                <div className="px-6 py-5 space-y-4">
                                    {/* Agency info */}
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/25 mb-3">Agency</p>
                                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neon-green/5 border border-neon-green/20">
                                            <div className="w-10 h-10 rounded-lg bg-neon-green/10 border border-neon-green/30 flex items-center justify-center text-neon-green font-black text-sm">
                                                {agency.name.split(' ').map((n: string) => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="font-black text-white text-sm">{agency.name}</p>
                                                <p className="text-[10px] text-white/35">{agency.email}</p>
                                            </div>
                                            <div className="ml-auto text-right">
                                                <p className="text-[9px] text-white/25 uppercase tracking-widest">Owner</p>
                                                <p className="text-[11px] font-bold text-white/60">{agency.owner}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Current admin */}
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/25 mb-2">Current Admin</p>
                                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                            <div className="w-7 h-7 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-neon-green font-black text-[10px]">
                                                {currentAdmin?.name.split(' ').map((n: string) => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-white/75">{currentAdmin?.name}</p>
                                                <p className="text-[9px] text-white/30">{currentAdmin?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Transfer to */}
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/25 mb-2">Transfer To</p>
                                        <div className="space-y-2">
                                            {mockAdmins.filter(a => a.id !== agency.adminId).map(admin => (
                                                <button key={admin.id} onClick={() => setSelectedAdmin(admin.id)}
                                                    className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all',
                                                        selectedAdmin === admin.id
                                                            ? 'bg-neon-green/10 border-neon-green/40 text-white'
                                                            : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1]')}>
                                                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center font-black text-[11px] border',
                                                        selectedAdmin === admin.id ? 'bg-neon-green/15 border-neon-green/40 text-neon-green' : 'bg-white/5 border-white/10 text-white/50')}>
                                                        {admin.name.split(' ').map((n: string) => n[0]).join('')}
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <p className="text-[11px] font-black text-white/75">{admin.name}</p>
                                                        <p className="text-[9px] text-white/30">{admin.email}</p>
                                                    </div>
                                                    {selectedAdmin === admin.id && <Check size={13} className="text-neon-green flex-shrink-0" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-1">
                                        <button
                                            disabled={!selectedAdmin}
                                            onClick={() => { if (selectedAdmin) { onTransfer(agency.id, selectedAdmin); onClose(); setSelectedAdmin(''); } }}
                                            className="flex-1 h-10 rounded-xl bg-neon-green/15 hover:bg-neon-green/25 border border-neon-green/30 hover:border-neon-green/60 text-neon-green text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                                            <ArrowRightLeft size={13} /> Confirm Transfer
                                        </button>
                                        <button onClick={onClose} className="flex-1 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-card-border text-text-muted text-xs font-black uppercase tracking-widest transition-all">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOST TRANSFER MODAL  (transfer host to another agency)
// ─────────────────────────────────────────────────────────────────────────────
function HostTransferModal({ host, agencies, isOpen, onClose, onTransfer }: {
    host: any; agencies: any[]; isOpen: boolean; onClose: () => void; onTransfer: (hostId: string, agencyId: string) => void;
}) {
    const [selectedAgency, setSelectedAgency] = useState('');
    const currentAgency = agencies.find(a => a.id === host?.agencyId);

    return (
        <AnimatePresence>
            {isOpen && host && (
                <>
                    <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div initial={{ opacity: 0, scale: 0.93, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.93 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                            className="pointer-events-auto w-full max-w-md relative">
                            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-transparent blur-md" />
                            <div className="relative rounded-2xl border border-neon-cyan/20 bg-[#080a10] overflow-hidden">
                                <motion.div animate={{ x: ['-100%','200%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
                                    className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent z-10" />
                                {/* Header */}
                                <div className="relative px-6 py-4 border-b border-card-border flex items-center justify-between"
                                    style={{ background: 'linear-gradient(135deg, rgba(0,255,255,0.06) 0%, transparent 60%)' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center shadow-[0_0_14px_rgba(0,255,255,0.15)]">
                                            <ArrowRightLeft size={16} className="text-neon-cyan" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-neon-cyan/50">Host Transfer</p>
                                            <h2 className="text-sm font-black text-text-primary">Transfer to Agency</h2>
                                        </div>
                                    </div>
                                    <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red border border-card-border text-text-muted transition-all flex items-center justify-center"><X size={13} /></button>
                                </div>
                                <div className="px-6 py-5 space-y-4">
                                    {/* Host info */}
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/25 mb-3">Host</p>
                                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan font-black text-sm">
                                                    {host.name.split(' ').map((n: string) => n[0]).join('')}
                                                </div>
                                                {host.status === 'LIVE' && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-neon-green border border-dark-bg shadow-[0_0_6px_rgba(0,255,100,0.8)]" />}
                                            </div>
                                            <div>
                                                <p className="font-black text-white text-sm">{host.name}</p>
                                                <p className="text-[10px] text-white/35">{host.roomName}</p>
                                            </div>
                                            <div className="ml-auto">
                                                <StatusDot status={host.status} />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Current agency */}
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/25 mb-2">Current Agency</p>
                                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                            <div className="w-7 h-7 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan font-black text-[10px]">
                                                {currentAgency?.name.split(' ').map((n: string) => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-white/75">{currentAgency?.name}</p>
                                                <p className="text-[9px] text-white/30">{currentAgency?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Transfer to agency */}
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/25 mb-2">Transfer To</p>
                                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                                            {agencies.filter(a => a.id !== host?.agencyId).map(ag => (
                                                <button key={ag.id} onClick={() => setSelectedAgency(ag.id)}
                                                    className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all',
                                                        selectedAgency === ag.id
                                                            ? 'bg-neon-cyan/10 border-neon-cyan/40 text-white'
                                                            : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1]')}>
                                                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center font-black text-[11px] border',
                                                        selectedAgency === ag.id ? 'bg-neon-cyan/15 border-neon-cyan/40 text-neon-cyan' : 'bg-white/5 border-white/10 text-white/50')}>
                                                        {ag.name.split(' ').map((n: string) => n[0]).join('')}
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <p className="text-[11px] font-black text-white/75">{ag.name}</p>
                                                        <p className="text-[9px] text-white/30">{ag.hosts} hosts · {ag.tier}</p>
                                                    </div>
                                                    <StatusDot status={ag.status} />
                                                    {selectedAgency === ag.id && <Check size={13} className="text-neon-cyan flex-shrink-0" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-1">
                                        <button
                                            disabled={!selectedAgency}
                                            onClick={() => { if (selectedAgency) { onTransfer(host.id, selectedAgency); onClose(); setSelectedAgency(''); } }}
                                            className="flex-1 h-10 rounded-xl bg-neon-cyan/15 hover:bg-neon-cyan/25 border border-neon-cyan/30 hover:border-neon-cyan/60 text-neon-cyan text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                                            <ArrowRightLeft size={13} /> Confirm Transfer
                                        </button>
                                        <button onClick={onClose} className="flex-1 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-card-border text-text-muted text-xs font-black uppercase tracking-widest transition-all">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ONBOARD AGENCY MODAL
// ─────────────────────────────────────────────────────────────────────────────
interface AgencyForm { name: string; email: string; owner: string; tier: string; }
const DEF_FORM: AgencyForm = { name: '', email: '', owner: '', tier: 'STARTER' };

function OnboardAgencyModal({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (a: any) => void }) {
    const [form, setForm] = useState<AgencyForm>(DEF_FORM);
    const [errs, setErrs] = useState<Partial<AgencyForm>>({});
    const set = (k: keyof AgencyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(p => ({ ...p, [k]: e.target.value })); setErrs(p => ({ ...p, [k]: '' }));
    };
    const validate = () => {
        const e: Partial<AgencyForm> = {};
        if (!form.name.trim())  e.name  = 'Required';
        if (!form.email.includes('@')) e.email = 'Valid email required';
        if (!form.owner.trim()) e.owner = 'Required';
        setErrs(e); return !Object.keys(e).length;
    };
    const submit = () => {
        if (!validate()) return;
        onAdd({
            id: `AG${Date.now()}`, name: form.name.trim(), email: form.email.trim(),
            owner: form.owner.trim(), adminId: 'ADM1', hosts: 0,
            earnings: 0, status: 'ACTIVE', tier: form.tier, joinDate: new Date().toISOString().split('T')[0],
        });
        setForm(DEF_FORM); setErrs({});
    };
    const close = () => { setForm(DEF_FORM); setErrs({}); onClose(); };

    const iCls = 'w-full h-9 rounded-lg bg-dark-bg border border-card-border hover:border-neon-green/30 focus:border-neon-green/50 focus:outline-none text-xs font-bold text-text-primary placeholder-text-muted/40 transition-all pl-8 pr-3';
    const lCls = 'text-[9px] font-black uppercase tracking-[0.2em] text-text-muted block mb-1.5';
    const ico  = (i: React.ReactNode) => <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-green/40 pointer-events-none">{i}</span>;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={close} className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div initial={{ opacity: 0, scale: 0.93, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.93 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                            className="pointer-events-auto w-full max-w-md relative">
                            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-neon-green/20 to-transparent blur-md" />
                            <div className="relative rounded-2xl border border-neon-green/20 bg-dark-bg overflow-hidden">
                                <motion.div animate={{ x: ['-100%','200%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
                                    className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-neon-green to-transparent z-10" />
                                <div className="relative px-6 py-4 border-b border-card-border flex items-center justify-between"
                                    style={{ background: 'linear-gradient(135deg, rgba(0,255,100,0.06) 0%, transparent 60%)' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center shadow-[0_0_14px_rgba(0,255,100,0.15)]">
                                            <Briefcase size={16} className="text-neon-green" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-neon-green/50">Agency Registry</p>
                                            <h2 className="text-sm font-black text-text-primary">Onboard New Agency</h2>
                                        </div>
                                    </div>
                                    <button onClick={close} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red border border-card-border text-text-muted transition-all flex items-center justify-center"><X size={13} /></button>
                                </div>
                                <div className="px-6 py-5 space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={lCls}>Agency Name *</label>
                                            <div className="relative">{ico(<Briefcase size={11} />)}<input value={form.name} onChange={set('name')} placeholder="e.g. Stellar Talent" className={iCls} /></div>
                                            {errs.name && <p className="text-[9px] text-neon-red mt-1">{errs.name}</p>}
                                        </div>
                                        <div>
                                            <label className={lCls}>Contact Email *</label>
                                            <div className="relative">{ico(<Mail size={11} />)}<input type="email" value={form.email} onChange={set('email')} placeholder="agency@spark.live" className={iCls} /></div>
                                            {errs.email && <p className="text-[9px] text-neon-red mt-1">{errs.email}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={lCls}>Owner Name *</label>
                                            <div className="relative">{ico(<AtSign size={11} />)}<input value={form.owner} onChange={set('owner')} placeholder="e.g. Cassandra Nova" className={iCls} /></div>
                                            {errs.owner && <p className="text-[9px] text-neon-red mt-1">{errs.owner}</p>}
                                        </div>
                                        <div>
                                            <label className={lCls}>Tier Classification</label>
                                            <select value={form.tier} onChange={set('tier')} className="w-full h-9 rounded-lg border border-card-border bg-dark-bg px-3 text-xs font-bold text-text-primary focus:outline-none focus:border-neon-green/50 transition-all hover:border-neon-green/30">
                                                <option value="STARTER">Starter</option>
                                                <option value="PRO">Pro</option>
                                                <option value="ELITE">Elite</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-1">
                                        <button onClick={submit} className="flex-1 h-10 rounded-xl bg-neon-green/15 hover:bg-neon-green/25 border border-neon-green/30 hover:border-neon-green/60 text-neon-green text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                            <Check size={13} /> Establish Agency
                                        </button>
                                        <button onClick={close} className="flex-1 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-card-border text-text-muted text-xs font-black uppercase tracking-widest transition-all">Abort</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AgencyManagementPage() {
    const [search, setSearch]                   = useState('');
    const [level, setLevel]                     = useState<Level>('agency');
    const [selectedAgency, setSelectedAgency]   = useState<any>(null);
    const [selectedHost, setSelectedHost]       = useState<any>(null);
    const [detailItem, setDetailItem]           = useState<any>(null);
    const [detailOpen, setDetailOpen]           = useState(false);
    const [onboardOpen, setOnboardOpen]         = useState(false);
    const [transferAgency, setTransferAgency]   = useState<any>(null);
    const [transferHost, setTransferHost]       = useState<any>(null);
    const [currentPage, setCurrentPage]         = useState(1);
    const [agencies, setAgencies]               = useState(mockAgencies);
    const [hosts, setHosts]                     = useState(mockHosts);

    const openDetail  = (e: React.MouseEvent, item: any) => { e.stopPropagation(); setDetailItem(item); setDetailOpen(true); };
    const closeDetail = () => { setDetailOpen(false); setTimeout(() => setDetailItem(null), 350); };

    const drillInto = (e: React.MouseEvent, next: Level, setter: (v: any) => void, item: any) => {
        e.stopPropagation(); setter(item); setLevel(next); setSearch(''); setCurrentPage(1);
    };

    const breadcrumbs = [
        { label: 'Agencies',  icon: <Home size={10} className="mr-1" /> },
        ...(selectedAgency ? [{ label: selectedAgency.name, icon: <Briefcase size={10} className="mr-1" /> }] : []),
        ...(selectedHost   ? [{ label: selectedHost.name,   icon: <Radio     size={10} className="mr-1" /> }] : []),
    ];

    const navigateTo = (idx: number) => {
        setCurrentPage(1);
        if (idx === 0) { setLevel('agency'); setSelectedAgency(null); setSelectedHost(null); }
        if (idx === 1) { setLevel('host');   setSelectedHost(null); }
    };

    const currentData = useMemo(() => {
        if (level === 'agency') return agencies;
        if (level === 'host')   return hosts[selectedAgency?.id] ?? [];
        return []
    }, [level, agencies, hosts, selectedAgency, selectedHost]);

    const filtered = useMemo(() => currentData.filter((r: any) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        (r.email?.toLowerCase() ?? '').includes(search.toLowerCase())
    ), [currentData, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const safePage   = Math.min(currentPage, totalPages);
    const paged      = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

    const handleAgencyTransfer = (agencyId: string, newAdminId: string) => {
        setAgencies(prev => prev.map(a => a.id === agencyId ? { ...a, adminId: newAdminId } : a));
    };

    const handleHostTransfer = (hostId: string, newAgencyId: string) => {
        setHosts(prev => {
            const updated = { ...prev };
            let movedHost: any = null;
            for (const agId of Object.keys(updated)) {
                const idx = updated[agId].findIndex((h: any) => h.id === hostId);
                if (idx !== -1) { movedHost = { ...updated[agId][idx], agencyId: newAgencyId }; updated[agId] = updated[agId].filter((_: any, i: number) => i !== idx); break; }
            }
            if (movedHost) updated[newAgencyId] = [...(updated[newAgencyId] ?? []), movedHost];
            return updated;
        });
    };

    const levelMeta: Record<Level, { title: string; desc: string }> = {
        agency: { title: 'Agency Infrastructure',               desc: 'Management and revenue tracking of registered agency units' },
        host:   { title: `Hosts — ${selectedAgency?.name}`,     desc: 'All hosts registered under this agency'                     },
    };

    // ── Columns ───────────────────────────────────────────────────────────────
    const agencyCols: Column<any>[] = [
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
            ),
        },
        { header: 'Tier', accessor: (a) => (
            <span className={cn('px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border',
                a.tier === 'ELITE'   ? 'text-neon-gold   border-neon-gold/30   bg-neon-gold/10'
                : a.tier === 'PRO'   ? 'text-neon-cyan   border-neon-cyan/30   bg-neon-cyan/10'
                :                     'text-text-muted   border-card-border    bg-white/5')}>
                {a.tier}
            </span>
        )},
        { header: 'Hosts',   accessor: (a) => <div className="flex items-center gap-1.5"><Users size={13} className="text-neon-cyan" /><span className="text-text-primary font-bold">{a.hosts}</span></div> },
        { header: 'Revenue', accessor: (a) => <div className="flex items-center gap-1.5"><TrendingUp size={13} className="text-neon-green" /><span className="text-neon-green font-black text-xs">${a.earnings.toLocaleString()}</span></div> },
        { header: 'Status',  accessor: (a) => <StatusDot status={a.status} /> },
        {
            header: 'Actions',
            accessor: (a) => (
                <div className="flex items-center gap-1">
                    <EyeBtn onClick={(e) => openDetail(e, a)} />
                    <TransferBtn onClick={(e) => { e.stopPropagation(); setTransferAgency(a); }} color="neon-green" />
                    <button onClick={(e) => drillInto(e, 'host', setSelectedAgency, a)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neon-green/10 hover:bg-neon-green/20 border border-neon-green/20 hover:border-neon-green/40 text-neon-green text-[10px] font-black uppercase tracking-widest transition-all">
                        <Radio size={11} /><ChevronRight size={10} />
                    </button>
                </div>
            ),
        },
    ];

    const hostCols: Column<any>[] = [
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
            ),
        },
        { header: 'Status',     accessor: (h) => <StatusDot status={h.status} /> },
        { header: 'Live Users', accessor: (h) => <span className={cn('font-black text-sm', h.userCount > 0 ? 'text-neon-green' : 'text-text-muted')}>{h.userCount}</span> },
        { header: 'Earnings',   accessor: (h) => <span className="text-neon-gold font-black text-xs">${h.earnings.toLocaleString()}</span> },
        {
            header: 'Actions',
            accessor: (h) => (
                <div className="flex items-center gap-1">
                    <EyeBtn onClick={(e) => openDetail(e, h)} />
                </div>
            ),
        },
    ];


    const colMap = { agency: agencyCols, host: hostCols };

    return (
        <PageContainer>
            <PageHeader
                title={levelMeta[level].title}
                description={levelMeta[level].desc}
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-56">
                            <NeonInput placeholder="Search..." value={search}
                                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                icon={<Search size={16} />} className="h-10" />
                        </div>
                        {level === 'agency' && (
                            <GlowButton variant="green" size="sm" className="flex items-center gap-2" onClick={() => setOnboardOpen(true)}>
                                <Plus size={16} /> Onboard Agency
                            </GlowButton>
                        )}
                    </div>
                }
            />

            {breadcrumbs.length > 1 && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                    <Breadcrumb items={breadcrumbs} onNavigate={navigateTo} />
                </motion.div>
            )}

            <motion.div key={level} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                className="glass-card rounded-2xl border border-neon-green/10 overflow-hidden">
                <div className="p-1">
                    <NeonTable columns={colMap[level]} data={paged}
                        onRowClick={(row) => { setDetailItem(row); setDetailOpen(true); }} />
                    {paged.length === 0 && <div className="py-16 text-center text-text-muted text-sm">No records found.</div>}
                </div>
                <Pagination currentPage={safePage} totalPages={totalPages} totalItems={filtered.length}
                    itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
            </motion.div>

            {/* Detail modal */}
            <DetailModal item={detailItem} level={level} isOpen={detailOpen} onClose={closeDetail} />

            {/* Onboard agency modal */}
            <OnboardAgencyModal isOpen={onboardOpen} onClose={() => setOnboardOpen(false)}
                onAdd={(a) => { setAgencies(p => [a, ...p]); setOnboardOpen(false); setCurrentPage(1); }} />

            {/* Agency transfer modal */}
            <AgencyTransferModal agency={transferAgency} isOpen={!!transferAgency} onClose={() => setTransferAgency(null)} onTransfer={handleAgencyTransfer} />

            {/* Host transfer modal */}
            <HostTransferModal host={transferHost} agencies={agencies} isOpen={!!transferHost} onClose={() => setTransferHost(null)} onTransfer={handleHostTransfer} />
        </PageContainer>
    );
}