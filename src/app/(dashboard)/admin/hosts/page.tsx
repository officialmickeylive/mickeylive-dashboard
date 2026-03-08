'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { LivePulse } from '@/components/gaming/LivePulse';
import { Search, Mic2, Users, Heart, Star, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock Data — Admin view-only host list (under agencies)
const mockHosts = [
    { id: '1', name: 'Luna Divine', agency: 'Stellar Talent', followers: '125K', diamonds: 85000, level: 45, isLive: true },
    { id: '2', name: 'Shadow Dancer', agency: 'Neon Streamers', followers: '42K', diamonds: 12000, level: 22, isLive: false },
    { id: '3', name: 'Cyber Queen', agency: 'Stellar Talent', followers: '210K', diamonds: 450000, level: 68, isLive: true },
    { id: '4', name: 'Nova Spark', agency: 'Aether Media', followers: '8K', diamonds: 2500, level: 12, isLive: false },
    { id: '5', name: 'Zen Master', agency: 'Galaxy Entertainment', followers: '55K', diamonds: 34000, level: 31, isLive: true },
];

export default function AdminHostsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const columns: Column<typeof mockHosts[0]>[] = [
        {
            header: 'Host Identity',
            accessor: (host) => (
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan font-black text-xs overflow-hidden">
                            {host.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {host.isLive && (
                            <div className="absolute -bottom-1 -right-1">
                                <LivePulse />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="font-bold text-text-primary text-sm flex items-center gap-2">
                            {host.name}
                            {host.level > 50 && <Star size={12} className="text-neon-gold fill-neon-gold" />}
                        </div>
                        <div className="text-[10px] text-text-muted font-medium">{host.agency}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Stream Status',
            accessor: (host) => (
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border",
                        host.isLive
                            ? "text-neon-red border-neon-red/30 bg-neon-red/5"
                            : "text-text-muted border-white/5 bg-white/5"
                    )}>
                        {host.isLive ? 'Live Now' : 'Offline'}
                    </span>
                </div>
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
                        <Users size={10} />
                        <span>Active Fanbase</span>
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
    ];

    return (
        <PageContainer>
            <PageHeader
                title="Host Directory"
                description="View-only mode — browse host profiles and metrics across assigned agencies"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <NeonInput
                                placeholder="Search host name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<Search size={16} />}
                                className="h-10"
                            />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-neon-purple/10 border border-neon-purple/30 rounded-xl text-neon-purple">
                            <Eye size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">View Only</span>
                        </div>
                    </div>
                }
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                {[
                    { label: 'Total Hosts', value: '342', color: 'cyan' },
                    { label: 'Currently Live', value: '89', color: 'red' },
                    { label: 'Avg Followers', value: '48K', color: 'purple' },
                    { label: 'Elite Hosts', value: '12', color: 'gold' },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="glass-card p-5 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{s.label}</p>
                        <p className="text-2xl font-black text-text-primary">{s.value}</p>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-card p-1 rounded-2xl border border-neon-cyan/10"
            >
                <NeonTable
                    columns={columns}
                    data={mockHosts}
                />
            </motion.div>
        </PageContainer>
    );
}
