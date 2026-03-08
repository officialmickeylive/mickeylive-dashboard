'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Search, Plus, Zap, Diamond, DollarSign, TrendingUp, ShieldCheck, Percent, Box } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock Data for Finance Packages
const mockPackages = [
    { id: '1', name: 'Starter Cache', type: 'COIN', reward: 1000, price: 0.99, bonus: 5, status: 'ACTIVE', popularity: 'HIGH' },
    { id: '2', name: 'Pro Vault', type: 'COIN', reward: 5000, price: 4.99, bonus: 10, status: 'ACTIVE', popularity: 'MEDIUM' },
    { id: '3', name: 'Whale Reservoir', type: 'COIN', reward: 50000, price: 44.99, bonus: 25, status: 'ACTIVE', popularity: 'ELITE' },
    { id: '4', name: 'Diamond Refill (Small)', type: 'DIAMOND', reward: 500, price: 1.99, bonus: 0, status: 'ACTIVE', popularity: 'LOW' },
    { id: '5', name: 'Corporate Diamond Pack', type: 'DIAMOND', reward: 10000, price: 29.99, bonus: 15, status: 'INACTIVE', popularity: 'ELITE' },
];

export default function PackagesManagementPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const columns: Column<typeof mockPackages[0]>[] = [
        {
            header: 'Package Protocol',
            accessor: (pkg) => (
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-500",
                        pkg.type === 'COIN'
                            ? "bg-neon-gold/5 border-neon-gold/20 text-neon-gold"
                            : "bg-neon-purple/5 border-neon-purple/20 text-neon-purple"
                    )}>
                        {pkg.type === 'COIN' ? <Zap size={20} /> : <Diamond size={20} />}
                    </div>
                    <div>
                        <div className="font-bold text-text-primary text-sm">{pkg.name}</div>
                        <div className="text-[10px] text-text-muted font-medium uppercase tracking-widest">{pkg.type} PROTOCOL</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Resource Reward',
            accessor: (pkg) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-text-primary font-black tracking-wider text-sm">{pkg.reward.toLocaleString()}</span>
                        <span className="text-[9px] text-text-muted font-bold">{pkg.type}S</span>
                    </div>
                    {pkg.bonus > 0 && (
                        <div className="flex items-center gap-1 text-neon-green text-[9px] font-black italic">
                            <Percent size={8} />
                            +{pkg.bonus}% OVERLOAD BONUS
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Acquisition Cost',
            accessor: (pkg) => (
                <div className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-full px-3 py-1 w-fit">
                    <DollarSign size={12} className="text-neon-green" />
                    <span className="text-neon-green font-black text-xs tracking-tighter">{pkg.price.toFixed(2)}</span>
                    <span className="text-[9px] text-text-muted font-bold ml-1">USD</span>
                </div>
            )
        },
        {
            header: 'Market Sentiment',
            accessor: (pkg) => (
                <NeonBadge variant={
                    pkg.popularity === 'ELITE' ? 'gold' :
                        pkg.popularity === 'HIGH' ? 'green' :
                            pkg.popularity === 'MEDIUM' ? 'cyan' : 'muted'
                }>
                    {pkg.popularity}
                </NeonBadge>
            )
        },
        {
            header: 'Manifest Status',
            accessor: (pkg) => (
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        pkg.status === 'ACTIVE' ? "bg-neon-green shadow-[0_0_8px_rgba(0,255,100,0.5)]" : "bg-neon-red shadow-[0_0_8px_rgba(255,0,0,0.5)]"
                    )} />
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em]",
                        pkg.status === 'ACTIVE' ? "text-neon-green" : "text-neon-red"
                    )}>
                        {pkg.status}
                    </span>
                </div>
            )
        },
        {
            header: 'Terminal Output',
            accessor: (pkg) => (
                <div className="flex items-center gap-2">
                    <GlowButton variant="cyan" size="sm" className="px-3 py-1 text-[10px]">
                        Modify
                    </GlowButton>
                    <button title="Security Audit" className="p-2 rounded-lg bg-white/5 hover:bg-neon-green/20 hover:text-neon-green transition-all border border-transparent hover:border-neon-green/30">
                        <ShieldCheck size={14} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <PageContainer>
            <PageHeader
                title="Financial Resource Matrix"
                description="Configuration of currency packages, bonus structures, and acquisition pricing"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <NeonInput
                                placeholder="Query package ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<Search size={16} />}
                                className="h-10"
                            />
                        </div>
                        <GlowButton variant="gold" size="sm" className="flex items-center gap-2" onClick={() => setIsAddModalOpen(true)}>
                            <Plus size={16} />
                            Generate Package
                        </GlowButton>
                    </div>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Revenue (24h)', value: '$12,450', icon: TrendingUp, color: 'green' },
                    { label: 'Coin Packages', value: '12 Active', icon: Zap, color: 'gold' },
                    { label: 'Diamond Units', value: '450K Sold', icon: Diamond, color: 'purple' },
                    { label: 'Avg. Profit', value: '82.4%', icon: Percent, color: 'cyan' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-4 rounded-xl border border-white/5 flex flex-col gap-3 relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between relative z-10">
                            <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{stat.label}</p>
                            <stat.icon size={16} className={cn(
                                stat.color === 'green' ? "text-neon-green" :
                                    stat.color === 'gold' ? "text-neon-gold" :
                                        stat.color === 'purple' ? "text-neon-purple" :
                                            "text-neon-cyan"
                            )} />
                        </div>
                        <p className="text-2xl font-black text-text-primary tracking-tight relative z-10">{stat.value}</p>
                        <div className={cn(
                            "absolute -bottom-4 -left-4 w-12 h-12 rounded-full blur-[30px] opacity-20",
                            stat.color === 'green' ? "bg-neon-green" :
                                stat.color === 'gold' ? "bg-neon-gold" :
                                    stat.color === 'purple' ? "bg-neon-purple" :
                                        "bg-neon-cyan"
                        )} />
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="glass-card p-1 rounded-2xl border border-neon-gold/10"
            >
                <NeonTable
                    columns={columns}
                    data={mockPackages}
                    onRowClick={(pkg) => console.log('Package link established:', pkg.name)}
                />
            </motion.div>

            <NeonModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Generate Financial Package"
                description="Configure a new resource package for user acquisition in the store."
                variant="gold"
                actions={
                    <GlowButton variant="gold" onClick={() => setIsAddModalOpen(false)} className="flex items-center gap-2">
                        <Plus size={16} /> Create Configuration
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <NeonInput label="Package Name" placeholder="e.g. Mega Diamond Vault" icon={<Box size={16} />} />
                    <div className="grid grid-cols-2 gap-4">
                        <NeonInput label="Resource Value" type="number" placeholder="5000" icon={<Diamond size={16} />} />
                        <NeonInput label="Price (USD)" type="number" placeholder="49.99" icon={<DollarSign size={16} />} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Package Type</label>
                        <select className="w-full bg-dark-bg/50 border border-card-border rounded-lg h-10 px-3 text-sm text-text-primary focus:outline-none focus:border-neon-gold/50 focus:shadow-[0_0_10px_rgba(255,215,0,0.1)] transition-all">
                            <option value="DIAMOND">Diamond Asset</option>
                            <option value="COIN">Coin Asset</option>
                        </select>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
