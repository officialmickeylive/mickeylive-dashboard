'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Search, Mic2, Star, Eye, UserMinus, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const myHosts = [
    { id: 'H-01', name: 'Luna Divine', level: 'DIAMOND_ELITE', diamonds: 125000, giftsReceived: 8900, status: 'LIVE' },
    { id: 'H-02', name: 'Nova Spark', level: 'PLATINUM', diamonds: 81000, giftsReceived: 6100, status: 'ONLINE' },
    { id: 'H-03', name: 'Cyber Rose', level: 'GOLD', diamonds: 42000, giftsReceived: 3200, status: 'OFFLINE' },
    { id: 'H-04', name: 'Aether Glow', level: 'SILVER', diamonds: 18000, giftsReceived: 1400, status: 'ONLINE' },
];

export default function AgencyHostManagementPage() {
    const [search, setSearch] = useState('');
    const [isRecruitModalOpen, setIsRecruitModalOpen] = useState(false);
    const columns: Column<typeof myHosts[0]>[] = [
        {
            header: 'Host', accessor: (h) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan font-black">{h.name[0]}</div>
                    <div><div className="font-bold text-sm text-text-primary">{h.name}</div><div className="text-[10px] text-text-muted">{h.level.replace('_', ' ')}</div></div>
                </div>
            )
        },
        { header: 'Level', accessor: (h) => <NeonBadge variant={h.level === 'DIAMOND_ELITE' ? 'gold' : h.level === 'PLATINUM' ? 'cyan' : h.level === 'GOLD' ? 'green' : 'muted'}>{h.level.replace('_', ' ')}</NeonBadge> },
        { header: 'Diamonds', accessor: (h) => <span className="text-neon-purple font-black">{h.diamonds.toLocaleString()}</span> },
        { header: 'Gifts', accessor: (h) => <span className="text-neon-gold font-bold">{h.giftsReceived.toLocaleString()}</span> },
        {
            header: 'Status', accessor: (h) => (
                <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", h.status === 'LIVE' ? "bg-neon-red shadow-[0_0_6px_rgba(255,0,0,0.5)]" : h.status === 'ONLINE' ? "bg-neon-green" : "bg-white/20")} />
                    <span className={cn("text-[10px] font-black uppercase tracking-widest", h.status === 'LIVE' ? "text-neon-red" : h.status === 'ONLINE' ? "text-neon-green" : "text-text-muted")}>{h.status}</span>
                </div>
            )
        },
        {
            header: 'Actions', accessor: () => (
                <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all"><Eye size={14} /></button>
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-neon-gold/20 hover:text-neon-gold transition-all"><Star size={14} /></button>
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red transition-all"><UserMinus size={14} /></button>
                </div>
            )
        }
    ];
    return (
        <PageContainer>
            <PageHeader title="My Host Roster" description="Manage your agency's talent — performance, status, and commission"
                actions={<div className="flex gap-3"><div className="w-60"><NeonInput placeholder="Search hosts..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search size={16} />} className="h-10" /></div><GlowButton variant="cyan" size="sm" className="flex items-center gap-2" onClick={() => setIsRecruitModalOpen(true)}><Mic2 size={16} /> Recruit Host</GlowButton></div>} />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-1 rounded-2xl border border-neon-cyan/10">
                <NeonTable columns={columns} data={myHosts} />
            </motion.div>

            <NeonModal
                isOpen={isRecruitModalOpen}
                onClose={() => setIsRecruitModalOpen(false)}
                title="Recruit Talent"
                description="Invite an existing user to join your agency as an official Streamer/Host."
                variant="cyan"
                actions={
                    <GlowButton variant="cyan" onClick={() => setIsRecruitModalOpen(false)} className="flex items-center gap-2">
                        <UserPlus size={16} />
                        Send Invitation
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <NeonInput label="Talent User ID" placeholder="e.g. User#9102" />
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Commission Split</label>
                        <select className="w-full bg-dark-bg/50 border border-card-border rounded-lg h-10 px-3 text-sm text-text-primary focus:outline-none focus:border-neon-cyan/50 focus:shadow-[0_0_10px_rgba(0,255,255,0.1)] transition-all">
                            <option value="50_50">Standard (50% / 50%)</option>
                            <option value="60_40">Premium (60% Host / 40% Agency)</option>
                            <option value="70_30">VIP (70% Host / 30% Agency)</option>
                        </select>
                    </div>
                    <div className="pt-2 border-t border-white/5">
                        <p className="text-xs text-text-muted mb-2">An invitation will be sent for the user to accept.</p>
                    </div>
                </div>
            </NeonModal>
        </PageContainer >
    );
}
