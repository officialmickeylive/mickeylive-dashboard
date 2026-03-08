'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Search, Plus, Repeat, ArrowRightLeft, TrendingUp, ShieldAlert, BarChart3, Settings, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock Data for Coin Trading
const mockTrades = [
    { id: 'TX-9901', seller: 'Zion Sentinel', buyer: 'Luna Divine', amount: 50000, rate: 0.95, status: 'COMPLETED', type: 'P2P_EXCHANGE' },
    { id: 'TX-9902', seller: 'System Reserve', buyer: 'Shadow Dancer', amount: 12000, rate: 1.05, status: 'PENDING', type: 'REFILL' },
    { id: 'TX-9903', seller: 'Void Nexus', buyer: 'Cyber Queen', amount: 8000, rate: 0.90, status: 'FLAGGED', type: 'P2P_EXCHANGE' },
    { id: 'TX-9904', seller: 'Aether Media', buyer: 'Vanguard X', amount: 25000, rate: 0.98, status: 'COMPLETED', type: 'DISBURSEMENT' },
    { id: 'TX-9905', seller: 'Cipher Zero', buyer: 'Oracle Tech', amount: 4500, rate: 1.00, status: 'COMPLETED', type: 'P2P_EXCHANGE' },
];

export default function CoinTradingPage() {
    const router = useRouter();
    const { role } = useSelector((state: RootState) => state.auth);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    // Guard: Prevent SUPER_ADMIN from accessing this page
    useEffect(() => {
        if (role === 'SUPER_ADMIN') {
            router.replace('/app-owner/dashboard');
        }
    }, [role, router]);

    if (role === 'SUPER_ADMIN') {
        return null; // Return nothing while redirecting
    }

    const columns: Column<typeof mockTrades[0]>[] = [
        {
            header: 'Transaction ID',
            accessor: (trade) => (
                <div className="flex items-center gap-2">
                    <Repeat size={14} className="text-neon-cyan" />
                    <span className="text-text-primary font-black tracking-widest text-xs">{trade.id}</span>
                </div>
            )
        },
        {
            header: 'Trading Pair',
            accessor: (trade) => (
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-text-primary">{trade.seller}</span>
                        <span className="text-[9px] text-text-muted uppercase">Seller</span>
                    </div>
                    <ArrowRightLeft size={12} className="text-neon-gold" />
                    <div className="flex flex-col items-start">
                        <span className="text-xs font-bold text-text-primary">{trade.buyer}</span>
                        <span className="text-[9px] text-text-muted uppercase">Buyer</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Market Value',
            accessor: (trade) => (
                <div className="flex flex-col gap-1">
                    <span className="text-neon-gold font-black tracking-wider text-sm">{trade.amount.toLocaleString()} Coins</span>
                    <div className="flex items-center gap-1 text-[9px] text-text-muted uppercase font-bold">
                        <TrendingUp size={10} className="text-neon-green" />
                        Rate: {trade.rate}x
                    </div>
                </div>
            )
        },
        {
            header: 'Execution Type',
            accessor: (trade) => (
                <NeonBadge variant={
                    trade.type === 'P2P_EXCHANGE' ? 'purple' :
                        trade.type === 'REFILL' ? 'gold' : 'cyan'
                }>
                    {trade.type.replace('_', ' ')}
                </NeonBadge>
            )
        },
        {
            header: 'Status',
            accessor: (trade) => (
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        trade.status === 'COMPLETED' ? "bg-neon-green shadow-[0_0_8px_rgba(0,255,100,0.5)]" :
                            trade.status === 'PENDING' ? "bg-neon-gold shadow-[0_0_8px_rgba(255,200,0,0.5)]" :
                                "bg-neon-red shadow-[0_0_8px_rgba(255,0,0,0.5)]"
                    )} />
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em]",
                        trade.status === 'COMPLETED' ? "text-neon-green" :
                            trade.status === 'PENDING' ? "text-neon-gold" :
                                "text-neon-red"
                    )}>
                        {trade.status}
                    </span>
                </div>
            )
        },
        {
            header: 'Console Actions',
            accessor: (trade) => (
                <div className="flex items-center gap-2">
                    <button title="View Analytics" className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all border border-transparent hover:border-neon-cyan/30">
                        <BarChart3 size={14} />
                    </button>
                    <button title="Security Intervention" className="p-2 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red transition-all border border-transparent hover:border-neon-red/30">
                        <ShieldAlert size={14} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <PageContainer>
            <PageHeader
                title="Coin Exchange Terminal"
                description="Oversight of peer-to-peer trading, system refills, and market liquidity"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <NeonInput
                                placeholder="Scan transaction hash..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<Search size={16} />}
                                className="h-10"
                            />
                        </div>
                        <GlowButton variant="purple" size="sm" className="flex items-center gap-2" onClick={() => setIsSettingsModalOpen(true)}>
                            <Settings size={16} />
                            Market Settings
                        </GlowButton>
                    </div>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { label: 'Trading Volume', value: '1.2M Coins', sub: 'last 24 standard hours', icon: Repeat, color: 'cyan' },
                    { label: 'Execution Efficiency', value: '98.4%', sub: 'successful settlements', icon: TrendingUp, color: 'green' },
                    { label: 'Flagged Activity', value: '3 Alerts', sub: 'pending security review', icon: ShieldAlert, color: 'red' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-5 rounded-2xl border border-white/5 relative group"
                    >
                        <div className="relative z-10">
                            <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mb-1">{stat.label}</p>
                            <div className="flex items-center gap-3">
                                <p className="text-2xl font-black text-text-primary">{stat.value}</p>
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center",
                                    stat.color === 'cyan' ? "bg-neon-cyan/10 text-neon-cyan" :
                                        stat.color === 'green' ? "bg-neon-green/10 text-neon-green" :
                                            "bg-neon-red/10 text-neon-red"
                                )}>
                                    <stat.icon size={16} />
                                </div>
                            </div>
                            <p className="text-[10px] text-text-muted italic mt-1">{stat.sub}</p>
                        </div>
                        <div className={cn(
                            "absolute top-0 right-0 w-24 h-24 blur-[40px] opacity-10 rounded-full -translate-y-1/2 translate-x-1/2",
                            stat.color === 'cyan' ? "bg-neon-cyan" :
                                stat.color === 'green' ? "bg-neon-green" :
                                    "bg-neon-red"
                        )} />
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-card p-1 rounded-2xl border border-neon-cyan/10"
            >
                <NeonTable
                    columns={columns}
                    data={mockTrades}
                    onRowClick={(trade) => console.log('Transaction intercept:', trade.id)}
                />
            </motion.div>

            <NeonModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                title="Market Liquidty Setup"
                description="Adjust global exchange rates and taxation logic for crypto-fiat pathways."
                variant="purple"
                actions={
                    <GlowButton variant="purple" onClick={() => setIsSettingsModalOpen(false)} className="flex items-center gap-2">
                        <Check size={16} /> Verify Configuration
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <NeonInput label="Global Exchange Rate" type="number" placeholder="1.0" icon={<TrendingUp size={16} />} />
                        <NeonInput label="Trading Fee %" type="number" placeholder="5" icon={<Settings size={16} />} />
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
