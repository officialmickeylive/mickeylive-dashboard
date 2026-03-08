'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Search, ClipboardCheck, Briefcase, Users, CheckCircle, XCircle, Clock, AlertTriangle, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const mockRequests = [
    { id: 'AR-001', name: 'Galaxy Entertainment', owner: 'Sarah Kim', hosts: 15, submitted: '2026-03-07 09:30', reason: 'Expanding to live-streaming talent management', status: 'PENDING' },
    { id: 'AR-002', name: 'Pulse Networks', owner: 'Marcus Dean', hosts: 8, submitted: '2026-03-06 18:10', reason: 'New agency partnership with regional streamers', status: 'PENDING' },
    { id: 'AR-003', name: 'Cipher Media Group', owner: 'Nina Voss', hosts: 22, submitted: '2026-03-06 14:00', reason: 'Professional host management and revenue sharing', status: 'APPROVED' },
    { id: 'AR-004', name: 'Shadow Corp', owner: 'Rex Hollow', hosts: 3, submitted: '2026-03-05 22:45', reason: 'Small-scale talent onboarding', status: 'REJECTED' },
    { id: 'AR-005', name: 'Neon Wave Studio', owner: 'Aria Chen', hosts: 11, submitted: '2026-03-05 10:15', reason: 'Creator economy platform integration', status: 'PENDING' },
];

export default function AgencyRequestsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<'approve' | 'reject'>('approve');
    const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

    const openConfirmModal = (action: 'approve' | 'reject', id: string) => {
        setModalAction(action);
        setSelectedRequest(id);
        setIsConfirmModalOpen(true);
    };

    const columns: Column<typeof mockRequests[0]>[] = [
        {
            header: 'Request ID',
            accessor: (r) => (
                <div className="flex items-center gap-2">
                    <ClipboardCheck size={14} className="text-neon-cyan" />
                    <span className="text-text-primary font-black tracking-widest text-xs">{r.id}</span>
                </div>
            )
        },
        {
            header: 'Agency Details',
            accessor: (r) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple font-black text-xs">
                        <Briefcase size={18} />
                    </div>
                    <div>
                        <div className="font-bold text-text-primary text-sm">{r.name}</div>
                        <div className="text-[10px] text-text-muted font-medium">Owner: {r.owner}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Proposed Hosts',
            accessor: (r) => (
                <div className="flex items-center gap-2">
                    <Users size={14} className="text-neon-cyan" />
                    <span className="text-text-primary font-bold">{r.hosts}</span>
                    <span className="text-[10px] text-text-muted">HOSTS</span>
                </div>
            )
        },
        {
            header: 'Submitted',
            accessor: (r) => <span className="text-[10px] text-text-muted font-mono">{r.submitted}</span>
        },
        {
            header: 'Status',
            accessor: (r) => (
                <NeonBadge variant={
                    r.status === 'APPROVED' ? 'green' :
                        r.status === 'REJECTED' ? 'red' : 'gold'
                }>
                    {r.status}
                </NeonBadge>
            )
        },
        {
            header: 'Actions',
            accessor: (r) => (
                <div className="flex items-center gap-2">
                    {r.status === 'PENDING' ? (
                        <>
                            <button
                                title="Approve Request"
                                onClick={(e) => { e.stopPropagation(); openConfirmModal('approve', r.id); }}
                                className="p-2 rounded-lg bg-white/5 hover:bg-neon-green/20 hover:text-neon-green transition-all border border-transparent hover:border-neon-green/30"
                            >
                                <CheckCircle size={14} />
                            </button>
                            <button
                                title="Reject Request"
                                onClick={(e) => { e.stopPropagation(); openConfirmModal('reject', r.id); }}
                                className="p-2 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red transition-all border border-transparent hover:border-neon-red/30"
                            >
                                <XCircle size={14} />
                            </button>
                        </>
                    ) : (
                        <span className="text-[10px] text-text-muted italic">Resolved</span>
                    )}
                </div>
            )
        }
    ];

    return (
        <PageContainer>
            <PageHeader
                title="Agency Request Queue"
                description="Review, approve, or reject incoming agency registration requests"
                actions={
                    <div className="w-64">
                        <NeonInput
                            placeholder="Search requests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={<Search size={16} />}
                            className="h-10"
                        />
                    </div>
                }
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                {[
                    { label: 'Pending Review', value: '3', color: 'gold', icon: Clock },
                    { label: 'Approved Today', value: '5', color: 'green', icon: CheckCircle },
                    { label: 'Rejected Today', value: '1', color: 'red', icon: XCircle },
                    { label: 'Total Requests', value: '42', color: 'cyan', icon: ClipboardCheck },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="glass-card p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{s.label}</p>
                        <p className="text-2xl font-black text-text-primary tracking-tight">{s.value}</p>
                        <s.icon size={20} className={cn("absolute top-4 right-4 opacity-20",
                            s.color === 'gold' ? "text-neon-gold" : s.color === 'green' ? "text-neon-green" :
                                s.color === 'red' ? "text-neon-red" : "text-neon-cyan")} />
                    </motion.div>
                ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                className="glass-card p-1 rounded-2xl border border-neon-purple/10">
                <NeonTable columns={columns} data={mockRequests} />
            </motion.div>

            <NeonModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                title={modalAction === 'approve' ? 'Approve Agency Request' : 'Reject Agency Request'}
                description={`Are you sure you want to ${modalAction} request ${selectedRequest}?`}
                variant={modalAction === 'approve' ? 'green' : 'red'}
                actions={
                    <GlowButton
                        variant={modalAction === 'approve' ? 'green' : 'red'}
                        onClick={() => setIsConfirmModalOpen(false)}
                        className="flex items-center gap-2"
                    >
                        <Check size={16} />
                        {modalAction === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                    </GlowButton>
                }
            >
                <div className={cn(
                    "text-sm text-text-primary p-4 rounded-xl border",
                    modalAction === 'approve'
                        ? "border-neon-green/20 bg-neon-green/5"
                        : "border-neon-red/20 bg-neon-red/5"
                )}>
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle size={14} className={modalAction === 'approve' ? "text-neon-green" : "text-neon-red"} />
                        <span className="font-bold text-xs uppercase">Confirmation Required</span>
                    </div>
                    <p>
                        {modalAction === 'approve'
                            ? 'This will grant the agency access to the platform and allow them to onboard hosts.'
                            : 'This will permanently reject the request. The agency owner will be notified.'}
                    </p>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
