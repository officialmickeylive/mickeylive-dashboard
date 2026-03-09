'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Search, Filter, Eye, Shield, UserCheck, UserX, Check, Coins, Gem, Star, TrendingUp, Mail, Hash, Activity, Calendar, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock Data for User Management
const mockUsers = [
    { id: '1', name: 'Alpha Draconis', email: 'alpha@matrix.io', role: 'ADMIN', status: 'ACTIVE', coins: 15200, diamonds: 450, level: 42, joinDate: '2023-01-15', lastSeen: '2 mins ago', totalTransactions: 284, winRate: 78 },
    { id: '2', name: 'Nebula Knight', email: 'nebula@void.com', role: 'HOST', status: 'ACTIVE', coins: 8400, diamonds: 120, level: 28, joinDate: '2023-03-22', lastSeen: '1 hour ago', totalTransactions: 156, winRate: 62 },
    { id: '3', name: 'Cyber Phantom', email: 'phantom@ghost.net', role: 'AGENCY', status: 'SUSPENDED', coins: 0, diamonds: 5, level: 15, joinDate: '2023-06-10', lastSeen: '3 days ago', totalTransactions: 43, winRate: 34 },
    { id: '4', name: 'Solar Flare', email: 'flare@nova.org', role: 'SELLER', status: 'ACTIVE', coins: 45000, diamonds: 2100, level: 56, joinDate: '2022-11-05', lastSeen: '5 mins ago', totalTransactions: 712, winRate: 91 },
    { id: '5', name: 'Void Walker', email: 'void@null.ptr', role: 'CUSTOMER', status: 'ACTIVE', coins: 1200, diamonds: 0, level: 8, joinDate: '2024-01-30', lastSeen: '2 days ago', totalTransactions: 12, winRate: 45 },
];

type User = typeof mockUsers[0];

