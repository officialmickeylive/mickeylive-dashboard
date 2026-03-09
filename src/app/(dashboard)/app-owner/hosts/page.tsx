'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { LivePulse } from '@/components/gaming/LivePulse';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Search, Mic2, Users, Heart, Star, ShieldAlert, Check, Eye, UserX, DoorClosed, Crown, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const mockHosts = [
    { id: '1', name: 'Luna Divine',    agency: 'Stellar Talent',       followers: '125K', diamonds: 85000,  level: 45, isLive: true,  roomName: 'Luna World',    audienceCount: 312 },
    { id: '2', name: 'Shadow Dancer',  agency: 'Neon Streamers',       followers: '42K',  diamonds: 12000,  level: 22, isLive: false, roomName: 'Shadow Zone',   audienceCount: 0   },
    { id: '3', name: 'Cyber Queen',    agency: 'Stellar Talent',       followers: '210K', diamonds: 450000, level: 68, isLive: true,  roomName: 'Queen Palace',  audienceCount: 891 },
    { id: '4', name: 'Nova Spark',     agency: 'Aether Media',         followers: '8K',   diamonds: 2500,   level: 12, isLive: false, roomName: 'Nova Stage',    audienceCount: 0   },
    { id: '5', name: 'Zen Master',     agency: 'None (Independent)',   followers: '55K',  diamonds: 34000,  level: 31, isLive: true,  roomName: 'Zen Garden',    audienceCount: 145 },
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
        { id: 'A6',  name: 'Storm Rider',   type: 'VIP',   coins: 3200,  diamonds: 80,  level: 22, joinedAgo: '8m',  avatar: 'SR' },
        { id: 'A7',  name: 'Pulse King',    type: 'VIP',   coins: 9800,  diamonds: 310, level: 38, joinedAgo: '3m',  avatar: 'PK' },
        { id: 'A8',  name: 'Pixel Ghost',   type: 'GUEST', coins: 500,   diamonds: 0,   level: 9,  joinedAgo: '15m', avatar: 'PG' },
        { id: 'A9',  name: 'Neon Blade',    type: 'GUEST', coins: 200,   diamonds: 0,   level: 4,  joinedAgo: '25m', avatar: 'NB' },
        { id: 'A10', name: 'Dark Matter',   type: 'VIP',   coins: 22000, diamonds: 800, level: 51, joinedAgo: '1m',  avatar: 'DM' },
    ],
    '5': [
        { id: 'A11', name: 'Cyber Ghost',   type: 'GUEST', coins: 5500,  diamonds: 0,   level: 33, joinedAgo: '10m', avatar: 'CG' },
        { id: 'A12', name: 'Wave Rider',    type: 'VIP',   coins: 7800,  diamonds: 190, level: 27, joinedAgo: '4m',  avatar: 'WR' },
    ],
};

