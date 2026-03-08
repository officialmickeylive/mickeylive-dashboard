'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Search, Filter, Eye, Shield, UserCheck, UserX, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock Data for User Management
const mockUsers = [
    { id: '1', name: 'Alpha Draconis', email: 'alpha@matrix.io', role: 'ADMIN', status: 'ACTIVE', coins: 15200, diamonds: 450, level: 42 },
    { id: '2', name: 'Nebula Knight', email: 'nebula@void.com', role: 'HOST', status: 'ACTIVE', coins: 8400, diamonds: 120, level: 28 },
    { id: '3', name: 'Cyber Phantom', email: 'phantom@ghost.net', role: 'AGENCY', status: 'SUSPENDED', coins: 0, diamonds: 5, level: 15 },
    { id: '4', name: 'Solar Flare', email: 'flare@nova.org', role: 'SELLER', status: 'ACTIVE', coins: 45000, diamonds: 2100, level: 56 },
    { id: '5', name: 'Void Walker', email: 'void@null.ptr', role: 'CUSTOMER', status: 'ACTIVE', coins: 1200, diamonds: 0, level: 8 },
];

export default function UserManagementPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const columns: Column<typeof mockUsers[0]>[] = [
        {
            header: 'User identity',
            accessor: (user) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan font-black text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <div className="font-bold text-text-primary text-sm">{user.name}</div>
                        <div className="text-[10px] text-text-muted font-medium">{user.email}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Rank / Role',
            accessor: (user) => <NeonBadge>{user.role}</NeonBadge>
        },
        {
            header: 'Level',
            accessor: (user) => (
                <div className="flex items-center gap-3 w-32">
                    <div className="w-8 h-8 rounded-lg bg-dark-bg border border-card-border flex items-center justify-center text-[10px] font-black text-neon-gold shadow-[0_0_10px_rgba(255,215,0,0.1)]">
                        {user.level}
                    </div>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(user.level % 10) * 10}%` }}
                            className="h-full bg-gradient-to-r from-neon-gold/50 to-neon-gold"
                        />
                    </div>
                </div>
            )
        },
        {
            header: 'Wallet Balance',
            accessor: (user) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-neon-gold font-black tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-gold animate-pulse" />
                        {user.coins.toLocaleString()} <span className="text-[8px] text-text-muted">COINS</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neon-purple font-black tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-purple shadow-[0_0_5px_rgba(191,0,255,0.5)]" />
                        {user.diamonds.toLocaleString()} <span className="text-[8px] text-text-muted">DIAMONDS</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (user) => (
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        user.status === 'ACTIVE' ? "bg-neon-green shadow-[0_0_8px_rgba(0,255,100,0.5)]" : "bg-neon-red shadow-[0_0_8px_rgba(255,0,0,0.5)]"
                    )} />
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em]",
                        user.status === 'ACTIVE' ? "text-neon-green" : "text-neon-red"
                    )}>
                        {user.status}
                    </span>
                </div>
            )
        },
        {
            header: 'Operations',
            accessor: (user) => (
                <div className="flex items-center gap-1">
                    <button title="View Profile" className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all border border-transparent hover:border-neon-cyan/30">
                        <Eye size={14} />
                    </button>
                    <button title="Permissions" className="p-2 rounded-lg bg-white/5 hover:bg-neon-gold/20 hover:text-neon-gold transition-all border border-transparent hover:border-neon-gold/30">
                        <Shield size={14} />
                    </button>
                    <button
                        title={user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        className={cn(
                            "p-2 rounded-lg bg-white/5 transition-all border border-transparent",
                            user.status === 'ACTIVE'
                                ? "hover:bg-neon-red/20 hover:text-neon-red hover:border-neon-red/30"
                                : "hover:bg-neon-green/20 hover:text-neon-green hover:border-neon-green/30"
                        )}
                    >
                        {user.status === 'ACTIVE' ? <UserX size={14} /> : <UserCheck size={14} />}
                    </button>
                </div>
            )
        }
    ];

    return (
        <PageContainer>
            <PageHeader
                title="User Base Access"
                description="Global user registry and security matrix"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <NeonInput
                                placeholder="Scan for identity..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<Search size={16} />}
                                className="h-10"
                            />
                        </div>
                        <GlowButton variant="purple" size="sm" className="flex items-center gap-2" onClick={() => setIsFilterModalOpen(true)}>
                            <Filter size={14} />
                            Matrix Filter
                        </GlowButton>
                    </div>
                }
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-1 rounded-2xl"
            >
                <NeonTable
                    columns={columns}
                    data={mockUsers}
                    onRowClick={(user) => console.log('Matrix access:', user.name)}
                />
            </motion.div>

            <NeonModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                title="Advanced Matrix Filter"
                description="Apply strict parameters to isolate specific user identities from the global database."
                variant="purple"
                actions={
                    <GlowButton variant="purple" onClick={() => setIsFilterModalOpen(false)} className="flex items-center gap-2">
                        <Check size={16} /> Apply Protocol
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Account Role</label>
                            <select className="flex h-10 w-full items-center justify-between rounded-lg border border-card-border bg-dark-bg/50 px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-neon-purple/50 focus:shadow-[0_0_10px_rgba(191,0,255,0.1)] transition-all">
                                <option value="ALL">All Identities</option>
                                <option value="HOST">Hosts</option>
                                <option value="AGENCY">Agencies</option>
                                <option value="SELLER">Sellers</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Account Status</label>
                            <select className="flex h-10 w-full items-center justify-between rounded-lg border border-card-border bg-dark-bg/50 px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-neon-purple/50 focus:shadow-[0_0_10px_rgba(191,0,255,0.1)] transition-all">
                                <option value="ALL">All States</option>
                                <option value="ACTIVE">Active Node</option>
                                <option value="SUSPENDED">Suspended Node</option>
                            </select>
                        </div>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
