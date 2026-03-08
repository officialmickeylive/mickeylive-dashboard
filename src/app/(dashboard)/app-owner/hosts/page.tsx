'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { LivePulse } from '@/components/gaming/LivePulse';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Search, Mic2, Users, Heart, Star, ShieldAlert, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock Data for Host Management
const mockHosts = [
    { id: '1', name: 'Luna Divine', agency: 'Stellar Talent', followers: '125K', diamonds: 85000, level: 45, isLive: true },
    { id: '2', name: 'Shadow Dancer', agency: 'Neon Streamers', followers: '42K', diamonds: 12000, level: 22, isLive: false },
    { id: '3', name: 'Cyber Queen', agency: 'Stellar Talent', followers: '210K', diamonds: 450000, level: 68, isLive: true },
    { id: '4', name: 'Nova Spark', agency: 'Aether Media', followers: '8K', diamonds: 2500, level: 12, isLive: false },
    { id: '5', name: 'Zen Master', agency: 'None (Independent)', followers: '55K', diamonds: 34000, level: 31, isLive: true },
];

export default function HostManagementPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);

    const columns: Column<typeof mockHosts[0]>[] = [
        {
            header: 'Host Identity',
            accessor: (host) => (
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan font-black text-xs overflow-hidden">
                            {host.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {host.isLive && (
                            <div className="absolute -bottom-1 -right-1">
                                <LivePulse />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="font-bold text-text-primary text-sm flex items-center gap-2">
                            {host.name}
                            {host.level > 50 && <Star size={12} className="text-neon-gold fill-neon-gold" />}
                        </div>
                        <div className="text-[10px] text-text-muted font-medium">{host.agency}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Stream Status',
            accessor: (host) => (
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border",
                        host.isLive
                            ? "text-neon-red border-neon-red/30 bg-neon-red/5"
                            : "text-text-muted border-white/5 bg-white/5"
                    )}>
                        {host.isLive ? 'Live Now' : 'Offline'}
                    </span>
                </div>
            )
        },
        {
            header: 'Engagement',
            accessor: (host) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-text-primary">
                        <Heart size={12} className="text-neon-pink" />
                        <span className="font-bold">{host.followers}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-text-muted">
                        <Users size={10} />
                        <span>Active Fanbase</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Diamond Wealth',
            accessor: (host) => (
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-purple shadow-[0_0_8px_rgba(191,0,255,0.6)]" />
                    <span className="text-neon-purple font-black tracking-wider text-sm">{host.diamonds.toLocaleString()}</span>
                </div>
            )
        },
        {
            header: 'Skill Level',
            accessor: (host) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-dark-bg border border-card-border flex items-center justify-center text-[10px] font-black text-neon-gold">
                        {host.level}
                    </div>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden w-12">
                        <div className="h-full bg-neon-gold" style={{ width: `${(host.level % 20) * 5}%` }} />
                    </div>
                </div>
            )
        },
        {
            header: 'Operator Console',
            accessor: (host) => (
                <div className="flex items-center gap-2">
                    <button title="View Stream" className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all border border-transparent hover:border-neon-cyan/30">
                        <Mic2 size={14} />
                    </button>
                    <button title="Security Audit" className="p-2 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red transition-all border border-transparent hover:border-neon-red/30">
                        <ShieldAlert size={14} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <PageContainer>
            <PageHeader
                title="Host Registry & Performance"
                description="Monitoring live status and engagement metrics of all platform entertainers"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <NeonInput
                                placeholder="Scan host alias..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<Search size={16} />}
                                className="h-10"
                            />
                        </div>
                        <GlowButton variant="purple" size="sm" className="flex items-center gap-2" onClick={() => setIsFeatureModalOpen(true)}>
                            <Star size={16} />
                            Feature Host
                        </GlowButton>
                    </div>
                }
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-card p-1 rounded-2xl border border-neon-cyan/10"
            >
                <NeonTable
                    columns={columns}
                    data={mockHosts}
                    onRowClick={(host) => console.log('Host intercept:', host.name)}
                />
            </motion.div>

            <NeonModal
                isOpen={isFeatureModalOpen}
                onClose={() => setIsFeatureModalOpen(false)}
                title="Feature Global Host"
                description="Highlight a top-performing host on the application's main landing dashboard."
                variant="purple"
                actions={
                    <GlowButton variant="purple" onClick={() => setIsFeatureModalOpen(false)} className="flex items-center gap-2">
                        <Check size={16} /> Execute Promotion
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <NeonInput label="Host Identity" placeholder="e.g. Luna Divine" icon={<Users size={16} />} />
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Promotion Duration</label>
                        <select className="w-full bg-dark-bg/50 border border-card-border rounded-lg h-10 px-3 text-sm text-text-primary focus:outline-none focus:border-neon-purple/50 focus:shadow-[0_0_10px_rgba(191,0,255,0.1)] transition-all">
                            <option value="24H">24 Standard Hours</option>
                            <option value="48H">48 Standard Hours</option>
                            <option value="7D">1 Planetary Cycle (7 Days)</option>
                        </select>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
