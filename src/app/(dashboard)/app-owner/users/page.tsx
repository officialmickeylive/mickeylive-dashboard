'use client';

import React, { useState, useMemo } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import {
    Search, Filter, Eye, Shield, UserCheck, UserX, Check,
    Coins, Gem, Star, TrendingUp, Mail, Hash, Activity,
    Calendar, Crown, Phone, Timer, Accessibility, Clock,
    Smartphone, Ban, Lock, UserPlus,
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
    AtSign, Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── Types & Constants ────────────────────────────────────────────────────────
type BlockType = 'deviceBlock' | 'timerBlock' | 'block';
type UserRole = 'SUPER_ADMIN' | 'APP_OWNER' | 'ADMIN' | 'HOST' | 'AGENCY' | 'SELLER' | 'CUSTOMER';
type UserStatus = 'ACTIVE' | 'DE_ACTIVE';

const CURRENT_VIEWER_ROLE: UserRole = 'SUPER_ADMIN';
const CAN_BLOCK_ROLES: UserRole[] = ['SUPER_ADMIN', 'APP_OWNER'];
const CAN_ADD_USER_ROLES: UserRole[] = ['SUPER_ADMIN', 'APP_OWNER'];
const ALL_ROLES: UserRole[] = ['ADMIN', 'HOST', 'AGENCY', 'SELLER', 'CUSTOMER'];
const ITEMS_PER_PAGE = 5;

// ─── Mock Data ────────────────────────────────────────────────────────────────
const initialMockUsers = [
    { id: '1',  name: 'Alpha Draconis', email: 'alpha@matrix.io',   role: 'ADMIN'    as UserRole, status: 'ACTIVE'    as UserStatus, coins: 15200, diamonds: 450,  level: 42, joinDate: '2023-01-15', lastSeen: '2 mins ago',  totalTransactions: 284, winRate: 78, deviceBlock: false, timerBlock: false, block: false },
    { id: '2',  name: 'Nebula Knight',  email: 'nebula@void.com',   role: 'HOST'     as UserRole, status: 'ACTIVE'    as UserStatus, coins:  8400, diamonds: 120,  level: 28, joinDate: '2023-03-22', lastSeen: '1 hour ago',  totalTransactions: 156, winRate: 62, deviceBlock: true,  timerBlock: false, block: false },
    { id: '3',  name: 'Cyber Phantom',  email: 'phantom@ghost.net', role: 'AGENCY'   as UserRole, status: 'DE_ACTIVE' as UserStatus, coins:     0, diamonds:   5,  level: 15, joinDate: '2023-06-10', lastSeen: '3 days ago',  totalTransactions:  43, winRate: 34, deviceBlock: false, timerBlock: false, block: true  },
    { id: '4',  name: 'Solar Flare',    email: 'flare@nova.org',    role: 'SELLER'   as UserRole, status: 'ACTIVE'    as UserStatus, coins: 45000, diamonds: 2100, level: 56, joinDate: '2022-11-05', lastSeen: '5 mins ago',  totalTransactions: 712, winRate: 91, deviceBlock: false, timerBlock: true,  block: false },
    { id: '5',  name: 'Void Walker',    email: 'void@null.ptr',     role: 'CUSTOMER' as UserRole, status: 'ACTIVE'    as UserStatus, coins:  1200, diamonds:   0,  level:  8, joinDate: '2024-01-30', lastSeen: '2 days ago',  totalTransactions:  12, winRate: 45, deviceBlock: false, timerBlock: false, block: false },
    { id: '6',  name: 'Storm Cipher',   email: 'storm@cipher.io',   role: 'HOST'     as UserRole, status: 'ACTIVE'    as UserStatus, coins:  3200, diamonds:  80,  level: 19, joinDate: '2023-09-12', lastSeen: '30 mins ago', totalTransactions:  67, winRate: 55, deviceBlock: false, timerBlock: false, block: false },
    { id: '7',  name: 'Dark Nexus',     email: 'dark@nexus.net',    role: 'SELLER'   as UserRole, status: 'DE_ACTIVE' as UserStatus, coins: 22000, diamonds: 900,  level: 38, joinDate: '2023-02-20', lastSeen: '1 week ago',  totalTransactions: 310, winRate: 70, deviceBlock: false, timerBlock: false, block: false },
    { id: '8',  name: 'Pulse Echo',     email: 'pulse@echo.dev',    role: 'CUSTOMER' as UserRole, status: 'ACTIVE'    as UserStatus, coins:   500, diamonds:  10,  level:  5, joinDate: '2024-03-05', lastSeen: '4 days ago',  totalTransactions:   8, winRate: 30, deviceBlock: false, timerBlock: false, block: false },
    { id: '9',  name: 'Frost Byte',     email: 'frost@byte.io',     role: 'AGENCY'   as UserRole, status: 'ACTIVE'    as UserStatus, coins:  9800, diamonds: 340,  level: 33, joinDate: '2023-05-17', lastSeen: '15 mins ago', totalTransactions: 189, winRate: 68, deviceBlock: false, timerBlock: false, block: false },
    { id: '10', name: 'Zeta Quasar',    email: 'zeta@quasar.com',   role: 'ADMIN'    as UserRole, status: 'ACTIVE'    as UserStatus, coins: 31000, diamonds: 1200, level: 47, joinDate: '2022-08-30', lastSeen: 'Just now',    totalTransactions: 520, winRate: 82, deviceBlock: false, timerBlock: false, block: false },
    { id: '11', name: 'Nova Shard',     email: 'nova@shard.net',    role: 'CUSTOMER' as UserRole, status: 'ACTIVE'    as UserStatus, coins:   750, diamonds:   0,  level:  4, joinDate: '2024-05-01', lastSeen: '6 days ago',  totalTransactions:   5, winRate: 22, deviceBlock: false, timerBlock: false, block: false },
    { id: '12', name: 'Binary Ghost',   email: 'binary@ghost.io',   role: 'HOST'     as UserRole, status: 'DE_ACTIVE' as UserStatus, coins:  4100, diamonds:  60,  level: 22, joinDate: '2023-11-08', lastSeen: '2 weeks ago', totalTransactions:  94, winRate: 49, deviceBlock: false, timerBlock: false, block: false },
];

type User = typeof initialMockUsers[0];

// ─── Block Duration Input ─────────────────────────────────────────────────────
function BlockDurationInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black uppercase tracking-[0.25em] text-text-muted">{label}</label>
            <div className="relative flex items-center">
                <Clock size={11} className="absolute left-3 text-neon-cyan/50 pointer-events-none" />
                <input type="number" min={1} placeholder="e.g. 24" value={value} onChange={(e) => onChange(e.target.value)}
                    className="w-full h-9 pl-8 pr-14 rounded-lg bg-dark-bg border border-card-border hover:border-neon-cyan/30 focus:border-neon-cyan/50 focus:outline-none text-xs font-bold text-text-primary placeholder-text-muted/40 transition-all focus:shadow-[0_0_8px_rgba(0,255,255,0.1)]" />
                <span className="absolute right-3 text-[9px] font-black uppercase tracking-wider text-text-muted pointer-events-none">hrs</span>
            </div>
        </div>
    );
}

