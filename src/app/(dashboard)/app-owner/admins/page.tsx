'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Search, Plus, ShieldCheck, UserMinus, MoreVertical, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock Data for Admin Management
const mockAdmins = [
    { id: '1', name: 'Zion Sentinel', email: 'zion@spark.live', level: 99, sellers: 24, status: 'ACTIVE', lastActive: '2 mins ago' },
    { id: '2', name: 'Oracle Tech', email: 'oracle@spark.live', level: 85, sellers: 12, status: 'ACTIVE', lastActive: '1 hour ago' },
    { id: '3', name: 'Vanguard X', email: 'vanguard@spark.live', level: 78, sellers: 18, status: 'INACTIVE', lastActive: '3 days ago' },
    { id: '4', name: 'Cipher Zero', email: 'cipher@spark.live', level: 92, sellers: 31, status: 'ACTIVE', lastActive: 'Just now' },
];

export default function AdminManagementPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const columns: Column<typeof mockAdmins[0]>[] = [
        {
            header: 'Admin Identity',
            accessor: (admin) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple font-black text-xs shadow-[0_0_15px_rgba(191,0,255,0.1)]">
                        {admin.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <div className="font-bold text-text-primary text-sm flex items-center gap-2">
                            {admin.name}
                            <ShieldCheck size={14} className="text-neon-cyan" />
                        </div>
                        <div className="text-[10px] text-text-muted font-medium">{admin.email}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Security Level',
            accessor: (admin) => (
                <div className="flex items-center gap-2">
                    <span className="text-neon-gold font-black text-xs">LVL {admin.level}</span>
                    <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-neon-gold" style={{ width: `${admin.level}%` }} />
                    </div>
                </div>
            )
        },
        {
            header: 'Assigned Sellers',
            accessor: (admin) => (
                <div className="flex items-center gap-2">
                    <span className="text-text-primary font-bold">{admin.sellers}</span>
                    <span className="text-[10px] text-text-muted uppercase tracking-tighter">Units Managed</span>
                </div>
            )
        },
        {
            header: 'System Status',
            accessor: (admin) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            admin.status === 'ACTIVE' ? "bg-neon-green" : "bg-neon-red"
                        )} />
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-wider",
                            admin.status === 'ACTIVE' ? "text-neon-green" : "text-neon-red"
                        )}>
                            {admin.status}
                        </span>
                    </div>
                    <span className="text-[9px] text-text-muted italic">{admin.lastActive}</span>
                </div>
            )
        },
        {
            header: 'Operations',
            accessor: (admin) => (
                <div className="flex items-center gap-2">
                    <button title="Edit Credentials" className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all border border-transparent hover:border-neon-cyan/30">
                        <Edit3 size={14} />
                    </button>
                    <button title="Revoke Access" className="p-2 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red transition-all border border-transparent hover:border-neon-red/30">
                        <UserMinus size={14} />
                    </button>
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-glass transition-all">
                        <MoreVertical size={14} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <PageContainer>
            <PageHeader
                title="Admin Control Matrix"
                description="High-level security permissions and admin oversight"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <NeonInput
                                placeholder="Query admin ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<Search size={16} />}
                                className="h-10"
                            />
                        </div>
                        <GlowButton variant="cyan" size="sm" className="flex items-center gap-2" onClick={() => setIsAddModalOpen(true)}>
                            <Plus size={16} />
                            Deploy New Admin
                        </GlowButton>
                    </div>
                }
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="glass-card p-1 rounded-2xl border border-neon-purple/10"
            >
                <NeonTable
                    columns={columns}
                    data={mockAdmins}
                    onRowClick={(admin) => console.log('Admin link established:', admin.name)}
                />
            </motion.div>

            <NeonModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Deploy New Admin"
                description="Provision a new high-level clearance administrator account."
                variant="cyan"
                actions={
                    <GlowButton variant="cyan" onClick={() => setIsAddModalOpen(false)} className="flex items-center gap-2">
                        <ShieldCheck size={16} />
                        Provision Admin
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <NeonInput label="Admin Alias" placeholder="e.g. Cipher Zero" />
                    <NeonInput label="Contact Email" type="email" placeholder="admin@spark.live" />
                    <NeonInput label="Initial Security Level" type="number" placeholder="Enter level (1-100)" />
                    <div className="pt-2 border-t border-white/5">
                        <p className="text-xs text-neon-gold mb-2 flex items-center gap-2"><ShieldCheck size={14} /> Requires Super Admin confirmation.</p>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
