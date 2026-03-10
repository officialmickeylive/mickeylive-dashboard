'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import {
    Search, Repeat, ArrowRightLeft, TrendingUp, ShieldAlert, BarChart3,
    Settings, Check, X, Filter, ChevronLeft, ChevronRight, ChevronsLeft,
    ChevronsRight, Plus, Minus, Send, Home, Calendar,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 5;

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const mockAgencies = [
    { id: 'AG1', name: 'Stellar Talent'  },
    { id: 'AG2', name: 'Neon Streamers'  },
    { id: 'AG3', name: 'Void Nexus'      },
    { id: 'AG4', name: 'Aether Media'    },
    { id: 'AG5', name: 'Quantum Guild'   },
];

const INIT_SELLERS: Seller[] = [
    { id: 'S1', name: 'Zion Sentinel',  agencyId: 'AG1', agency: 'Stellar Talent', coins: 128400, status: 'ACTIVE',   joinDate: '2022-03-10' },
    { id: 'S2', name: 'Void Nexus',     agencyId: 'AG3', agency: 'Void Nexus',     coins: 47200,  status: 'ACTIVE',   joinDate: '2022-07-14' },
    { id: 'S3', name: 'Aether Media',   agencyId: 'AG4', agency: 'Aether Media',   coins: 9800,   status: 'INACTIVE', joinDate: '2023-01-22' },
    { id: 'S4', name: 'Cipher Zero',    agencyId: 'AG1', agency: 'Stellar Talent', coins: 85000,  status: 'ACTIVE',   joinDate: '2022-11-05' },
    { id: 'S5', name: 'Oracle Tech',    agencyId: 'AG2', agency: 'Neon Streamers', coins: 34600,  status: 'ACTIVE',   joinDate: '2023-04-18' },
    { id: 'S6', name: 'System Reserve', agencyId: null,  agency: 'Platform',       coins: 500000, status: 'ACTIVE',   joinDate: '2021-01-01' },
    { id: 'S7', name: 'Nexus Prime',    agencyId: 'AG5', agency: 'Quantum Guild',  coins: 21000,  status: 'INACTIVE', joinDate: '2023-08-30' },
];

type TxType   = 'P2P_EXCHANGE' | 'REFILL' | 'DISBURSEMENT' | 'SEND';
type TxStatus = 'COMPLETED' | 'PENDING' | 'FLAGGED';

interface Tx {
    id: string; sellerId: string; seller: string;
    buyerId?: string; buyer: string;
    amount: number; rate: number; status: TxStatus; type: TxType; date: string;
}

interface Seller {
    id: string; name: string; agencyId: string | null; agency: string;
    coins: number; status: 'ACTIVE' | 'INACTIVE'; joinDate: string;
}