// ─── Block Action Button ──────────────────────────────────────────────────────
function BlockActionButton({ label, icon, color, isActive, isAnyOtherActive, canAct, onToggle }: {
    label: string; icon: React.ReactNode; color: 'red' | 'orange' | 'purple';
    isActive: boolean; isAnyOtherActive: boolean; canAct: boolean; onToggle: () => void;
}) {
    const map = {
        red:    { active: 'bg-neon-red/15 border-neon-red/50 text-neon-red shadow-[0_0_12px_rgba(255,0,0,0.2)]',       hover: 'hover:bg-neon-red/10 hover:border-neon-red/30 hover:text-neon-red',       dot: 'bg-neon-red shadow-[0_0_6px_rgba(255,0,0,0.8)]'    },
        orange: { active: 'bg-amber-500/15 border-amber-500/50 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]', hover: 'hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400', dot: 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]' },
        purple: { active: 'bg-neon-purple/15 border-neon-purple/50 text-neon-purple shadow-[0_0_12px_rgba(191,0,255,0.2)]', hover: 'hover:bg-neon-purple/10 hover:border-neon-purple/30 hover:text-neon-purple', dot: 'bg-neon-purple shadow-[0_0_6px_rgba(191,0,255,0.8)]' },
    };
    const c = map[color];
    const idle = 'bg-white/[0.03] border-card-border text-text-muted';
    const isDisabled = !canAct || (!isActive && isAnyOtherActive);
    return (
        <button disabled={isDisabled} onClick={onToggle}
            title={!canAct ? 'Insufficient permissions' : isAnyOtherActive && !isActive ? 'Another block is active. Remove it first.' : undefined}
            className={cn('flex-1 h-9 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5',
                isDisabled ? 'opacity-30 cursor-not-allowed ' + idle : isActive ? c.active : idle + ' ' + c.hover)}>
            {isActive && <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', c.dot)} />}
            {icon}
            {isActive ? 'Unblock' : label}
        </button>
    );
}

// ─── Block Actions Section ────────────────────────────────────────────────────
function BlockActionsSection({ user, canBlock, onBlockChange }: {
    user: User; canBlock: boolean; onBlockChange: (key: BlockType, value: boolean, duration?: string) => void;
}) {
    const [pendingBlock, setPendingBlock] = useState<BlockType | null>(null);
    const [duration, setDuration] = useState('');

    const activeBlock: BlockType | null = user.deviceBlock ? 'deviceBlock' : user.timerBlock ? 'timerBlock' : user.block ? 'block' : null;
    const isAnyActive = activeBlock !== null;

    const configs: { key: BlockType; label: string; icon: React.ReactNode; color: 'red' | 'orange' | 'purple' }[] = [
        { key: 'deviceBlock', label: 'Device Block', icon: <Smartphone size={12} />, color: 'red'    },
        { key: 'timerBlock',  label: 'Timer Block',  icon: <Timer size={12} />,      color: 'orange' },
        { key: 'block',       label: 'Block User',   icon: <Ban size={12} />,         color: 'purple' },
    ];

    const handleToggle = (key: BlockType) => {
        if (user[key]) { onBlockChange(key, false); }
        else { setPendingBlock(key); setDuration(''); }
    };

    const handleConfirm = () => {
        if (!pendingBlock) return;
        onBlockChange(pendingBlock, true, duration || undefined);
        setPendingBlock(null); setDuration('');
    };

    const pending = configs.find(c => c.key === pendingBlock);

    return (
        <div className="space-y-2.5">
            <div className="flex items-center justify-between">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted">Block Controls</p>
                {!canBlock && <span className="flex items-center gap-1 text-[8px] text-neon-red/60 font-bold uppercase tracking-wider"><Lock size={8} /> No Permission</span>}
                {isAnyActive && canBlock && <span className="flex items-center gap-1 text-[8px] text-amber-400/70 font-bold uppercase tracking-wider"><span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />1 Active Block</span>}
            </div>
            <div className="flex items-center gap-1.5">
                {configs.map(({ key, label, icon, color }) => (
                    <BlockActionButton key={key} label={label} icon={icon} color={color}
                        isActive={user[key]} isAnyOtherActive={isAnyActive && !user[key]} canAct={canBlock} onToggle={() => handleToggle(key)} />
                ))}
            </div>
            <AnimatePresence>
                {pendingBlock && pending && (
                    <motion.div initial={{ opacity: 0, height: 0, y: -6 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -6 }} transition={{ duration: 0.22 }} className="overflow-hidden">
                        <div className={cn('rounded-xl border p-3 space-y-3',
                            pending.color === 'red' ? 'border-neon-red/20 bg-neon-red/5' : pending.color === 'orange' ? 'border-amber-500/20 bg-amber-500/5' : 'border-neon-purple/20 bg-neon-purple/5')}>
                            <div className="flex items-center gap-2">
                                <span className={cn('text-xs', pending.color === 'red' ? 'text-neon-red' : pending.color === 'orange' ? 'text-amber-400' : 'text-neon-purple')}>{pending.icon}</span>
                                <p className="text-[10px] font-black uppercase tracking-widest text-text-primary">Configure {pending.label}</p>
                            </div>
                            <BlockDurationInput label="Block Duration (optional — leave blank for permanent)" value={duration} onChange={setDuration} />
                            <div className="flex items-center gap-2">
                                <button onClick={handleConfirm} className={cn('flex-1 h-8 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5',
                                    pending.color === 'red' ? 'bg-neon-red/20 hover:bg-neon-red/30 border border-neon-red/40 text-neon-red' : pending.color === 'orange' ? 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-400' : 'bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/40 text-neon-purple')}>
                                    <Check size={11} />{duration ? `Block for ${duration}h` : 'Block Permanently'}
                                </button>
                                <button onClick={() => { setPendingBlock(null); setDuration(''); }} className="flex-1 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-card-border text-[10px] font-black uppercase tracking-widest text-text-muted transition-all">Cancel</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Block Status Badge ───────────────────────────────────────────────────────
function BlockStatusBadge({ user }: { user: User }) {
    if (user.deviceBlock) return (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-neon-red/20 border border-neon-red/50 shadow-[0_0_8px_rgba(255,0,0,0.3)]">
            <Smartphone size={8} className="text-neon-red" /><span className="text-[7px] font-black uppercase tracking-wider text-neon-red">Device</span>
        </motion.div>
    );
    if (user.timerBlock) return (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.3)]">
            <Timer size={8} className="text-amber-400" /><span className="text-[7px] font-black uppercase tracking-wider text-amber-400">Timer</span>
        </motion.div>
    );
    if (user.block) return (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-neon-purple/20 border border-neon-purple/50 shadow-[0_0_8px_rgba(191,0,255,0.3)]">
            <Ban size={8} className="text-neon-purple" /><span className="text-[7px] font-black uppercase tracking-wider text-neon-purple">Blocked</span>
        </motion.div>
    );
    return null;
}

// ─── User Profile Modal ───────────────────────────────────────────────────────
function UserProfileModal({ user, isOpen, onClose, onBlockChange }: {
    user: User | null; isOpen: boolean; onClose: () => void;
    onBlockChange: (userId: string, key: BlockType, value: boolean, duration?: string) => void;
}) {
    if (!user) return null;
    const initials = user.name.split(' ').map(n => n[0]).join('');
    const isActive = user.status === 'ACTIVE';
    const canBlock = CAN_BLOCK_ROLES.includes(CURRENT_VIEWER_ROLE);
    const avatarBorder = user.deviceBlock ? 'border-neon-red/60 shadow-[0_0_20px_rgba(255,0,0,0.25)]'
        : user.timerBlock ? 'border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
        : user.block ? 'border-neon-purple/60 shadow-[0_0_20px_rgba(191,0,255,0.25)]'
        : 'border-neon-cyan/40 shadow-[0_0_20px_rgba(0,255,255,0.25)]';

    const stats = [
        { label: 'Coins',    value: user.coins.toLocaleString(), icon: <Coins size={14} />,    color: 'neon-gold',   glow: 'rgba(255,215,0,0.4)'   },
        { label: 'Diamonds', value: user.diamonds.toLocaleString(), icon: <Gem size={14} />,   color: 'neon-purple', glow: 'rgba(191,0,255,0.4)'   },
        { label: 'Level',    value: user.level,                  icon: <Star size={14} />,    color: 'neon-cyan',   glow: 'rgba(0,255,255,0.4)'   },
        { label: 'Win Rate', value: `${user.winRate}%`,          icon: <TrendingUp size={14} />, color: 'neon-green', glow: 'rgba(0,255,100,0.4)' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
                    <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <div className="pointer-events-auto w-full max-w-lg relative">
                            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-neon-cyan/40 via-transparent to-neon-purple/30 blur-sm" />
                            <div className="relative rounded-2xl border border-neon-cyan/20 bg-dark-bg overflow-hidden shadow-[0_0_60px_rgba(0,255,255,0.08)] max-h-[90vh] overflow-y-auto">
                                <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 3 }} className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent z-10" />

                                {/* Header */}
                                <div className="relative h-28 bg-gradient-to-br from-neon-cyan/10 via-dark-bg to-neon-purple/10 border-b border-card-border overflow-hidden">
                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(0,255,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,255,0.3) 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
                                    <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-neon-cyan/50" />
                                    <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-neon-cyan/50" />
                                    <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-neon-cyan/50" />
                                    <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-neon-cyan/50" />
                                    <button onClick={onClose} className="absolute top-3 right-10 w-7 h-7 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red border border-card-border hover:border-neon-red/40 transition-all flex items-center justify-center text-text-muted text-xs font-bold">✕</button>
                                    <div className="absolute bottom-3 left-16 ml-2">
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-neon-cyan/60">Identity Profile</p>
                                        <h2 className="text-lg font-black text-text-primary tracking-wide leading-tight">{user.name}</h2>
                                    </div>
                                </div>

                                {/* Avatar — overlaps header */}
                                <div className="absolute top-[88px] left-6 mt-12">
                                    <div className="relative">
                                        <motion.div
                                            animate={user.deviceBlock || user.timerBlock || user.block ? { boxShadow: ['0 0 0px rgba(255,0,100,0)', '0 0 14px rgba(255,0,100,0.3)', '0 0 0px rgba(255,0,100,0)'] } : {}}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className={cn('w-16 h-16 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border-2 flex items-center justify-center text-neon-cyan font-black text-lg', avatarBorder)}>
                                            {initials}
                                        </motion.div>
                                        <BlockStatusBadge user={user} />
                                        <div className={cn('absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-dark-bg', isActive ? 'bg-neon-green shadow-[0_0_8px_rgba(0,255,100,0.8)]' : 'bg-neon-red shadow-[0_0_8px_rgba(255,0,0,0.8)]')} />
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="pt-10 px-6 pb-6 space-y-5 mt-4">
                                    <div className="flex items-center gap-2 pl-[4.5rem]">
                                        <NeonBadge>{user.role}</NeonBadge>
                                        <span className={cn('px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-[0.2em] border', isActive ? 'text-neon-green border-neon-green/30 bg-neon-green/10' : 'text-neon-red border-neon-red/30 bg-neon-red/10')}>{user.status}</span>
                                    </div>

                                    {/* Info rows */}
                                    <div className="grid grid-cols-1 gap-2 mt-12">
                                        {[
                                            { icon: <Mail size={12} />,        label: 'Email',        value: user.email },
                                            { icon: <Hash size={12} />,        label: 'User ID',      value: `#${user.id.padStart(6, '0')}` },
                                            { icon: <Calendar size={12} />,    label: 'Joined',       value: new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                                            { icon: <Activity size={12} />,    label: 'Last Active',  value: user.lastSeen },
                                            { icon: <Crown size={12} />,       label: 'Transactions', value: `${user.totalTransactions} total` },
                                            { icon: <Phone size={12} />,       label: 'Device Block', value: user.deviceBlock ? 'Active' : 'None', highlight: user.deviceBlock },
                                            { icon: <Timer size={12} />,       label: 'Timer Block',  value: user.timerBlock  ? 'Active' : 'None', highlight: user.timerBlock  },
                                            { icon: <Accessibility size={12} />, label: 'Block',      value: user.block       ? 'Active' : 'None', highlight: user.block       },
                                        ].map(({ icon, label, value, highlight }) => (
                                            <div key={label} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-card-border hover:border-neon-cyan/20 transition-all group">
                                                <div className="flex items-center gap-2 text-text-muted group-hover:text-neon-cyan/60 transition-colors">{icon}<span className="text-[10px] font-bold uppercase tracking-widest">{label}</span></div>
                                                <span className={cn('text-xs font-semibold', highlight ? 'text-neon-red' : 'text-text-primary')}>{value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Stats grid */}
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted mb-2">Wallet & Stats</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {stats.map(({ label, value, icon, color, glow }) => (
                                                <motion.div key={label} whileHover={{ scale: 1.04 }} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.03] border border-card-border hover:border-white/10 transition-all"
                                                    style={{ boxShadow: `0 0 0 0 ${glow}` }} whileInView={{ boxShadow: [`0 0 0 0 ${glow}`, `0 0 14px -2px ${glow}`, `0 0 0 0 ${glow}`] }} transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}>
                                                    <span className={`text-${color}`}>{icon}</span>
                                                    <span className={`text-sm font-black text-${color}`}>{value}</span>
                                                    <span className="text-[9px] uppercase tracking-wider text-text-muted">{label}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Level progress */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted">Level Progress</p>
                                            <span className="text-[9px] font-bold text-neon-gold">{user.level % 10 * 10}% to Lvl {user.level + 1}</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full border border-white/5 overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${(user.level % 10) * 10}%` }} transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }} className="h-full rounded-full bg-gradient-to-r from-neon-gold/60 to-neon-gold shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-3">
                                        <button className="w-full h-9 rounded-lg bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/20 hover:border-neon-cyan/50 text-neon-cyan text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5">
                                            <Shield size={13} /> Permissions
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-px bg-card-border" />
                                            <span className="text-[8px] uppercase tracking-widest text-text-muted font-bold">Block Controls</span>
                                            <div className="flex-1 h-px bg-card-border" />
                                        </div>
                                        <BlockActionsSection user={user} canBlock={canBlock} onBlockChange={(key, value, dur) => onBlockChange(user.id, key, value, dur)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ─── Add User Modal ───────────────────────────────────────────────────────────
interface AddUserForm {
    name: string; email: string; role: UserRole; status: UserStatus;
    coins: string; diamonds: string; level: string; winRate: string; totalTransactions: string;
}
const defaultForm: AddUserForm = { name: '', email: '', role: 'CUSTOMER', status: 'ACTIVE', coins: '0', diamonds: '0', level: '1', winRate: '0', totalTransactions: '0' };

function AddUserModal({ isOpen, onClose, onAdd }: {
    isOpen: boolean; onClose: () => void; onAdd: (u: Omit<User, 'id' | 'joinDate' | 'lastSeen'>) => void;
}) {
    const [form, setForm] = useState<AddUserForm>(defaultForm);
    const [errors, setErrors] = useState<Partial<Record<keyof AddUserForm, string>>>({});

    const set = (k: keyof AddUserForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(p => ({ ...p, [k]: e.target.value }));
        setErrors(p => ({ ...p, [k]: '' }));
    };

    const validate = () => {
        const err: typeof errors = {};
        if (!form.name.trim()) err.name = 'Required';
        if (!form.email.includes('@')) err.email = 'Valid email required';
        if (+form.level < 1 || +form.level > 100) err.level = '1–100 only';
        if (+form.winRate < 0 || +form.winRate > 100) err.winRate = '0–100 only';
        setErrors(err);
        return !Object.keys(err).length;
    };

    const submit = () => {
        if (!validate()) return;
        onAdd({ name: form.name.trim(), email: form.email.trim(), role: form.role, status: form.status, coins: +form.coins || 0, diamonds: +form.diamonds || 0, level: +form.level || 1, winRate: +form.winRate || 0, totalTransactions: +form.totalTransactions || 0, deviceBlock: false, timerBlock: false, block: false });
        setForm(defaultForm); setErrors({}); onClose();
    };

    const close = () => { setForm(defaultForm); setErrors({}); onClose(); };

    const iBase = "w-full h-9 rounded-lg bg-dark-bg border border-card-border hover:border-neon-cyan/30 focus:border-neon-cyan/50 focus:outline-none text-xs font-bold text-text-primary placeholder-text-muted/40 transition-all focus:shadow-[0_0_8px_rgba(0,255,255,0.1)] pl-8 pr-3";
    const lBase = "text-[9px] font-black uppercase tracking-[0.2em] text-text-muted block mb-1.5";
    const icon = (i: React.ReactNode) => <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-cyan/40 pointer-events-none">{i}</span>;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
                    <motion.div initial={{ opacity: 0, scale: 0.93, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.93, y: 16 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <div className="pointer-events-auto w-full max-w-lg relative">
                            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-neon-cyan/30 via-transparent to-neon-green/20 blur-sm" />
                            <div className="relative rounded-2xl border border-neon-cyan/20 bg-dark-bg overflow-hidden max-h-[90vh] overflow-y-auto">
                                <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 4 }} className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent z-10" />

                                {/* Header */}
                                <div className="relative h-20 bg-gradient-to-br from-neon-cyan/8 via-dark-bg to-neon-green/8 border-b border-card-border flex items-center px-6 gap-3 overflow-hidden">
                                    <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(rgba(0,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,255,0.4) 1px,transparent 1px)', backgroundSize: '20px 20px' }} />
                                    <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-neon-cyan/40" />
                                    <div className="absolute top-2 right-10 w-4 h-4 border-r-2 border-t-2 border-neon-cyan/40" />
                                    <button onClick={close} className="absolute top-2.5 right-3 w-7 h-7 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red border border-card-border hover:border-neon-red/40 transition-all flex items-center justify-center text-text-muted text-xs font-bold">✕</button>
                                    <div className="relative w-9 h-9 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center shadow-[0_0_14px_rgba(0,255,255,0.15)]">
                                        <UserPlus size={16} className="text-neon-cyan" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-neon-cyan/50">Matrix Registry</p>
                                        <h2 className="text-sm font-black text-text-primary tracking-wide">Register New Identity</h2>
                                    </div>
                                </div>

                                {/* Form */}
                                <div className="px-6 py-5 space-y-5">

                                    {/* Core Identity */}
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-neon-cyan/50 mb-3 flex items-center gap-2"><span className="w-3 h-px bg-neon-cyan/30" />Core Identity<span className="flex-1 h-px bg-card-border" /></p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className={lBase}>Display Name *</label>
                                                <div className="relative">{icon(<AtSign size={11} />)}<input value={form.name} onChange={set('name')} placeholder="e.g. Nova Striker" className={iBase} /></div>
                                                {errors.name && <p className="text-[9px] text-neon-red mt-1">{errors.name}</p>}
                                            </div>
                                            <div>
                                                <label className={lBase}>Email Address *</label>
                                                <div className="relative">{icon(<Mail size={11} />)}<input type="email" value={form.email} onChange={set('email')} placeholder="user@domain.com" className={iBase} /></div>
                                                {errors.email && <p className="text-[9px] text-neon-red mt-1">{errors.email}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Access & Status */}
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-neon-cyan/50 mb-3 flex items-center gap-2"><span className="w-3 h-px bg-neon-cyan/30" />Access & Status<span className="flex-1 h-px bg-card-border" /></p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className={lBase}>Account Role</label>
                                                <select value={form.role} onChange={set('role')} className="w-full h-9 rounded-lg border border-card-border bg-dark-bg px-3 text-xs font-bold text-text-primary focus:outline-none focus:border-neon-cyan/50 transition-all hover:border-neon-cyan/30">
                                                    {ALL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className={lBase}>Account Status</label>
                                                <select value={form.status} onChange={set('status')} className="w-full h-9 rounded-lg border border-card-border bg-dark-bg px-3 text-xs font-bold text-text-primary focus:outline-none focus:border-neon-cyan/50 transition-all hover:border-neon-cyan/30">
                                                    <option value="ACTIVE">Active</option>
                                                    <option value="DE_ACTIVE">De-Active</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Wallet & Stats */}
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-neon-cyan/50 mb-3 flex items-center gap-2"><span className="w-3 h-px bg-neon-cyan/30" />Wallet & Stats<span className="flex-1 h-px bg-card-border" /></p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className={lBase}>Coins Balance</label>
                                                <div className="relative">{icon(<Coins size={11} />)}<input type="number" value={form.coins} onChange={set('coins')} className={iBase} /></div>
                                            </div>
                                            <div>
                                                <label className={lBase}>Diamonds Balance</label>
                                                <div className="relative">{icon(<Gem size={11} />)}<input type="number" value={form.diamonds} onChange={set('diamonds')} className={iBase} /></div>
                                            </div>
                                            <div>
                                                <label className={lBase}>Player Level (1–100)</label>
                                                <div className="relative">{icon(<Star size={11} />)}<input type="number" value={form.level} onChange={set('level')} className={iBase} /></div>
                                                {errors.level && <p className="text-[9px] text-neon-red mt-1">{errors.level}</p>}
                                            </div>
                                            <div>
                                                <label className={lBase}>Win Rate % (0–100)</label>
                                                <div className="relative">{icon(<TrendingUp size={11} />)}<input type="number" value={form.winRate} onChange={set('winRate')} className={iBase} /></div>
                                                {errors.winRate && <p className="text-[9px] text-neon-red mt-1">{errors.winRate}</p>}
                                            </div>
                                            <div className="col-span-2">
                                                <label className={lBase}>Total Transactions</label>
                                                <div className="relative">{icon(<Layers size={11} />)}<input type="number" value={form.totalTransactions} onChange={set('totalTransactions')} className={iBase} /></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <div className="flex gap-2 pt-1">
                                        <button onClick={submit} className="flex-1 h-10 rounded-xl bg-neon-cyan/15 hover:bg-neon-cyan/25 border border-neon-cyan/30 hover:border-neon-cyan/60 text-neon-cyan text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                            <UserPlus size={13} /> Register Identity
                                        </button>
                                        <button onClick={close} className="flex-1 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-card-border text-text-muted text-xs font-black uppercase tracking-widest transition-all">Abort</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }: {
    currentPage: number; totalPages: number; totalItems: number; itemsPerPage: number; onPageChange: (p: number) => void;
}) {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    const pages: (number | '...')[] = useMemo(() => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
        if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    }, [currentPage, totalPages]);

    const btn = "w-7 h-7 rounded-lg border transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed";
    const idle = "bg-white/[0.03] border-card-border text-text-muted hover:bg-neon-cyan/10 hover:border-neon-cyan/30 hover:text-neon-cyan";

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between px-4 py-3 border-t border-card-border">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">
                Showing <span className="text-neon-cyan">{start}–{end}</span> of {totalItems}
            </span>
            <div className="flex items-center gap-1">
                <button disabled={currentPage === 1} onClick={() => onPageChange(1)} className={cn(btn, idle)}><ChevronsLeft size={11} /></button>
                <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className={cn(btn, idle)}><ChevronLeft size={11} /></button>
                {pages.map((p, i) => p === '...'
                    ? <span key={`e${i}`} className="w-7 flex items-center justify-center text-[10px] text-text-muted">···</span>
                    : <motion.button key={p} whileTap={{ scale: 0.92 }} onClick={() => onPageChange(p as number)}
                        className={cn(btn, 'text-[10px] font-black', currentPage === p ? 'bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.2)]' : idle)}>
                        {p}
                    </motion.button>
                )}
                <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} className={cn(btn, idle)}><ChevronRight size={11} /></button>
                <button disabled={currentPage === totalPages} onClick={() => onPageChange(totalPages)} className={cn(btn, idle)}><ChevronsRight size={11} /></button>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">
                Page <span className="text-text-primary">{currentPage}/{totalPages}</span>
            </span>
        </motion.div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>(initialMockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterRole, setFilterRole] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');

    const canAddUser = CAN_ADD_USER_ROLES.includes(CURRENT_VIEWER_ROLE);

    const filtered = useMemo(() => users.filter(u =>
        (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterRole === 'ALL' || u.role === filterRole) &&
        (filterStatus === 'ALL' || u.status === filterStatus)
    ), [users, searchTerm, filterRole, filterStatus]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paged = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

    const handleViewProfile = (user: User) => { setSelectedUser(user); setIsProfileModalOpen(true); };

    const handleBlockChange = (userId: string, key: BlockType, value: boolean, duration?: string) => {
        const update = (u: User): User => {
            if (u.id !== userId) return u;
            if (value) return { ...u, deviceBlock: key === 'deviceBlock', timerBlock: key === 'timerBlock', block: key === 'block' };
            return { ...u, [key]: false };
        };
        setUsers(p => p.map(update));
        setSelectedUser(p => p ? update(p) : p);
        if (duration && value) console.log(`[Block] ${userId} → ${key} for ${duration}h`);
    };

    const handleAddUser = (data: Omit<User, 'id' | 'joinDate' | 'lastSeen'>) => {
        setUsers(p => [{ ...data, id: String(Date.now()), joinDate: new Date().toISOString().split('T')[0], lastSeen: 'Just now' }, ...p]);
        setCurrentPage(1);
    };

    const columns: Column<User>[] = [
        {
            header: 'User Identity',
            accessor: (user) => (
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 flex-shrink-0">
                        <div className={cn('w-10 h-10 rounded-lg border flex items-center justify-center font-black text-xs',
                            user.deviceBlock ? 'bg-neon-red/10 border-neon-red/30 text-neon-red' : user.timerBlock ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : user.block ? 'bg-neon-purple/10 border-neon-purple/30 text-neon-purple' : 'bg-neon-cyan/10 border-neon-cyan/20 text-neon-cyan')}>
                            {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {(user.deviceBlock || user.timerBlock || user.block) && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-neon-red border border-dark-bg shadow-[0_0_6px_rgba(255,0,0,0.6)] flex items-center justify-center">
                                <Ban size={6} className="text-white" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="font-bold text-text-primary text-sm">{user.name}</div>
                        <div className="text-[10px] text-text-muted font-medium">{user.email}</div>
                    </div>
                </div>
            ),
        },
        { header: 'Rank / Role', accessor: (user) => <NeonBadge>{user.role}</NeonBadge> },
        {
            header: 'Level',
            accessor: (user) => (
                <div className="flex items-center gap-3 w-32">
                    <div className="w-8 h-8 rounded-lg bg-dark-bg border border-card-border flex items-center justify-center text-[10px] font-black text-neon-gold">{user.level}</div>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(user.level % 10) * 10}%` }} className="h-full bg-gradient-to-r from-neon-gold/50 to-neon-gold" />
                    </div>
                </div>
            ),
        },
        {
            header: 'Wallet Balance',
            accessor: (user) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-neon-gold font-black tracking-wider"><span className="w-1.5 h-1.5 rounded-full bg-neon-gold animate-pulse" />{user.coins.toLocaleString()} <span className="text-[8px] text-text-muted">COINS</span></div>
                    <div className="flex items-center gap-2 text-xs text-neon-purple font-black tracking-wider"><span className="w-1.5 h-1.5 rounded-full bg-neon-purple" />{user.diamonds.toLocaleString()} <span className="text-[8px] text-text-muted">DIAMONDS</span></div>
                </div>
            ),
        },
        {
            header: 'Status',
            accessor: (user) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className={cn('w-2 h-2 rounded-full', user.status === 'ACTIVE' ? 'bg-neon-green shadow-[0_0_8px_rgba(0,255,100,0.5)]' : 'bg-neon-red shadow-[0_0_8px_rgba(255,0,0,0.5)]')} />
                        <span className={cn('text-[10px] font-black uppercase tracking-[0.2em]', user.status === 'ACTIVE' ? 'text-neon-green' : 'text-neon-red')}>{user.status}</span>
                    </div>
                    {user.deviceBlock && <span className="text-[8px] font-bold text-neon-red/70 uppercase tracking-wider flex items-center gap-1"><Smartphone size={8} /> Device Blocked</span>}
                    {user.timerBlock  && <span className="text-[8px] font-bold text-amber-400/70 uppercase tracking-wider flex items-center gap-1"><Timer size={8} /> Timer Blocked</span>}
                    {user.block       && <span className="text-[8px] font-bold text-neon-purple/70 uppercase tracking-wider flex items-center gap-1"><Ban size={8} /> Blocked</span>}
                </div>
            ),
        },
        {
            header: 'Operations',
            accessor: (user) => (
                <button title="View Profile" onClick={(e) => { e.stopPropagation(); handleViewProfile(user); }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all border border-transparent hover:border-neon-cyan/30">
                    <Eye size={14} />
                </button>
            ),
        },
    ];

    return (
        <PageContainer>
            <PageHeader
                title="User Base Access"
                description="Global user registry and security matrix"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <NeonInput placeholder="Scan for identity..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} icon={<Search size={16} />} className="h-10" />
                        </div>
                        <GlowButton variant="purple" size="sm" className="flex items-center gap-2" onClick={() => setIsFilterModalOpen(true)}>
                            <Filter size={14} /> Matrix Filter
                        </GlowButton>
                        {canAddUser && (
                            <GlowButton variant="cyan" size="sm" className="flex items-center gap-2" onClick={() => setIsAddUserOpen(true)}>
                                <UserPlus size={14} /> Add User
                            </GlowButton>
                        )}
                    </div>
                }
            />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl overflow-hidden">
                <div className="p-1">
                    <NeonTable columns={columns} data={paged} onRowClick={handleViewProfile} />
                </div>
                <Pagination currentPage={safePage} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
            </motion.div>

            {/* Filter Modal */}
            <NeonModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} title="Advanced Matrix Filter" description="Apply strict parameters to isolate specific user identities from the global database." variant="purple"
                actions={<GlowButton variant="purple" onClick={() => { setIsFilterModalOpen(false); setCurrentPage(1); }} className="flex items-center gap-2"><Check size={16} /> Apply Protocol</GlowButton>}>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Account Role</label>
                        <select value={filterRole} onChange={e => { setFilterRole(e.target.value); }} className="flex h-10 w-full rounded-lg border border-card-border bg-dark-bg/50 px-3 text-sm text-text-primary focus:outline-none focus:border-neon-purple/50 transition-all">
                            <option value="ALL">All Identities</option>
                            {ALL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Account Status</label>
                        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); }} className="flex h-10 w-full rounded-lg border border-card-border bg-dark-bg/50 px-3 text-sm text-text-primary focus:outline-none focus:border-neon-purple/50 transition-all">
                            <option value="ALL">All States</option>
                            <option value="ACTIVE">Active Node</option>
                            <option value="DE_ACTIVE">De-Active Node</option>
                        </select>
                    </div>
                </div>
            </NeonModal>

            <AddUserModal isOpen={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} onAdd={handleAddUser} />

            <UserProfileModal user={selectedUser} isOpen={isProfileModalOpen} onClose={() => { setIsProfileModalOpen(false); setSelectedUser(null); }} onBlockChange={handleBlockChange} />
        </PageContainer>
    );
}