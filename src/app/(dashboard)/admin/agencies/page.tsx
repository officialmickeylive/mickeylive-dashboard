'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { Search, Briefcase, Users, TrendingUp, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock Data — Admin ghost/invisible browse mode (read-only)
const mockAgencies = [
    { id: '1', name: 'Stellar Talent', owner: 'Cassandra Nova', hosts: 42, earnings: 12500, status: 'ACTIVE', tier: 'ELITE' },
    { id: '2', name: 'Neon Streamers', owner: 'Leo Flux', hosts: 18, earnings: 4200, status: 'ACTIVE', tier: 'PRO' },
    { id: '3', name: 'Void Nexus', owner: 'Sylas Vane', hosts: 5, earnings: 900, status: 'INACTIVE', tier: 'STARTER' },
    { id: '4', name: 'Aether Media', owner: 'Luna Ray', hosts: 31, earnings: 8700, status: 'ACTIVE', tier: 'PRO' },
    { id: '5', name: 'Galaxy Entertainment', owner: 'Sarah Kim', hosts: 15, earnings: 3400, status: 'ACTIVE', tier: 'PRO' },
];

export default function AdminAgenciesPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const columns: Column<typeof mockAgencies[0]>[] = [
        {
            header: 'Agency / Corporate',
            accessor: (agency) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-neon-green font-black text-xs">
                        <Briefcase size={20} />
                    </div>
                    <div>
                        <div className="font-bold text-text-primary text-sm">{agency.name}</div>
                        <div className="text-[10px] text-text-muted font-medium">Owner: {agency.owner}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Tier Level',
            accessor: (agency) => (
                <NeonBadge variant={agency.tier === 'ELITE' ? 'gold' : agency.tier === 'PRO' ? 'cyan' : 'muted'}>
                    {agency.tier}
                </NeonBadge>
            )
        },
        {
            header: 'Host Units',
            accessor: (agency) => (
                <div className="flex items-center gap-2">
                    <Users size={14} className="text-neon-cyan" />
                    <span className="text-text-primary font-bold">{agency.hosts}</span>
                    <span className="text-[10px] text-text-muted">HOSTS</span>
                </div>
            )
        },
        {
            header: 'Revenue Generation',
            accessor: (agency) => (
                <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-neon-green" />
                    <span className="text-neon-green font-black tracking-widest text-xs">${agency.earnings.toLocaleString()}</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (agency) => (
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        agency.status === 'ACTIVE' ? "bg-neon-green shadow-[0_0_8px_rgba(0,255,100,0.5)]" : "bg-neon-red shadow-[0_0_8px_rgba(255,0,0,0.5)]"
                    )} />
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em]",
                        agency.status === 'ACTIVE' ? "text-neon-green" : "text-neon-red"
                    )}>
                        {agency.status}
                    </span>
                </div>
            )
        },
    ];

    return (
        <PageContainer>
            <PageHeader
                title="Agency Overview"
                description="Read-only browse mode — invisibly view all registered agencies and their metrics"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <NeonInput
                                placeholder="Search agency name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<Search size={16} />}
                                className="h-10"
                            />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-neon-purple/10 border border-neon-purple/30 rounded-xl text-neon-purple">
                            <Eye size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Ghost Mode</span>
                        </div>
                    </div>
                }
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                {[
                    { label: 'Total Agencies', value: '28', color: 'green' },
                    { label: 'Active Agencies', value: '22', color: 'cyan' },
                    { label: 'Total Hosts', value: '342', color: 'purple' },
                    { label: 'Avg Revenue', value: '$6,200', color: 'gold' },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="glass-card p-5 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{s.label}</p>
                        <p className="text-2xl font-black text-text-primary">{s.value}</p>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="glass-card p-1 rounded-2xl border border-neon-green/10"
            >
                <NeonTable
                    columns={columns}
                    data={mockAgencies}
                />
            </motion.div>
        </PageContainer>
    );
}
