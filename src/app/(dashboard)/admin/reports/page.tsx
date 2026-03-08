'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { Search, Flag, AlertTriangle, Eye, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const mockReports = [
    { id: 'RPT-001', reporter: 'User#8821', target: 'Void Nexus', type: 'HATE_SPEECH', severity: 'HIGH', date: '2026-03-07 14:10', status: 'OPEN' },
    { id: 'RPT-002', reporter: 'User#4432', target: 'Cipher Zero', type: 'SPAM', severity: 'LOW', date: '2026-03-07 13:55', status: 'RESOLVED' },
    { id: 'RPT-003', reporter: 'User#2201', target: 'Shadow Bot', type: 'FRAUD', severity: 'CRITICAL', date: '2026-03-07 11:30', status: 'OPEN' },
    { id: 'RPT-004', reporter: 'User#9934', target: 'Luna Divine', type: 'INAPPROPRIATE', severity: 'MEDIUM', date: '2026-03-07 10:00', status: 'DISMISSED' },
    { id: 'RPT-005', reporter: 'User#1122', target: 'Nova Spark', type: 'SCAM', severity: 'HIGH', date: '2026-03-07 09:15', status: 'OPEN' },
];

export default function AdminReportsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const columns: Column<typeof mockReports[0]>[] = [
        {
            header: 'Report ID',
            accessor: (r) => (
                <div className="flex items-center gap-2">
                    <Flag size={14} className="text-neon-red" />
                    <span className="text-text-primary font-black tracking-widest text-xs">{r.id}</span>
                </div>
            )
        },
        {
            header: 'Reporter → Target',
            accessor: (r) => (
                <div className="text-xs">
                    <span className="text-text-muted">{r.reporter}</span>
                    <span className="text-neon-red mx-2">→</span>
                    <span className="font-bold text-text-primary">{r.target}</span>
                </div>
            )
        },
        {
            header: 'Incident Type',
            accessor: (r) => (
                <NeonBadge variant={
                    r.type === 'FRAUD' || r.type === 'SCAM' ? 'red' :
                        r.type === 'HATE_SPEECH' ? 'purple' :
                            r.type === 'SPAM' ? 'cyan' : 'muted'
                }>
                    {r.type.replace('_', ' ')}
                </NeonBadge>
            )
        },
        {
            header: 'Severity',
            accessor: (r) => (
                <div className={cn("text-[10px] font-black uppercase tracking-widest flex items-center gap-1",
                    r.severity === 'CRITICAL' ? "text-neon-red" :
                        r.severity === 'HIGH' ? "text-neon-gold" :
                            r.severity === 'MEDIUM' ? "text-neon-cyan" : "text-text-muted")}>
                    <AlertTriangle size={10} />
                    {r.severity}
                </div>
            )
        },
        {
            header: 'Date Filed',
            accessor: (r) => <span className="text-[10px] text-text-muted font-mono">{r.date}</span>
        },
        {
            header: 'Resolution',
            accessor: (r) => (
                <NeonBadge variant={
                    r.status === 'OPEN' ? 'red' :
                        r.status === 'RESOLVED' ? 'green' : 'muted'
                }>
                    {r.status}
                </NeonBadge>
            )
        },
        {
            header: 'Actions',
            accessor: () => (
                <div className="flex items-center gap-2">
                    <button title="Review" className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all border border-transparent hover:border-neon-cyan/30"><Eye size={14} /></button>
                    <button title="Resolve" className="p-2 rounded-lg bg-white/5 hover:bg-neon-green/20 hover:text-neon-green transition-all border border-transparent hover:border-neon-green/30"><CheckCircle size={14} /></button>
                </div>
            )
        }
    ];

    return (
        <PageContainer>
            <PageHeader
                title="Reports Console"
                description="View and manage reported incidents within your assigned scope"
                actions={
                    <div className="w-64">
                        <NeonInput placeholder="Search report ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} icon={<Search size={16} />} className="h-10" />
                    </div>
                }
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
                {[
                    { label: 'Open Reports', value: '34', color: 'red' },
                    { label: 'Critical Flags', value: '6', color: 'gold' },
                    { label: 'Resolved Today', value: '128', color: 'green' },
                    { label: 'Dismissed', value: '12', color: 'purple' },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="glass-card p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{s.label}</p>
                        <p className="text-2xl font-black text-text-primary tracking-tight">{s.value}</p>
                        <div className={cn("absolute bottom-0 left-0 h-1 w-full",
                            s.color === 'red' ? "bg-neon-red" : s.color === 'gold' ? "bg-neon-gold" :
                                s.color === 'green' ? "bg-neon-green" : "bg-neon-purple")} />
                    </motion.div>
                ))}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                className="glass-card p-1 rounded-2xl border border-neon-red/10">
                <NeonTable columns={columns} data={mockReports} />
            </motion.div>
        </PageContainer>
    );
}
