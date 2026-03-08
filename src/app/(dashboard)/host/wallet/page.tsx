'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { NeonInput } from '@/components/gaming/NeonInput';
import { DollarSign, Zap, TrendingUp, ArrowUpRight, ArrowDownLeft, Clock, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const walletHistory = [
    { month: 'Oct', earned: 8200, withdrawn: 5000 }, { month: 'Nov', earned: 12400, withdrawn: 8000 },
    { month: 'Dec', earned: 18900, withdrawn: 12000 }, { month: 'Jan', earned: 15600, withdrawn: 10000 },
    { month: 'Feb', earned: 22400, withdrawn: 15000 }, { month: 'Mar', earned: 28100, withdrawn: 18000 },
];

const recentTx = [
    { type: 'credit', desc: 'Gift earnings converted', amount: '+9,999 💎 → $7.49', time: '2h ago' },
    { type: 'debit', desc: 'Withdrawal to bank', amount: '-$500', time: '1d ago' },
    { type: 'credit', desc: 'PK battle victory', amount: '+5,000 💎', time: '2d ago' },
    { type: 'credit', desc: 'Stream tips', amount: '+1,200 💎', time: '3d ago' },
];

export default function HostEarningsWalletPage() {
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    return (
        <PageContainer>
            <PageHeader title="Earnings & Wallet" description="Your diamond balance, withdrawal history, and earnings timeline"
                actions={<GlowButton variant="green" size="sm" className="flex items-center gap-2" onClick={() => setIsWithdrawModalOpen(true)}><ArrowUpRight size={16} /> Request Withdrawal</GlowButton>} />

            {/* Balance Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                {[
                    { label: 'Diamond Balance', value: '125,000 💎', icon: Zap, color: 'purple' },
                    { label: 'Cash Value', value: '$93.75', icon: DollarSign, color: 'green' },
                    { label: 'Withdrawn (Month)', value: '$18,000', icon: ArrowUpRight, color: 'gold' },
                    { label: 'Pending Payout', value: '$7.49', icon: Clock, color: 'cyan' },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="glass-card p-5 rounded-2xl border border-white/5 flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center",
                            s.color === 'purple' ? "bg-neon-purple/10 text-neon-purple" : s.color === 'green' ? "bg-neon-green/10 text-neon-green" :
                                s.color === 'gold' ? "bg-neon-gold/10 text-neon-gold" : "bg-neon-cyan/10 text-neon-cyan")}>
                            <s.icon size={18} />
                        </div>
                        <div><p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{s.label}</p><p className="text-lg font-black text-text-primary">{s.value}</p></div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 glass-card p-6 rounded-2xl border border-neon-green/10">
                    <h3 className="text-xs font-black uppercase tracking-widest text-neon-green mb-4">Earnings & Withdrawals</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={walletHistory}>
                            <defs>
                                <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00ff64" stopOpacity={0.15} /><stop offset="95%" stopColor="#00ff64" stopOpacity={0} /></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#0a0a1a', border: '1px solid rgba(0,255,100,0.2)', borderRadius: 8, fontSize: 11 }} />
                            <Area type="monotone" dataKey="earned" stroke="#00ff64" strokeWidth={2} fill="url(#earnGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-6 rounded-2xl border border-white/5">
                    <h3 className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2 mb-4">
                        <TrendingUp size={14} className="text-neon-green" /> Recent Transactions
                    </h3>
                    <div className="flex flex-col gap-3">
                        {recentTx.map((tx, i) => (
                            <div key={i} className="flex items-start gap-3">
                                {tx.type === 'credit' ? <ArrowDownLeft size={14} className="text-neon-green mt-0.5" /> : <ArrowUpRight size={14} className="text-neon-red mt-0.5" />}
                                <div className="flex-1"><p className="text-xs text-text-primary">{tx.desc}</p><p className="text-[10px] text-text-muted italic">{tx.time}</p></div>
                                <p className={cn("text-xs font-black", tx.type === 'credit' ? "text-neon-green" : "text-neon-red")}>{tx.amount}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <NeonModal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                title="Request Withdrawal"
                description="Exchange your diamond balance for real-world currency."
                variant="green"
                actions={
                    <GlowButton variant="green" onClick={() => setIsWithdrawModalOpen(false)} className="flex items-center gap-2">
                        <Send size={16} />
                        Submit Request
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <div className="p-4 bg-neon-green/5 border border-neon-green/20 rounded-xl mb-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs uppercase tracking-widest text-text-muted">Available Diamonds</span>
                            <span className="font-black text-neon-purple flex items-center gap-1"><Zap size={14} /> 125,000</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs uppercase tracking-widest text-text-muted">Est. Cash Value</span>
                            <span className="font-black text-neon-green">$93.75</span>
                        </div>
                    </div>

                    <NeonInput label="Withdrawal Amount (Diamonds)" type="number" placeholder="Enter diamonds to exchange..." />

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Payout Method</label>
                        <select className="w-full bg-dark-bg/50 border border-card-border rounded-lg h-10 px-3 text-sm text-text-primary focus:outline-none focus:border-neon-green/50 focus:shadow-[0_0_10px_rgba(0,255,100,0.1)] transition-all">
                            <option value="bank">Bank Transfer (Linked acc...8921)</option>
                            <option value="paypal">PayPal (user@example.com)</option>
                            <option value="crypto">USDT (TRC20)</option>
                        </select>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
