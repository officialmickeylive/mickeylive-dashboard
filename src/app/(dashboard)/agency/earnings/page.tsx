'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Download, DollarSign, Percent, TrendingUp, Calendar, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const monthlyData = [
    { month: 'Oct', gross: 24000, commission: 4800, net: 19200 },
    { month: 'Nov', gross: 31000, commission: 6200, net: 24800 },
    { month: 'Dec', gross: 42000, commission: 8400, net: 33600 },
    { month: 'Jan', gross: 38000, commission: 7600, net: 30400 },
    { month: 'Feb', gross: 48000, commission: 9600, net: 38400 },
    { month: 'Mar', gross: 56000, commission: 11200, net: 44800 },
];

const tooltipStyle = { backgroundColor: '#0a0a1a', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 8, color: '#e2e8f0', fontSize: 11 };

export default function AgencyEarningsPage() {
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    return (
        <PageContainer>
            <PageHeader title="Agency Revenue & Commission" description="Earnings breakdown, host commission splits, and payout history"
                actions={<GlowButton variant="gold" size="sm" className="flex items-center gap-2" onClick={() => setIsExportModalOpen(true)}><Download size={16} /> Export Statement</GlowButton>} />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                {[
                    { label: 'Gross Revenue (Mar)', value: '$56,000', icon: DollarSign, color: 'green' },
                    { label: 'Commission Paid', value: '$11,200', icon: Percent, color: 'gold' },
                    { label: 'Net Earnings', value: '$44,800', icon: TrendingUp, color: 'cyan' },
                    { label: 'Next Payout', value: 'Mar 15', icon: Calendar, color: 'purple' },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="glass-card p-5 rounded-2xl border border-white/5 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color === 'green' ? "bg-neon-green/10 text-neon-green" : s.color === 'gold' ? "bg-neon-gold/10 text-neon-gold" : s.color === 'cyan' ? "bg-neon-cyan/10 text-neon-cyan" : "bg-neon-purple/10 text-neon-purple"}`}>
                            <s.icon size={18} />
                        </div>
                        <div><p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{s.label}</p><p className="text-xl font-black text-text-primary">{s.value}</p></div>
                    </motion.div>
                ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="glass-card p-6 rounded-2xl border border-neon-gold/10">
                <h3 className="text-xs font-black uppercase tracking-widest text-neon-gold mb-5">6-Month Revenue Breakdown</h3>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={monthlyData} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="gross" fill="rgba(255,215,0,0.7)" radius={[3, 3, 0, 0]} name="Gross ($)" />
                        <Bar dataKey="commission" fill="rgba(191,0,255,0.7)" radius={[3, 3, 0, 0]} name="Commission ($)" />
                        <Bar dataKey="net" fill="rgba(0,255,100,0.7)" radius={[3, 3, 0, 0]} name="Net ($)" />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>

            <NeonModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                title="Export Earnings Report"
                description="Download a detailed PDF/CSV of your agency's revenue and commission."
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
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Select Date Range</label>
                        <select className="w-full bg-dark-bg/50 border border-card-border rounded-lg h-10 px-3 text-sm text-text-primary focus:outline-none focus:border-neon-gold/50 focus:shadow-[0_0_10px_rgba(255,215,0,0.1)] transition-all">
                            <option value="last_30">Last 30 Days</option>
                            <option value="this_month">This Month (March)</option>
                            <option value="last_month">Last Month (February)</option>
                            <option value="year_to_date">Year to Date (2024)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Format</label>
                        <div className="grid grid-cols-2 gap-2">
                            <label className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:border-neon-gold/50 transition-all">
                                <input type="radio" name="format" defaultChecked className="accent-neon-gold" />
                                <span className="text-sm font-bold text-text-primary">PDF Statement</span>
                            </label>
                            <label className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:border-neon-gold/50 transition-all">
                                <input type="radio" name="format" className="accent-neon-gold" />
                                <span className="text-sm font-bold text-text-primary">CSV Spreadsheet</span>
                            </label>
                        </div>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
