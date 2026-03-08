'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Search, Repeat, ArrowRightLeft, Coins, Plus, Send, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const myTrades = [
    { id: 'ST-001', buyer: 'User#8821', amount: 5000, rate: 0.95, earned: 4.75, status: 'COMPLETED', date: '2024-03-07 14:20' },
    { id: 'ST-002', buyer: 'User#4432', amount: 12000, rate: 1.05, earned: 12.60, status: 'PENDING', date: '2024-03-07 13:45' },
    { id: 'ST-003', buyer: 'User#2201', amount: 8000, rate: 0.98, earned: 7.84, status: 'COMPLETED', date: '2024-03-07 11:30' },
];

export default function SellerCoinTradingPage() {
    const [search, setSearch] = useState('');
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const columns: Column<typeof myTrades[0]>[] = [
        { header: 'Trade ID', accessor: (t) => <div className="flex items-center gap-2"><Repeat size={13} className="text-neon-gold" /><span className="font-black text-xs">{t.id}</span></div> },
        { header: 'Buyer', accessor: (t) => <div className="flex items-center gap-2"><ArrowRightLeft size={12} className="text-neon-cyan" /><span className="font-bold text-sm">{t.buyer}</span></div> },
        { header: 'Coins', accessor: (t) => <div className="flex items-center gap-1"><Coins size={12} className="text-neon-gold" /><span className="text-neon-gold font-black">{t.amount.toLocaleString()}</span></div> },
        { header: 'Rate', accessor: (t) => <span className="text-text-muted text-xs font-mono">{t.rate}x</span> },
        { header: 'Earned', accessor: (t) => <span className="text-neon-green font-black text-sm">${t.earned.toFixed(2)}</span> },
        { header: 'Status', accessor: (t) => <NeonBadge variant={t.status === 'COMPLETED' ? 'green' : 'gold'}>{t.status}</NeonBadge> },
        { header: 'Date', accessor: (t) => <span className="text-[10px] text-text-muted font-mono">{t.date}</span> }
    ];
    return (
        <PageContainer>
            <PageHeader title="My Coin Trades" description="Your personal trading book — completed and pending transactions"
                actions={<div className="flex gap-3"><div className="w-60"><NeonInput placeholder="Search trades..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search size={16} />} className="h-10" /></div><GlowButton variant="gold" size="sm" className="flex items-center gap-2" onClick={() => setIsTradeModalOpen(true)}><Plus size={16} /> New Trade</GlowButton></div>} />
            <div className="grid grid-cols-3 gap-5 mb-8">
                {[{ label: 'Trades (Week)', value: '48' }, { label: 'Coins Sold', value: '240K' }, { label: 'Net Profit', value: '$225.20' }].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="glass-card p-5 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{s.label}</p>
                        <p className="text-2xl font-black text-neon-gold">{s.value}</p>
                    </motion.div>
                ))}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-1 rounded-2xl border border-neon-gold/10">
                <NeonTable columns={columns} data={myTrades} />
            </motion.div>

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
        </PageContainer >
    );
}
