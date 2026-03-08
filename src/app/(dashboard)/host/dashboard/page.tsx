'use client';

import React from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { StatCard } from '@/components/gaming/StatCard';
import { GlowButton } from '@/components/gaming/GlowButton';
import { LivePulse } from '@/components/gaming/LivePulse';
import { Video, Gift, Sword, DollarSign, Eye, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const weeklyEarnings = [
    { day: 'Mon', diamonds: 8200 }, { day: 'Tue', diamonds: 12400 },
    { day: 'Wed', diamonds: 9800 }, { day: 'Thu', diamonds: 15600 },
    { day: 'Fri', diamonds: 18900 }, { day: 'Sat', diamonds: 24200 },
    { day: 'Sun', diamonds: 21400 },
];

const recentGifts = [
    { sender: 'Anon User', gift: 'Galaxy Rocket', value: 9999, time: '2 min ago' },
    { sender: 'Diamond Fan', gift: 'Phoenix Wings', value: 5000, time: '8 min ago' },
    { sender: 'Vanguard X', gift: 'Neon Rose', value: 1200, time: '22 min ago' },
];

export default function HostDashboardPage() {
    return (
        <PageContainer>
            <PageHeader title="Host Studio" description="Your live performance hub — streams, gifts, battles, and earnings"
                actions={
                    <GlowButton variant="red" size="sm" className="flex items-center gap-2">
                        <div className="flex items-center gap-2"><LivePulse /> Go Live</div>
                    </GlowButton>
                }
            />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatCard title="Total Diamonds" value={125000} trend={8.4} trendType="up" icon={<Zap size={20} />} prefix="" />
                <StatCard title="Gifts Received" value={8900} trend={12.1} trendType="up" icon={<Gift size={20} />} prefix="" />
                <StatCard title="Live Sessions" value={284} trend={5.2} trendType="up" icon={<Video size={20} />} prefix="" />
                <StatCard title="PK Victories" value={42} trend={3} trendType="up" icon={<Sword size={20} />} prefix="" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 glass-card p-6 rounded-2xl border border-neon-cyan/10">
                    <h3 className="text-xs font-black uppercase tracking-widest text-neon-cyan mb-4">Weekly Diamond Earnings</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={weeklyEarnings}>
                            <defs><linearGradient id="diamGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00ffff" stopOpacity={0.2} /><stop offset="95%" stopColor="#00ffff" stopOpacity={0} /></linearGradient></defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#0a0a1a', border: '1px solid rgba(0,255,255,0.2)', borderRadius: 8, fontSize: 11 }} />
                            <Area type="monotone" dataKey="diamonds" stroke="#00ffff" strokeWidth={2} fill="url(#diamGrad)" dot={{ fill: '#00ffff', r: 3 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-6 rounded-2xl border border-white/5">
                    <h3 className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2 mb-4">
                        <Gift size={14} className="text-neon-gold" /> Latest Gifts
                    </h3>
                    <div className="flex flex-col gap-3">
                        {recentGifts.map((g, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-all">
                                <div className="w-8 h-8 rounded-full bg-neon-gold/10 border border-neon-gold/20 flex items-center justify-center text-neon-gold text-xs font-black">{g.sender[0]}</div>
                                <div className="flex-1">
                                    <div className="text-xs font-bold text-text-primary">{g.gift}</div>
                                    <div className="text-[9px] text-text-muted">from {g.sender} · {g.time}</div>
                                </div>
                                <div className="text-neon-gold font-black text-xs">{g.value.toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </PageContainer>
    );
}
