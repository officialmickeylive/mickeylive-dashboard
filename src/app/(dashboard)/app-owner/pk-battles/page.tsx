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
import { Search, Sword, Trophy, Zap, Shield, Users, Timer, Crown, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const mockBattles = [
    { id: 'PK-001', challenger: 'Luna Divine', opponent: 'Shadow Dancer', challengerScore: 12400, opponentScore: 9800, viewers: 4500, duration: '14:22', status: 'LIVE', winner: null },
    { id: 'PK-002', challenger: 'Cyber Queen', opponent: 'Zion Sentinel', challengerScore: 35000, opponentScore: 28700, viewers: 8900, duration: '30:00', status: 'COMPLETED', winner: 'Cyber Queen' },
    { id: 'PK-003', challenger: 'Nova Spark', opponent: 'Void Nexus', challengerScore: 6200, opponentScore: 7800, viewers: 2100, duration: '08:45', status: 'LIVE', winner: null },
    { id: 'PK-004', challenger: 'Aether Star', opponent: 'Crystal Rose', challengerScore: 0, opponentScore: 0, viewers: 0, duration: '00:00', status: 'PENDING', winner: null },
];

export default function PKBattleManagementPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isForceEndModalOpen, setIsForceEndModalOpen] = useState(false);

    const columns: Column<typeof mockBattles[0]>[] = [
        {
            header: 'Battle Instance',
            accessor: (battle) => (
                <div className="flex items-center gap-2">
                    <Sword size={14} className="text-neon-red" />
                    <span className="text-text-primary font-black tracking-widest text-xs">{battle.id}</span>
                    {battle.status === 'LIVE' && <LivePulse />}
                </div>
            )
        },
        {
            header: 'Combat Pair',
            accessor: (battle) => (
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <div className="font-bold text-neon-cyan text-xs">{battle.challenger}</div>
                        <div className="text-[9px] text-neon-gold font-black">{battle.challengerScore.toLocaleString()} pts</div>
                    </div>
                    <div className="text-neon-red font-black text-sm">VS</div>
                    <div className="text-left">
                        <div className="font-bold text-neon-purple text-xs">{battle.opponent}</div>
                        <div className="text-[9px] text-neon-gold font-black">{battle.opponentScore.toLocaleString()} pts</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Audience',
            accessor: (battle) => (
                <div className="flex items-center gap-1">
                    <Users size={12} className="text-neon-cyan" />
                    <span className="text-text-primary font-bold text-sm">{battle.viewers.toLocaleString()}</span>
                </div>
            )
        },
        {
            header: 'Duration',
            accessor: (battle) => (
                <div className="flex items-center gap-1 text-text-muted text-xs font-mono">
                    <Timer size={12} className="text-neon-gold" />
                    {battle.duration}
                </div>
            )
        },
        {
            header: 'Combat Status',
            accessor: (battle) => (
                <NeonBadge variant={
                    battle.status === 'LIVE' ? 'red' :
                        battle.status === 'COMPLETED' ? 'green' : 'cyan'
                }>
                    {battle.status}
                </NeonBadge>
            )
        },
        {
            header: 'Victor',
            accessor: (battle) => battle.winner ? (
                <div className="flex items-center gap-1">
                    <Crown size={12} className="text-neon-gold" />
                    <span className="text-neon-gold font-black text-xs">{battle.winner}</span>
                </div>
            ) : <span className="text-text-muted text-xs italic">In Progress</span>
        },
        {
            header: 'Actions',
            accessor: (battle) => (
                <div className="flex items-center gap-2">
                    <button title="Intervene" className="p-2 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red transition-all border border-transparent hover:border-neon-red/30">
                        <Shield size={14} />
                    </button>
                    <button title="Award Trophy" className="p-2 rounded-lg bg-white/5 hover:bg-neon-gold/20 hover:text-neon-gold transition-all border border-transparent hover:border-neon-gold/30">
                        <Trophy size={14} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <PageContainer>
            <PageHeader
                title="PK Battle Arena Control"
                description="Live oversight of challenger duels, scoring, and combat moderation"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <NeonInput placeholder="Search battle ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} icon={<Search size={16} />} className="h-10" />
                        </div>
                        <GlowButton variant="red" size="sm" className="flex items-center gap-2" onClick={() => setIsForceEndModalOpen(true)}>
                            <Zap size={16} /> Force End Battle
                        </GlowButton>
                    </div>
                }
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
                {[
                    { label: 'Live Battles', value: '84', color: 'red', icon: Sword },
                    { label: 'Today\'s Battles', value: '1,240', color: 'gold', icon: Trophy },
                    { label: 'Avg. Viewers/PK', value: '3.8K', color: 'cyan', icon: Users },
                    { label: 'Total Diamonds', value: '2.4M', color: 'purple', icon: Zap },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="glass-card p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{s.label}</p>
                        <p className="text-2xl font-black text-text-primary tracking-tight">{s.value}</p>
                        <s.icon size={20} className={cn("absolute top-4 right-4 opacity-30",
                            s.color === 'red' ? "text-neon-red" : s.color === 'gold' ? "text-neon-gold" :
                                s.color === 'cyan' ? "text-neon-cyan" : "text-neon-purple")} />
                    </motion.div>
                ))}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                className="glass-card p-1 rounded-2xl border border-neon-red/10">
                <NeonTable columns={columns} data={mockBattles} onRowClick={(b) => console.log('Battle intercept:', b.id)} />
            </motion.div>

            <NeonModal
                isOpen={isForceEndModalOpen}
                onClose={() => setIsForceEndModalOpen(false)}
                title="Force End PK Battle"
                description="Instantly terminate a live PK Battle. Diamond payouts will be withheld pending review."
                variant="red"
                actions={
                    <GlowButton variant="red" onClick={() => setIsForceEndModalOpen(false)} className="flex items-center gap-2">
                        <Check size={16} />
                        Execute Termination
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <NeonInput label="Target Battle ID" placeholder="e.g. PK-001" icon={<Sword size={16} />} />
                    <div className="text-sm text-text-primary p-4 border border-neon-red/20 bg-neon-red/5 rounded-xl">
                        <p>This action will immediately disconnect both users from the PK Session and broadcast a termination event to viewers.</p>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