// ── Audience Room Modal ───────────────────────────────────────────────────────
function AudienceModal({ host, isOpen, onClose }: { host: any; isOpen: boolean; onClose: () => void }) {
    const [kicked, setKicked]         = useState<string[]>([]);
    const [roomClosed, setRoomClosed] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const audience = (mockAudience[host?.id] ?? []).filter(a => !kicked.includes(a.id));

    const handleKick = (id: string) => { setKicked(p => [...p, id]); if (selectedUser?.id === id) setSelectedUser(null); };
    const handleCloseRoom = () => { setRoomClosed(true); setTimeout(onClose, 1200); };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose} className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />

                    <motion.div initial={{ opacity: 0, scale: 0.93, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.93 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <div className="pointer-events-auto w-full max-w-2xl">
                            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-neon-red/30 via-transparent to-neon-cyan/20 blur-sm" />
                            <div className="relative rounded-2xl border border-neon-red/20 bg-dark-bg overflow-hidden">
                                {/* scanline */}
                                <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
                                    className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-neon-red to-transparent z-10" />

                                {/* Header */}
                                <div className="relative p-5 border-b border-card-border bg-gradient-to-br from-neon-red/5 to-transparent">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan font-black text-sm">
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
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-red/10 border border-neon-red/20">
                                                <Radio size={11} className="text-neon-red animate-pulse" />
                                                <span className="text-[10px] font-black text-neon-red uppercase tracking-widest">
                                                    {roomClosed ? 'CLOSED' : 'LIVE'}
                                                </span>
                                                <span className="text-[10px] font-black text-neon-red">· {audience.length}</span>
                                            </div>
                                            <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red border border-card-border text-text-muted text-xs transition-all flex items-center justify-center">✕</button>
                                        </div>
                                    </div>
                                    {/* Close Room Button */}
                                    <div className="mt-4">
                                        <button onClick={handleCloseRoom} disabled={roomClosed}
                                            className={cn("flex items-center gap-2 w-full justify-center py-2 rounded-lg border text-xs font-black uppercase tracking-widest transition-all",
                                                roomClosed
                                                    ? "bg-white/5 border-card-border text-text-muted cursor-not-allowed"
                                                    : "bg-neon-red/10 hover:bg-neon-red/20 border-neon-red/30 hover:border-neon-red/60 text-neon-red"
                                            )}>
                                            <DoorClosed size={14} />
                                            {roomClosed ? 'Room Closed' : 'Force Close Room'}
                                        </button>
                                    </div>
                                </div>

                                {/* Body: audience list + user detail */}
                                <div className="flex gap-0 divide-x divide-card-border" style={{ minHeight: 340 }}>
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
                                                className={cn(
                                                    "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all",
                                                    selectedUser?.id === a.id
                                                        ? "bg-neon-cyan/10 border-neon-cyan/30"
                                                        : "bg-white/[0.03] border-card-border hover:border-white/10 hover:bg-white/[0.05]"
                                                )}>
                                                <div className="flex items-center gap-2.5">
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border",
                                                        a.type === 'VIP'
                                                            ? "bg-neon-gold/10 border-neon-gold/30 text-neon-gold"
                                                            : "bg-white/5 border-card-border text-text-muted"
                                                    )}>
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
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleKick(a.id); }}
                                                    title="Kick from room"
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
                                                        <button onClick={() => setSelectedUser(null)} className="w-5 h-5 rounded-md bg-white/5 hover:bg-neon-red/20 hover:text-neon-red border border-card-border text-text-muted text-[10px] transition-all flex items-center justify-center">✕</button>
                                                    </div>
                                                    {/* Avatar */}
                                                    <div className="flex flex-col items-center mb-4">
                                                        <div className={cn(
                                                            "w-14 h-14 rounded-xl flex items-center justify-center font-black text-base border mb-2",
                                                            selectedUser.type === 'VIP'
                                                                ? "bg-neon-gold/10 border-neon-gold/30 text-neon-gold shadow-[0_0_14px_rgba(255,215,0,0.15)]"
                                                                : "bg-white/5 border-card-border text-text-muted"
                                                        )}>
                                                            {selectedUser.avatar}
                                                        </div>
                                                        <div className="font-black text-text-primary text-sm text-center">{selectedUser.name}</div>
                                                        <div className={cn("text-[9px] font-black uppercase tracking-widest mt-0.5",
                                                            selectedUser.type === 'VIP' ? "text-neon-gold" : "text-text-muted")}>
                                                            {selectedUser.type}
                                                        </div>
                                                    </div>
                                                    {/* Stats */}
                                                    <div className="space-y-1.5">
                                                        {[
                                                            { label: 'Level',     value: `LVL ${selectedUser.level}`,              color: 'text-neon-cyan'    },
                                                            { label: 'Joined',    value: `${selectedUser.joinedAgo} ago`,           color: 'text-text-primary' },
                                                            { label: 'Coins',     value: selectedUser.coins.toLocaleString(),       color: 'text-neon-gold'    },
                                                            { label: 'Diamonds',  value: selectedUser.diamonds.toLocaleString(),    color: 'text-neon-purple'  },
                                                        ].map(({ label, value, color }) => (
                                                            <div key={label} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-card-border">
                                                                <span className="text-[9px] uppercase tracking-widest text-text-muted">{label}</span>
                                                                <span className={cn("text-[10px] font-black", color)}>{value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {/* XP Bar */}
                                                    <div className="mt-3">
                                                        <div className="flex justify-between mb-1">
                                                            <span className="text-[9px] uppercase tracking-widest text-text-muted">XP</span>
                                                            <span className="text-[9px] text-neon-gold font-bold">{(selectedUser.level % 10) * 10}%</span>
                                                        </div>
                                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                            <motion.div initial={{ width: 0 }} animate={{ width: `${(selectedUser.level % 10) * 10}%` }}
                                                                transition={{ duration: 0.7 }} className="h-full bg-gradient-to-r from-neon-gold/60 to-neon-gold" />
                                                        </div>
                                                    </div>
                                                    {/* Kick Button */}
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
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HostManagementPage() {
    const [searchTerm, setSearchTerm]         = useState('');
    const [isFeatureModalOpen, setFeatureModal] = useState(false);
    const [audienceHost, setAudienceHost]     = useState<any>(null);

    const columns: Column<typeof mockHosts[0]>[] = [
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
            )
        },
        {
            header: 'Stream Status',
            accessor: (host) => (
                <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border",
                    host.isLive ? "text-neon-red border-neon-red/30 bg-neon-red/5" : "text-text-muted border-white/5 bg-white/5")}>
                    {host.isLive ? 'Live Now' : 'Offline'}
                </span>
            )
        },
        {
            header: 'Engagement',
            accessor: (host) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-text-primary">
                        <Heart size={12} className="text-neon-pink" />
                        <span className="font-bold">{host.followers}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-text-muted">
                        <Users size={10} /><span>Active Fanbase</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Diamond Wealth',
            accessor: (host) => (
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-purple shadow-[0_0_8px_rgba(191,0,255,0.6)]" />
                    <span className="text-neon-purple font-black tracking-wider text-sm">{host.diamonds.toLocaleString()}</span>
                </div>
            )
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
            )
        },
        {
            header: 'Operator Console',
            accessor: (host) => (
                <div className="flex items-center gap-1">
                    {/* Audience button — shows count badge */}
                    <button
                        title="View Room Audience"
                        onClick={(e) => { e.stopPropagation(); setAudienceHost(host); }}
                        className={cn(
                            "relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all",
                            host.isLive
                                ? "bg-neon-red/10 hover:bg-neon-red/20 border-neon-red/20 hover:border-neon-red/50 text-neon-red"
                                : "bg-white/5 border-card-border text-text-muted cursor-not-allowed opacity-50"
                        )}
                        disabled={!host.isLive}
                    >
                        <Users size={13} />
                        {host.isLive && (
                            <span className="font-black">{host.audienceCount}</span>
                        )}
                    </button>
                    <button title="View Stream" className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all border border-transparent hover:border-neon-cyan/30">
                        <Mic2 size={14} />
                    </button>
                    <button title="Security Audit" className="p-2 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red transition-all border border-transparent hover:border-neon-red/30">
                        <ShieldAlert size={14} />
                    </button>
                </div>
            )
        }
    ];

    const filtered = mockHosts.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.agency.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PageContainer>
            <PageHeader
                title="Host Registry & Performance"
                description="Monitoring live status and engagement metrics of all platform entertainers"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <NeonInput placeholder="Scan host alias..." value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} icon={<Search size={16} />} className="h-10" />
                        </div>
                        <GlowButton variant="purple" size="sm" className="flex items-center gap-2" onClick={() => setFeatureModal(true)}>
                            <Star size={16} /> Feature Host
                        </GlowButton>
                    </div>
                }
            />

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
                className="glass-card p-1 rounded-2xl border border-neon-cyan/10">
                <NeonTable columns={columns} data={filtered} onRowClick={(host) => host.isLive && setAudienceHost(host)} />
            </motion.div>

            <AudienceModal host={audienceHost} isOpen={!!audienceHost} onClose={() => setAudienceHost(null)} />

            <NeonModal isOpen={isFeatureModalOpen} onClose={() => setFeatureModal(false)} title="Feature Global Host"
                description="Highlight a top-performing host on the application's main landing dashboard." variant="purple"
                actions={<GlowButton variant="purple" onClick={() => setFeatureModal(false)} className="flex items-center gap-2"><Check size={16} /> Execute Promotion</GlowButton>}
            >
                <div className="space-y-4">
                    <NeonInput label="Host Identity" placeholder="e.g. Luna Divine" icon={<Users size={16} />} />
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Promotion Duration</label>
                        <select className="w-full bg-dark-bg/50 border border-card-border rounded-lg h-10 px-3 text-sm text-text-primary focus:outline-none focus:border-neon-purple/50 transition-all">
                            <option value="24H">24 Standard Hours</option>
                            <option value="48H">48 Standard Hours</option>
                            <option value="7D">1 Planetary Cycle (7 Days)</option>
                        </select>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}