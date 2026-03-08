'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Search, Bell, Send, Users, Megaphone, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const mockNotifications = [
    { id: 'NT-101', title: 'System Maintenance Tonight', target: 'ALL_USERS', type: 'SYSTEM', sent: 48200, status: 'DELIVERED', date: '2024-03-07 08:00' },
    { id: 'NT-102', title: 'New Gift Pack Available!', target: 'VIP_USERS', type: 'PROMOTIONAL', sent: 12400, status: 'DELIVERED', date: '2024-03-06 18:00' },
    { id: 'NT-103', title: 'Your payout has been processed', target: 'HOSTS', type: 'TRANSACTIONAL', sent: 2800, status: 'DELIVERED', date: '2024-03-06 10:00' },
    { id: 'NT-104', title: 'Weekend Double Diamond Event!', target: 'ALL_USERS', type: 'PROMOTIONAL', sent: 0, status: 'SCHEDULED', date: '2024-03-09 09:00' },
    { id: 'NT-105', title: 'Platform Update: New Features', target: 'ALL_USERS', type: 'SYSTEM', sent: 0, status: 'DRAFT', date: '—' },
];

export default function NotificationsBroadcastPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

    const columns: Column<typeof mockNotifications[0]>[] = [
        {
            header: 'Broadcast ID',
            accessor: (n) => (
                <div className="flex items-center gap-2">
                    <Bell size={14} className="text-neon-gold" />
                    <span className="text-text-primary font-black text-xs">{n.id}</span>
                </div>
            )
        },
        {
            header: 'Message Content',
            accessor: (n) => (
                <div>
                    <div className="font-bold text-sm text-text-primary line-clamp-1">{n.title}</div>
                    <div className="flex items-center gap-1 text-[9px] text-text-muted uppercase font-bold mt-0.5">
                        <Users size={9} /> {n.target.replace('_', ' ')}
                    </div>
                </div>
            )
        },
        {
            header: 'Channel Type',
            accessor: (n) => (
                <NeonBadge variant={n.type === 'SYSTEM' ? 'cyan' : n.type === 'PROMOTIONAL' ? 'gold' : 'purple'}>
                    {n.type}
                </NeonBadge>
            )
        },
        {
            header: 'Recipients Reached',
            accessor: (n) => (
                <div className="flex items-center gap-1 text-xs">
                    <Send size={12} className="text-neon-green" />
                    <span className="font-bold text-text-primary">{n.sent.toLocaleString()}</span>
                </div>
            )
        },
        {
            header: 'Scheduled / Sent',
            accessor: (n) => <span className="text-[10px] text-text-muted font-mono">{n.date}</span>
        },
        {
            header: 'Dispatch Status',
            accessor: (n) => (
                <NeonBadge variant={n.status === 'DELIVERED' ? 'green' : n.status === 'SCHEDULED' ? 'cyan' : 'muted'}>
                    {n.status}
                </NeonBadge>
            )
        },
        {
            header: 'Actions',
            accessor: (n) => (
                <div className="flex items-center gap-2">
                    <button title="Send Now" className="p-2 rounded-lg bg-white/5 hover:bg-neon-green/20 hover:text-neon-green transition-all border border-transparent hover:border-neon-green/30">
                        <CheckCircle size={14} />
                    </button>
                    <button title="Schedule" className="p-2 rounded-lg bg-white/5 hover:bg-neon-gold/20 hover:text-neon-gold transition-all border border-transparent hover:border-neon-gold/30">
                        <Clock size={14} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <PageContainer>
            <PageHeader
                title="Broadcast Command Hub"
                description="System-wide notifications, promotions, and targeted user communications"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <NeonInput placeholder="Search broadcasts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} icon={<Search size={16} />} className="h-10" />
                        </div>
                        <GlowButton variant="gold" size="sm" className="flex items-center gap-2" onClick={() => setIsBroadcastModalOpen(true)}>
                            <Megaphone size={16} /> New Broadcast
                        </GlowButton>
                    </div>
                }
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
                {[
                    { label: 'Total Sent (Month)', value: '4.2M', color: 'cyan' },
                    { label: 'Open Rate', value: '68.4%', color: 'green' },
                    { label: 'Scheduled', value: '14', color: 'gold' },
                    { label: 'Draft Queue', value: '7', color: 'purple' },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="glass-card p-5 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{s.label}</p>
                        <p className="text-2xl font-black text-text-primary">{s.value}</p>
                    </motion.div>
                ))}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                className="glass-card p-1 rounded-2xl border border-neon-gold/10">
                <NeonTable columns={columns} data={mockNotifications} />
            </motion.div>

            <NeonModal
                isOpen={isBroadcastModalOpen}
                onClose={() => setIsBroadcastModalOpen(false)}
                title="System Broadcast"
                description="Dispatch a global or targeted notification to users."
                variant="gold"
                actions={
                    <GlowButton variant="gold" onClick={() => setIsBroadcastModalOpen(false)} className="flex items-center gap-2">
                        <Send size={16} />
                        Dispatch Notification
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <NeonInput label="Message Title" placeholder="e.g. Server Maintenance" icon={<Bell size={16} />} />
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Target Audience</label>
                        <select className="w-full bg-dark-bg/50 border border-card-border rounded-lg h-10 px-3 text-sm text-text-primary focus:outline-none focus:border-neon-gold/50 focus:shadow-[0_0_10px_rgba(255,215,0,0.1)] transition-all">
                            <option value="ALL_USERS">All Active Users</option>
                            <option value="VIP_USERS">VIP Members Only</option>
                            <option value="HOSTS">All Live Hosts</option>
                        </select>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
