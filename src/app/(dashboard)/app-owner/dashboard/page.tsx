'use client';

import React, { useState } from 'react';
import { StatCard } from '@/components/gaming/StatCard';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { ActivityChart } from '@/components/charts/ActivityChart';
import { PageHeader } from '@/components/gaming/PageHeader';
import { PageContainer } from '@/components/gaming/PageContainer';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Users, DollarSign, Video, Zap, Download, FileText } from 'lucide-react';

const revenueData = [
    { name: 'Mon', amount: 4000 },
    { name: 'Tue', amount: 3000 },
    { name: 'Wed', amount: 5000 },
    { name: 'Thu', amount: 2780 },
    { name: 'Fri', amount: 6890 },
    { name: 'Sat', amount: 8390 },
    { name: 'Sun', amount: 9490 },
];

const activityData = [
    { name: 'Morning', users: 400 },
    { name: 'Noon', users: 1200 },
    { name: 'Evening', users: 3400 },
    { name: 'Night', users: 5600 },
    { name: 'Late Night', users: 2100 },
];

export default function AppOwnerDashboard() {
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    return (
        <PageContainer>
            <PageHeader
                title="App Owner Command Center"
                description="Global platform performance & revenue metrics"
                actions={
                    <GlowButton size="sm" variant="gold" className="flex items-center gap-2" onClick={() => setIsExportModalOpen(true)}>
                        <Download size={14} />
                        Export Data
                    </GlowButton>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Agents"
                    value={1240}
                    icon={<Users size={20} />}
                    trend={12.5}
                    variant="cyan"
                />
                <StatCard
                    title="Daily Revenue"
                    value={52400}
                    icon={<DollarSign size={20} />}
                    trend={8.2}
                    variant="gold"
                    prefix="$"
                />
                <StatCard
                    title="Live Rooms"
                    value={842}
                    icon={<Video size={20} />}
                    trend={-2.4}
                    variant="purple"
                />
                <StatCard
                    title="Active PKs"
                    value={156}
                    icon={<Zap size={20} />}
                    trend={24.1}
                    variant="gold"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6 min-h-[400px]">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-neon-cyan mb-6">Revenue Growth (7D)</h3>
                    <RevenueChart data={revenueData} />
                </div>
                <div className="glass-card p-6 min-h-[400px]">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-neon-purple mb-6">User Activity Peak Time</h3>
                    <ActivityChart data={activityData} />
                </div>
            </div>

            <NeonModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                title="Export Platform Data"
                description="Download platform performance metrics and user activity logs."
                variant="gold"
                actions={
                    <GlowButton variant="gold" onClick={() => setIsExportModalOpen(false)} className="flex items-center gap-2">
                        <FileText size={16} />
                        Generate & Download
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Select Target Data</label>
                        <select className="w-full bg-dark-bg/50 border border-card-border rounded-lg h-10 px-3 text-sm text-text-primary focus:outline-none focus:border-neon-gold/50 focus:shadow-[0_0_10px_rgba(255,215,0,0.1)] transition-all">
                            <option value="revenue">Revenue & Financials</option>
                            <option value="activity">User Activity & Engagement</option>
                            <option value="growth">Platform Growth Analytics</option>
                            <option value="all">Complete System Snapshot</option>
                        </select>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
