'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { PageContainer } from '@/components/gaming/PageContainer';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import {
    Search, Repeat, ArrowRightLeft, TrendingUp, ShieldAlert, BarChart3,
    Settings, Check, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
    Plus, Minus, Send, Home, Calendar, Gem, Sparkles, Activity, Clock, Hash,
    ChevronDown, ChevronUp, SlidersHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 5;

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type TxType   = 'P2P_EXCHANGE' | 'REFILL' | 'DISBURSEMENT' | 'SEND';
type TxStatus = 'COMPLETED' | 'PENDING' | 'FLAGGED';

interface Tx {
    id: string;
    sellerId: string;
    seller: string;
    buyer: string;
    coins: number;
    diamonds: number;
    rate: number;
    status: TxStatus;
    type: TxType;
    date: string;
}

interface Seller {
    id: string;
    name: string;
    agencyId: string | null;
    agency: string;
    coins: number;
    diamonds: number;
    status: 'ACTIVE' | 'INACTIVE';
    joinDate: string;
}

interface Filters {
    status: string;
    type: string;
    from: string;
    to: string;
}

const DEF_FILTERS: Filters = { status: '', type: '', from: '', to: '' };

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const INIT_SELLERS: Seller[] = [
    { id: 'S1', name: 'Zion Sentinel',  agencyId: 'AG1', agency: 'Stellar Talent', coins: 128400, diamonds: 4500,  status: 'ACTIVE',   joinDate: '2022-03-10' },
    { id: 'S2', name: 'Void Nexus',     agencyId: 'AG3', agency: 'Void Nexus',     coins: 47200,  diamonds: 1200,  status: 'ACTIVE',   joinDate: '2022-07-14' },
    { id: 'S3', name: 'Aether Media',   agencyId: 'AG4', agency: 'Aether Media',   coins: 9800,   diamonds: 300,   status: 'INACTIVE', joinDate: '2023-01-22' },
    { id: 'S4', name: 'Cipher Zero',    agencyId: 'AG1', agency: 'Stellar Talent', coins: 85000,  diamonds: 2800,  status: 'ACTIVE',   joinDate: '2022-11-05' },
    { id: 'S5', name: 'Oracle Tech',    agencyId: 'AG2', agency: 'Neon Streamers', coins: 34600,  diamonds: 900,   status: 'ACTIVE',   joinDate: '2023-04-18' },
    { id: 'S6', name: 'System Reserve', agencyId: null,  agency: 'Platform',       coins: 500000, diamonds: 15000, status: 'ACTIVE',   joinDate: '2021-01-01' },
    { id: 'S7', name: 'Nexus Prime',    agencyId: 'AG5', agency: 'Quantum Guild',  coins: 21000,  diamonds: 650,   status: 'INACTIVE', joinDate: '2023-08-30' },
];

const INIT_TX: Tx[] = [
    { id: 'TX-9901', sellerId: 'S1', seller: 'Zion Sentinel',  buyer: 'Luna Divine',   coins: 50000, diamonds: 1500, rate: 0.95, status: 'COMPLETED', type: 'P2P_EXCHANGE', date: '2024-03-15' },
    { id: 'TX-9902', sellerId: 'S6', seller: 'System Reserve', buyer: 'Shadow Dancer', coins: 12000, diamonds: 400,  rate: 1.05, status: 'PENDING',   type: 'REFILL',       date: '2024-03-14' },
    { id: 'TX-9903', sellerId: 'S2', seller: 'Void Nexus',     buyer: 'Cyber Queen',   coins: 8000,  diamonds: 250,  rate: 0.90, status: 'FLAGGED',   type: 'P2P_EXCHANGE', date: '2024-03-13' },
    { id: 'TX-9904', sellerId: 'S3', seller: 'Aether Media',   buyer: 'Vanguard X',    coins: 25000, diamonds: 750,  rate: 0.98, status: 'COMPLETED', type: 'DISBURSEMENT', date: '2024-03-12' },
    { id: 'TX-9905', sellerId: 'S4', seller: 'Cipher Zero',    buyer: 'Oracle Tech',   coins: 4500,  diamonds: 120,  rate: 1.00, status: 'COMPLETED', type: 'P2P_EXCHANGE', date: '2024-03-11' },
    { id: 'TX-9906', sellerId: 'S1', seller: 'Zion Sentinel',  buyer: 'Storm Rider',   coins: 18000, diamonds: 600,  rate: 0.97, status: 'COMPLETED', type: 'P2P_EXCHANGE', date: '2024-03-09' },
    { id: 'TX-9907', sellerId: 'S5', seller: 'Oracle Tech',    buyer: 'Nova Spark',    coins: 6200,  diamonds: 200,  rate: 1.00, status: 'PENDING',   type: 'SEND',         date: '2024-03-08' },
    { id: 'TX-9908', sellerId: 'S4', seller: 'Cipher Zero',    buyer: 'Pixel Phoenix', coins: 11000, diamonds: 350,  rate: 0.95, status: 'COMPLETED', type: 'DISBURSEMENT', date: '2024-03-06' },
    { id: 'TX-9909', sellerId: 'S1', seller: 'Zion Sentinel',  buyer: 'Iron Veil',     coins: 32000, diamonds: 980,  rate: 1.00, status: 'COMPLETED', type: 'P2P_EXCHANGE', date: '2024-02-28' },
    { id: 'TX-9910', sellerId: 'S1', seller: 'Zion Sentinel',  buyer: 'Echo Strike',   coins: 7500,  diamonds: 220,  rate: 0.93, status: 'FLAGGED',   type: 'REFILL',       date: '2024-02-20' },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toLocaleString();
const initials = (name: string) => name.split(' ').map(w => w[0]).join('');
const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });

