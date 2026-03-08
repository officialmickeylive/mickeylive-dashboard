'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Search, Crown, Medal, Gem, TrendingUp, Zap, Award, RefreshCw, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const mockLeaderboard = [
    { id: 'LB-1', rank: 1, user: 'Luna Divine', xp: 984200, diamonds: 125000, giftsReceived: 8900, hostLevel: 'DIAMOND_ELITE', region: 'GLOBAL' },
    { id: 'LB-2', rank: 2, user: 'Cyber Queen', xp: 872400, diamonds: 98000, giftsReceived: 7200, hostLevel: 'DIAMOND', region: 'GLOBAL' },
    { id: 'LB-3', rank: 3, user: 'Nova Spark', xp: 754100, diamonds: 81000, giftsReceived: 6100, hostLevel: 'PLATINUM', region: 'REGIONAL' },
    { id: 'LB-4', rank: 4, user: 'Shadow Dancer', xp: 680900, diamonds: 72000, giftsReceived: 5400, hostLevel: 'PLATINUM', region: 'GLOBAL' },
    { id: 'LB-5', rank: 5, user: 'Zion Sentinel', xp: 590200, diamonds: 58000, giftsReceived: 4200, hostLevel: 'GOLD', region: 'REGIONAL' },
];

const rankIcons: Record<number, React.ReactNode> = {
    1: <Crown size={16} className="text-neon-gold" />,
    2: <Medal size={16} className="text-slate-300" />,
    3: <Medal size={16} className="text-amber-600" />,
};

export default function LeaderboardsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshModalOpen, setIsRefreshModalOpen] = useState(false);

    const columns: Column<typeof mockLeaderboard[0]>[] = [
        {
            header: 'Rank',
            accessor: (e) => (
                <div className="flex items-center gap-2">
                    {rankIcons[e.rank] || <span className="text-text-muted font-black text-xs w-4 text-center">#{e.rank}</span>}
                    {!rankIcons[e.rank] && null}
                    {rankIcons[e.rank] && null}
                    <span className={cn("font-black text-base",
                        e.rank === 1 ? "text-neon-gold" : e.rank === 2 ? "text-slate-300" : e.rank === 3 ? "text-amber-600" : "text-text-muted")}>
                        {rankIcons[e.rank] ? '' : `#${e.rank}`}
                    </span>
                </div>
            )
        },
        {
            header: 'Champion',
            accessor: (e) => (
                <div>
                    <div className="font-bold text-sm text-text-primary">{e.user}</div>
                    <div className="text-[9px] text-text-muted uppercase font-bold tracking-widest">{e.region}</div>
                </div>
            )
        },
        {
            header: 'Total XP',
            accessor: (e) => (
                <div className="flex items-center gap-1">
                    <Zap size={12} className="text-neon-gold" />
                    <span className="text-neon-gold font-black text-sm">{e.xp.toLocaleString()}</span>
                </div>
            )
        },
        {
            header: 'Diamonds Earned',
            accessor: (e) => (
                <div className="flex items-center gap-1">
                    <Gem size={12} className="text-neon-purple" />
                    <span className="text-neon-purple font-bold text-sm">{e.diamonds.toLocaleString()}</span>
                </div>
            )
        },
        {
            header: 'Gifts Received',
            accessor: (e) => (
                <div className="flex items-center gap-1">
                    <Award size={12} className="text-neon-cyan" />
                    <span className="text-text-primary font-bold text-sm">{e.giftsReceived.toLocaleString()}</span>
                </div>
            )
        },
        {
            header: 'Host Tier',
            accessor: (e) => (
                <NeonBadge variant={
                    e.hostLevel === 'DIAMOND_ELITE' ? 'gold' :
                        e.hostLevel === 'DIAMOND' ? 'purple' :
                            e.hostLevel === 'PLATINUM' ? 'cyan' : 'green'
                }>
                    {e.hostLevel.replace('_', ' ')}
                </NeonBadge>
            )
        }
    ];

    return (
        <PageContainer>
            <PageHeader
                title="Global Leaderboard Matrix"
                description="Top-ranked hosts, highest earners, and most-gifted creators worldwide"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-60">
                            <NeonInput placeholder="Search champion..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} icon={<Search size={16} />} className="h-10" />
                        </div>
                        <GlowButton variant="gold" size="sm" className="flex items-center gap-2" onClick={() => setIsRefreshModalOpen(true)}>
                            <RefreshCw size={16} /> Refresh Rankings
                        </GlowButton>
                    </div>
                }
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                {[
                    { label: 'Total Champions', value: '48,200', color: 'gold', icon: Crown },
                    { label: 'Diamonds Circulated', value: '2.4M', color: 'purple', icon: Gem },
                    { label: 'Gifts Given (Day)', value: '84,000', color: 'cyan', icon: Award },
                    { label: 'Top XP (Week)', value: '984K', color: 'green', icon: TrendingUp },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="glass-card p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{s.label}</p>
                        <p className="text-2xl font-black text-text-primary">{s.value}</p>
                        <s.icon size={20} className={cn("absolute top-4 right-4 opacity-20",
                            s.color === 'gold' ? "text-neon-gold" : s.color === 'purple' ? "text-neon-purple" :
                                s.color === 'cyan' ? "text-neon-cyan" : "text-neon-green")} />
                    </motion.div>
                ))}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                className="glass-card p-1 rounded-2xl border border-neon-gold/10">
                <NeonTable columns={columns} data={mockLeaderboard} />
            </motion.div>

            <NeonModal
                isOpen={isRefreshModalOpen}
                onClose={() => setIsRefreshModalOpen(false)}
                title="Refresh Matrix"
                description="Trigger a manual recalculation of the global leaderboard matrix."
                variant="gold"
                actions={
                    <GlowButton variant="gold" onClick={() => setIsRefreshModalOpen(false)} className="flex items-center gap-2">
                        <Check size={16} />
                        Confirm Refresh
                    </GlowButton>
                }
            >
                <div className="text-sm text-text-primary p-4 border border-neon-gold/20 bg-neon-gold/5 rounded-xl">
                    <p>This will instantly sync with the latest cache from Redis and update the displayed rankings.</p>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
