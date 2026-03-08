'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Search, Plus, Gift, Flame, Zap, DollarSign, Image as ImageIcon, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock Data for Gift System
const mockGifts = [
    { id: '1', name: 'Cyber Dragon', category: 'PREMIUM', price: 5000, animation: '3D_ORBIT', status: 'ACTIVE', sales: 1250 },
    { id: '2', name: 'Neon Rose', category: 'BASIC', price: 10, animation: 'PARTICLE', status: 'ACTIVE', sales: 45000 },
    { id: '3', name: 'Void Star', category: 'EXCLUSIVE', price: 15000, animation: 'SCREEN_FILTER', status: 'ACTIVE', sales: 85 },
    { id: '4', name: 'Ghost Wings', category: 'PREMIUM', price: 1200, animation: 'OVERLAY', status: 'INACTIVE', sales: 0 },
    { id: '5', name: 'Plasma Heart', category: 'SPECIAL', price: 500, animation: 'SHAKE', status: 'ACTIVE', sales: 3200 },
];

export default function GiftSystemPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isForgeModalOpen, setIsForgeModalOpen] = useState(false);

    const columns: Column<typeof mockGifts[0]>[] = [
        {
            header: 'Gift Asset',
            accessor: (gift) => (
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-neon-cyan/5 border border-white/5 flex items-center justify-center relative overflow-hidden group">
                        <Gift size={24} className="text-neon-cyan group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-transparent" />
                    </div>
                    <div>
                        <div className="font-bold text-text-primary text-sm flex items-center gap-2">
                            {gift.name}
                            {gift.category === 'EXCLUSIVE' && <Flame size={12} className="text-neon-red animate-pulse" />}
                        </div>
                        <div className="text-[10px] text-text-muted font-medium flex items-center gap-1">
                            <ImageIcon size={10} />
                            {gift.animation} FX Active
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Manifest Category',
            accessor: (gift) => (
                <NeonBadge variant={
                    gift.category === 'EXCLUSIVE' ? 'gold' :
                        gift.category === 'PREMIUM' ? 'purple' :
                            gift.category === 'SPECIAL' ? 'cyan' : 'muted'
                }>
                    {gift.category}
                </NeonBadge>
            )
        },
        {
            header: 'Value (Coins)',
            accessor: (gift) => (
                <div className="flex items-center gap-2">
                    <Zap size={14} className="text-neon-gold" />
                    <span className="text-neon-gold font-black tracking-widest text-sm">{gift.price.toLocaleString()}</span>
                </div>
            )
        },
        {
            header: 'Market Usage',
            accessor: (gift) => (
                <div className="flex flex-col gap-1">
                    <span className="text-text-primary font-bold">{gift.sales.toLocaleString()}</span>
                    <span className="text-[9px] text-text-muted uppercase tracking-tighter font-bold">Transmissions</span>
                </div>
            )
        },
        {
            header: 'Registry Status',
            accessor: (gift) => (
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        gift.status === 'ACTIVE' ? "bg-neon-green shadow-[0_0_8px_rgba(0,255,100,0.5)]" : "bg-neon-red shadow-[0_0_8px_rgba(255,0,0,0.5)]"
                    )} />
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em]",
                        gift.status === 'ACTIVE' ? "text-neon-green" : "text-neon-red"
                    )}>
                        {gift.status}
                    </span>
                </div>
            )
        },
        {
            header: 'Asset Control',
            accessor: (gift) => (
                <div className="flex items-center gap-2">
                    <GlowButton variant="cyan" size="sm" className="px-3 py-1 text-[10px]">
                        Edit Asset
                    </GlowButton>
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red transition-all">
                        <DollarSign size={14} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <PageContainer>
            <PageHeader
                title="Virtual Gift Inventory"
                description="Configuration of digital assets and coin valuation for platform tipping"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <NeonInput
                                placeholder="Query asset name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<Search size={16} />}
                                className="h-10"
                            />
                        </div>
                        <GlowButton variant="purple" size="sm" className="flex items-center gap-2" onClick={() => setIsForgeModalOpen(true)}>
                            <Plus size={16} />
                            Forge New Gift
                        </GlowButton>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Assets', value: '154', icon: Gift, color: 'cyan' },
                    { label: 'Active Revenue', value: '4.2M Credits', icon: Zap, color: 'gold' },
                    { label: 'Trending Gift', value: 'Cyber Dragon', icon: Flame, color: 'red' },
                    { label: 'Market Velocity', value: '+12.5%', icon: TrendingUp, color: 'green' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-4 rounded-xl border border-white/5 flex items-center justify-between"
                    >
                        <div>
                            <p className="text-[10px] text-text-muted uppercase font-black tracking-widest leading-none mb-2">{stat.label}</p>
                            <p className="text-xl font-black text-text-primary tracking-tight">{stat.value}</p>
                        </div>
                        <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            stat.color === 'cyan' ? "bg-neon-cyan/20 text-neon-cyan" :
                                stat.color === 'gold' ? "bg-neon-gold/20 text-neon-gold" :
                                    stat.color === 'red' ? "bg-neon-red/20 text-neon-red" :
                                        "bg-neon-green/20 text-neon-green"
                        )}>
                            <stat.icon size={20} className="" />
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="glass-card p-1 rounded-2xl border border-neon-cyan/10"
            >
                <NeonTable
                    columns={columns}
                    data={mockGifts}
                    onRowClick={(gift) => console.log('Asset focus:', gift.name)}
                />
            </motion.div>

            <NeonModal
                isOpen={isForgeModalOpen}
                onClose={() => setIsForgeModalOpen(false)}
                title="Forge New Gift"
                description="Create a new virtual gift for user tipping during live streams."
                variant="purple"
                actions={
                    <GlowButton variant="purple" onClick={() => setIsForgeModalOpen(false)} className="flex items-center gap-2">
                        <Check size={16} /> Mint Asset
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <NeonInput label="Gift Name" placeholder="e.g. Plasma Heart" icon={<Gift size={16} />} />
                    <div className="grid grid-cols-2 gap-4">
                        <NeonInput label="Coin Value" type="number" placeholder="500" icon={<Zap size={16} />} />
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Category</label>
                            <select className="flex h-10 w-full items-center justify-between rounded-lg border border-card-border bg-dark-bg/50 px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-neon-purple/50 focus:shadow-[0_0_10px_rgba(191,0,255,0.1)] transition-all">
                                <option value="BASIC">Basic</option>
                                <option value="PREMIUM">Premium</option>
                                <option value="EXCLUSIVE">Exclusive</option>
                                <option value="SPECIAL">Special</option>
                            </select>
                        </div>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}

// Internal component for Trending icon since Lucide TrendingUp was used but not imported in stat map
function TrendingUp({ size, className }: { size: number, className: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    );
}
