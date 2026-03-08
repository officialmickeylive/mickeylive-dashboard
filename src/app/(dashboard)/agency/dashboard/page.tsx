'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { StatCard } from '@/components/gaming/StatCard';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { NeonInput } from '@/components/gaming/NeonInput';
import { Mic2, Users, DollarSign, TrendingUp, Star, Award, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const earningsData = [
    { month: 'Oct', earnings: 12400 }, { month: 'Nov', earnings: 18200 },
    { month: 'Dec', earnings: 22400 }, { month: 'Jan', earnings: 19800 },
    { month: 'Feb', earnings: 28400 }, { month: 'Mar', earnings: 32100 },
];

const myHosts = [
    { id: 'H1', name: 'Luna Divine', level: 'DIAMOND_ELITE', diamonds: 125000, status: 'LIVE' },
    { id: 'H2', name: 'Nova Spark', level: 'PLATINUM', diamonds: 81000, status: 'ONLINE' },
    { id: 'H3', name: 'Cyber Rose', level: 'GOLD', diamonds: 42000, status: 'OFFLINE' },
];

export default function AgencyDashboardPage() {
    const [isRecruitModalOpen, setIsRecruitModalOpen] = useState(false);
    return (
        <PageContainer>
            <PageHeader title="Agency Command Center" description="Your talent roster, host performance, and agency revenue"
                actions={<GlowButton variant="gold" size="sm" className="flex items-center gap-2" onClick={() => setIsRecruitModalOpen(true)}><Mic2 size={16} /> Recruit Host</GlowButton>} />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatCard title="My Hosts" value={48} trend={4} trendType="up" icon={<Users size={20} />} prefix="" />
                <StatCard title="Monthly Revenue" value={32100} trend={13.1} trendType="up" icon={<DollarSign size={20} />} prefix="$" />
                <StatCard title="Live Now" value={12} trend={2} trendType="up" icon={<TrendingUp size={20} />} prefix="" />
                <StatCard title="Agency Tier" value={1} trend={0} trendType="neutral" icon={<Award size={20} />} prefix="Platinum #" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 glass-card p-6 rounded-2xl border border-neon-gold/10">
                    <h3 className="text-xs font-black uppercase tracking-widest text-neon-gold mb-4">Agency Earnings (6 Months)</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={earningsData}>
                            <defs><linearGradient id="agGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ffd700" stopOpacity={0.2} /><stop offset="95%" stopColor="#ffd700" stopOpacity={0} /></linearGradient></defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#0a0a1a', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 8, fontSize: 11 }} />
                            <Area type="monotone" dataKey="earnings" stroke="#ffd700" strokeWidth={2} fill="url(#agGrad)" dot={{ fill: '#ffd700', r: 3 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 rounded-2xl border border-white/5">
                    <h3 className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2 mb-4">
                        <Star size={14} className="text-neon-gold" /> Top Hosts
                    </h3>
                    <div className="flex flex-col gap-3">
                        {myHosts.map((h, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-all">
                                <div className="w-8 h-8 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan font-black text-xs">{h.name[0]}</div>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-text-primary">{h.name}</div>
                                    <div className="text-[9px] text-text-muted uppercase">{h.level.replace('_', ' ')}</div>
                                </div>
                                <div className={cn("w-2 h-2 rounded-full", h.status === 'LIVE' ? "bg-neon-red" : h.status === 'ONLINE' ? "bg-neon-green" : "bg-white/20")} />
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <NeonModal
                isOpen={isRecruitModalOpen}
                onClose={() => setIsRecruitModalOpen(false)}
                title="Recruit Talent"
                description="Invite an existing user to join your agency as an official Streamer/Host."
                variant="gold"
                actions={
                    <GlowButton variant="gold" onClick={() => setIsRecruitModalOpen(false)} className="flex items-center gap-2">
                        <UserPlus size={16} />
                        Send Invitation
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <NeonInput label="Talent User ID" placeholder="e.g. User#9102" />
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Commission Split</label>
                        <select className="w-full bg-dark-bg/50 border border-card-border rounded-lg h-10 px-3 text-sm text-text-primary focus:outline-none focus:border-neon-gold/50 focus:shadow-[0_0_10px_rgba(255,215,0,0.1)] transition-all">
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
        </PageContainer>
    );
}
