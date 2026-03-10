'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Search, Plus, ShoppingBag, ShoppingCart, Tag, Zap, Layers, Palette, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock Data for Store System
const mockStoreItems = [
    { id: '1', name: 'Cyberpunk Frame', category: 'AVATAR_FRAME', price: 1200, duration: '30 Days', status: 'ACTIVE', sales: 850 },
    { id: '2', name: 'Neon Dragon Ride', category: 'ENTRY_EFFECT', price: 5000, duration: 'Permanent', status: 'ACTIVE', sales: 120 },
    { id: '3', name: 'Matrix Chat Bubble', category: 'CHAT_SKIN', price: 500, duration: '7 Days', status: 'ACTIVE', sales: 2100 },
    { id: '4', name: 'Gold VIP Badge', category: 'SPECIAL', price: 9999, duration: 'Permanent', status: 'INACTIVE', sales: 0 },
    { id: '5', name: 'Holographic Background', category: 'ROOM_SKIN', price: 2500, duration: '30 Days', status: 'ACTIVE', sales: 430 },
];

export default function StoreSystemPage() {
    
    const [searchTerm, setSearchTerm] = useState('');
    const [isInitializeModalOpen, setIsInitializeModalOpen] = useState(false);

    const columns: Column<typeof mockStoreItems[0]>[] = [
        {
            header: 'Product Asset',
            accessor: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-neon-purple/5 border border-white/5 flex items-center justify-center relative overflow-hidden group">
                        <ShoppingBag size={24} className="text-neon-purple group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-transparent" />
                    </div>
                    <div>
                        <div className="font-bold text-text-primary text-sm flex items-center gap-2">
                            {item.name}
                        </div>
                        <div className="text-[10px] text-text-muted font-medium flex items-center gap-1">
                            <Layers size={10} />
                            {item.duration} Validated
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Utility Class',
            accessor: (item) => (
                <NeonBadge variant={
                    item.category === 'ENTRY_EFFECT' ? 'red' :
                        item.category === 'AVATAR_FRAME' ? 'cyan' :
                            item.category === 'CHAT_SKIN' ? 'green' : 'purple'
                }>
                    {item.category.replace('_', ' ')}
                </NeonBadge>
            )
        },
        {
            header: 'Market Price',
            accessor: (item) => (
                <div className="flex items-center gap-2">
                    <Zap size={14} className="text-neon-gold" />
                    <span className="text-neon-gold font-black tracking-widest text-sm">{item.price.toLocaleString()}</span>
                </div>
            )
        },
        {
            header: 'Sales Volume',
            accessor: (item) => (
                <div className="flex flex-col gap-1">
                    <span className="text-text-primary font-bold">{item.sales.toLocaleString()}</span>
                    <span className="text-[9px] text-text-muted uppercase tracking-tighter font-bold">Units Acquired</span>
                </div>
            )
        },
        {
            header: 'Registry Status',
            accessor: (item) => (
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        item.status === 'ACTIVE' ? "bg-neon-green shadow-[0_0_8px_rgba(0,255,100,0.5)]" : "bg-neon-red shadow-[0_0_8px_rgba(255,0,0,0.5)]"
                    )} />
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em]",
                        item.status === 'ACTIVE' ? "text-neon-green" : "text-neon-red"
                    )}>
                        {item.status}
                    </span>
                </div>
            )
        },
        {
            header: 'Inventory Control',
            accessor: (item) => (
                <div className="flex items-center gap-2">
                    <GlowButton variant="purple" size="sm" className="px-3 py-1 text-[10px]">
                        Configure
                    </GlowButton>
                    <button title="Price Adjustment" className="p-2 rounded-lg bg-white/5 hover:bg-neon-gold/20 hover:text-neon-gold transition-all border border-transparent hover:border-neon-gold/30">
                        <Tag size={14} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <PageContainer>
            <PageHeader
                title="Commodity Control Center"
                description="Management of virtual goods, cosmetics, and status items for the global market"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <NeonInput
                                placeholder="Scan product matrix..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<Search size={16} />}
                                className="h-10"
                            />
                        </div>
                        <GlowButton variant="cyan" size="sm" className="flex items-center gap-2" onClick={() => setIsInitializeModalOpen(true)}>
                            <Plus size={16} />
                            Initialize Asset
                        </GlowButton>
                    </div>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { label: 'Active Listings', value: '84 Items', sub: 'across 6 categories', icon: ShoppingCart, color: 'purple' },
                    { label: 'Avg. Transaction', value: '1,250 Coins', sub: 'per unit sold', icon: Zap, color: 'gold' },
                    { label: 'New Arrivals', value: '12 Assets', sub: 'this week', icon: Palette, color: 'cyan' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-5 rounded-2xl border border-white/5 group relative overflow-hidden"
                    >
                        <div className="relative z-10 flex flex-col gap-1">
                            <p className="text-[10px] text-text-muted uppercase font-black tracking-[0.2em] leading-none mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-text-primary tracking-tight">{stat.value}</p>
                            <p className="text-[10px] text-text-muted italic">{stat.sub}</p>
                        </div>
                        <div className={cn(
                            "absolute top-1/2 -translate-y-1/2 right-6 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                            stat.color === 'purple' ? "bg-neon-purple/20 text-neon-purple" :
                                stat.color === 'gold' ? "bg-neon-gold/20 text-neon-gold" :
                                    "bg-neon-cyan/20 text-neon-cyan"
                        )}>
                            <stat.icon size={24} />
                        </div>
                        {/* Glow decor */}
                        <div className={cn(
                            "absolute -bottom-8 -right-8 w-16 h-16 rounded-full blur-[40px] opacity-20",
                            stat.color === 'purple' ? "bg-neon-purple" :
                                stat.color === 'gold' ? "bg-neon-gold" :
                                    "bg-neon-cyan"
                        )} />
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-card p-1 rounded-2xl border border-neon-purple/10"
            >
                <NeonTable
                    columns={columns}
                    data={mockStoreItems}
                    onRowClick={(item) => console.log('Asset link established:', item.name)}
                />
            </motion.div>

            <NeonModal
                isOpen={isInitializeModalOpen}
                onClose={() => setIsInitializeModalOpen(false)}
                title="Initialize Store Asset"
                description="List a new virtual commodity, cosmetic, or membership package in the registry."
                variant="cyan"
                actions={
                    <GlowButton variant="cyan" onClick={() => setIsInitializeModalOpen(false)} className="flex items-center gap-2">
                        <Check size={16} /> Develop Asset
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <NeonInput label="Asset Name" placeholder="e.g. Cyberpunk Frame" icon={<Palette size={16} />} />
                    <div className="grid grid-cols-2 gap-4">
                        <NeonInput label="Market Price (Coins)" type="number" placeholder="1200" icon={<Zap size={16} />} />
                        <NeonInput label="Duration Prefix" placeholder="e.g. 30 Days" icon={<Layers size={16} />} />
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
