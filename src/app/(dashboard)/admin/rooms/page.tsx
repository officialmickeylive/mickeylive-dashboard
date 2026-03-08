'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { LivePulse } from '@/components/gaming/LivePulse';
import { Search, Mic2, Users, Radio, Video, Eye, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock Data — Scoped to admin's assigned agencies only
const adminAssignedAgencies = ['Stellar Talent', 'Galaxy Entertainment', 'Neon Streamers'];

const mockRooms = [
    { id: 'RM-501', title: 'Late Night Chill & Chill', host: 'Luna Divine', agency: 'Stellar Talent', type: 'SOLO_LIVE', viewers: 1200, category: 'CHAT', status: 'ACTIVE' },
    { id: 'RM-502', title: 'Morning Talk Show', host: 'Shadow Dancer', agency: 'Neon Streamers', type: 'SOLO_LIVE', viewers: 540, category: 'CHAT', status: 'ACTIVE' },
    { id: 'RM-503', title: 'Talent Show Extravaganza', host: 'Cyber Queen', agency: 'Stellar Talent', type: 'MULTI_LIVE', viewers: 8900, category: 'TALENT', status: 'ACTIVE' },
    { id: 'RM-504', title: 'Music & Vibes', host: 'Aria Chen', agency: 'Galaxy Entertainment', type: 'SOLO_LIVE', viewers: 3100, category: 'MUSIC', status: 'ACTIVE' },
    { id: 'RM-505', title: 'PK Battle: Zen vs Nova', host: 'Zen Master', agency: 'Galaxy Entertainment', type: 'PK_BATTLE', viewers: 4500, category: 'GAMING', status: 'FLAGGED' },
];

export default function AdminRoomInfoPage() {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter rooms to only those from assigned agencies
    const scopedRooms = mockRooms.filter(room => adminAssignedAgencies.includes(room.agency));

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
            header: 'Agency',
            accessor: (room) => (
                <NeonBadge variant="purple">{room.agency}</NeonBadge>
            )
        },
        {
            header: 'Type',
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
            header: 'Audience',
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
            header: 'Status',
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
    ];

    return (
        <PageContainer>
            <PageHeader
                title="Room Info — Scoped View"
                description="Viewing rooms registered under your assigned agencies only"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <NeonInput
                                placeholder="Search room or host..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<Search size={16} />}
                                className="h-10"
                            />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-neon-gold/10 border border-neon-gold/30 rounded-xl text-neon-gold">
                            <Lock size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Scoped Access</span>
                        </div>
                    </div>
                }
            />

            {/* Assigned Agencies Bar */}
            <div className="mb-6 px-4 py-3 bg-glass rounded-xl border border-card-border flex items-center gap-3 flex-wrap">
                <Eye size={14} className="text-neon-cyan" />
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Viewing agencies:</span>
                {adminAssignedAgencies.map((agency, i) => (
                    <span key={i} className="text-[10px] font-bold text-neon-cyan bg-neon-cyan/10 px-2 py-1 rounded-lg border border-neon-cyan/20">
                        {agency}
                    </span>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                {[
                    { label: 'Active Rooms', value: scopedRooms.filter(r => r.status === 'ACTIVE').length.toString(), color: 'cyan' },
                    { label: 'Total Viewers', value: scopedRooms.reduce((acc, r) => acc + r.viewers, 0).toLocaleString(), color: 'purple' },
                    { label: 'Flagged', value: scopedRooms.filter(r => r.status === 'FLAGGED').length.toString(), color: 'red' },
                    { label: 'Agencies Assigned', value: adminAssignedAgencies.length.toString(), color: 'gold' },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="glass-card p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{s.label}</p>
                        <p className="text-2xl font-black text-text-primary">{s.value}</p>
                        <div className={cn(
                            "absolute top-0 right-0 w-1 h-full",
                            s.color === 'cyan' ? "bg-neon-cyan" : s.color === 'purple' ? "bg-neon-purple" :
                                s.color === 'red' ? "bg-neon-red" : "bg-neon-gold"
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
                    data={scopedRooms}
                />
            </motion.div>
        </PageContainer>
    );
}
