'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { LivePulse } from '@/components/gaming/LivePulse';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Search, Mic2, Users, Radio, ShieldAlert, Monitor, MessageSquare, Video, Skull } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock Data for Room Management
const mockRooms = [
    { id: 'RM-501', title: 'Late Night Chill & Chill', host: 'Luna Divine', type: 'SOLO_LIVE', viewers: 1200, category: 'CHAT', status: 'ACTIVE' },
    { id: 'RM-502', title: 'Epic PK Battle: Shadow vs Cipher', host: 'Shadow Dancer', type: 'PK_BATTLE', viewers: 4500, category: 'GAMING', status: 'ACTIVE' },
    { id: 'RM-503', title: 'Talent Show Extravaganza', host: 'Cyber Queen', type: 'MULTI_LIVE', viewers: 8900, category: 'TALENT', status: 'ACTIVE' },
    { id: 'RM-504', title: 'Chill Vibes Only - No Toxicity', host: 'Zen Master', type: 'SOLO_LIVE', viewers: 540, category: 'RELAX', status: 'FLAGGED' },
    { id: 'RM-505', title: 'Music Request Night', host: 'Nova Spark', type: 'SOLO_LIVE', viewers: 3100, category: 'MUSIC', status: 'ACTIVE' },
];

export default function RoomManagementPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isTerminationModalOpen, setIsTerminationModalOpen] = useState(false);

    const columns: Column<typeof mockRooms[0]>[] = [
        {
            header: 'Stream Identity',
            accessor: (room) => (
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan font-black text-xs overflow-hidden">
                            <Video size={20} />
                        </div>
                        <div className="absolute -top-1 -left-1">
                            <LivePulse />
                        </div>
                    </div>
                    <div>
                        <div className="font-bold text-text-primary text-sm line-clamp-1">{room.title}</div>
                        <div className="text-[10px] text-text-muted font-medium flex items-center gap-1">
                            <Mic2 size={10} />
                            {room.host}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Matrix Classification',
            accessor: (room) => (
                <NeonBadge variant={
                    room.type === 'PK_BATTLE' ? 'red' :
                        room.type === 'MULTI_LIVE' ? 'gold' : 'cyan'
                }>
                    {room.type.replace('_', ' ')}
                </NeonBadge>
            )
        },
        {
            header: 'Audience Load',
            accessor: (room) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-text-primary">
                        <Users size={12} className="text-neon-cyan" />
                        <span className="font-bold">{room.viewers.toLocaleString()}</span>
                    </div>
                    <div className="h-1 w-16 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-neon-cyan" style={{ width: `${Math.min(100, (room.viewers / 10000) * 100)}%` }} />
                    </div>
                </div>
            )
        },
        {
            header: 'Sector',
            accessor: (room) => (
                <div className="flex items-center gap-2 text-[10px] text-text-muted font-black uppercase tracking-widest">
                    <Radio size={10} className="text-neon-purple" />
                    {room.category}
                </div>
            )
        },
        {
            header: 'System Status',
            accessor: (room) => (
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        room.status === 'ACTIVE' ? "bg-neon-green shadow-[0_0_8px_rgba(0,255,100,0.5)]" : "bg-neon-red shadow-[0_0_8px_rgba(255,0,0,0.5)]"
                    )} />
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em]",
                        room.status === 'ACTIVE' ? "text-neon-green" : "text-neon-red"
                    )}>
                        {room.status}
                    </span>
                </div>
            )
        },
        {
            header: 'Console Actions',
            accessor: (room) => (
                <div className="flex items-center gap-2">
                    <button title="Intercept Stream" className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all border border-transparent hover:border-neon-cyan/30">
                        <Monitor size={14} />
                    </button>
                    <button title="Mod Console" className="p-2 rounded-lg bg-white/5 hover:bg-neon-purple/20 hover:text-neon-purple transition-all border border-transparent hover:border-neon-purple/30">
                        <MessageSquare size={14} />
                    </button>
                    <button title="Security Termination" className="p-2 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red transition-all border border-transparent hover:border-neon-red/30">
                        <ShieldAlert size={14} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <PageContainer>
            <PageHeader
                title="Live Instance Control"
                description="Real-time oversight of streaming rooms, PK battles, and moderated content"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <NeonInput
                                placeholder="Scan room ID or host..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<Search size={16} />}
                                className="h-10"
                            />
                        </div>
                        <GlowButton variant="red" size="sm" className="flex items-center gap-2" onClick={() => setIsTerminationModalOpen(true)}>
                            <ShieldAlert size={16} />
                            Global Termination
                        </GlowButton>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Active Streams', value: '1,245', sub: 'running instances', color: 'cyan' },
                    { label: 'Total Viewers', value: '42.8K', sub: 'concurrent users', color: 'purple' },
                    { label: 'PK Sessions', value: '84', sub: 'active battles', color: 'red' },
                    { label: 'Bandwidth', value: '1.2 Tbps', sub: 'network load', color: 'gold' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-5 rounded-2xl border border-white/5 relative overflow-hidden group"
                    >
                        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest relative z-10">{stat.label}</p>
                        <p className="text-2xl font-black text-text-primary tracking-tight relative z-10">{stat.value}</p>
                        <p className="text-[10px] text-text-muted font-medium italic relative z-10">{stat.sub}</p>
                        <div className={cn(
                            "absolute top-0 right-0 w-1 h-full",
                            stat.color === 'cyan' ? "bg-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.5)]" :
                                stat.color === 'purple' ? "bg-neon-purple shadow-[0_0_10px_rgba(191,0,255,0.5)]" :
                                    stat.color === 'red' ? "bg-neon-red shadow-[0_0_10px_rgba(255,0,0,0.5)]" :
                                        "bg-neon-gold shadow-[0_0_10px_rgba(255,200,0,0.5)]"
                        )} />
                        <div className={cn(
                            "absolute -right-8 -bottom-8 w-24 h-24 rounded-full blur-[40px] opacity-10 transition-opacity group-hover:opacity-20",
                            stat.color === 'cyan' ? "bg-neon-cyan" :
                                stat.color === 'purple' ? "bg-neon-purple" :
                                    stat.color === 'red' ? "bg-neon-red" : "bg-neon-gold"
                        )} />
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-card p-1 rounded-2xl border border-neon-cyan/10"
            >
                <NeonTable
                    columns={columns}
                    data={mockRooms}
                    onRowClick={(room) => console.log('Instance intercept:', room.id)}
                />
            </motion.div>

            <NeonModal
                isOpen={isTerminationModalOpen}
                onClose={() => setIsTerminationModalOpen(false)}
                title="Global Termination Override"
                description="Forcefully terminate an active streaming sub-instance immediately."
                variant="red"
                actions={
                    <GlowButton variant="red" onClick={() => setIsTerminationModalOpen(false)} className="flex items-center gap-2">
                        <Skull size={16} /> Execute Termination
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <NeonInput label="Room Matrix ID" placeholder="e.g. RM-501" icon={<Video size={16} />} />
                    <div className="text-sm text-text-primary p-4 border border-neon-red/20 bg-neon-red/5 rounded-xl">
                        <p>WARNING: This action drops all connections, destroys the room instance, and flags the host account automatically.</p>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
