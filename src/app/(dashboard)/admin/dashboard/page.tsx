'use client';

import React from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { Users, Briefcase, ClipboardCheck, Video, TrendingUp, Activity, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';

const weeklyData = [
    { day: 'Mon', approvals: 4, requests: 8 }, { day: 'Tue', approvals: 6, requests: 11 },
    { day: 'Wed', approvals: 3, requests: 7 }, { day: 'Thu', approvals: 9, requests: 14 },
    { day: 'Fri', approvals: 7, requests: 10 }, { day: 'Sat', approvals: 5, requests: 9 },
    { day: 'Sun', approvals: 8, requests: 12 },
];

const roomTrendData = [
    { hour: '06:00', active: 12 }, { hour: '09:00', active: 28 }, { hour: '12:00', active: 45 },
    { hour: '15:00', active: 62 }, { hour: '18:00', active: 89 }, { hour: '21:00', active: 120 },
    { hour: '00:00', active: 74 },
];

const recentActivity = [
    { text: 'Agency "Galaxy Entertainment" request approved', time: '5 min ago', type: 'success' },
    { text: 'Room RM-503 flagged for review', time: '18 min ago', type: 'danger' },
    { text: 'New agency request from "Pulse Networks"', time: '32 min ago', type: 'info' },
    { text: '3 new hosts registered under "Stellar Talent"', time: '1h ago', type: 'success' },
];

const tooltipStyle = { backgroundColor: '#0a0a1a', border: '1px solid rgba(0,255,255,0.2)', borderRadius: 8, color: '#e2e8f0', fontSize: 11 };

export default function AdminDashboardPage() {
    return (
        <PageContainer>
            <PageHeader
                title="Admin Dashboard"
                description="Read-only analytics overview — agency operations, room metrics, and activity feed"
            />

            {/* KPI Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {[
                    { title: 'Assigned Agencies', value: '12', trend: '+2 this week', icon: Briefcase, color: 'green' },
                    { title: 'Pending Requests', value: '5', trend: '3 urgent', icon: ClipboardCheck, color: 'gold' },
                    { title: 'Active Rooms', value: '89', trend: '+12% today', icon: Video, color: 'cyan' },
                    { title: 'Total Hosts', value: '342', trend: '+8 new', icon: Users, color: 'purple' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-5 rounded-2xl border border-white/5 relative overflow-hidden"
                    >
                        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{stat.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-2xl font-black text-text-primary">{stat.value}</p>
                            <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                stat.color === 'green' ? "bg-neon-green/10 text-neon-green" :
                                    stat.color === 'gold' ? "bg-neon-gold/10 text-neon-gold" :
                                        stat.color === 'cyan' ? "bg-neon-cyan/10 text-neon-cyan" :
                                            "bg-neon-purple/10 text-neon-purple"
                            )}>
                                <stat.icon size={16} />
                            </div>
                        </div>
                        <p className={cn("text-[10px] font-bold italic mt-1",
                            stat.color === 'green' ? "text-neon-green" : stat.color === 'gold' ? "text-neon-gold" :
                                stat.color === 'cyan' ? "text-neon-cyan" : "text-neon-purple"
                        )}>{stat.trend}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Agency Requests Chart */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    className="lg:col-span-1 glass-card p-6 rounded-2xl border border-neon-cyan/10">
                    <h3 className="text-xs font-black uppercase tracking-widest text-neon-cyan mb-4">Weekly Requests & Approvals</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={weeklyData} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Bar dataKey="requests" fill="rgba(255,200,0,0.7)" radius={[3, 3, 0, 0]} />
                            <Bar dataKey="approvals" fill="rgba(0,255,100,0.7)" radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Room Activity Trend */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="lg:col-span-1 glass-card p-6 rounded-2xl border border-neon-purple/10">
                    <h3 className="text-xs font-black uppercase tracking-widest text-neon-purple mb-4">Room Activity Trend (Today)</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={roomTrendData}>
                            <defs>
                                <linearGradient id="roomGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#bf00ff" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#bf00ff" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Area type="monotone" dataKey="active" stroke="#bf00ff" strokeWidth={2} fill="url(#roomGrad)" dot={{ fill: '#bf00ff', r: 3 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Recent Activity Feed */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                    className="glass-card p-6 rounded-2xl border border-white/5">
                    <h3 className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2 mb-4">
                        <Shield size={14} className="text-neon-cyan" /> Recent Activity
                    </h3>
                    <div className="flex flex-col gap-3">
                        {recentActivity.map((a, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                                    a.type === 'success' ? "bg-neon-green" : a.type === 'danger' ? "bg-neon-red" : "bg-neon-cyan")} />
                                <div>
                                    <p className="text-xs text-text-primary leading-tight">{a.text}</p>
                                    <p className="text-[10px] text-text-muted italic">{a.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </PageContainer>
    );
}
