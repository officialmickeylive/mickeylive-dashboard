'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { StatCard } from '@/components/gaming/StatCard';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { NeonInput } from '@/components/gaming/NeonInput';
import { Coins, TrendingUp, Users, DollarSign, Repeat, Award, Send, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const tradeHistory = [
    { day: 'Mon', sold: 24000, profit: 1800 }, { day: 'Tue', sold: 18000, profit: 1350 },
    { day: 'Wed', sold: 32000, profit: 2400 }, { day: 'Thu', sold: 28000, profit: 2100 },
    { day: 'Fri', sold: 45000, profit: 3375 }, { day: 'Sat', sold: 52000, profit: 3900 },
    { day: 'Sun', sold: 41000, profit: 3075 },
];

const inventoryItems = [
    { name: 'Coin Pack A (1K)', limit: 10000, used: 6800, unit: 'coins' },
    { name: 'Coin Pack B (5K)', limit: 50000, used: 38200, unit: 'coins' },
    { name: 'Coin Pack C (10K)', limit: 20000, used: 9400, unit: 'coins' },
];

export default function SellerDashboardPage() {
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    return (
        <PageContainer>
            <PageHeader title="Seller Trade Desk" description="Your coin inventory, trade history, and profit tracking"
                actions={<GlowButton variant="gold" size="sm" className="flex items-center gap-2" onClick={() => setIsTradeModalOpen(true)}><Repeat size={16} /> New Trade</GlowButton>} />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatCard title="Coins Available" value={480000} trend={5.2} trendType="up" icon={<Coins size={20} />} prefix="" />
                <StatCard title="Weekly Sales" value={240000} trend={14.8} trendType="up" icon={<TrendingUp size={20} />} prefix="" />
                <StatCard title="Total Buyers" value={1248} trend={8.1} trendType="up" icon={<Users size={20} />} prefix="" />
                <StatCard title="Net Profit" value={18000} trend={11.2} trendType="up" icon={<DollarSign size={20} />} prefix="$" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 glass-card p-6 rounded-2xl border border-neon-gold/10">
                    <h3 className="text-xs font-black uppercase tracking-widest text-neon-gold mb-4">Trade Volume & Profit (Week)</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={tradeHistory} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#0a0a1a', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 8, fontSize: 11 }} />
                            <Bar dataKey="sold" fill="rgba(255,215,0,0.7)" radius={[3, 3, 0, 0]} name="Coins Sold" />
                            <Bar dataKey="profit" fill="rgba(0,255,100,0.7)" radius={[3, 3, 0, 0]} name="Profit ($)" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-6 rounded-2xl border border-white/5">
                    <h3 className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2 mb-4">
                        <Award size={14} className="text-neon-gold" /> Inventory Status
                    </h3>
                    <div className="flex flex-col gap-4">
                        {inventoryItems.map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-bold text-text-primary">{item.name}</span>
                                    <span className="text-text-muted font-mono">{item.used.toLocaleString()}/{item.limit.toLocaleString()}</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className={cn("h-full rounded-full transition-all",
                                        (item.used / item.limit) > 0.8 ? "bg-neon-red" : (item.used / item.limit) > 0.5 ? "bg-neon-gold" : "bg-neon-green"
                                    )} style={{ width: `${(item.used / item.limit) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <NeonModal
                isOpen={isTradeModalOpen}
                onClose={() => setIsTradeModalOpen(false)}
                title="Initiate Trade"
                description="Transfer coins to a buyer from your allocated inventory."
                variant="gold"
                actions={
                    <GlowButton variant="gold" onClick={() => setIsTradeModalOpen(false)} className="flex items-center gap-2">
                        <Send size={16} />
                        Process Sale
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <NeonInput label="Buyer ID or Username" placeholder="e.g. User#8821" />
                    <NeonInput label="Coin Amount" type="number" placeholder="Enter amount to sell" />
                    <div className="pt-2 border-t border-white/5">
                        <p className="text-xs text-neon-gold mb-2 flex items-center gap-2"><ShieldCheck size={14} /> Funds will be deducted from your Seller Wallet.</p>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
