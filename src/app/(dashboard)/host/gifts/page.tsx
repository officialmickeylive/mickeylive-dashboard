'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Gift, Zap, ArrowDownLeft, Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const giftsReceived = [
    { id: 'GR-01', sender: 'Anon User', gift: 'Galaxy Rocket', value: 9999, time: '2024-03-07 22:10' },
    { id: 'GR-02', sender: 'Diamond Fan', gift: 'Phoenix Wings', value: 5000, time: '2024-03-07 21:45' },
    { id: 'GR-03', sender: 'Vanguard X', gift: 'Neon Dragon', value: 3888, time: '2024-03-07 20:30' },
    { id: 'GR-04', sender: 'Elite Backer', gift: 'Lightning Bolt', value: 2500, time: '2024-03-07 19:55' },
    { id: 'GR-05', sender: 'Cyber Star', gift: 'Crystal Rose', value: 1200, time: '2024-03-07 18:40' },
];

export default function HostGiftsPage() {
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const columns: Column<typeof giftsReceived[0]>[] = [
        {
            header: 'Gift', accessor: (g) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-neon-gold/10 border border-neon-gold/20 flex items-center justify-center text-neon-gold"><Gift size={16} /></div>
                    <span className="font-bold text-sm text-text-primary">{g.gift}</span>
                </div>
            )
        },
        { header: 'From', accessor: (g) => <span className="text-sm text-text-muted font-bold">{g.sender}</span> },
        {
            header: 'Diamond Value', accessor: (g) => (
                <div className="flex items-center gap-1">
                    <Zap size={12} className="text-neon-gold" />
                    <span className="text-neon-gold font-black text-sm">{g.value.toLocaleString()}</span>
                </div>
            )
        },
        { header: 'Received At', accessor: (g) => <span className="text-[10px] text-text-muted font-mono">{g.time}</span> },
        {
            header: 'Type', accessor: () => (
                <div className="flex items-center gap-1 text-neon-green text-[10px] font-black uppercase">
                    <ArrowDownLeft size={10} /> Received
                </div>
            )
        }
    ];
    return (
        <PageContainer>
            <PageHeader title="Gift Inbox" description="All virtual gifts received during live streams"
                actions={<GlowButton variant="gold" size="sm" className="flex items-center gap-2" onClick={() => setIsExportModalOpen(true)}><Download size={16} /> Export History</GlowButton>} />
            <div className="grid grid-cols-3 gap-5 mb-8">
                {[{ label: 'Total Gifts', value: '8,900' }, { label: 'Total Diamonds', value: '125,000' }, { label: 'Today', value: '22,597' }].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="glass-card p-5 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{s.label}</p>
                        <p className="text-2xl font-black text-neon-gold">{s.value}</p>
                    </motion.div>
                ))}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-1 rounded-2xl border border-neon-gold/10">
                <NeonTable columns={columns} data={giftsReceived} />
            </motion.div>

            <NeonModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                title="Export Gift Records"
                description="Download a detailed record of all virtual gifts received."
                variant="gold"
                actions={
                    <GlowButton variant="gold" onClick={() => setIsExportModalOpen(false)} className="flex items-center gap-2">
                        <FileText size={16} />
                        Download CSV
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Select Date Range</label>
                        <select className="w-full bg-dark-bg/50 border border-card-border rounded-lg h-10 px-3 text-sm text-text-primary focus:outline-none focus:border-neon-gold/50 focus:shadow-[0_0_10px_rgba(255,215,0,0.1)] transition-all">
                            <option value="last_7">Last 7 Days</option>
                            <option value="last_30">Last 30 Days</option>
                            <option value="all_time">All Time</option>
                        </select>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