// ─── User Profile Modal ───────────────────────────────────────────────────────
function UserProfileModal({ user, isOpen, onClose }: { user: User | null; isOpen: boolean; onClose: () => void }) {
    if (!user) return null;

    const initials = user.name.split(' ').map(n => n[0]).join('');
    const isActive = user.status === 'ACTIVE';

    const stats = [
        { label: 'Coins', value: user.coins.toLocaleString(), icon: <Coins size={14} />, color: 'neon-gold', glow: 'rgba(255,215,0,0.4)' },
        { label: 'Diamonds', value: user.diamonds.toLocaleString(), icon: <Gem size={14} />, color: 'neon-purple', glow: 'rgba(191,0,255,0.4)' },
        { label: 'Level', value: user.level, icon: <Star size={14} />, color: 'neon-cyan', glow: 'rgba(0,255,255,0.4)' },
        { label: 'Win Rate', value: `${user.winRate}%`, icon: <TrendingUp size={14} />, color: 'neon-green', glow: 'rgba(0,255,100,0.4)' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="pointer-events-auto w-full max-w-lg relative">
                            {/* Outer glow */}
                            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-neon-cyan/40 via-transparent to-neon-purple/30 blur-sm" />

                            {/* Card */}
                            <div className="relative rounded-2xl border border-neon-cyan/20 bg-dark-bg overflow-hidden shadow-[0_0_60px_rgba(0,255,255,0.08)]">

                                {/* Top scanline animation */}
                                <motion.div
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
                                    className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent z-10"
                                />

                                {/* Header Banner */}
                                <div className="relative h-28 bg-gradient-to-br from-neon-cyan/10 via-dark-bg to-neon-purple/10 border-b border-card-border overflow-hidden">
                                    {/* Grid pattern */}
                                    <div className="absolute inset-0 opacity-10"
                                        style={{
                                            backgroundImage: 'linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)',
                                            backgroundSize: '24px 24px'
                                        }}
                                    />
                                    {/* Corner decorations */}
                                    <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-neon-cyan/50" />
                                    <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-neon-cyan/50" />
                                    <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-neon-cyan/50" />
                                    <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-neon-cyan/50" />

                                    {/* Close button */}
                                    <button
                                        onClick={onClose}
                                        className="absolute top-3 right-10 w-7 h-7 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red border border-card-border hover:border-neon-red/40 transition-all flex items-center justify-center text-text-muted text-xs font-bold"
                                    >
                                        ✕
                                    </button>

                                    {/* Title */}
                                    <div className="absolute bottom-3 left-16 ml-2">
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-neon-cyan/60">Identity Profile</p>
                                        <h2 className="text-lg font-black text-text-primary tracking-wide leading-tight">{user.name}</h2>
                                    </div>
                                </div>

                                {/* Avatar — overlaps header */}
                                <div className="absolute top-14 left-6">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border-2 border-neon-cyan/40 flex items-center justify-center text-neon-cyan font-black text-lg shadow-[0_0_20px_rgba(0,255,255,0.25)]">
                                            {initials}
                                        </div>
                                        {/* Status dot */}
                                        <div className={cn(
                                            "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-dark-bg",
                                            isActive ? "bg-neon-green shadow-[0_0_8px_rgba(0,255,100,0.8)]" : "bg-neon-red shadow-[0_0_8px_rgba(255,0,0,0.8)]"
                                        )} />
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="pt-10 px-6 pb-6 space-y-5">

                                    {/* Role + Status badges */}
                                    <div className="flex items-center gap-2 pl-[4.5rem]">
                                        <NeonBadge>{user.role}</NeonBadge>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-[0.2em] border",
                                            isActive
                                                ? "text-neon-green border-neon-green/30 bg-neon-green/10"
                                                : "text-neon-red border-neon-red/30 bg-neon-red/10"
                                        )}>
                                            {user.status}
                                        </span>
                                    </div>

                                    {/* Info rows */}
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { icon: <Mail size={12} />, label: 'Email', value: user.email },
                                            { icon: <Hash size={12} />, label: 'User ID', value: `#${user.id.padStart(6, '0')}` },
                                            { icon: <Calendar size={12} />, label: 'Joined', value: new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                                            { icon: <Activity size={12} />, label: 'Last Active', value: user.lastSeen },
                                            { icon: <Crown size={12} />, label: 'Transactions', value: `${user.totalTransactions} total` },
                                        ].map(({ icon, label, value }) => (
                                            <div key={label} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-card-border hover:border-neon-cyan/20 transition-all group">
                                                <div className="flex items-center gap-2 text-text-muted group-hover:text-neon-cyan/60 transition-colors">
                                                    {icon}
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
                                                </div>
                                                <span className="text-xs font-semibold text-text-primary">{value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Stats grid */}
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted mb-2">Wallet & Stats</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {stats.map(({ label, value, icon, color, glow }) => (
                                                <motion.div
                                                    key={label}
                                                    whileHover={{ scale: 1.04 }}
                                                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.03] border border-card-border hover:border-white/10 transition-all"
                                                    style={{ boxShadow: `0 0 0 0 ${glow}` }}
                                                    whileInView={{ boxShadow: [`0 0 0 0 ${glow}`, `0 0 14px -2px ${glow}`, `0 0 0 0 ${glow}`] }}
                                                    transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
                                                >
                                                    <span className={`text-${color}`}>{icon}</span>
                                                    <span className={`text-sm font-black text-${color}`}>{value}</span>
                                                    <span className="text-[9px] uppercase tracking-wider text-text-muted">{label}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Level progress bar */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted">Level Progress</p>
                                            <span className="text-[9px] font-bold text-neon-gold">{user.level % 10 * 10}% to Lvl {user.level + 1}</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full border border-white/5 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(user.level % 10) * 10}%` }}
                                                transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                                                className="h-full rounded-full bg-gradient-to-r from-neon-gold/60 to-neon-gold shadow-[0_0_8px_rgba(255,215,0,0.5)]"
                                            />
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-2 pt-1">
                                        <button className="flex-1 h-9 rounded-lg bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/20 hover:border-neon-cyan/50 text-neon-cyan text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5">
                                            <Shield size={13} /> Permissions
                                        </button>
                                        <button className={cn(
                                            "flex-1 h-9 rounded-lg border text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5",
                                            isActive
                                                ? "bg-neon-red/10 hover:bg-neon-red/20 border-neon-red/20 hover:border-neon-red/50 text-neon-red"
                                                : "bg-neon-green/10 hover:bg-neon-green/20 border-neon-green/20 hover:border-neon-green/50 text-neon-green"
                                        )}>
                                            {isActive ? <><UserX size={13} /> Suspend</> : <><UserCheck size={13} /> Activate</>}
                                        </button>
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UserManagementPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const handleViewProfile = (user: User) => {
        setSelectedUser(user);
        setIsProfileModalOpen(true);
    };

    const columns: Column<typeof mockUsers[0]>[] = [
        {
            header: 'User identity',
            accessor: (user) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan font-black text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <div className="font-bold text-text-primary text-sm">{user.name}</div>
                        <div className="text-[10px] text-text-muted font-medium">{user.email}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Rank / Role',
            accessor: (user) => <NeonBadge>{user.role}</NeonBadge>
        },
        {
            header: 'Level',
            accessor: (user) => (
                <div className="flex items-center gap-3 w-32">
                    <div className="w-8 h-8 rounded-lg bg-dark-bg border border-card-border flex items-center justify-center text-[10px] font-black text-neon-gold shadow-[0_0_10px_rgba(255,215,0,0.1)]">
                        {user.level}
                    </div>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(user.level % 10) * 10}%` }}
                            className="h-full bg-gradient-to-r from-neon-gold/50 to-neon-gold"
                        />
                    </div>
                </div>
            )
        },
        {
            header: 'Wallet Balance',
            accessor: (user) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-neon-gold font-black tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-gold animate-pulse" />
                        {user.coins.toLocaleString()} <span className="text-[8px] text-text-muted">COINS</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neon-purple font-black tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-purple shadow-[0_0_5px_rgba(191,0,255,0.5)]" />
                        {user.diamonds.toLocaleString()} <span className="text-[8px] text-text-muted">DIAMONDS</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (user) => (
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        user.status === 'ACTIVE' ? "bg-neon-green shadow-[0_0_8px_rgba(0,255,100,0.5)]" : "bg-neon-red shadow-[0_0_8px_rgba(255,0,0,0.5)]"
                    )} />
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em]",
                        user.status === 'ACTIVE' ? "text-neon-green" : "text-neon-red"
                    )}>
                        {user.status}
                    </span>
                </div>
            )
        },
        {
            header: 'Operations',
            accessor: (user) => (
                <div className="flex items-center gap-1">
                    <button
                        title="View Profile"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleViewProfile(user);
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all border border-transparent hover:border-neon-cyan/30"
                    >
                        <Eye size={14} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <PageContainer>
            <PageHeader
                title="User Base Access"
                description="Global user registry and security matrix"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <NeonInput
                                placeholder="Scan for identity..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<Search size={16} />}
                                className="h-10"
                            />
                        </div>
                        <GlowButton variant="purple" size="sm" className="flex items-center gap-2" onClick={() => setIsFilterModalOpen(true)}>
                            <Filter size={14} />
                            Matrix Filter
                        </GlowButton>
                    </div>
                }
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-1 rounded-2xl"
            >
                <NeonTable
                    columns={columns}
                    data={mockUsers}
                    onRowClick={(user) => handleViewProfile(user)}
                />
            </motion.div>

            {/* Filter Modal */}
            <NeonModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                title="Advanced Matrix Filter"
                description="Apply strict parameters to isolate specific user identities from the global database."
                variant="purple"
                actions={
                    <GlowButton variant="purple" onClick={() => setIsFilterModalOpen(false)} className="flex items-center gap-2">
                        <Check size={16} /> Apply Protocol
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Account Role</label>
                            <select className="flex h-10 w-full items-center justify-between rounded-lg border border-card-border bg-dark-bg/50 px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-neon-purple/50 focus:shadow-[0_0_10px_rgba(191,0,255,0.1)] transition-all">
                                <option value="ALL">All Identities</option>
                                <option value="HOST">Hosts</option>
                                <option value="AGENCY">Agencies</option>
                                <option value="SELLER">Sellers</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Account Status</label>
                            <select className="flex h-10 w-full items-center justify-between rounded-lg border border-card-border bg-dark-bg/50 px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-neon-purple/50 focus:shadow-[0_0_10px_rgba(191,0,255,0.1)] transition-all">
                                <option value="ALL">All States</option>
                                <option value="ACTIVE">Active Node</option>
                                <option value="SUSPENDED">Suspended Node</option>
                            </select>
                        </div>
                    </div>
                </div>
            </NeonModal>

            {/* User Profile Modal */}
            <UserProfileModal
                user={selectedUser}
                isOpen={isProfileModalOpen}
                onClose={() => {
                    setIsProfileModalOpen(false);
                    setSelectedUser(null);
                }}
            />
        </PageContainer>
    );
}