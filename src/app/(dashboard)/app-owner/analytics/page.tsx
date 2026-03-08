'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Download, TrendingUp, Users, Zap, BarChart3, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, AreaChart, Area
} from 'recharts';

const revenueData = [
    { month: 'Oct', revenue: 42000, users: 8200 },
    { month: 'Nov', revenue: 58000, users: 11400 },
    { month: 'Dec', revenue: 74000, users: 14800 },
    { month: 'Jan', revenue: 62000, users: 12300 },
    { month: 'Feb', revenue: 89000, users: 17200 },
    { month: 'Mar', revenue: 96000, users: 19800 },
];

const activityData = [
    { day: 'Mon', streams: 420, battles: 84 },
    { day: 'Tue', streams: 390, battles: 72 },
    { day: 'Wed', streams: 510, battles: 98 },
    { day: 'Thu', streams: 480, battles: 91 },
    { day: 'Fri', streams: 640, battles: 130 },
    { day: 'Sat', streams: 890, battles: 185 },
    { day: 'Sun', streams: 760, battles: 155 },
];

const tooltipStyle = { backgroundColor: '#0a0a1a', border: '1px solid rgba(0,255,255,0.2)', borderRadius: 8, color: '#e2e8f0', fontSize: 11 };

export default function AnalyticsPage() {
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    return (
        <PageContainer>
            <PageHeader
                title="Analytics Command Center"
                description="Platform-wide performance metrics, growth trends, and engagement intelligence"
                actions={
                    <GlowButton variant="cyan" size="sm" className="flex items-center gap-2" onClick={() => setIsExportModalOpen(true)}>
                        <Download size={16} /> Export Report
                    </GlowButton>
                }
            />

            {/* KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                {[
                    { label: 'Monthly Revenue', value: '$96,000', change: '+8.2%', color: 'green', icon: TrendingUp },
                    { label: 'Active Users', value: '19,800', change: '+15.1%', color: 'cyan', icon: Users },
                    { label: 'Coins Circulated', value: '48.2M', change: '+22.4%', color: 'gold', icon: Zap },
                    { label: 'Live Sessions', value: '1,245', change: '+4.7%', color: 'purple', icon: BarChart3 },
                ].map((kpi, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="glass-card p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{kpi.label}</p>
                        <p className="text-2xl font-black text-text-primary tracking-tight">{kpi.value}</p>
                        <p className={cn("text-[10px] font-black italic",
                            kpi.color === 'green' ? "text-neon-green" : kpi.color === 'cyan' ? "text-neon-cyan" :
                                kpi.color === 'gold' ? "text-neon-gold" : "text-neon-purple")}>
                            {kpi.change} vs last month
                        </p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Revenue Chart */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    className="glass-card p-6 rounded-2xl border border-neon-cyan/10">
                    <h3 className="text-xs font-black uppercase tracking-widest text-neon-cyan mb-5">Revenue & User Growth</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00ffff" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#00ffff" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Area type="monotone" dataKey="revenue" stroke="#00ffff" strokeWidth={2} fill="url(#revGrad)" dot={{ fill: '#00ffff', r: 3 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Activity Chart */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                    className="glass-card p-6 rounded-2xl border border-neon-purple/10">
                    <h3 className="text-xs font-black uppercase tracking-widest text-neon-purple mb-5">Weekly Streams & PK Battles</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={activityData} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Bar dataKey="streams" fill="rgba(191,0,255,0.7)" radius={[3, 3, 0, 0]} />
                            <Bar dataKey="battles" fill="rgba(255,0,80,0.7)" radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            <NeonModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                title="Export Analytics Data"
                description="Download complete platform analytics and intelligence metrics."
                variant="cyan"
                actions={
                    <GlowButton variant="cyan" onClick={() => setIsExportModalOpen(false)} className="flex items-center gap-2">
                        <FileText size={16} />
                        Generate & Download
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Select Target Data</label>
                        <select className="w-full bg-dark-bg/50 border border-card-border rounded-lg h-10 px-3 text-sm text-text-primary focus:outline-none focus:border-neon-cyan/50 focus:shadow-[0_0_10px_rgba(0,255,255,0.1)] transition-all">
                            <option value="revenue">Financial Revenue Report</option>
                            <option value="growth">User Growth & Retention</option>
                            <option value="activity">Streams & Battles Activity</option>
                            <option value="all">Complete System Snapshot</option>
                        </select>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
