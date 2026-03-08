'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonBadge } from '@/components/gaming/NeonBadge';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { NeonInput } from '@/components/gaming/NeonInput';
import { Video, Users, Clock, Eye, Radio, Play } from 'lucide-react';
import { motion } from 'framer-motion';

import { LivePulse } from '@/components/gaming/LivePulse';

const myRooms = [
    { id: 'RM-101', title: 'Chill Night Stream', type: 'SOLO_LIVE', viewers: 1200, duration: '01:24:10', status: 'LIVE', category: 'CHAT' },
    { id: 'RM-102', title: 'Sunday Vibes', type: 'SOLO_LIVE', viewers: 840, duration: '00:48:30', status: 'ENDED', category: 'MUSIC' },
    { id: 'RM-103', title: 'Epic PK Battle', type: 'PK_BATTLE', viewers: 4500, duration: '00:30:00', status: 'ENDED', category: 'GAMING' },
];

export default function HostRoomsPage() {
    const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
    const columns: Column<typeof myRooms[0]>[] = [
        {
            header: 'Room', accessor: (r) => (
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-9 h-9 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan"><Video size={16} /></div>
                        {r.status === 'LIVE' && <div className="absolute -top-1 -left-1"><LivePulse /></div>}
                    </div>
                    <div><div className="font-bold text-sm text-text-primary">{r.title}</div><div className="text-[9px] text-text-muted uppercase">{r.category}</div></div>
                </div>
            )
        },
        { header: 'Type', accessor: (r) => <NeonBadge variant={r.type === 'PK_BATTLE' ? 'red' : 'cyan'}>{r.type.replace('_', ' ')}</NeonBadge> },
        { header: 'Viewers', accessor: (r) => <div className="flex items-center gap-1"><Users size={12} className="text-neon-cyan" /><span className="font-bold text-sm">{r.viewers.toLocaleString()}</span></div> },
        { header: 'Duration', accessor: (r) => <div className="flex items-center gap-1 text-text-muted text-xs font-mono"><Clock size={12} />{r.duration}</div> },
        { header: 'Status', accessor: (r) => <NeonBadge variant={r.status === 'LIVE' ? 'red' : 'muted'}>{r.status}</NeonBadge> },
        { header: 'Actions', accessor: () => <button className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all"><Eye size={14} /></button> }
    ];
    return (
        <PageContainer>
            <PageHeader title="My Stream Rooms" description="History and live status of all your streaming sessions"
                actions={<GlowButton variant="red" size="sm" className="flex items-center gap-2" onClick={() => setIsLiveModalOpen(true)}><Radio size={16} /> Go Live</GlowButton>} />
            <div className="grid grid-cols-3 gap-5 mb-8">
                {[{ label: 'Total Sessions', value: '284' }, { label: 'Total Viewers', value: '1.2M' }, { label: 'Hours Live', value: '448h' }].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="glass-card p-5 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{s.label}</p>
                        <p className="text-2xl font-black text-text-primary">{s.value}</p>
                    </motion.div>
                ))}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-1 rounded-2xl border border-neon-cyan/10">
                <NeonTable columns={columns} data={myRooms} />
            </motion.div>

            <NeonModal
                isOpen={isLiveModalOpen}
                onClose={() => setIsLiveModalOpen(false)}
                title="Start Live Stream"
                description="Configure your stream settings before broadcasting to viewers."
                variant="red"
                actions={
                    <GlowButton variant="red" onClick={() => setIsLiveModalOpen(false)} className="flex items-center gap-2">
                        <Play size={16} />
                        Go Live Now
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <NeonInput label="Stream Title" placeholder="What are you doing today?" />
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Category</label>
                        <select className="w-full bg-dark-bg/50 border border-card-border rounded-lg h-10 px-3 text-sm text-text-primary focus:outline-none focus:border-neon-red/50 focus:shadow-[0_0_10px_rgba(255,0,0,0.1)] transition-all">
                            <option value="chat">Just Chatting</option>
                            <option value="music">Music & Performance</option>
                            <option value="gaming">Gaming</option>
                            <option value="dance">Dance & Fitness</option>
                        </select>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
