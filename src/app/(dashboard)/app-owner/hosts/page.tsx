'use client';

import React, { useState, useMemo } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { LivePulse } from '@/components/gaming/LivePulse';
import {
    Search, Mic2, Users, Heart, Star, ShieldAlert, Check, UserX,
    DoorClosed, Crown, Radio, ChevronLeft, ChevronRight, ChevronsLeft,
    ChevronsRight, ArrowRightLeft, X, AtSign, Mail, Building2, Plus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 5;

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const mockAgencies = [
    { id: 'AG1', name: 'Stellar Talent',  tier: 'ELITE',   status: 'ACTIVE'   },
    { id: 'AG2', name: 'Neon Streamers',  tier: 'PRO',     status: 'ACTIVE'   },
    { id: 'AG3', name: 'Void Nexus',      tier: 'STARTER', status: 'INACTIVE' },
    { id: 'AG4', name: 'Aether Media',    tier: 'PRO',     status: 'ACTIVE'   },
    { id: 'AG5', name: 'Quantum Guild',   tier: 'PRO',     status: 'ACTIVE'   },
    { id: 'AG6', name: 'Solar Syndicate', tier: 'ELITE',   status: 'ACTIVE'   },
];

const INIT_HOSTS = [
    { id: '1',  name: 'Luna Divine',    agencyId: 'AG1', agency: 'Stellar Talent',       followers: '125K', diamonds: 85000,  level: 45, isLive: true,  roomName: 'Luna World',     audienceCount: 312, email: 'luna@spark.live'    },
    { id: '2',  name: 'Shadow Dancer',  agencyId: 'AG2', agency: 'Neon Streamers',       followers: '42K',  diamonds: 12000,  level: 22, isLive: false, roomName: 'Shadow Zone',    audienceCount: 0,   email: 'shadow@spark.live'  },
    { id: '3',  name: 'Cyber Queen',    agencyId: 'AG1', agency: 'Stellar Talent',       followers: '210K', diamonds: 450000, level: 68, isLive: true,  roomName: 'Queen Palace',   audienceCount: 891, email: 'cyber@spark.live'   },
    { id: '4',  name: 'Nova Spark',     agencyId: 'AG4', agency: 'Aether Media',         followers: '8K',   diamonds: 2500,   level: 12, isLive: false, roomName: 'Nova Stage',     audienceCount: 0,   email: 'nova@spark.live'    },
    { id: '5',  name: 'Zen Master',     agencyId: null,  agency: 'None (Independent)',   followers: '55K',  diamonds: 34000,  level: 31, isLive: true,  roomName: 'Zen Garden',     audienceCount: 145, email: 'zen@spark.live'     },
    { id: '6',  name: 'Storm Breaker',  agencyId: 'AG2', agency: 'Neon Streamers',       followers: '33K',  diamonds: 9800,   level: 19, isLive: false, roomName: 'Storm Rift',     audienceCount: 0,   email: 'storm@spark.live'   },
    { id: '7',  name: 'Pixel Phoenix',  agencyId: 'AG5', agency: 'Quantum Guild',        followers: '77K',  diamonds: 61000,  level: 37, isLive: true,  roomName: 'Phoenix Nest',   audienceCount: 228, email: 'pixel@spark.live'   },
    { id: '8',  name: 'Frost Byte',     agencyId: 'AG4', agency: 'Aether Media',         followers: '19K',  diamonds: 7200,   level: 26, isLive: false, roomName: 'Frost Chamber',  audienceCount: 0,   email: 'frost@spark.live'   },
    { id: '9',  name: 'Omega Flash',    agencyId: 'AG6', agency: 'Solar Syndicate',      followers: '98K',  diamonds: 130000, level: 52, isLive: true,  roomName: 'Omega Stage',    audienceCount: 510, email: 'omega@spark.live'   },
    { id: '10', name: 'Neon Viper',     agencyId: 'AG3', agency: 'Void Nexus',           followers: '14K',  diamonds: 4100,   level: 15, isLive: false, roomName: 'Viper Den',      audienceCount: 0,   email: 'neon@spark.live'    },
];

const mockAudience: Record<string, any[]> = {
    '1': [
        { id: 'A1', name: 'Nebula Knight',  type: 'VIP',   coins: 8400,  diamonds: 120, level: 28, joinedAgo: '5m',  avatar: 'NK' },
        { id: 'A2', name: 'Void Walker',    type: 'GUEST', coins: 1200,  diamonds: 0,   level: 8,  joinedAgo: '12m', avatar: 'VW' },
        { id: 'A3', name: 'Solar Flare',    type: 'VIP',   coins: 45000, diamonds: 210, level: 56, joinedAgo: '2m',  avatar: 'SF' },
        { id: 'A4', name: 'Cyber Phantom',  type: 'GUEST', coins: 0,     diamonds: 0,   level: 5,  joinedAgo: '20m', avatar: 'CP' },
        { id: 'A5', name: 'Alpha Draconis', type: 'VIP',   coins: 15200, diamonds: 450, level: 42, joinedAgo: '1m',  avatar: 'AD' },
    ],
    '3': [
        { id: 'A6',  name: 'Storm Rider',  type: 'VIP',   coins: 3200,  diamonds: 80,  level: 22, joinedAgo: '8m',  avatar: 'SR' },
        { id: 'A7',  name: 'Pulse King',   type: 'VIP',   coins: 9800,  diamonds: 310, level: 38, joinedAgo: '3m',  avatar: 'PK' },
        { id: 'A8',  name: 'Pixel Ghost',  type: 'GUEST', coins: 500,   diamonds: 0,   level: 9,  joinedAgo: '15m', avatar: 'PG' },
        { id: 'A9',  name: 'Neon Blade',   type: 'GUEST', coins: 200,   diamonds: 0,   level: 4,  joinedAgo: '25m', avatar: 'NB' },
        { id: 'A10', name: 'Dark Matter',  type: 'VIP',   coins: 22000, diamonds: 800, level: 51, joinedAgo: '1m',  avatar: 'DM' },
    ],
    '5': [
        { id: 'A11', name: 'Cyber Ghost',  type: 'GUEST', coins: 5500,  diamonds: 0,   level: 33, joinedAgo: '10m', avatar: 'CG' },
        { id: 'A12', name: 'Wave Rider',   type: 'VIP',   coins: 7800,  diamonds: 190, level: 27, joinedAgo: '4m',  avatar: 'WR' },
    ],
    '7': [
        { id: 'A13', name: 'Binary Storm', type: 'VIP',   coins: 6100,  diamonds: 95,  level: 30, joinedAgo: '6m',  avatar: 'BS' },
        { id: 'A14', name: 'Zero Flux',    type: 'GUEST', coins: 800,   diamonds: 0,   level: 11, joinedAgo: '18m', avatar: 'ZF' },
    ],
    '9': [
        { id: 'A15', name: 'Nova Crest',   type: 'VIP',   coins: 18000, diamonds: 620, level: 47, joinedAgo: '2m',  avatar: 'NC' },
        { id: 'A16', name: 'Frost Shard',  type: 'VIP',   coins: 11200, diamonds: 280, level: 35, joinedAgo: '9m',  avatar: 'FS' },
        { id: 'A17', name: 'Pulse Wave',   type: 'GUEST', coins: 300,   diamonds: 0,   level: 7,  joinedAgo: '22m', avatar: 'PW' },
    ],
};

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
    const idle = 'bg-white/[0.03] border-card-border text-text-muted hover:bg-neon-cyan/10 hover:border-neon-cyan/30 hover:text-neon-cyan';

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-card-border">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted hidden sm:block">
                Showing <span className="text-neon-cyan">{start}–{end}</span> of {totalItems}
            </span>
            <div className="flex items-center gap-1 mx-auto sm:mx-0">
                <button disabled={currentPage === 1} onClick={() => onPageChange(1)} className={cn(btn, idle)}><ChevronsLeft size={11} /></button>
                <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className={cn(btn, idle)}><ChevronLeft size={11} /></button>
                {pages.map((p, i) => p === '...'
                    ? <span key={`e${i}`} className="w-7 flex items-center justify-center text-[10px] text-text-muted">···</span>
                    : <motion.button key={p} whileTap={{ scale: 0.92 }} onClick={() => onPageChange(p as number)}
                        className={cn(btn, 'text-[10px] font-black', currentPage === p
                            ? 'bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.2)]'
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
// AUDIENCE ROOM MODAL  (existing — preserved, color-adjusted)
// ─────────────────────────────────────────────────────────────────────────────
function AudienceModal({ host, isOpen, onClose }: { host: any; isOpen: boolean; onClose: () => void }) {
    const [kicked, setKicked]             = useState<string[]>([]);
    const [roomClosed, setRoomClosed]     = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const audience = (mockAudience[host?.id] ?? []).filter(a => !kicked.includes(a.id));

    const handleKick      = (id: string) => { setKicked(p => [...p, id]); if (selectedUser?.id === id) setSelectedUser(null); };
    const handleCloseRoom = () => { setRoomClosed(true); setTimeout(onClose, 1200); };

    React.useEffect(() => { setKicked([]); setRoomClosed(false); setSelectedUser(null); }, [host?.id]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />

                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div initial={{ opacity: 0, scale: 0.93, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.93 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                            className="pointer-events-auto w-full max-w-2xl relative">
                            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-neon-cyan/20 via-transparent to-neon-purple/10 blur-sm" />
                            <div className="relative rounded-2xl border border-neon-cyan/20 bg-[#080a10] overflow-hidden">
                                <motion.div animate={{ x: ['-100%','200%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
                                    className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent z-10" />

                                {/* Header */}
                                <div className="relative p-5 border-b border-card-border"
                                    style={{ background: 'linear-gradient(135deg, rgba(0,255,255,0.06) 0%, transparent 60%)' }}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan font-black text-sm"
                                                    style={{ boxShadow: '0 0 18px rgba(0,255,255,0.12)' }}>
                                                    {host?.name.split(' ').map((n: string) => n[0]).join('')}
                                                </div>
                                                {host?.isLive && <div className="absolute -bottom-1 -right-1"><LivePulse /></div>}
                                            </div>
                                            <div>
                                                <div className="font-black text-text-primary text-base">{host?.roomName}</div>
                                                <div className="text-[10px] text-text-muted">Host: {host?.name} · {host?.agency}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20">
                                                <Radio size={11} className="text-neon-cyan animate-pulse" />
                                                <span className="text-[10px] font-black text-neon-cyan uppercase tracking-widest">
                                                    {roomClosed ? 'CLOSED' : 'LIVE'}
                                                </span>
                                                <span className="text-[10px] font-black text-neon-cyan">· {audience.length}</span>
                                            </div>
                                            <button onClick={onClose}
                                                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red border border-card-border text-text-muted text-xs transition-all flex items-center justify-center">
                                                <X size={13} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <button onClick={handleCloseRoom} disabled={roomClosed}
                                            className={cn('flex items-center gap-2 w-full justify-center py-2 rounded-lg border text-xs font-black uppercase tracking-widest transition-all',
                                                roomClosed
                                                    ? 'bg-white/5 border-card-border text-text-muted cursor-not-allowed'
                                                    : 'bg-neon-red/10 hover:bg-neon-red/20 border-neon-red/30 hover:border-neon-red/60 text-neon-red')}>
                                            <DoorClosed size={14} />
                                            {roomClosed ? 'Room Closed' : 'Force Close Room'}
                                        </button>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="flex divide-x divide-card-border" style={{ minHeight: 340 }}>
                                    {/* Audience List */}
                                    <div className="flex-1 p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 380 }}>
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted mb-3">
                                            Audience ({audience.length})
                                        </p>
                                        {audience.length === 0 && (
                                            <div className="py-10 text-center text-text-muted text-xs">No audience members.</div>
                                        )}
                                        {audience.map((a) => (
                                            <motion.div key={a.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                                                onClick={() => setSelectedUser(a)}
                                                className={cn('flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all',
                                                    selectedUser?.id === a.id
                                                        ? 'bg-neon-cyan/10 border-neon-cyan/30'
                                                        : 'bg-white/[0.03] border-card-border hover:border-white/10 hover:bg-white/[0.05]')}>
                                                <div className="flex items-center gap-2.5">
                                                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border',
                                                        a.type === 'VIP' ? 'bg-neon-gold/10 border-neon-gold/30 text-neon-gold' : 'bg-white/5 border-card-border text-text-muted')}>
                                                        {a.avatar}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-xs font-bold text-text-primary">{a.name}</span>
                                                            {a.type === 'VIP' && <Crown size={10} className="text-neon-gold" />}
                                                        </div>
                                                        <span className="text-[9px] text-text-muted">{a.type} · joined {a.joinedAgo} ago</span>
                                                    </div>
                                                </div>
                                                <button onClick={(e) => { e.stopPropagation(); handleKick(a.id); }} title="Kick from room"
                                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red border border-transparent hover:border-neon-red/30 text-text-muted transition-all">
                                                    <UserX size={13} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* User Detail */}
                                    <AnimatePresence>
                                        {selectedUser && (
                                            <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 220 }} exit={{ opacity: 0, width: 0 }}
                                                transition={{ duration: 0.25 }} className="shrink-0 overflow-hidden">
                                                <div className="p-4 w-[220px]">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-neon-cyan/70">Profile</span>
                                                        <button onClick={() => setSelectedUser(null)}
                                                            className="w-5 h-5 rounded-md bg-white/5 hover:bg-neon-red/20 hover:text-neon-red border border-card-border text-text-muted text-[10px] transition-all flex items-center justify-center">
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                    <div className="flex flex-col items-center mb-4">
                                                        <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center font-black text-base border mb-2',
                                                            selectedUser.type === 'VIP'
                                                                ? 'bg-neon-gold/10 border-neon-gold/30 text-neon-gold shadow-[0_0_14px_rgba(255,215,0,0.15)]'
                                                                : 'bg-white/5 border-card-border text-text-muted')}>
                                                            {selectedUser.avatar}
                                                        </div>
                                                        <div className="font-black text-text-primary text-sm text-center">{selectedUser.name}</div>
                                                        <div className={cn('text-[9px] font-black uppercase tracking-widest mt-0.5',
                                                            selectedUser.type === 'VIP' ? 'text-neon-gold' : 'text-text-muted')}>
                                                            {selectedUser.type}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        {[
                                                            { label: 'Level',    value: `LVL ${selectedUser.level}`,           color: 'text-neon-cyan'    },
                                                            { label: 'Joined',   value: `${selectedUser.joinedAgo} ago`,        color: 'text-text-primary' },
                                                            { label: 'Coins',    value: selectedUser.coins.toLocaleString(),    color: 'text-neon-gold'    },
                                                            { label: 'Diamonds', value: selectedUser.diamonds.toLocaleString(), color: 'text-neon-purple'  },
                                                        ].map(({ label, value, color }) => (
                                                            <div key={label} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-card-border">
                                                                <span className="text-[9px] uppercase tracking-widest text-text-muted">{label}</span>
                                                                <span className={cn('text-[10px] font-black', color)}>{value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-3">
                                                        <div className="flex justify-between mb-1">
                                                            <span className="text-[9px] uppercase tracking-widest text-text-muted">XP</span>
                                                            <span className="text-[9px] text-neon-gold font-bold">{(selectedUser.level % 10) * 10}%</span>
                                                        </div>
                                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                            <motion.div initial={{ width: 0 }} animate={{ width: `${(selectedUser.level % 10) * 10}%` }}
                                                                transition={{ duration: 0.7 }}
                                                                className="h-full bg-gradient-to-r from-neon-gold/60 to-neon-gold" />
                                                        </div>
                                                    </div>
                                                    <button onClick={() => handleKick(selectedUser.id)}
                                                        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-neon-red/10 hover:bg-neon-red/20 border border-neon-red/20 hover:border-neon-red/50 text-neon-red text-[10px] font-black uppercase tracking-widest transition-all">
                                                        <UserX size={12} /> Kick from Room
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
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
// HOST TRANSFER MODAL
// ─────────────────────────────────────────────────────────────────────────────
function HostTransferModal({ host, isOpen, onClose, onTransfer }: {
    host: any; isOpen: boolean; onClose: () => void; onTransfer: (hostId: string, agencyId: string) => void;
}) {
    const [selected, setSelected] = useState('');
    React.useEffect(() => { setSelected(''); }, [host?.id]);

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
                                        <div className="w-9 h-9 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center"
                                            style={{ boxShadow: '0 0 14px rgba(0,255,255,0.15)' }}>
                                            <ArrowRightLeft size={16} className="text-neon-cyan" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-neon-cyan/50">Host Transfer</p>
                                            <h2 className="text-sm font-black text-text-primary">Transfer to Agency</h2>
                                        </div>
                                    </div>
                                    <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red border border-card-border text-text-muted transition-all flex items-center justify-center">
                                        <X size={13} />
                                    </button>
                                </div>
                                <div className="px-6 py-5 space-y-4">
                                    {/* Host card */}
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/25 mb-3">Host</p>
                                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan font-black text-sm">
                                                    {host.name.split(' ').map((n: string) => n[0]).join('')}
                                                </div>
                                                {host.isLive && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-neon-green border border-dark-bg shadow-[0_0_6px_rgba(0,255,100,0.8)]" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-black text-white text-sm">{host.name}</p>
                                                <p className="text-[10px] text-white/35">{host.roomName}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] text-white/25 uppercase tracking-widest">Current</p>
                                                <p className="text-[10px] font-bold text-white/50 max-w-[100px] truncate">{host.agency}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Agency selection */}
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/25 mb-2">Transfer To Agency</p>
                                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                            {mockAgencies.filter(a => a.id !== host.agencyId).map(ag => (
                                                <button key={ag.id} onClick={() => setSelected(ag.id)}
                                                    className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all',
                                                        selected === ag.id
                                                            ? 'bg-neon-cyan/10 border-neon-cyan/40'
                                                            : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1]')}>
                                                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center font-black text-[11px] border',
                                                        selected === ag.id ? 'bg-neon-cyan/15 border-neon-cyan/40 text-neon-cyan' : 'bg-white/5 border-white/10 text-white/50')}>
                                                        {ag.name.split(' ').map((n: string) => n[0]).join('')}
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <p className="text-[11px] font-black text-white/75">{ag.name}</p>
                                                        <p className="text-[9px] text-white/30">{ag.tier}</p>
                                                    </div>
                                                    <span className={cn('text-[8px] font-black uppercase px-2 py-0.5 rounded border',
                                                        ag.status === 'ACTIVE' ? 'text-neon-green border-neon-green/30 bg-neon-green/10' : 'text-neon-red border-neon-red/30 bg-neon-red/10')}>
                                                        {ag.status}
                                                    </span>
                                                    {selected === ag.id && <Check size={13} className="text-neon-cyan flex-shrink-0" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-1">
                                        <button disabled={!selected}
                                            onClick={() => { if (selected) { onTransfer(host.id, selected); onClose(); } }}
                                            className="flex-1 h-10 rounded-xl bg-neon-cyan/15 hover:bg-neon-cyan/25 border border-neon-cyan/30 hover:border-neon-cyan/60 text-neon-cyan text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                                            <ArrowRightLeft size={13} /> Confirm Transfer
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
// FEATURE HOST MODAL  (updated to match admin/agency modal style)
// ─────────────────────────────────────────────────────────────────────────────
interface FeatureForm { hostName: string; duration: string; }
const DEF_FEATURE: FeatureForm = { hostName: '', duration: '24H' };

function FeatureHostModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [form, setForm] = useState<FeatureForm>(DEF_FEATURE);
    const [errs, setErrs] = useState<Partial<FeatureForm>>({});
    const set = (k: keyof FeatureForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(p => ({ ...p, [k]: e.target.value })); setErrs(p => ({ ...p, [k]: '' }));
    };
    const validate = () => {
        const e: Partial<FeatureForm> = {};
        if (!form.hostName.trim()) e.hostName = 'Required';
        setErrs(e); return !Object.keys(e).length;
    };
    const submit = () => { if (!validate()) return; setForm(DEF_FEATURE); setErrs({}); onClose(); };
    const close  = () => { setForm(DEF_FEATURE); setErrs({}); onClose(); };

    const iCls = 'w-full h-9 rounded-lg bg-dark-bg border border-card-border hover:border-neon-purple/30 focus:border-neon-purple/50 focus:outline-none text-xs font-bold text-text-primary placeholder-text-muted/40 transition-all pl-8 pr-3';
    const lCls = 'text-[9px] font-black uppercase tracking-[0.2em] text-text-muted block mb-1.5';

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
                            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-neon-purple/20 to-transparent blur-md" />
                            <div className="relative rounded-2xl border border-neon-purple/20 bg-[#080a10] overflow-hidden">
                                <motion.div animate={{ x: ['-100%','200%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
                                    className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent z-10" />
                                {/* Header */}
                                <div className="relative px-6 py-4 border-b border-card-border flex items-center justify-between"
                                    style={{ background: 'linear-gradient(135deg, rgba(191,0,255,0.06) 0%, transparent 60%)' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center"
                                            style={{ boxShadow: '0 0 14px rgba(191,0,255,0.15)' }}>
                                            <Star size={16} className="text-neon-purple" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-neon-purple/50">Promotion Engine</p>
                                            <h2 className="text-sm font-black text-text-primary">Feature Global Host</h2>
                                        </div>
                                    </div>
                                    <button onClick={close} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red border border-card-border text-text-muted transition-all flex items-center justify-center">
                                        <X size={13} />
                                    </button>
                                </div>
                                <div className="px-6 py-5 space-y-4">
                                    <div>
                                        <label className={lCls}>Host Identity *</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-purple/40 pointer-events-none"><AtSign size={11} /></span>
                                            <input value={form.hostName} onChange={set('hostName')} placeholder="e.g. Luna Divine" className={iCls} />
                                        </div>
                                        {errs.hostName && <p className="text-[9px] text-neon-red mt-1">{errs.hostName}</p>}
                                    </div>
                                    <div>
                                        <label className={lCls}>Promotion Duration</label>
                                        <select value={form.duration} onChange={set('duration')}
                                            className="w-full h-9 rounded-lg border border-card-border bg-dark-bg px-3 text-xs font-bold text-text-primary focus:outline-none focus:border-neon-purple/50 transition-all hover:border-neon-purple/30">
                                            <option value="24H">24 Standard Hours</option>
                                            <option value="48H">48 Standard Hours</option>
                                            <option value="7D">1 Planetary Cycle (7 Days)</option>
                                        </select>
                                    </div>
                                    <p className="text-xs text-neon-gold flex items-center gap-2 pt-1 border-t border-white/5">
                                        <Star size={13} /> Host will be pinned on the main landing dashboard.
                                    </p>
                                    <div className="flex gap-2 pt-1">
                                        <button onClick={submit}
                                            className="flex-1 h-10 rounded-xl bg-neon-purple/15 hover:bg-neon-purple/25 border border-neon-purple/30 hover:border-neon-purple/60 text-neon-purple text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                            <Check size={13} /> Execute Promotion
                                        </button>
                                        <button onClick={close} className="flex-1 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-card-border text-text-muted text-xs font-black uppercase tracking-widest transition-all">
                                            Abort
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
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function HostManagementPage() {
    const [searchTerm, setSearchTerm]         = useState('');
    const [featureOpen, setFeatureOpen]       = useState(false);
    const [audienceHost, setAudienceHost]     = useState<any>(null);
    const [transferHost, setTransferHost]     = useState<any>(null);
    const [currentPage, setCurrentPage]       = useState(1);
    const [hosts, setHosts]                   = useState(INIT_HOSTS);

    const filtered = useMemo(() =>
        hosts.filter(h =>
            h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.agency.toLowerCase().includes(searchTerm.toLowerCase())
        ), [hosts, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const safePage   = Math.min(currentPage, totalPages);
    const paged      = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

    const handleTransfer = (hostId: string, agencyId: string) => {
        const ag = mockAgencies.find(a => a.id === agencyId);
        setHosts(prev => prev.map(h => h.id === hostId ? { ...h, agencyId, agency: ag?.name ?? h.agency } : h));
    };

    const columns: Column<typeof INIT_HOSTS[0]>[] = [
        {
            header: 'Host Identity',
            accessor: (host) => (
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan font-black text-xs">
                            {host.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {host.isLive && <div className="absolute -bottom-1 -right-1"><LivePulse /></div>}
                    </div>
                    <div>
                        <div className="font-bold text-text-primary text-sm flex items-center gap-2">
                            {host.name}
                            {host.level > 50 && <Star size={12} className="text-neon-gold fill-neon-gold" />}
                        </div>
                        <div className="text-[10px] text-text-muted">{host.agency}</div>
                    </div>
                </div>
            ),
        },
        {
            header: 'Stream Status',
            accessor: (host) => (
                <span className={cn('text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border',
                    host.isLive
                        ? 'text-neon-cyan border-neon-cyan/30 bg-neon-cyan/5'
                        : 'text-text-muted border-white/5 bg-white/5')}>
                    {host.isLive ? 'Live Now' : 'Offline'}
                </span>
            ),
        },
        {
            header: 'Engagement',
            accessor: (host) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-text-primary">
                        <Heart size={12} className="text-neon-purple" />
                        <span className="font-bold">{host.followers}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-text-muted">
                        <Users size={10} /><span>Active Fanbase</span>
                    </div>
                </div>
            ),
        },
        {
            header: 'Diamond Wealth',
            accessor: (host) => (
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-purple shadow-[0_0_8px_rgba(191,0,255,0.6)]" />
                    <span className="text-neon-purple font-black tracking-wider text-sm">{host.diamonds.toLocaleString()}</span>
                </div>
            ),
        },
        {
            header: 'Skill Level',
            accessor: (host) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-dark-bg border border-card-border flex items-center justify-center text-[10px] font-black text-neon-gold">
                        {host.level}
                    </div>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden w-12">
                        <div className="h-full bg-neon-gold" style={{ width: `${(host.level % 20) * 5}%` }} />
                    </div>
                </div>
            ),
        },
        {
            header: 'Operator Console',
            accessor: (host) => (
                <div className="flex items-center gap-1">
                    {/* Audience button */}
                    <button title="View Room Audience"
                        onClick={(e) => { e.stopPropagation(); if (host.isLive) setAudienceHost(host); }}
                        disabled={!host.isLive}
                        className={cn('relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all',
                            host.isLive
                                ? 'bg-neon-cyan/10 hover:bg-neon-cyan/20 border-neon-cyan/20 hover:border-neon-cyan/50 text-neon-cyan'
                                : 'bg-white/5 border-card-border text-text-muted cursor-not-allowed opacity-50')}>
                        <Users size={13} />
                        {host.isLive && <span className="font-black">{host.audienceCount}</span>}
                    </button>
                    {/* Transfer button */}
                    <button title="Transfer to Agency"
                        onClick={(e) => { e.stopPropagation(); setTransferHost(host); }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-neon-green/20 hover:text-neon-green transition-all border border-transparent hover:border-neon-green/30 text-text-muted">
                        <ArrowRightLeft size={14} />
                    </button>
                    {/* View stream */}
                    <button title="View Stream"
                        className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all border border-transparent hover:border-neon-cyan/30 text-text-muted">
                        <Mic2 size={14} />
                    </button>
                    {/* Security audit */}
                    <button title="Security Audit"
                        className="p-2 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red transition-all border border-transparent hover:border-neon-red/30 text-text-muted">
                        <ShieldAlert size={14} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <PageContainer>
            <PageHeader
                title="Host Registry & Performance"
                description="Monitoring live status and engagement metrics of all platform entertainers"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <NeonInput placeholder="Scan host alias..." value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                icon={<Search size={16} />} className="h-10" />
                        </div>
                        <GlowButton variant="purple" size="sm" className="flex items-center gap-2" onClick={() => setFeatureOpen(true)}>
                            <Star size={16} /> Feature Host
                        </GlowButton>
                    </div>
                }
            />

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}
                className="glass-card rounded-2xl border border-neon-cyan/10 overflow-hidden">
                <div className="p-1">
                    <NeonTable columns={columns} data={paged}
                        onRowClick={(host) => host.isLive && setAudienceHost(host)} />
                    {paged.length === 0 && <div className="py-16 text-center text-text-muted text-sm">No hosts found.</div>}
                </div>
                <Pagination currentPage={safePage} totalPages={totalPages} totalItems={filtered.length}
                    itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
            </motion.div>

            <AudienceModal   host={audienceHost} isOpen={!!audienceHost} onClose={() => setAudienceHost(null)} />
            <HostTransferModal host={transferHost} isOpen={!!transferHost} onClose={() => setTransferHost(null)} onTransfer={handleTransfer} />
            <FeatureHostModal  isOpen={featureOpen} onClose={() => setFeatureOpen(false)} />
        </PageContainer>
    );
}