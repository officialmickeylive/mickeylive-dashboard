'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { Search, Bell, Send, Users, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const mockNotifications = [
    { id: 'NT-101', title: 'System Maintenance Tonight', target: 'ALL_USERS', type: 'SYSTEM', sent: 48200, status: 'DELIVERED', date: '2026-03-07 08:00' },
    { id: 'NT-102', title: 'New Gift Pack Available!', target: 'VIP_USERS', type: 'PROMOTIONAL', sent: 12400, status: 'DELIVERED', date: '2026-03-06 18:00' },
    { id: 'NT-103', title: 'Your payout has been processed', target: 'HOSTS', type: 'TRANSACTIONAL', sent: 2800, status: 'DELIVERED', date: '2026-03-06 10:00' },
    { id: 'NT-104', title: 'Weekend Double Diamond Event!', target: 'ALL_USERS', type: 'PROMOTIONAL', sent: 0, status: 'SCHEDULED', date: '2026-03-09 09:00' },
    { id: 'NT-105', title: 'Platform Update: New Features', target: 'ALL_USERS', type: 'SYSTEM', sent: 0, status: 'DRAFT', date: '—' },
];

export default function AdminNotificationsPage() {
    const [searchTerm, setSearchTerm] = useState('');

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
            accessor: () => (
                <div className="flex items-center gap-2">
                    <button title="View Details" className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all border border-transparent hover:border-neon-cyan/30">
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
                title="Notification Center"
                description="View and manage platform-wide notifications and broadcasts"
                actions={
                    <div className="w-64">
                        <NeonInput placeholder="Search broadcasts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} icon={<Search size={16} />} className="h-10" />
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
        </PageContainer>
    );
}
