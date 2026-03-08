'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { NeonInput } from '@/components/gaming/NeonInput';
import { Sword, Zap, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LivePulse } from '@/components/gaming/LivePulse';

const myPKs = [
    { id: 'PK-H01', opponent: 'Shadow Dancer', myScore: 14200, opponentScore: 9800, result: 'WON', diamonds: 9999, date: '2024-03-07 21:00' },
    { id: 'PK-H02', opponent: 'Void Shadow', myScore: 8200, opponentScore: 11400, result: 'LOST', diamonds: 0, date: '2024-03-07 19:30' },
    { id: 'PK-H03', opponent: 'Crystal Star', myScore: 21000, opponentScore: 18400, result: 'WON', diamonds: 5000, date: '2024-03-06 22:00' },
    { id: 'PK-H04', opponent: 'Neon King', myScore: 0, opponentScore: 0, result: 'LIVE', diamonds: 0, date: '2024-03-07 22:30' },
];

export default function HostPKBattlesPage() {
    const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
    const columns: Column<typeof myPKs[0]>[] = [
        {
            header: 'Battle ID', accessor: (pk) => (
                <div className="flex items-center gap-2">
                    <Sword size={13} className="text-neon-red" />
                    <span className="font-black text-xs">{pk.id}</span>
                    {pk.result === 'LIVE' && <LivePulse />}
                </div>
            )
        },
        { header: 'Opponent', accessor: (pk) => <span className="font-bold text-sm text-neon-purple">{pk.opponent}</span> },
        {
            header: 'Score', accessor: (pk) => (
                <div className="text-xs">
                    <span className="text-neon-cyan font-black">{pk.myScore.toLocaleString()}</span>
                    <span className="text-text-muted mx-2">vs</span>
                    <span className="text-neon-red font-black">{pk.opponentScore.toLocaleString()}</span>
                </div>
            )
        },
        {
            header: 'Diamonds Won', accessor: (pk) => (
                pk.diamonds > 0 ? (
                    <div className="flex items-center gap-1"><Zap size={12} className="text-neon-gold" /><span className="text-neon-gold font-black">{pk.diamonds.toLocaleString()}</span></div>
                ) : <span className="text-text-muted text-xs">—</span>
            )
        },
        { header: 'Date', accessor: (pk) => <span className="text-[10px] text-text-muted font-mono">{pk.date}</span> },
        { header: 'Result', accessor: (pk) => <NeonBadge variant={pk.result === 'WON' ? 'gold' : pk.result === 'LIVE' ? 'red' : 'muted'}>{pk.result === 'WON' ? '👑 WON' : pk.result}</NeonBadge> }
    ];
    return (
        <PageContainer>
            <PageHeader title="My PK Battle History" description="Results and performance stats from all your PK duels"
                actions={<GlowButton variant="red" size="sm" className="flex items-center gap-2" onClick={() => setIsChallengeModalOpen(true)}><Sword size={16} /> Challenge Opponent</GlowButton>} />
            <div className="grid grid-cols-4 gap-5 mb-8">
                {[{ label: 'Total PK', value: '42', c: 'cyan' }, { label: 'Victories', value: '28', c: 'gold' }, { label: 'Win Rate', value: '66.7%', c: 'green' }, { label: 'Diamonds Won', value: '124K', c: 'purple' }].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="glass-card p-5 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{s.label}</p>
                        <p className={cn("text-2xl font-black", s.c === 'gold' ? "text-neon-gold" : s.c === 'green' ? "text-neon-green" : s.c === 'cyan' ? "text-neon-cyan" : "text-neon-purple")}>{s.value}</p>
                    </motion.div>
                ))}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-1 rounded-2xl border border-neon-red/10">
                <NeonTable columns={columns} data={myPKs} />
            </motion.div>

            <NeonModal
                isOpen={isChallengeModalOpen}
                onClose={() => setIsChallengeModalOpen(false)}
                title="Challenge an Opponent"
                description="Invite another host to a real-time PK battle."
                variant="red"
                actions={
                    <GlowButton variant="red" onClick={() => setIsChallengeModalOpen(false)} className="flex items-center gap-2">
                        <UserPlus size={16} />
                        Send Challenge
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <NeonInput label="Opponent User ID" placeholder="Who are you challenging?" />
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Battle Duration</label>
                        <select className="w-full bg-dark-bg/50 border border-card-border rounded-lg h-10 px-3 text-sm text-text-primary focus:outline-none focus:border-neon-red/50 focus:shadow-[0_0_10px_rgba(255,0,0,0.1)] transition-all">
                            <option value="5m">5 Minutes (Blitz)</option>
                            <option value="15m">15 Minutes (Standard)</option>
                            <option value="30m">30 Minutes (Epic)</option>
                        </select>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