function StatusDot({ status }: { status: string }) {
    const g = status === 'COMPLETED' || status === 'ACTIVE';
    const p = status === 'PENDING';
    return (
        <div className="flex items-center gap-1.5">
            <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0',
                g ? 'bg-neon-green shadow-[0_0_6px_rgba(0,255,100,0.5)]'
                  : p ? 'bg-neon-gold shadow-[0_0_6px_rgba(255,200,0,0.5)]'
                      : 'bg-neon-red shadow-[0_0_6px_rgba(255,0,0,0.5)]')} />
            <span className={cn('text-[10px] font-black uppercase tracking-wider',
                g ? 'text-neon-green' : p ? 'text-neon-gold' : 'text-neon-red')}>
                {status}
            </span>
        </div>
    );
}

function TypeBadge({ type }: { type: TxType }) {
    const v = type === 'P2P_EXCHANGE' ? 'purple' : type === 'REFILL' ? 'gold' : 'cyan';
    return <NeonBadge variant={v}>{type.replace('_', ' ')}</NeonBadge>;
}

function SLabel({ text }: { text: string }) {
    return <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/25">{text}</p>;
}

// ─────────────────────────────────────────────────────────────────────────────
// TX SUMMARY BAR — totals above table
// ─────────────────────────────────────────────────────────────────────────────
function TxSummaryBar({ txList, label = '' }: { txList: Tx[]; label?: string }) {
    const totalCoins    = txList.reduce((s, t) => s + t.coins,    0);
    const totalDiamonds = txList.reduce((s, t) => s + t.diamonds, 0);
    const totalTx       = txList.length;

    return (
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
            {[
                { icon: <Hash size={12} />,     label: 'Transactions',   val: String(totalTx),           color: 'neon-cyan',  border: 'border-neon-cyan/15',   bg: 'bg-neon-cyan/[0.05]',   text: 'text-neon-cyan'   },
                { icon: <Sparkles size={12} />, label: 'Total Coins',    val: fmt(totalCoins),           color: 'neon-gold',  border: 'border-neon-gold/15',   bg: 'bg-neon-gold/[0.05]',   text: 'text-neon-gold'   },
                { icon: <Gem size={12} />,      label: 'Total Diamonds', val: fmt(totalDiamonds),        color: '[#7ef6ff]',  border: 'border-[#7ef6ff]/15',   bg: 'bg-[#7ef6ff]/[0.04]',  text: 'text-[#7ef6ff]'  },
            ].map(({ icon, label: lb, val, color, border, bg, text }) => (
                <div key={lb} className={cn('relative flex items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-xl border overflow-hidden', border, bg)}>
                    <div className={cn('w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 border',
                        `bg-${color}/10 border-${color}/25 ${text}`)}>
                        {icon}
                    </div>
                    <div className="min-w-0">
                        <p className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.2em] text-white/25 hidden sm:block truncate">{lb}</p>
                        <p className={cn('text-sm sm:text-base font-black leading-tight', text)}>{val}</p>
                        {label && <p className="text-[7px] text-white/20 hidden sm:block truncate">{label}</p>}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// COLLAPSIBLE FILTER PANEL
// ─────────────────────────────────────────────────────────────────────────────
function FilterPanel({
    filters, onChange, onClear,
    search, onSearch,
}: {
    filters: Filters; onChange: (f: Filters) => void; onClear: () => void;
    search?: string; onSearch?: (v: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const activeCount = [filters.status, filters.type, (filters.from || filters.to) ? '1' : ''].filter(Boolean).length;

    const selCls = 'h-10 sm:h-9 w-full rounded-lg border border-card-border bg-dark-bg px-3 text-xs sm:text-[10px] font-bold text-text-primary focus:outline-none focus:border-neon-cyan/40 hover:border-neon-cyan/20 transition-all touch-manipulation';
    const dateCls = 'h-10 sm:h-9 w-full rounded-lg border border-card-border bg-dark-bg px-3 text-xs font-bold text-white/60 focus:outline-none focus:border-neon-gold/40 hover:border-neon-gold/20 transition-all touch-manipulation';

    return (
        <div className="glass-card rounded-xl border border-card-border mb-3 overflow-hidden">
            {/* Toggle */}
            <button
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3 touch-manipulation"
            >
                <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                    <SlidersHorizontal size={13} className="text-neon-cyan/70 flex-shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted">Filters</span>
                    {activeCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-neon-cyan/20 border border-neon-cyan/30 text-neon-cyan text-[9px] font-black">
                            {activeCount}
                        </span>
                    )}
                    {!open && filters.status && (
                        <span className="px-1.5 py-0.5 rounded bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-[8px] font-black">{filters.status}</span>
                    )}
                    {!open && filters.type && (
                        <span className="px-1.5 py-0.5 rounded bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-[8px] font-black">{filters.type.replace('_', ' ')}</span>
                    )}
                    {!open && (filters.from || filters.to) && (
                        <span className="px-1.5 py-0.5 rounded bg-neon-gold/10 border border-neon-gold/20 text-neon-gold text-[8px] font-black">
                            {filters.from || '…'} → {filters.to || '…'}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {activeCount > 0 && (
                        <button
                            onClick={e => { e.stopPropagation(); onClear(); }}
                            className="flex items-center gap-1 px-2 h-6 rounded bg-neon-red/10 border border-neon-red/20 text-neon-red text-[9px] font-black touch-manipulation"
                        >
                            <X size={9} /> Clear
                        </button>
                    )}
                    {open ? <ChevronUp size={14} className="text-text-muted" /> : <ChevronDown size={14} className="text-text-muted" />}
                </div>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 pt-1 border-t border-card-border space-y-3">
                            {/* Search (optional) */}
                            {onSearch !== undefined && (
                                <div className="relative">
                                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                    <input
                                        value={search}
                                        onChange={e => onSearch(e.target.value)}
                                        placeholder="Search TX / seller / buyer..."
                                        className="w-full h-10 sm:h-9 rounded-lg border border-card-border bg-dark-bg hover:border-neon-cyan/20 focus:border-neon-cyan/40 focus:outline-none text-xs font-bold text-text-primary placeholder-text-muted/40 transition-all pl-9 pr-3"
                                    />
                                </div>
                            )}
                            {/* Status + Type */}
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-text-muted mb-1.5">Status</p>
                                    <select value={filters.status} onChange={e => onChange({ ...filters, status: e.target.value })} className={selCls}>
                                        <option value="">All Status</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="PENDING">Pending</option>
                                        <option value="FLAGGED">Flagged</option>
                                    </select>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-text-muted mb-1.5">Type</p>
                                    <select value={filters.type} onChange={e => onChange({ ...filters, type: e.target.value })} className={selCls}>
                                        <option value="">All Types</option>
                                        <option value="P2P_EXCHANGE">P2P Exchange</option>
                                        <option value="REFILL">Refill</option>
                                        <option value="DISBURSEMENT">Disbursement</option>
                                        <option value="SEND">Send</option>
                                    </select>
                                </div>
                            </div>
                            {/* Date range */}
                            <div>
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <Calendar size={10} className="text-neon-gold/60" />
                                    <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Date Range</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-[7px] text-text-muted mb-1">From</p>
                                        <input type="date" value={filters.from} onChange={e => onChange({ ...filters, from: e.target.value })} className={dateCls} />
                                    </div>
                                    <div>
                                        <p className="text-[7px] text-text-muted mb-1">To</p>
                                        <input type="date" value={filters.to} onChange={e => onChange({ ...filters, to: e.target.value })} className={dateCls} />
                                    </div>
                                </div>
                                {(filters.from || filters.to) && (
                                    <div className="flex items-center justify-between mt-2 px-2.5 py-1.5 rounded-lg bg-neon-gold/[0.06] border border-neon-gold/15">
                                        <span className="text-[9px] text-neon-gold font-bold">{filters.from || 'Any'} → {filters.to || 'Any'}</span>
                                        <button onClick={() => onChange({ ...filters, from: '', to: '' })} className="text-neon-red/60 hover:text-neon-red touch-manipulation">
                                            <X size={10} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────────────────────────────────────
function Pagination({
    currentPage, totalPages, totalItems, itemsPerPage, onPageChange, accent = 'cyan',
}: {
    currentPage: number; totalPages: number; totalItems: number;
    itemsPerPage: number; onPageChange: (p: number) => void; accent?: string;
}) {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end   = Math.min(currentPage * itemsPerPage, totalItems);
    const pages: (number | '...')[] = useMemo(() => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage <= 3) return [1, 2, 3, '...', totalPages];
        if (currentPage >= totalPages - 2) return [1, '...', totalPages - 2, totalPages - 1, totalPages];
        return [1, '...', currentPage, '...', totalPages];
    }, [currentPage, totalPages]);

    const btn  = 'min-w-[32px] h-8 sm:min-w-[28px] sm:h-7 rounded-lg border transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation px-1 text-[10px] font-black';
    const idle = `bg-white/[0.03] border-card-border text-text-muted hover:bg-neon-${accent}/10 hover:border-neon-${accent}/30 hover:text-neon-${accent}`;
    const active = `bg-neon-${accent}/20 border-neon-${accent}/50 text-neon-${accent}`;

    return (
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-t border-card-border gap-2 flex-wrap">
            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-text-muted hidden sm:block whitespace-nowrap">
                <span className={`text-neon-${accent}`}>{start}–{end}</span> / {totalItems}
            </span>
            <div className="flex items-center gap-1 mx-auto sm:mx-0">
                <button disabled={currentPage === 1} onClick={() => onPageChange(1)} className={cn(btn, idle)}><ChevronsLeft size={11} /></button>
                <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className={cn(btn, idle)}><ChevronLeft size={11} /></button>
                {pages.map((p, i) => p === '...'
                    ? <span key={`e${i}`} className="min-w-[28px] flex items-center justify-center text-[10px] text-text-muted">·</span>
                    : <button key={p} onClick={() => onPageChange(p as number)} className={cn(btn, currentPage === p ? active : idle)}>{p}</button>
                )}
                <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} className={cn(btn, idle)}><ChevronRight size={11} /></button>
                <button disabled={currentPage === totalPages} onClick={() => onPageChange(totalPages)} className={cn(btn, idle)}><ChevronsRight size={11} /></button>
            </div>
            <span className="text-[9px] font-black text-text-muted hidden sm:block whitespace-nowrap">{currentPage}/{totalPages}</span>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE TX CARD — used on all screen sizes (replaces table on mobile)
// ─────────────────────────────────────────────────────────────────────────────
function MobileTxCard({ tx, onClick }: { tx: Tx; onClick?: () => void }) {
    return (
        <div
            onClick={onClick}
            className={cn(
                'relative rounded-xl border border-card-border bg-white/[0.02] p-3 overflow-hidden',
                onClick && 'cursor-pointer active:bg-white/[0.05]'
            )}
        >
            {/* Row 1: ID + badges */}
            <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                    <Repeat size={10} className="text-neon-cyan flex-shrink-0" />
                    <span className="text-neon-cyan font-black text-[11px] tracking-widest truncate">{tx.id}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <TypeBadge type={tx.type} />
                    <StatusDot status={tx.status} />
                </div>
            </div>
            {/* Row 2: pair */}
            <div className="flex items-center gap-2 mb-2.5 min-w-0">
                <span className="text-[11px] font-bold text-text-primary truncate max-w-[90px] sm:max-w-none">{tx.seller}</span>
                <ArrowRightLeft size={9} className="text-neon-gold flex-shrink-0" />
                <span className="text-[11px] font-bold text-text-primary truncate max-w-[90px] sm:max-w-none">{tx.buyer}</span>
            </div>
            {/* Row 3: 4 stat tiles */}
            <div className="grid grid-cols-4 gap-1.5">
                {[
                    { label: 'Coins',    val: fmt(tx.coins),    cls: 'text-neon-gold',          bg: 'bg-neon-gold/[0.06] border-neon-gold/15' },
                    { label: 'Diamonds', val: fmt(tx.diamonds), cls: 'text-[#7ef6ff]',          bg: 'bg-[#7ef6ff]/[0.05] border-[#7ef6ff]/15' },
                    { label: 'Rate',     val: `${tx.rate}x`,    cls: 'text-neon-green',         bg: 'bg-neon-green/[0.05] border-neon-green/15' },
                    { label: 'Date',     val: fmtDate(tx.date), cls: 'text-white/50',           bg: 'bg-white/[0.03] border-white/[0.07]' },
                ].map(({ label, val, cls, bg }) => (
                    <div key={label} className={cn('rounded-lg px-1.5 py-1.5 text-center border', bg)}>
                        <p className="text-[7px] uppercase tracking-widest text-white/25 mb-0.5 font-black">{label}</p>
                        <p className={cn('text-[10px] sm:text-[11px] font-black leading-none truncate', cls)}>{val}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SEND COIN MODAL — bottom-sheet on mobile
// ─────────────────────────────────────────────────────────────────────────────
function SendCoinModal({
    isOpen, onClose, onSend, sellers,
}: {
    isOpen: boolean; onClose: () => void;
    onSend: (sellerId: string, amount: number) => void;
    sellers: Seller[];
}) {
    const [sel, setSel] = useState('');
    const [amt, setAmt] = useState('');
    const [err, setErr] = useState('');
    React.useEffect(() => { setSel(''); setAmt(''); setErr(''); }, [isOpen]);

    const submit = () => {
        if (!sel) { setErr('Please select a seller'); return; }
        const n = parseInt(amt);
        if (!n || n <= 0) { setErr('Enter a valid amount'); return; }
        onSend(sel, n);
        onClose();
    };

    const inputCls = 'w-full h-11 sm:h-9 rounded-lg border border-card-border bg-dark-bg focus:border-neon-gold/50 focus:outline-none text-sm sm:text-xs font-bold text-text-primary placeholder-text-muted/40 transition-all px-3';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
                    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 80 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                            className="pointer-events-auto w-full sm:max-w-md sm:mb-8 relative"
                        >
                            <div className="relative rounded-t-2xl sm:rounded-2xl border border-neon-gold/20 bg-[#080a10] overflow-hidden">
                                {/* Drag handle */}
                                <div className="flex justify-center pt-3 sm:hidden">
                                    <div className="w-10 h-1 rounded-full bg-white/20" />
                                </div>
                                {/* Header */}
                                <div className="px-5 py-4 border-b border-card-border flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-neon-gold/10 border border-neon-gold/30 flex items-center justify-center">
                                            <Send size={15} className="text-neon-gold" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-neon-gold/50">Coin Dispatch</p>
                                            <h2 className="text-sm font-black text-text-primary">Send Coins to Seller</h2>
                                        </div>
                                    </div>
                                    <button onClick={onClose} className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-white/5 border border-card-border text-text-muted flex items-center justify-center touch-manipulation">
                                        <X size={15} />
                                    </button>
                                </div>
                                {/* Body */}
                                <div className="px-5 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                                    <div>
                                        <SLabel text="Select Seller" />
                                        <div className="mt-2 space-y-2 max-h-[200px] overflow-y-auto pr-1">
                                            {sellers.filter(s => s.status === 'ACTIVE').map(s => (
                                                <button key={s.id} onClick={() => setSel(s.id)}
                                                    className={cn('w-full flex items-center gap-3 px-3 py-3 rounded-xl border transition-all touch-manipulation',
                                                        sel === s.id ? 'bg-neon-gold/10 border-neon-gold/40' : 'bg-white/[0.03] border-white/[0.06] active:bg-white/[0.06]')}>
                                                    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center font-black text-[11px] border flex-shrink-0',
                                                        sel === s.id ? 'bg-neon-gold/15 border-neon-gold/40 text-neon-gold' : 'bg-white/5 border-white/10 text-white/50')}>
                                                        {initials(s.name)}
                                                    </div>
                                                    <div className="flex-1 text-left min-w-0">
                                                        <p className="text-xs font-black text-white/75 truncate">{s.name}</p>
                                                        <p className="text-[9px] text-white/30">{s.agency} · {s.coins.toLocaleString()} coins</p>
                                                    </div>
                                                    {sel === s.id && <Check size={14} className="text-neon-gold flex-shrink-0" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <AnimatePresence>
                                        {sel && (
                                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                                                <SLabel text="Coin Amount" />
                                                <div className="relative mt-2">
                                                    <Sparkles size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-gold/40 pointer-events-none" />
                                                    <input
                                                        type="number"
                                                        inputMode="numeric"
                                                        min={1}
                                                        value={amt}
                                                        onChange={e => { setAmt(e.target.value); setErr(''); }}
                                                        placeholder="e.g. 5000"
                                                        className={cn(inputCls, 'pl-8')}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    {err && <p className="text-[10px] text-neon-red">{err}</p>}
                                    <div className="grid grid-cols-2 gap-2 pb-2">
                                        <button onClick={submit}
                                            className="h-12 sm:h-10 rounded-xl bg-neon-gold/15 hover:bg-neon-gold/25 border border-neon-gold/30 text-neon-gold text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 touch-manipulation transition-all">
                                            <Send size={13} /> Dispatch
                                        </button>
                                        <button onClick={onClose}
                                            className="h-12 sm:h-10 rounded-xl bg-white/[0.04] border border-card-border text-text-muted text-xs font-black uppercase tracking-widest touch-manipulation transition-all">
                                            Cancel
                                        </button>
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
// MARKET SETTINGS MODAL
// ─────────────────────────────────────────────────────────────────────────────
function MarketSettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [rate, setRate] = useState('1.0');
    const [fee, setFee]   = useState('5');

    const inputCls = 'w-full h-11 sm:h-9 rounded-lg border border-card-border bg-dark-bg focus:border-neon-purple/50 focus:outline-none text-sm sm:text-xs font-bold text-text-primary transition-all px-3';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
                    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 80 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                            className="pointer-events-auto w-full sm:max-w-md sm:mb-8 relative"
                        >
                            <div className="relative rounded-t-2xl sm:rounded-2xl border border-neon-purple/20 bg-[#080a10] overflow-hidden">
                                <div className="flex justify-center pt-3 sm:hidden">
                                    <div className="w-10 h-1 rounded-full bg-white/20" />
                                </div>
                                <div className="px-5 py-4 border-b border-card-border flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center">
                                            <Settings size={15} className="text-neon-purple" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-neon-purple/50">Market Config</p>
                                            <h2 className="text-sm font-black text-text-primary">Market Liquidity Setup</h2>
                                        </div>
                                    </div>
                                    <button onClick={onClose} className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-white/5 border border-card-border text-text-muted flex items-center justify-center touch-manipulation">
                                        <X size={15} />
                                    </button>
                                </div>
                                <div className="px-5 py-5 space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-2">Exchange Rate</p>
                                            <input type="number" inputMode="decimal" value={rate} onChange={e => setRate(e.target.value)} className={inputCls} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-2">Trading Fee %</p>
                                            <input type="number" inputMode="decimal" value={fee} onChange={e => setFee(e.target.value)} className={inputCls} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pb-2">
                                        <button onClick={onClose}
                                            className="h-12 sm:h-10 rounded-xl bg-neon-purple/15 hover:bg-neon-purple/25 border border-neon-purple/30 text-neon-purple text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 touch-manipulation transition-all">
                                            <Check size={13} /> Verify
                                        </button>
                                        <button onClick={onClose}
                                            className="h-12 sm:h-10 rounded-xl bg-white/[0.04] border border-card-border text-text-muted text-xs font-black uppercase tracking-widest touch-manipulation transition-all">
                                            Cancel
                                        </button>
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
// SELLER DETAIL VIEW
// ─────────────────────────────────────────────────────────────────────────────
function SellerDetailView({
    seller, txList, onBack, onEditCoins,
}: {
    seller: Seller; txList: Tx[]; onBack: () => void;
    onEditCoins: (sellerId: string, delta: number) => void;
}) {
    const [filters, setFilters]         = useState<Filters>(DEF_FILTERS);
    const [search, setSearch]           = useState('');
    const [editMode, setEditMode]       = useState<'add' | 'sub' | null>(null);
    const [editAmount, setEditAmount]   = useState('');
    const [page, setPage]               = useState(1);
    const [profileOpen, setProfileOpen] = useState(false);

    const sellerTx = useMemo(() => txList.filter(t => t.sellerId === seller.id), [txList, seller.id]);

    const filtered = useMemo(() => {
        const s = search.toLowerCase();
        return sellerTx
            .filter(t => !s || t.id.toLowerCase().includes(s) || t.buyer.toLowerCase().includes(s))
            .filter(t => !filters.status || t.status === filters.status)
            .filter(t => !filters.type   || t.type   === filters.type)
            .filter(t => {
                if (!filters.from && !filters.to) return true;
                const d = new Date(t.date);
                if (filters.from && d < new Date(filters.from)) return false;
                if (filters.to   && d > new Date(filters.to))   return false;
                return true;
            });
    }, [sellerTx, search, filters]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paged      = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    const hasFilter  = Object.values(filters).some(Boolean) || !!search;

    const applyEdit = () => {
        const n = parseInt(editAmount);
        if (!n || n <= 0) return;
        onEditCoins(seller.id, editMode === 'add' ? n : -n);
        setEditMode(null);
        setEditAmount('');
    };

    const desktopTxCols: Column<Tx>[] = [
        { header: 'TX ID',    accessor: t => <span className="text-text-primary font-black text-[11px] tracking-widest">{t.id}</span> },
        { header: 'Buyer',    accessor: t => <span className="text-text-primary font-bold text-xs">{t.buyer}</span> },
        { header: 'Coins',    accessor: t => <span className="flex items-center gap-1 text-neon-gold font-black text-xs"><Sparkles size={10} />{t.coins.toLocaleString()}</span> },
        { header: 'Diamonds', accessor: t => <span className="flex items-center gap-1 text-[#7ef6ff] font-black text-xs"><Gem size={10} />{t.diamonds.toLocaleString()}</span> },
        { header: 'Rate',     accessor: t => <span className="text-neon-cyan font-black text-xs">{t.rate}x</span> },
        { header: 'Type',     accessor: t => <TypeBadge type={t.type} /> },
        { header: 'Status',   accessor: t => <StatusDot status={t.status} /> },
        { header: 'Date',     accessor: t => <span className="text-[10px] text-text-muted">{fmtDate(t.date)}</span> },
    ];

    // ── Shared profile card content ──────────────────────────────────────────
    const ProfileContent = () => (
        <div className="p-4 space-y-3">
            {/* Avatar + name */}
            <div className="flex lg:flex-col items-center gap-3 lg:gap-2 lg:text-center">
                <div className="w-14 h-14 rounded-2xl bg-neon-cyan/10 border-2 border-neon-cyan/30 flex items-center justify-center text-neon-cyan font-black text-xl flex-shrink-0"
                    style={{ boxShadow: '0 0 20px rgba(0,255,255,0.12)' }}>
                    {initials(seller.name)}
                </div>
                <div>
                    <p className="font-black text-white text-sm">{seller.name}</p>
                    <p className="text-[9px] text-white/35 mt-0.5">{seller.agency}</p>
                    <div className="mt-1"><StatusDot status={seller.status} /></div>
                </div>
            </div>
            {/* Stat rows */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
                {[
                    { icon: <Sparkles size={10} className="text-neon-gold" />,          label: 'Coins',    val: seller.coins.toLocaleString(),    vc: 'text-neon-gold',       bg: 'bg-neon-gold/[0.06] border-neon-gold/15' },
                    { icon: <Gem      size={10} className="text-[#7ef6ff]" />,          label: 'Diamonds', val: seller.diamonds.toLocaleString(), vc: 'text-[#7ef6ff]',       bg: 'bg-[#7ef6ff]/[0.06] border-[#7ef6ff]/15' },
                    { icon: <Activity size={10} className="text-neon-cyan/50" />,       label: 'Total TX', val: `${sellerTx.length}`,             vc: 'text-neon-cyan',       bg: 'bg-white/[0.03] border-white/[0.06]' },
                    { icon: <Clock    size={10} className="text-white/20" />,           label: 'Joined',   val: fmtDate(seller.joinDate),         vc: 'text-white/40',        bg: 'bg-white/[0.03] border-white/[0.06]' },
                ].map(({ icon, label, val, vc, bg }) => (
                    <div key={label} className={cn('flex items-center justify-between px-3 py-2 rounded-xl border', bg)}>
                        <div className="flex items-center gap-1.5">{icon}<span className="text-[9px] uppercase tracking-widest text-white/25 font-black">{label}</span></div>
                        <span className={cn('text-[11px] font-black', vc)}>{val}</span>
                    </div>
                ))}
            </div>
            {/* Edit coins */}
            <div className="border-t border-card-border pt-3">
                <SLabel text="Edit Coin Balance" />
                <div className="mt-2 grid grid-cols-2 gap-2">
                    {(['add', 'sub'] as const).map(mode => (
                        <button key={mode} onClick={() => setEditMode(editMode === mode ? null : mode)}
                            className={cn('flex items-center justify-center gap-1.5 h-10 lg:h-8 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all touch-manipulation',
                                editMode === mode
                                    ? mode === 'add' ? 'bg-neon-green/20 border-neon-green/50 text-neon-green' : 'bg-neon-red/20 border-neon-red/50 text-neon-red'
                                    : mode === 'add' ? 'bg-white/[0.04] border-card-border text-text-muted hover:border-neon-green/30 hover:text-neon-green'
                                                     : 'bg-white/[0.04] border-card-border text-text-muted hover:border-neon-red/30 hover:text-neon-red')}>
                            {mode === 'add' ? <Plus size={11} /> : <Minus size={11} />}
                            {mode === 'add' ? 'Add' : 'Deduct'}
                        </button>
                    ))}
                </div>
                <AnimatePresence>
                    {editMode && (
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="mt-2 flex gap-2">
                            <input
                                type="number" inputMode="numeric" min={1}
                                value={editAmount} onChange={e => setEditAmount(e.target.value)}
                                placeholder="Amount..."
                                className="flex-1 h-10 lg:h-8 rounded-lg bg-dark-bg border border-card-border focus:border-neon-cyan/50 focus:outline-none text-xs font-bold text-text-primary placeholder-text-muted/40 transition-all px-3"
                            />
                            <button onClick={applyEdit}
                                className={cn('px-3 h-10 lg:h-8 rounded-lg border text-[10px] font-black uppercase tracking-widest flex items-center gap-1 touch-manipulation transition-all',
                                    editMode === 'add' ? 'bg-neon-green/15 border-neon-green/40 text-neon-green' : 'bg-neon-red/15 border-neon-red/40 text-neon-red')}>
                                <Check size={11} /> Apply
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 mb-4">
                <button onClick={onBack}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-card-border text-text-muted hover:text-neon-cyan text-[10px] font-black uppercase tracking-widest transition-all touch-manipulation">
                    <Home size={10} /><span className="hidden xs:inline">Coin Exchange</span>
                </button>
                <ChevronRight size={12} className="text-text-muted/40" />
                <span className="px-2.5 py-1 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-[10px] font-black uppercase tracking-widest truncate max-w-[140px] sm:max-w-none">
                    {seller.name}
                </span>
            </div>

            {/* ── MOBILE: collapsible profile ── */}
            <div className="lg:hidden mb-4">
                <div className="glass-card rounded-2xl border border-neon-cyan/15 overflow-hidden">
                    <button onClick={() => setProfileOpen(v => !v)}
                        className="w-full flex items-center justify-between px-4 py-3 touch-manipulation">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-neon-cyan/10 border border-neon-cyan/25 flex items-center justify-center text-neon-cyan font-black text-[11px] flex-shrink-0">
                                {initials(seller.name)}
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-black text-white">{seller.name}</p>
                                <div className="flex items-center gap-3 mt-0.5">
                                    <span className="text-[9px] text-neon-gold font-bold flex items-center gap-0.5"><Sparkles size={8} />{seller.coins.toLocaleString()}</span>
                                    <span className="text-[9px] text-[#7ef6ff] font-bold flex items-center gap-0.5"><Gem size={8} />{seller.diamonds.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <StatusDot status={seller.status} />
                            {profileOpen ? <ChevronUp size={14} className="text-text-muted" /> : <ChevronDown size={14} className="text-text-muted" />}
                        </div>
                    </button>
                    <AnimatePresence>
                        {profileOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                                className="overflow-hidden border-t border-card-border">
                                <ProfileContent />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ── DESKTOP: side-by-side ── */}
            <div className="hidden lg:flex gap-5 items-start">
                {/* Sidebar */}
                <div className="w-[260px] flex-shrink-0">
                    <div className="glass-card rounded-2xl border border-neon-cyan/15 overflow-hidden relative"
                        style={{ background: 'linear-gradient(135deg,rgba(0,255,255,0.04) 0%,transparent 60%)' }}>
                        <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 6 }}
                            className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent pointer-events-none" />
                        <ProfileContent />
                    </div>
                </div>
                {/* Right: transactions */}
                <div className="flex-1 min-w-0">
                    <FilterPanel
                        filters={filters} onChange={f => { setFilters(f); setPage(1); }}
                        onClear={() => { setFilters(DEF_FILTERS); setSearch(''); setPage(1); }}
                        search={search} onSearch={v => { setSearch(v); setPage(1); }}
                    />
                    <TxSummaryBar txList={filtered} label={hasFilter ? 'filtered results' : `all ${seller.name} tx`} />
                    <div className="glass-card rounded-2xl border border-neon-cyan/10 overflow-hidden">
                        <div className="px-4 py-2.5 border-b border-card-border flex items-center justify-between">
                            <SLabel text="Transaction History" />
                            <span className="text-[8px] font-bold text-white/20">{filtered.length} records</span>
                        </div>
                        <div className="p-1">
                            <NeonTable columns={desktopTxCols} data={paged} />
                            {paged.length === 0 && <div className="py-10 text-center text-text-muted text-sm">No transactions found.</div>}
                        </div>
                        <Pagination currentPage={page} totalPages={totalPages} totalItems={filtered.length}
                            itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} accent="cyan" />
                    </div>
                </div>
            </div>

            {/* ── MOBILE: full-width tx panel ── */}
            <div className="lg:hidden">
                <FilterPanel
                    filters={filters} onChange={f => { setFilters(f); setPage(1); }}
                    onClear={() => { setFilters(DEF_FILTERS); setSearch(''); setPage(1); }}
                    search={search} onSearch={v => { setSearch(v); setPage(1); }}
                />
                <TxSummaryBar txList={filtered} label={hasFilter ? 'filtered' : 'all tx'} />
                <div className="space-y-2 mb-3">
                    {paged.map(tx => <MobileTxCard key={tx.id} tx={tx} />)}
                    {paged.length === 0 && <div className="py-10 text-center text-text-muted text-sm">No transactions found.</div>}
                </div>
                {totalPages > 1 && (
                    <div className="glass-card rounded-xl border border-neon-cyan/10 overflow-hidden">
                        <Pagination currentPage={page} totalPages={totalPages} totalItems={filtered.length}
                            itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} accent="cyan" />
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function CoinTradingPage() {
    const router   = useRouter();
    const { role } = useSelector((state: RootState) => state.auth);

    React.useEffect(() => {
        if (role === 'SUPER_ADMIN') router.replace('/app-owner/dashboard');
    }, [role, router]);

    if (role === 'SUPER_ADMIN') return null;

    const [sellers, setSellers]           = useState<Seller[]>(INIT_SELLERS);
    const [txList,  setTxList]            = useState<Tx[]>(INIT_TX);
    const [searchTerm, setSearchTerm]     = useState('');
    const [filters, setFilters]           = useState<Filters>(DEF_FILTERS);
    const [sendOpen, setSendOpen]         = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [activeSeller, setActiveSeller] = useState<Seller | null>(null);
    const [page, setPage]                 = useState(1);

    const filtered = useMemo(() => {
        const s = searchTerm.toLowerCase();
        return txList
            .filter(t => !s || t.id.toLowerCase().includes(s) || t.seller.toLowerCase().includes(s) || t.buyer.toLowerCase().includes(s))
            .filter(t => !filters.status || t.status === filters.status)
            .filter(t => !filters.type   || t.type   === filters.type)
            .filter(t => {
                if (!filters.from && !filters.to) return true;
                const d = new Date(t.date);
                if (filters.from && d < new Date(filters.from)) return false;
                if (filters.to   && d > new Date(filters.to))   return false;
                return true;
            });
    }, [txList, searchTerm, filters]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const safePage   = Math.min(page, totalPages);
    const paged      = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

    const handleSend = (sellerId: string, amount: number) => {
        const seller = sellers.find(s => s.id === sellerId)!;
        const newTx: Tx = {
            id:       `TX-${Date.now()}`.slice(0, 10),
            sellerId, seller: seller.name,
            buyer:    'Admin Dispatch',
            coins:    amount,
            diamonds: Math.round(amount * 0.03),
            rate:     1.00,
            status:   'COMPLETED',
            type:     'SEND',
            date:     new Date().toISOString().split('T')[0],
        };
        setTxList(p => [newTx, ...p]);
        setSellers(p => p.map(s => s.id === sellerId ? { ...s, coins: s.coins + amount } : s));
        setPage(1);
    };

    const handleEditCoins = (sellerId: string, delta: number) => {
        setSellers(p => p.map(s => s.id === sellerId ? { ...s, coins: Math.max(0, s.coins + delta) } : s));
    };

    const stats = [
        { label: 'Trading Volume',       value: '1.2M Coins', sub: 'last 24 hours',          Icon: Repeat,      color: 'neon-cyan',  textCls: 'text-neon-cyan',  bgCls: 'bg-neon-cyan/10',  glowCls: 'bg-neon-cyan'  },
        { label: 'Execution Efficiency', value: '98.4%',      sub: 'successful settlements', Icon: TrendingUp,  color: 'neon-green', textCls: 'text-neon-green', bgCls: 'bg-neon-green/10', glowCls: 'bg-neon-green' },
        { label: 'Flagged Activity',     value: '3 Alerts',   sub: 'pending review',         Icon: ShieldAlert, color: 'neon-red',   textCls: 'text-neon-red',   bgCls: 'bg-neon-red/10',   glowCls: 'bg-neon-red'   },
    ];

    // Desktop table columns
    const mainCols: Column<Tx>[] = [
        { header: 'TX ID', accessor: t => (
            <div className="flex items-center gap-2">
                <Repeat size={12} className="text-neon-cyan flex-shrink-0" />
                <span className="text-text-primary font-black tracking-widest text-xs">{t.id}</span>
            </div>
        )},
        { header: 'Trading Pair', accessor: t => (
            <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-text-primary leading-tight">{t.seller}</span>
                    <span className="text-[9px] text-text-muted uppercase">Seller</span>
                </div>
                <ArrowRightLeft size={10} className="text-neon-gold flex-shrink-0" />
                <div className="flex flex-col items-start">
                    <span className="text-xs font-bold text-text-primary leading-tight">{t.buyer}</span>
                    <span className="text-[9px] text-text-muted uppercase">Buyer</span>
                </div>
            </div>
        )},
        { header: 'Coins',    accessor: t => <span className="flex items-center gap-1 text-neon-gold font-black"><Sparkles size={10} />{t.coins.toLocaleString()}</span> },
        { header: 'Diamonds', accessor: t => <span className="flex items-center gap-1 text-[#7ef6ff] font-black"><Gem size={10} />{t.diamonds.toLocaleString()}</span> },
        { header: 'Rate',     accessor: t => <span className="text-[10px] font-bold text-neon-green">{t.rate}x</span> },
        { header: 'Type',     accessor: t => <TypeBadge type={t.type} /> },
        { header: 'Status',   accessor: t => <StatusDot status={t.status} /> },
        { header: 'Date',     accessor: t => <span className="text-[10px] text-text-muted">{fmtDate(t.date)}</span> },
        { header: 'Actions',  accessor: t => (
            <div className="flex items-center gap-1">
                <button
                    onClick={e => { e.stopPropagation(); const s = sellers.find(x => x.id === t.sellerId); if (s) setActiveSeller(s); }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan border border-transparent hover:border-neon-cyan/30 text-text-muted transition-all touch-manipulation">
                    <BarChart3 size={13} />
                </button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red border border-transparent hover:border-neon-red/30 text-text-muted transition-all touch-manipulation">
                    <ShieldAlert size={13} />
                </button>
            </div>
        )},
    ];

    // ── Seller Detail Page
    if (activeSeller) {
        return (
            <PageContainer>
                <SellerDetailView
                    seller={sellers.find(s => s.id === activeSeller.id) ?? activeSeller}
                    txList={txList}
                    onBack={() => setActiveSeller(null)}
                    onEditCoins={(id, delta) => {
                        handleEditCoins(id, delta);
                        setActiveSeller(s => s ? { ...s, coins: Math.max(0, s.coins + delta) } : s);
                    }}
                />
            </PageContainer>
        );
    }

    // ── Main Page
    return (
        <PageContainer>
            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <div className="mb-5">
                {/* Title row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.35em] text-neon-cyan/50 mb-1">Exchange Terminal</p>
                        <h1 className="text-xl sm:text-2xl font-black text-text-primary leading-tight">
                            Coin Exchange Terminal
                        </h1>
                        <p className="text-xs text-text-muted mt-1 hidden sm:block">
                            Oversight of peer-to-peer trading, system refills &amp; market liquidity
                        </p>
                    </div>
                    {/* Action buttons — stack on mobile */}
                    <div className="flex flex-col xs:flex-row gap-2 sm:flex-shrink-0">
                        <button onClick={() => setSendOpen(true)}
                            className="flex items-center justify-center gap-2 h-11 sm:h-10 px-4 rounded-xl bg-neon-gold/13 hover:bg-neon-gold/22 active:scale-95 border border-neon-gold/30 hover:border-neon-gold/55 text-neon-gold text-xs font-black uppercase tracking-widest transition-all touch-manipulation">
                            <Send size={13} /> Send Coins
                        </button>
                        <button onClick={() => setSettingsOpen(true)}
                            className="flex items-center justify-center gap-2 h-11 sm:h-10 px-4 rounded-xl bg-neon-purple/13 hover:bg-neon-purple/22 active:scale-95 border border-neon-purple/30 hover:border-neon-purple/55 text-neon-purple text-xs font-black uppercase tracking-widest transition-all touch-manipulation">
                            <Settings size={13} /> Market Settings
                        </button>
                    </div>
                </div>

                {/* Search — full width always */}
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    <input
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                        placeholder="Search transaction ID, seller or buyer..."
                        className="w-full h-11 sm:h-10 rounded-xl bg-white/[0.04] border border-card-border hover:border-neon-cyan/25 focus:border-neon-cyan/40 focus:outline-none text-xs sm:text-sm font-bold text-text-primary placeholder-text-muted/40 transition-all pl-9 pr-4"
                    />
                </div>
            </div>

            {/* ── STATS — 1 col mobile → 3 col sm+ ──────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5">
                {stats.map(({ label, value, sub, Icon, textCls, bgCls, glowCls }, i) => (
                    <motion.div key={i}
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className="glass-card p-4 rounded-2xl border border-white/5 relative overflow-hidden">
                        <div className="relative z-10 flex items-center gap-4">
                            <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', bgCls, textCls)}>
                                <Icon size={18} />
                            </div>
                            <div>
                                <p className="text-[9px] text-text-muted uppercase font-black tracking-widest">{label}</p>
                                <p className="text-xl font-black text-text-primary">{value}</p>
                                <p className="text-[9px] text-text-muted italic">{sub}</p>
                            </div>
                        </div>
                        <div className={cn('absolute top-0 right-0 w-20 h-20 blur-[35px] opacity-10 rounded-full -translate-y-1/2 translate-x-1/2', glowCls)} />
                    </motion.div>
                ))}
            </div>

            {/* ── FILTER PANEL ──────────────────────────────────────────── */}
            <FilterPanel
                filters={filters}
                onChange={f => { setFilters(f); setPage(1); }}
                onClear={() => { setFilters(DEF_FILTERS); setPage(1); }}
            />

            {/* ── SUMMARY ──────────────────────────────────────────────── */}
            <TxSummaryBar
                txList={filtered}
                label={Object.values(filters).some(Boolean) || searchTerm ? 'filtered results' : 'all transactions'}
            />

            {/* ── DESKTOP: NeonTable ─────────────────────────────────────── */}
            <div className="hidden md:block">
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
                    className="glass-card rounded-2xl border border-neon-cyan/10 overflow-hidden">
                    <div className="p-1">
                        <NeonTable
                            columns={mainCols}
                            data={paged}
                            onRowClick={t => { const s = sellers.find(x => x.id === t.sellerId); if (s) setActiveSeller(s); }}
                        />
                        {paged.length === 0 && (
                            <div className="py-16 text-center text-text-muted text-sm">No transactions found.</div>
                        )}
                    </div>
                    <Pagination currentPage={safePage} totalPages={totalPages} totalItems={filtered.length}
                        itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} accent="cyan" />
                </motion.div>
            </div>

            {/* ── MOBILE: card list ─────────────────────────────────────── */}
            <div className="md:hidden">
                <div className="space-y-2">
                    {paged.map(tx => (
                        <MobileTxCard
                            key={tx.id}
                            tx={tx}
                            onClick={() => { const s = sellers.find(x => x.id === tx.sellerId); if (s) setActiveSeller(s); }}
                        />
                    ))}
                    {paged.length === 0 && (
                        <div className="py-10 text-center text-text-muted text-sm">No transactions found.</div>
                    )}
                </div>
                {totalPages > 1 && (
                    <div className="glass-card rounded-xl border border-neon-cyan/10 overflow-hidden mt-3">
                        <Pagination currentPage={safePage} totalPages={totalPages} totalItems={filtered.length}
                            itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} accent="cyan" />
                    </div>
                )}
            </div>

            {/* ── MODALS ──────────────────────────────────────────────────── */}
            <SendCoinModal
                isOpen={sendOpen}
                onClose={() => setSendOpen(false)}
                onSend={handleSend}
                sellers={sellers}
            />
            <MarketSettingsModal
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
            />
        </PageContainer>
    );
}