const INIT_TX: Tx[] = [
    { id: 'TX-9901', sellerId: 'S1', seller: 'Zion Sentinel',  buyer: 'Luna Divine',    amount: 50000, rate: 0.95, status: 'COMPLETED', type: 'P2P_EXCHANGE', date: '2024-03-15' },
    { id: 'TX-9902', sellerId: 'S6', seller: 'System Reserve', buyer: 'Shadow Dancer',  amount: 12000, rate: 1.05, status: 'PENDING',   type: 'REFILL',       date: '2024-03-14' },
    { id: 'TX-9903', sellerId: 'S2', seller: 'Void Nexus',     buyer: 'Cyber Queen',    amount: 8000,  rate: 0.90, status: 'FLAGGED',   type: 'P2P_EXCHANGE', date: '2024-03-13' },
    { id: 'TX-9904', sellerId: 'S3', seller: 'Aether Media',   buyer: 'Vanguard X',     amount: 25000, rate: 0.98, status: 'COMPLETED', type: 'DISBURSEMENT', date: '2024-03-12' },
    { id: 'TX-9905', sellerId: 'S4', seller: 'Cipher Zero',    buyer: 'Oracle Tech',    amount: 4500,  rate: 1.00, status: 'COMPLETED', type: 'P2P_EXCHANGE', date: '2024-03-11' },
    { id: 'TX-9906', sellerId: 'S1', seller: 'Zion Sentinel',  buyer: 'Storm Rider',    amount: 18000, rate: 0.97, status: 'COMPLETED', type: 'P2P_EXCHANGE', date: '2024-03-09' },
    { id: 'TX-9907', sellerId: 'S5', seller: 'Oracle Tech',    buyer: 'Nova Spark',     amount: 6200,  rate: 1.00, status: 'PENDING',   type: 'SEND',         date: '2024-03-08' },
    { id: 'TX-9908', sellerId: 'S4', seller: 'Cipher Zero',    buyer: 'Pixel Phoenix',  amount: 11000, rate: 0.95, status: 'COMPLETED', type: 'DISBURSEMENT', date: '2024-03-06' },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function StatusDot({ status }: { status: string }) {
    const g = status === 'COMPLETED' || status === 'ACTIVE';
    const p = status === 'PENDING';
    return (
        <div className="flex items-center gap-1.5">
            <div className={cn('w-1.5 h-1.5 rounded-full',
                g ? 'bg-neon-green shadow-[0_0_6px_rgba(0,255,100,0.6)]'
                : p ? 'bg-neon-gold shadow-[0_0_6px_rgba(255,200,0,0.5)]'
                :     'bg-neon-red  shadow-[0_0_6px_rgba(255,0,0,0.5)]')} />
            <span className={cn('text-[10px] font-black uppercase tracking-wider',
                g ? 'text-neon-green' : p ? 'text-neon-gold' : 'text-neon-red')}>{status}</span>
        </div>
    );
}

function SLabel({ text }: { text: string }) {
    return <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/25">{text}</p>;
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange, accent = 'cyan' }: {
    currentPage: number; totalPages: number; totalItems: number; itemsPerPage: number;
    onPageChange: (p: number) => void; accent?: string;
}) {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end   = Math.min(currentPage * itemsPerPage, totalItems);
    const pages: (number | '...')[] = useMemo(() => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
        if (currentPage >= totalPages - 3) return [1, '...', totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages];
        return [1, '...', currentPage-1, currentPage, currentPage+1, '...', totalPages];
    }, [currentPage, totalPages]);
    const btn  = 'w-7 h-7 rounded-lg border transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed';
    const idle = `bg-white/[0.03] border-card-border text-text-muted hover:bg-neon-${accent}/10 hover:border-neon-${accent}/30 hover:text-neon-${accent}`;
    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-card-border">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted hidden sm:block">
                Showing <span className={`text-neon-${accent}`}>{start}–{end}</span> of {totalItems}
            </span>
            <div className="flex items-center gap-1 mx-auto sm:mx-0">
                <button disabled={currentPage===1} onClick={()=>onPageChange(1)} className={cn(btn,idle)}><ChevronsLeft size={11}/></button>
                <button disabled={currentPage===1} onClick={()=>onPageChange(currentPage-1)} className={cn(btn,idle)}><ChevronLeft size={11}/></button>
                {pages.map((p,i) => p==='...'
                    ? <span key={`e${i}`} className="w-7 flex items-center justify-center text-[10px] text-text-muted">···</span>
                    : <motion.button key={p} whileTap={{scale:0.92}} onClick={()=>onPageChange(p as number)}
                        className={cn(btn,'text-[10px] font-black', currentPage===p
                            ? `bg-neon-${accent}/20 border-neon-${accent}/50 text-neon-${accent} shadow-[0_0_10px_rgba(0,255,255,0.15)]`
                            : idle)}>{p}</motion.button>
                )}
                <button disabled={currentPage===totalPages} onClick={()=>onPageChange(currentPage+1)} className={cn(btn,idle)}><ChevronRight size={11}/></button>
                <button disabled={currentPage===totalPages} onClick={()=>onPageChange(totalPages)} className={cn(btn,idle)}><ChevronsRight size={11}/></button>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted hidden sm:block">
                Page <span className="text-text-primary">{currentPage}/{totalPages}</span>
            </span>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SEND COIN MODAL
