'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Search, Download, FileText, ArrowDownLeft, ArrowUpRight, Filter, Calendar, Info, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock Data for Transaction Ledger
const mockLedger = [
    { id: 'LDG-001', date: '2024-03-07 14:20', entity: 'Luna Divine', type: 'REVENUE', amount: 12500, asset: 'DIAMOND', status: 'VERIFIED' },
    { id: 'LDG-002', date: '2024-03-07 13:45', entity: 'Stellar Talent', type: 'PAYOUT', amount: 5000, asset: 'USD', status: 'PENDING' },
    { id: 'LDG-003', date: '2024-03-07 12:10', entity: 'Cyber Queen', type: 'REVENUE', amount: 85000, asset: 'COIN', status: 'VERIFIED' },
    { id: 'LDG-004', date: '2024-03-07 11:30', entity: 'Vanguard X', type: 'ADJUSTMENT', amount: -200, asset: 'COIN', status: 'REJECTED' },
    { id: 'LDG-005', date: '2024-03-07 10:15', entity: 'Neon Streamers', type: 'REVENUE', amount: 4500, asset: 'DIAMOND', status: 'VERIFIED' },
];

export default function TransactionLedgerPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const columns: Column<typeof mockLedger[0]>[] = [
        {
            header: 'Ledger Audit ID',
            accessor: (log) => (
                <div className="flex items-center gap-2">
                    <FileText size={14} className="text-neon-cyan" />
                    <span className="text-text-primary font-black tracking-widest text-xs">{log.id}</span>
                </div>
            )
        },
        {
            header: 'Timestamp',
            accessor: (log) => (
                <div className="flex items-center gap-2 text-[10px] text-text-muted font-medium uppercase">
                    <Calendar size={12} className="text-neon-purple" />
                    {log.date}
                </div>
            )
        },
        {
            header: 'Entity / Counterparty',
            accessor: (log) => (
                <div className="font-bold text-text-primary text-sm">{log.entity}</div>
            )
        },
        {
            header: 'Flow Classification',
            accessor: (log) => (
                <div className="flex items-center gap-2">
                    {log.type === 'REVENUE' ? (
                        <ArrowDownLeft size={14} className="text-neon-green" />
                    ) : log.type === 'PAYOUT' ? (
                        <ArrowUpRight size={14} className="text-neon-red" />
                    ) : (
                        <Info size={14} className="text-neon-gold" />
                    )}
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        log.type === 'REVENUE' ? "text-neon-green" :
                            log.type === 'PAYOUT' ? "text-neon-red" : "text-neon-gold"
                    )}>
                        {log.type}
                    </span>
                </div>
            )
        },
        {
            header: 'Quantum Value',
            accessor: (log) => (
                <div className="flex flex-col">
                    <span className={cn(
                        "font-black tracking-widest text-sm",
                        log.amount > 0 ? "text-text-primary" : "text-neon-red"
                    )}>
                        {log.amount.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-text-muted font-bold uppercase tracking-tighter">
                        {log.asset} ASSET
                    </span>
                </div>
            )
        },
        {
            header: 'Protocol Status',
            accessor: (log) => (
                <NeonBadge variant={
                    log.status === 'VERIFIED' ? 'green' :
                        log.status === 'PENDING' ? 'cyan' : 'red'
                }>
                    {log.status}
                </NeonBadge>
            )
        },
        {
            header: 'Audit Actions',
            accessor: (log) => (
                <div className="flex items-center gap-2">
                    <button title="Examine Details" className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all border border-transparent hover:border-neon-cyan/30">
                        <Info size={14} />
                    </button>
                    <button title="Export Manifest" className="p-2 rounded-lg bg-white/5 hover:bg-neon-gold/20 hover:text-neon-gold transition-all border border-transparent hover:border-neon-gold/30">
                        <Download size={14} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <PageContainer>
            <PageHeader
                title="Transaction Ledger Matrix"
                description="Immutable record of platform financial flows, payouts, and revenue verification"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <NeonInput
                                placeholder="Scan ledger log..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<Search size={16} />}
                                className="h-10"
                            />
                        </div>
                        <GlowButton variant="cyan" size="sm" className="flex items-center gap-2" onClick={() => setIsFilterModalOpen(true)}>
                            <Filter size={16} />
                            Filter Protocol
                        </GlowButton>
                    </div>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Verified Inflow', value: '850K Coins', sub: 'today', color: 'green' },
                    { label: 'Pending Outflow', value: '$12,400', sub: 'in process', color: 'gold' },
                    { label: 'Audit Alerts', value: '2 Logs', sub: 'rejected frames', color: 'red' },
                    { label: 'System Balance', value: '4.2M Coins', sub: 'reserve pool', color: 'cyan' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-4 rounded-xl border border-white/5 flex flex-col gap-1 relative overflow-hidden"
                    >
                        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{stat.label}</p>
                        <p className="text-xl font-black text-text-primary tracking-tight">{stat.value}</p>
                        <p className="text-[10px] text-text-muted italic">{stat.sub}</p>
                        <div className={cn(
                            "absolute top-0 right-0 w-2 h-full",
                            stat.color === 'green' ? "bg-neon-green" :
                                stat.color === 'gold' ? "bg-neon-gold" :
                                    stat.color === 'red' ? "bg-neon-red" : "bg-neon-cyan"
                        )} />
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card p-1 rounded-2xl border border-neon-purple/10"
            >
                <NeonTable
                    columns={columns}
                    data={mockLedger}
                    onRowClick={(log) => console.log('Audit log focus:', log.id)}
                />
            </motion.div>

            <NeonModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                title="Filter Ledger Protocol"
                description="Apply advanced constraints to transaction audit logs."
                variant="cyan"
                actions={
                    <GlowButton variant="cyan" onClick={() => setIsFilterModalOpen(false)} className="flex items-center gap-2">
                        <Check size={16} />
                        Apply Filters
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Flow Classification</label>
                        <select className="w-full bg-dark-bg/50 border border-card-border rounded-lg h-10 px-3 text-sm text-text-primary focus:outline-none focus:border-neon-cyan/50 focus:shadow-[0_0_10px_rgba(0,255,255,0.1)] transition-all">
                            <option value="all">All Flows</option>
                            <option value="REVENUE">Revenue (Inflow)</option>
                            <option value="PAYOUT">Payout (Outflow)</option>
                            <option value="ADJUSTMENT">System Adjustment</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Asset Type</label>
                        <select className="w-full bg-dark-bg/50 border border-card-border rounded-lg h-10 px-3 text-sm text-text-primary focus:outline-none focus:border-neon-cyan/50 focus:shadow-[0_0_10px_rgba(0,255,255,0.1)] transition-all">
                            <option value="all">All Assets</option>
                            <option value="DIAMOND">Diamond Asset</option>
                            <option value="COIN">Coin Asset</option>
                            <option value="USD">Fiat USD</option>
                        </select>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
