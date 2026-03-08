'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Search, Image, Link, Calendar, Eye, Plus, Pencil, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const mockBanners = [
    { id: 'BNR-01', title: 'Weekend Mega Sale', placement: 'HOME_HERO', type: 'PROMOTIONAL', clicks: 4280, impressions: 48000, status: 'ACTIVE', expires: '2024-03-10' },
    { id: 'BNR-02', title: 'New PK Tournament', placement: 'PK_LOBBY', type: 'EVENT', clicks: 1820, impressions: 22400, status: 'ACTIVE', expires: '2024-03-08' },
    { id: 'BNR-03', title: 'VIP Badge Upgrade', placement: 'PROFILE_PAGE', type: 'UPSELL', clicks: 960, impressions: 18000, status: 'PAUSED', expires: '2024-03-15' },
    { id: 'BNR-04', title: 'Double Diamonds Event', placement: 'HOME_HERO', type: 'PROMOTIONAL', clicks: 0, impressions: 0, status: 'SCHEDULED', expires: '2024-03-09' },
];

export default function BannersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

    const columns: Column<typeof mockBanners[0]>[] = [
        {
            header: 'Banner Asset',
            accessor: (b) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple">
                        <Image size={18} />
                    </div>
                    <div>
                        <div className="font-bold text-sm text-text-primary">{b.title}</div>
                        <div className="flex items-center gap-1 text-[9px] text-text-muted uppercase">
                            <Link size={9} /> {b.placement.replace('_', ' ')}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Campaign Type',
            accessor: (b) => (
                <NeonBadge variant={b.type === 'PROMOTIONAL' ? 'gold' : b.type === 'EVENT' ? 'red' : 'cyan'}>
                    {b.type}
                </NeonBadge>
            )
        },
        {
            header: 'Performance',
            accessor: (b) => (
                <div>
                    <div className="text-xs text-text-primary font-bold">{b.clicks.toLocaleString()} clicks</div>
                    <div className="text-[10px] text-text-muted">{b.impressions.toLocaleString()} impressions</div>
                    {b.impressions > 0 && (
                        <div className="text-[9px] text-neon-green font-black italic">
                            CTR: {((b.clicks / b.impressions) * 100).toFixed(1)}%
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Expires',
            accessor: (b) => (
                <div className="flex items-center gap-1 text-[10px] text-text-muted">
                    <Calendar size={10} className="text-neon-cyan" /> {b.expires}
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (b) => (
                <NeonBadge variant={b.status === 'ACTIVE' ? 'green' : b.status === 'PAUSED' ? 'gold' : b.status === 'SCHEDULED' ? 'cyan' : 'muted'}>
                    {b.status}
                </NeonBadge>
            )
        },
        {
            header: 'Controls',
            accessor: () => (
                <div className="flex items-center gap-2">
                    <button title="Preview" className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all border border-transparent hover:border-neon-cyan/30"><Eye size={14} /></button>
                    <button title="Edit" className="p-2 rounded-lg bg-white/5 hover:bg-neon-gold/20 hover:text-neon-gold transition-all border border-transparent hover:border-neon-gold/30"><Pencil size={14} /></button>
                </div>
            )
        }
    ];

    return (
        <PageContainer>
            <PageHeader
                title="Visual Campaign Manager"
                description="Control promotional banners, event slides, and in-app visual campaigns"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-60">
                            <NeonInput placeholder="Search campaigns..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} icon={<Search size={16} />} className="h-10" />
                        </div>
                        <GlowButton variant="purple" size="sm" className="flex items-center gap-2" onClick={() => setIsDeployModalOpen(true)}>
                            <Plus size={16} /> Deploy Banner
                        </GlowButton>
                    </div>
                }
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
                {[
                    { label: 'Active Campaigns', value: '12', color: 'green' },
                    { label: 'Total Impressions', value: '1.2M', color: 'cyan' },
                    { label: 'Avg CTR', value: '9.2%', color: 'gold' },
                    { label: 'Expiring Soon', value: '3', color: 'red' },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                        className="glass-card p-5 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{s.label}</p>
                        <p className="text-2xl font-black text-text-primary">{s.value}</p>
                    </motion.div>
                ))}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                className="glass-card p-1 rounded-2xl border border-neon-purple/10">
                <NeonTable columns={columns} data={mockBanners} />
            </motion.div>

            <NeonModal
                isOpen={isDeployModalOpen}
                onClose={() => setIsDeployModalOpen(false)}
                title="Deploy New Campaign Banner"
                description="Upload and configure a new visual banner for the application interface."
                variant="purple"
                actions={
                    <GlowButton variant="purple" onClick={() => setIsDeployModalOpen(false)} className="flex items-center gap-2">
                        <Check size={16} />
                        Launch Campaign
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <NeonInput label="Campaign Title" placeholder="e.g. Weekend Mega Sale" icon={<Link size={16} />} />
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Placement Zone</label>
                        <select className="w-full bg-dark-bg/50 border border-card-border rounded-lg h-10 px-3 text-sm text-text-primary focus:outline-none focus:border-neon-purple/50 focus:shadow-[0_0_10px_rgba(191,0,255,0.1)] transition-all">
                            <option value="HOME_HERO">Home Hero Header</option>
                            <option value="PK_LOBBY">PK Battle Lobby</option>
                            <option value="PROFILE_PAGE">User Profile Banner</option>
                        </select>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