// ─────────────────────────────────────────────────────────────────────────────
function SendCoinModal({ isOpen, onClose, onSend, sellers }: {
    isOpen: boolean; onClose: () => void;
    onSend: (sellerId: string, amount: number) => void;
    sellers: Seller[];
}) {
    const [selectedSeller, setSelectedSeller] = useState('');
    const [amount, setAmount]                 = useState('');
    const [err, setErr]                       = useState('');

    React.useEffect(() => { setSelectedSeller(''); setAmount(''); setErr(''); }, [isOpen]);

    const submit = () => {
        if (!selectedSeller) { setErr('Select a seller'); return; }
        const n = parseInt(amount);
        if (!n || n <= 0) { setErr('Enter a valid amount'); return; }
        onSend(selectedSeller, n);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                        onClick={onClose} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div initial={{opacity:0,scale:0.93,y:16}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.93}}
                            transition={{type:'spring',stiffness:320,damping:26}}
                            className="pointer-events-auto w-full max-w-md relative">
                            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-neon-gold/20 to-transparent blur-md" />
                            <div className="relative rounded-2xl border border-neon-gold/20 bg-[#080a10] overflow-hidden">
                                <motion.div animate={{x:['-100%','200%']}} transition={{duration:2.5,repeat:Infinity,ease:'linear',repeatDelay:4}}
                                    className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-neon-gold to-transparent z-10" />
                                <div className="relative px-6 py-4 border-b border-card-border flex items-center justify-between"
                                    style={{background:'linear-gradient(135deg,rgba(255,215,0,0.06) 0%,transparent 60%)'}}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-neon-gold/10 border border-neon-gold/30 flex items-center justify-center"
                                            style={{boxShadow:'0 0 14px rgba(255,215,0,0.15)'}}>
                                            <Send size={15} className="text-neon-gold" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-neon-gold/50">Coin Dispatch</p>
                                            <h2 className="text-sm font-black text-text-primary">Send Coins to Seller</h2>
                                        </div>
                                    </div>
                                    <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red border border-card-border text-text-muted transition-all flex items-center justify-center">
                                        <X size={13}/>
                                    </button>
                                </div>
                                <div className="px-6 py-5 space-y-4">
                                    {/* Seller select */}
                                    <div>
                                        <SLabel text="Select Seller" />
                                        <div className="mt-2 space-y-2 max-h-[180px] overflow-y-auto pr-1">
                                            {sellers.filter(s=>s.status==='ACTIVE').map(s=>(
                                                <button key={s.id} onClick={()=>setSelectedSeller(s.id)}
                                                    className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all',
                                                        selectedSeller===s.id ? 'bg-neon-gold/10 border-neon-gold/40' : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10')}>
                                                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center font-black text-[11px] border',
                                                        selectedSeller===s.id ? 'bg-neon-gold/15 border-neon-gold/40 text-neon-gold' : 'bg-white/5 border-white/10 text-white/50')}>
                                                        {s.name.split(' ').map((n:string)=>n[0]).join('')}
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <p className="text-[11px] font-black text-white/75">{s.name}</p>
                                                        <p className="text-[9px] text-white/30">{s.agency} · {s.coins.toLocaleString()} coins</p>
                                                    </div>
                                                    {selectedSeller===s.id && <Check size={13} className="text-neon-gold flex-shrink-0"/>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Amount — appears after seller is selected */}
                                    <AnimatePresence>
                                        {selectedSeller && (
                                            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}>
                                                <SLabel text="Coin Amount" />
                                                <div className="relative mt-2">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-gold/40 pointer-events-none"><Repeat size={11}/></span>
                                                    <input type="number" min={1} value={amount} onChange={e=>{setAmount(e.target.value);setErr('');}}
                                                        placeholder="e.g. 5000"
                                                        className="w-full h-9 rounded-lg bg-dark-bg border border-card-border hover:border-neon-gold/30 focus:border-neon-gold/50 focus:outline-none text-xs font-bold text-text-primary placeholder-text-muted/40 transition-all pl-8 pr-3" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    {err && <p className="text-[9px] text-neon-red">{err}</p>}
                                    <div className="flex gap-2 pt-1">
                                        <button onClick={submit}
                                            className="flex-1 h-10 rounded-xl bg-neon-gold/15 hover:bg-neon-gold/25 border border-neon-gold/30 hover:border-neon-gold/60 text-neon-gold text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                            <Send size={13}/> Dispatch Coins
                                        </button>
                                        <button onClick={onClose} className="flex-1 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-card-border text-text-muted text-xs font-black uppercase tracking-widest transition-all">
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
    const [fee,  setFee ] = useState('5');
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                        onClick={onClose} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div initial={{opacity:0,scale:0.93,y:16}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.93}}
                            transition={{type:'spring',stiffness:320,damping:26}}
                            className="pointer-events-auto w-full max-w-md relative">
                            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-neon-purple/20 to-transparent blur-md" />
                            <div className="relative rounded-2xl border border-neon-purple/20 bg-[#080a10] overflow-hidden">
                                <motion.div animate={{x:['-100%','200%']}} transition={{duration:2.5,repeat:Infinity,ease:'linear',repeatDelay:4}}
                                    className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent z-10" />
                                <div className="relative px-6 py-4 border-b border-card-border flex items-center justify-between"
                                    style={{background:'linear-gradient(135deg,rgba(191,0,255,0.06) 0%,transparent 60%)'}}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center">
                                            <Settings size={15} className="text-neon-purple" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-neon-purple/50">Market Config</p>
                                            <h2 className="text-sm font-black text-text-primary">Market Liquidity Setup</h2>
                                        </div>
                                    </div>
                                    <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red border border-card-border text-text-muted transition-all flex items-center justify-center"><X size={13}/></button>
                                </div>
                                <div className="px-6 py-5 space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted block mb-1.5">Global Exchange Rate</p>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-purple/40 pointer-events-none"><TrendingUp size={11}/></span>
                                                <input type="number" value={rate} onChange={e=>setRate(e.target.value)}
                                                    className="w-full h-9 rounded-lg bg-dark-bg border border-card-border hover:border-neon-purple/30 focus:border-neon-purple/50 focus:outline-none text-xs font-bold text-text-primary transition-all pl-8 pr-3" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted block mb-1.5">Trading Fee %</p>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-purple/40 pointer-events-none"><Settings size={11}/></span>
                                                <input type="number" value={fee} onChange={e=>setFee(e.target.value)}
                                                    className="w-full h-9 rounded-lg bg-dark-bg border border-card-border hover:border-neon-purple/30 focus:border-neon-purple/50 focus:outline-none text-xs font-bold text-text-primary transition-all pl-8 pr-3" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-1">
                                        <button onClick={onClose}
                                            className="flex-1 h-10 rounded-xl bg-neon-purple/15 hover:bg-neon-purple/25 border border-neon-purple/30 hover:border-neon-purple/60 text-neon-purple text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                            <Check size={13}/> Verify Configuration
                                        </button>
                                        <button onClick={onClose} className="flex-1 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-card-border text-text-muted text-xs font-black uppercase tracking-widest transition-all">
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
// FILTER BAR
// ─────────────────────────────────────────────────────────────────────────────
interface Filters { status: string; type: string; from: string; to: string; }
const DEF_FILTERS: Filters = { status: '', type: '', from: '', to: '' };

function FilterBar({ filters, onChange, onClear }: {
    filters: Filters; onChange: (f: Filters) => void; onClear: () => void;
}) {
    const active = Object.values(filters).some(Boolean);
    const sel = (k: keyof Filters) => (e: React.ChangeEvent<HTMLSelectElement|HTMLInputElement>) =>
        onChange({ ...filters, [k]: e.target.value });

    const sCls = 'h-8 rounded-lg border border-card-border bg-dark-bg px-3 text-[10px] font-bold text-text-primary focus:outline-none focus:border-neon-cyan/40 hover:border-neon-cyan/20 transition-all';
    const iCls = 'h-8 rounded-lg border border-card-border bg-dark-bg px-3 text-[10px] font-bold text-white/60 focus:outline-none focus:border-neon-cyan/40 transition-all';

    return (
        <div className="flex items-center gap-2 flex-wrap mb-4">
            <Filter size={12} className="text-text-muted flex-shrink-0" />
            <select value={filters.status} onChange={sel('status')} className={sCls}>
                <option value="">All Status</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="FLAGGED">Flagged</option>
            </select>
            <select value={filters.type} onChange={sel('type')} className={sCls}>
                <option value="">All Types</option>
                <option value="P2P_EXCHANGE">P2P Exchange</option>
                <option value="REFILL">Refill</option>
                <option value="DISBURSEMENT">Disbursement</option>
                <option value="SEND">Send</option>
            </select>
            <div className="flex items-center gap-1">
                <Calendar size={10} className="text-text-muted" />
                <input type="date" value={filters.from} onChange={sel('from')} className={iCls} />
                <span className="text-[9px] text-text-muted">→</span>
                <input type="date" value={filters.to}   onChange={sel('to')}   className={iCls} />
            </div>
            {active && (
                <button onClick={onClear} className="flex items-center gap-1 px-2.5 h-8 rounded-lg bg-neon-red/10 border border-neon-red/20 text-neon-red text-[10px] font-black transition-all hover:bg-neon-red/20">
                    <X size={10}/> Clear
                </button>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SELLER DETAIL PAGE  (drill-down)
// ─────────────────────────────────────────────────────────────────────────────
function SellerDetailView({ seller, txList, onBack, onEditCoins }: {
    seller: Seller; txList: Tx[]; onBack: () => void;
    onEditCoins: (sellerId: string, delta: number) => void;
}) {
    const [search, setSearch]         = useState('');
    const [filters, setFilters]       = useState<Filters>(DEF_FILTERS);
    const [editMode, setEditMode]     = useState<'add'|'sub'|null>(null);
    const [editAmount, setEditAmount] = useState('');
    const [page, setPage]             = useState(1);

    const filtered = useMemo(() => {
        const s = search.toLowerCase();
        return txList
            .filter(t => t.sellerId === seller.id)
            .filter(t => !s || t.id.toLowerCase().includes(s) || t.buyer.toLowerCase().includes(s))
            .filter(t => !filters.status || t.status === filters.status)
            .filter(t => !filters.type   || t.type   === filters.type)
            .filter(t => { if (!filters.from) return true; return new Date(t.date) >= new Date(filters.from); })
            .filter(t => { if (!filters.to)   return true; return new Date(t.date) <= new Date(filters.to);   });
    }, [txList, seller.id, search, filters]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paged      = filtered.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE);

    const applyEdit = () => {
        const n = parseInt(editAmount);
        if (!n || n <= 0) return;
        onEditCoins(seller.id, editMode==='add' ? n : -n);
        setEditMode(null); setEditAmount('');
    };

    const txCols: Column<Tx>[] = [
        { header: 'TX ID',    accessor: t => <span className="text-text-primary font-black text-xs tracking-widest">{t.id}</span> },
        { header: 'Buyer',    accessor: t => <span className="text-text-primary font-bold text-xs">{t.buyer}</span> },
        { header: 'Amount',   accessor: t => <span className="text-neon-gold font-black text-xs">{t.amount.toLocaleString()} coins</span> },
        { header: 'Rate',     accessor: t => <span className="text-neon-cyan font-black text-xs">{t.rate}x</span> },
        { header: 'Type',     accessor: t => (
            <NeonBadge variant={t.type==='P2P_EXCHANGE'?'purple':t.type==='REFILL'?'gold':'cyan'}>
                {t.type.replace('_',' ')}
            </NeonBadge>
        )},
        { header: 'Status',   accessor: t => <StatusDot status={t.status} /> },
        { header: 'Date',     accessor: t => <span className="text-[10px] text-text-muted">{new Date(t.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span> },
    ];

    return (
        <motion.div initial={{opacity:0,x:32}} animate={{opacity:1,x:0}} exit={{opacity:0,x:32}} transition={{duration:0.25}}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1 mb-5">
                <button onClick={onBack} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-card-border text-text-muted hover:text-neon-cyan hover:border-neon-cyan/20 text-[10px] font-black uppercase tracking-widest transition-all">
                    <Home size={10}/> Coin Exchange
                </button>
                <ChevronRight size={12} className="text-text-muted/40"/>
                <span className="px-2.5 py-1 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-[10px] font-black uppercase tracking-widest">{seller.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
                {/* Seller info card */}
                <div className="lg:col-span-1 glass-card rounded-2xl border border-neon-cyan/15 overflow-hidden">
                    <div className="relative p-5" style={{background:'linear-gradient(135deg,rgba(0,255,255,0.06) 0%,transparent 60%)'}}>
                        <motion.div animate={{x:['-100%','200%']}} transition={{duration:3,repeat:Infinity,ease:'linear',repeatDelay:6}}
                            className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent z-10 pointer-events-none" />
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan font-black text-lg"
                                style={{boxShadow:'0 0 20px rgba(0,255,255,0.12)'}}>
                                {seller.name.split(' ').map((n:string)=>n[0]).join('')}
                            </div>
                            <div>
                                <p className="font-black text-white text-base">{seller.name}</p>
                                <p className="text-[10px] text-white/35">{seller.agency}</p>
                                <StatusDot status={seller.status} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            {[
                                { label:'Coin Balance', value: seller.coins.toLocaleString(), vc:'text-neon-gold' },
                                { label:'Total TX',     value: `${txList.filter(t=>t.sellerId===seller.id).length}`, vc:'text-neon-cyan' },
                                { label:'Joined',       value: new Date(seller.joinDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}), vc:'text-white/40' },
                            ].map(({label,value,vc})=>(
                                <div key={label} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                    <span className="text-[9px] uppercase tracking-widest text-white/25">{label}</span>
                                    <span className={cn('text-[11px] font-black',vc)}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Edit coins */}
                    <div className="px-5 pb-5">
                        <SLabel text="Edit Coin Balance" />
                        <div className="mt-2 flex gap-2">
                            <button onClick={()=>setEditMode(editMode==='add'?null:'add')}
                                className={cn('flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all',
                                    editMode==='add' ? 'bg-neon-green/20 border-neon-green/50 text-neon-green' : 'bg-white/[0.04] border-card-border text-text-muted hover:border-neon-green/30 hover:text-neon-green')}>
                                <Plus size={11}/> Add
                            </button>
                            <button onClick={()=>setEditMode(editMode==='sub'?null:'sub')}
                                className={cn('flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all',
                                    editMode==='sub' ? 'bg-neon-red/20 border-neon-red/50 text-neon-red' : 'bg-white/[0.04] border-card-border text-text-muted hover:border-neon-red/30 hover:text-neon-red')}>
                                <Minus size={11}/> Deduct
                            </button>
                        </div>
                        <AnimatePresence>
                            {editMode && (
                                <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:6}} className="mt-2 flex gap-2">
                                    <input type="number" min={1} value={editAmount} onChange={e=>setEditAmount(e.target.value)}
                                        placeholder="Amount..."
                                        className="flex-1 h-8 rounded-lg bg-dark-bg border border-card-border hover:border-neon-cyan/30 focus:border-neon-cyan/50 focus:outline-none text-xs font-bold text-text-primary placeholder-text-muted/40 transition-all px-3" />
                                    <button onClick={applyEdit}
                                        className={cn('px-3 h-8 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1',
                                            editMode==='add' ? 'bg-neon-green/15 border-neon-green/40 text-neon-green hover:bg-neon-green/25' : 'bg-neon-red/15 border-neon-red/40 text-neon-red hover:bg-neon-red/25')}>
                                        <Check size={11}/> Apply
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Transaction history */}
                <div className="lg:col-span-2 glass-card rounded-2xl border border-neon-cyan/10 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-card-border">
                        <div className="flex items-center justify-between mb-3">
                            <SLabel text="Transaction History" />
                            <span className="text-[8px] font-bold text-white/20">{filtered.length} records</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="relative flex-1 min-w-[160px]">
                                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
                                    placeholder="Search TX / buyer..."
                                    className="w-full h-8 rounded-lg bg-dark-bg border border-card-border hover:border-neon-cyan/20 focus:border-neon-cyan/40 focus:outline-none text-[10px] font-bold text-text-primary placeholder-text-muted/40 transition-all pl-7 pr-3" />
                            </div>
                            <select value={filters.status} onChange={e=>setFilters(f=>({...f,status:e.target.value}))}
                                className="h-8 rounded-lg border border-card-border bg-dark-bg px-2 text-[10px] font-bold text-text-primary focus:outline-none focus:border-neon-cyan/30 transition-all">
                                <option value="">All Status</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="PENDING">Pending</option>
                                <option value="FLAGGED">Flagged</option>
                            </select>
                            <select value={filters.type} onChange={e=>setFilters(f=>({...f,type:e.target.value}))}
                                className="h-8 rounded-lg border border-card-border bg-dark-bg px-2 text-[10px] font-bold text-text-primary focus:outline-none focus:border-neon-cyan/30 transition-all">
                                <option value="">All Types</option>
                                <option value="P2P_EXCHANGE">P2P</option>
                                <option value="REFILL">Refill</option>
                                <option value="DISBURSEMENT">Disbursement</option>
                                <option value="SEND">Send</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex-1 p-1">
                        <NeonTable columns={txCols} data={paged} />
                        {paged.length===0 && <div className="py-10 text-center text-text-muted text-sm">No transactions found.</div>}
                    </div>
                    <Pagination currentPage={page} totalPages={totalPages} totalItems={filtered.length}
                        itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} accent="cyan" />
                </div>
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function CoinTradingPage() {
    const router   = useRouter();
    const { role } = useSelector((state: RootState) => state.auth);

    React.useEffect(() => { if (role==='SUPER_ADMIN') router.replace('/app-owner/dashboard'); }, [role, router]);
    if (role==='SUPER_ADMIN') return null;

    const [sellers, setSellers]         = useState<Seller[]>(INIT_SELLERS);
    const [txList,  setTxList]          = useState<Tx[]>(INIT_TX);
    const [searchTerm, setSearchTerm]   = useState('');
    const [filters, setFilters]         = useState<Filters>(DEF_FILTERS);
    const [sendOpen, setSendOpen]       = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [activeSeller, setActiveSeller] = useState<Seller|null>(null);
    const [page, setPage]               = useState(1);

    const filtered = useMemo(() => {
        const s = searchTerm.toLowerCase();
        return txList
            .filter(t => !s || t.id.toLowerCase().includes(s) || t.seller.toLowerCase().includes(s) || t.buyer.toLowerCase().includes(s))
            .filter(t => !filters.status || t.status===filters.status)
            .filter(t => !filters.type   || t.type===filters.type)
            .filter(t => { if (!filters.from) return true; return new Date(t.date)>=new Date(filters.from); })
            .filter(t => { if (!filters.to)   return true; return new Date(t.date)<=new Date(filters.to);   });
    }, [txList, searchTerm, filters]);

    const totalPages = Math.max(1, Math.ceil(filtered.length/ITEMS_PER_PAGE));
    const safePage   = Math.min(page, totalPages);
    const paged      = filtered.slice((safePage-1)*ITEMS_PER_PAGE, safePage*ITEMS_PER_PAGE);

    const handleSend = (sellerId: string, amount: number) => {
        const seller = sellers.find(s=>s.id===sellerId)!;
        const newTx: Tx = {
            id:       `TX-${Date.now()}`.slice(0,10),
            sellerId, seller: seller.name,
            buyer:    'Admin Dispatch',
            amount, rate: 1.00, status: 'COMPLETED', type: 'SEND',
            date: new Date().toISOString().split('T')[0],
        };
        setTxList(p=>[newTx,...p]);
        setSellers(p=>p.map(s=>s.id===sellerId ? {...s, coins: s.coins+amount} : s));
        setPage(1);
    };

    const handleEditCoins = (sellerId: string, delta: number) => {
        setSellers(p=>p.map(s=>s.id===sellerId ? {...s, coins: Math.max(0, s.coins+delta)} : s));
    };

    const stats = [
        { label:'Trading Volume',        value:'1.2M Coins',  sub:'last 24 standard hours',      Icon:Repeat,    color:'cyan'   },
        { label:'Execution Efficiency',  value:'98.4%',       sub:'successful settlements',       Icon:TrendingUp, color:'green' },
        { label:'Flagged Activity',      value:'3 Alerts',    sub:'pending security review',      Icon:ShieldAlert,color:'red'  },
    ];

    const mainCols: Column<Tx>[] = [
        { header:'Transaction ID', accessor:t=>(
            <div className="flex items-center gap-2"><Repeat size={13} className="text-neon-cyan"/>
                <span className="text-text-primary font-black tracking-widest text-xs">{t.id}</span>
            </div>
        )},
        { header:'Trading Pair', accessor:t=>(
            <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-text-primary leading-tight">{t.seller}</span>
                    <span className="text-[9px] text-text-muted uppercase">Seller</span>
                </div>
                <ArrowRightLeft size={11} className="text-neon-gold flex-shrink-0"/>
                <div className="flex flex-col items-start">
                    <span className="text-xs font-bold text-text-primary leading-tight">{t.buyer}</span>
                    <span className="text-[9px] text-text-muted uppercase">Buyer</span>
                </div>
            </div>
        )},
        { header:'Market Value', accessor:t=>(
            <div className="flex flex-col gap-0.5">
                <span className="text-neon-gold font-black tracking-wider text-sm">{t.amount.toLocaleString()} Coins</span>
                <div className="flex items-center gap-1 text-[9px] text-text-muted uppercase font-bold">
                    <TrendingUp size={9} className="text-neon-green"/>Rate: {t.rate}x
                </div>
            </div>
        )},
        { header:'Execution Type', accessor:t=>(
            <NeonBadge variant={t.type==='P2P_EXCHANGE'?'purple':t.type==='REFILL'?'gold':'cyan'}>
                {t.type.replace('_',' ')}
            </NeonBadge>
        )},
        { header:'Status', accessor:t=><StatusDot status={t.status}/> },
        { header:'Date',   accessor:t=><span className="text-[10px] text-text-muted">{new Date(t.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span> },
        { header:'Actions', accessor:t=>(
            <div className="flex items-center gap-1">
                <button onClick={e=>{e.stopPropagation(); const s=sellers.find(x=>x.id===t.sellerId); if(s) setActiveSeller(s);}}
                    title="Seller Detail"
                    className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all border border-transparent hover:border-neon-cyan/30 text-text-muted">
                    <BarChart3 size={13}/>
                </button>
                <button title="Security Intervention"
                    className="p-2 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red transition-all border border-transparent hover:border-neon-red/30 text-text-muted">
                    <ShieldAlert size={13}/>
                </button>
            </div>
        )},
    ];

    if (activeSeller) {
        return (
            <PageContainer>
                <SellerDetailView
                    seller={activeSeller}
                    txList={txList}
                    onBack={()=>setActiveSeller(null)}
                    onEditCoins={(id,delta)=>{ handleEditCoins(id,delta); setActiveSeller(s=>s ? {...s,coins:Math.max(0,(s.coins+delta))} : s); }}
                />
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader
                title="Coin Exchange Terminal"
                description="Oversight of peer-to-peer trading, system refills, and market liquidity"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <NeonInput placeholder="Scan transaction hash..." value={searchTerm}
                                onChange={e=>{setSearchTerm(e.target.value);setPage(1);}}
                                icon={<Search size={16}/>} className="h-10" />
                        </div>
                        <GlowButton variant="gold" size="sm" className="flex items-center gap-2" onClick={()=>setSendOpen(true)}>
                            <Send size={15}/> Send Coins
                        </GlowButton>
                        <GlowButton variant="purple" size="sm" className="flex items-center gap-2" onClick={()=>setSettingsOpen(true)}>
                            <Settings size={15}/> Market Settings
                        </GlowButton>
                    </div>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                {stats.map(({label,value,sub,Icon,color},i)=>(
                    <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
                        className="glass-card p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mb-1">{label}</p>
                            <div className="flex items-center gap-3">
                                <p className="text-2xl font-black text-text-primary">{value}</p>
                                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center',
                                    color==='cyan'?'bg-neon-cyan/10 text-neon-cyan':color==='green'?'bg-neon-green/10 text-neon-green':'bg-neon-red/10 text-neon-red')}>
                                    <Icon size={15}/>
                                </div>
                            </div>
                            <p className="text-[10px] text-text-muted italic mt-1">{sub}</p>
                        </div>
                        <div className={cn('absolute top-0 right-0 w-24 h-24 blur-[40px] opacity-10 rounded-full -translate-y-1/2 translate-x-1/2',
                            color==='cyan'?'bg-neon-cyan':color==='green'?'bg-neon-green':'bg-neon-red')} />
                    </motion.div>
                ))}
            </div>

            {/* Filter bar */}
            <FilterBar filters={filters} onChange={f=>{setFilters(f);setPage(1);}} onClear={()=>{setFilters(DEF_FILTERS);setPage(1);}} />

            {/* Table */}
            <motion.div initial={{opacity:0,scale:0.98}} animate={{opacity:1,scale:1}} transition={{duration:0.35}}
                className="glass-card rounded-2xl border border-neon-cyan/10 overflow-hidden">
                <div className="p-1">
                    <NeonTable columns={mainCols} data={paged}
                        onRowClick={t=>{ const s=sellers.find(x=>x.id===t.sellerId); if(s) setActiveSeller(s); }} />
                    {paged.length===0 && <div className="py-16 text-center text-text-muted text-sm">No transactions found.</div>}
                </div>
                <Pagination currentPage={safePage} totalPages={totalPages} totalItems={filtered.length}
                    itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} accent="cyan" />
            </motion.div>

            <SendCoinModal isOpen={sendOpen} onClose={()=>setSendOpen(false)} onSend={handleSend} sellers={sellers} />
            <MarketSettingsModal isOpen={settingsOpen} onClose={()=>setSettingsOpen(false)} />
        </PageContainer>
    );
}