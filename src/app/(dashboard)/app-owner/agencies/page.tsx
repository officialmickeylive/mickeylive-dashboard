'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Search, Plus, Briefcase, Users, TrendingUp, Settings, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock Data for Agency Management
const mockAgencies = [
    { id: '1', name: 'Stellar Talent', owner: 'Cassandra Nova', hosts: 42, earnings: 12500, status: 'ACTIVE', tier: 'ELITE' },
    { id: '2', name: 'Neon Streamers', owner: 'Leo Flux', hosts: 18, earnings: 4200, status: 'ACTIVE', tier: 'PRO' },
    { id: '3', name: 'Void Nexus', owner: 'Sylas Vane', hosts: 5, earnings: 900, status: 'INACTIVE', tier: 'STARTER' },
    { id: '4', name: 'Aether Media', owner: 'Luna Ray', hosts: 31, earnings: 8700, status: 'ACTIVE', tier: 'PRO' },
];

export default function AgencyManagementPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);

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
        {
            header: 'Matrix Actions',
            accessor: (agency) => (
                <div className="flex items-center gap-2">
                    <button title="Agency Settings" className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all border border-transparent hover:border-neon-cyan/30">
                        <Settings size={14} />
                    </button>
                    <GlowButton variant="cyan" size="sm" className="px-3 py-1">
                        Analyze
                    </GlowButton>
                </div>
            )
        }
    ];

    return (
        <PageContainer>
            <PageHeader
                title="Agency Infrastructure"
                description="Management and revenue tracking of registered agency units"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <NeonInput
                                placeholder="Scan agency name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<Search size={16} />}
                                className="h-10"
                            />
                        </div>
                        <GlowButton variant="green" size="sm" className="flex items-center gap-2" onClick={() => setIsOnboardModalOpen(true)}>
                            <Plus size={16} />
                            Onboard Agency
                        </GlowButton>
                    </div>
                }
            />

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="glass-card p-1 rounded-2xl border border-neon-green/10"
            >
                <NeonTable
                    columns={columns}
                    data={mockAgencies}
                    onRowClick={(agency) => console.log('Agency link established:', agency.name)}
                />
            </motion.div>

            <NeonModal
                isOpen={isOnboardModalOpen}
                onClose={() => setIsOnboardModalOpen(false)}
                title="Onboard New Agency"
                description="Register a new management entity to oversee hosts and collect commission."
                variant="green"
                actions={
                    <GlowButton variant="green" onClick={() => setIsOnboardModalOpen(false)} className="flex items-center gap-2">
                        <Check size={16} /> Establish Agency
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <NeonInput label="Agency Registered Name" placeholder="e.g. Stellar Talent" icon={<Briefcase size={16} />} />
                    <NeonInput label="Owner Principal Name" placeholder="e.g. Cassandra Nova" icon={<Users size={16} />} />
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Agency Tier Classification</label>
                        <select className="w-full bg-dark-bg/50 border border-card-border rounded-lg h-10 px-3 text-sm text-text-primary focus:outline-none focus:border-neon-green/50 focus:shadow-[0_0_10px_rgba(0,255,100,0.1)] transition-all">
                            <option value="STARTER">Starter Tier</option>
                            <option value="PRO">Pro Tier</option>
                            <option value="ELITE">Elite Syndicate</option>
                        </select>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
