'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Search, MessageSquare, CheckCircle, Clock, AlertCircle, HeadphonesIcon, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const mockTickets = [
    { id: 'TKT-5501', user: 'Luna Divine', subject: 'Diamond balance not updated', category: 'BILLING', priority: 'HIGH', status: 'OPEN', created: '2024-03-07 13:20' },
    { id: 'TKT-5502', user: 'Cyber Queen', subject: 'Cannot start live stream', category: 'TECHNICAL', priority: 'CRITICAL', status: 'IN_PROGRESS', created: '2024-03-07 12:45' },
    { id: 'TKT-5503', user: 'Nova Spark', subject: 'How to withdraw earnings?', category: 'GENERAL', priority: 'LOW', status: 'RESOLVED', created: '2024-03-07 10:00' },
    { id: 'TKT-5504', user: 'Shadow Dancer', subject: 'Account permanently banned unfairly', category: 'APPEAL', priority: 'HIGH', status: 'OPEN', created: '2024-03-06 21:00' },
    { id: 'TKT-5505', user: 'Void Nexus', subject: 'Gift not delivered to recipient', category: 'BILLING', priority: 'MEDIUM', status: 'RESOLVED', created: '2024-03-06 18:30' },
];

export default function SupportTicketsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    const columns: Column<typeof mockTickets[0]>[] = [
        {
            header: 'Ticket ID',
            accessor: (t) => (
                <div className="flex items-center gap-2">
                    <MessageSquare size={14} className="text-neon-cyan" />
                    <span className="text-text-primary font-black text-xs">{t.id}</span>
                </div>
            )
        },
        {
            header: 'Requester',
            accessor: (t) => <span className="font-bold text-sm text-text-primary">{t.user}</span>
        },
        {
            header: 'Subject',
            accessor: (t) => (
                <div className="text-xs text-text-primary line-clamp-1 max-w-[180px]">{t.subject}</div>
            )
        },
        {
            header: 'Category',
            accessor: (t) => (
                <NeonBadge variant={t.category === 'BILLING' ? 'gold' : t.category === 'TECHNICAL' ? 'red' : t.category === 'APPEAL' ? 'purple' : 'cyan'}>
                    {t.category}
                </NeonBadge>
            )
        },
        {
            header: 'Priority',
            accessor: (t) => (
                <div className={cn("text-[10px] font-black uppercase tracking-widest flex items-center gap-1",
                    t.priority === 'CRITICAL' ? "text-neon-red" :
                        t.priority === 'HIGH' ? "text-neon-gold" :
                            t.priority === 'MEDIUM' ? "text-neon-cyan" : "text-text-muted")}>
                    <AlertCircle size={10} /> {t.priority}
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (t) => (
                <NeonBadge variant={t.status === 'OPEN' ? 'red' : t.status === 'IN_PROGRESS' ? 'gold' : 'green'}>
                    {t.status.replace('_', ' ')}
                </NeonBadge>
            )
        },
        {
            header: 'Actions',
            accessor: () => (
                <div className="flex items-center gap-2">
                    <button title="Respond" className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all border border-transparent hover:border-neon-cyan/30"><MessageSquare size={14} /></button>
                    <button title="Resolve" className="p-2 rounded-lg bg-white/5 hover:bg-neon-green/20 hover:text-neon-green transition-all border border-transparent hover:border-neon-green/30"><CheckCircle size={14} /></button>
                </div>
            )
        }
    ];

    return (
        <PageContainer>
            <PageHeader
                title="Support Command Center"
                description="Platform user support tickets, escalations, and resolution tracking"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <NeonInput placeholder="Search ticket ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} icon={<Search size={16} />} className="h-10" />
                        </div>
                        <GlowButton variant="cyan" size="sm" className="flex items-center gap-2" onClick={() => setIsAssignModalOpen(true)}>
                            <HeadphonesIcon size={16} /> Assign Agent
                        </GlowButton>
                    </div>
                }
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                {[
                    { label: 'Open Tickets', value: '48', color: 'red' },
                    { label: 'In Progress', value: '12', color: 'gold' },
                    { label: 'Resolved Today', value: '84', color: 'green' },
                    { label: 'Avg Response', value: '1.4h', color: 'cyan' },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="glass-card p-5 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{s.label}</p>
                        <p className="text-2xl font-black text-text-primary">{s.value}</p>
                    </motion.div>
                ))}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                className="glass-card p-1 rounded-2xl border border-neon-cyan/10">
                <NeonTable columns={columns} data={mockTickets} />
            </motion.div>

            <NeonModal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                title="Assign Support Agent"
                description="Manually route tickets to specific customer service agents."
                variant="cyan"
                actions={
                    <GlowButton variant="cyan" onClick={() => setIsAssignModalOpen(false)} className="flex items-center gap-2">
                        <CheckCircle size={16} />
                        Confirm Assignment
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <NeonInput label="Agent Email/ID" placeholder="e.g. agent@sparklive.com" icon={<UserCircle size={16} />} />
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Target Ticket Category</label>
                        <select className="w-full bg-dark-bg/50 border border-card-border rounded-lg h-10 px-3 text-sm text-text-primary focus:outline-none focus:border-neon-cyan/50 focus:shadow-[0_0_10px_rgba(0,255,255,0.1)] transition-all">
                            <option value="UNASSIGNED">All Unassigned Tickets</option>
                            <option value="BILLING">Billing & Finance</option>
                            <option value="TECHNICAL">Technical Issues</option>
                        </select>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
