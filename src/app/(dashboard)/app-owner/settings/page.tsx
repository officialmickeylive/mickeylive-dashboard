'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonInput } from '@/components/gaming/NeonInput';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Save, Settings, Globe, Shield, Bell, Coins, Zap, ToggleLeft, ToggleRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SettingToggle { label: string; desc: string; enabled: boolean; }

const settingGroups: { title: string; icon: React.ReactNode; color: string; settings: SettingToggle[] }[] = [
    {
        title: 'Platform Operations', icon: <Globe size={16} />, color: 'cyan',
        settings: [
            { label: 'Maintenance Mode', desc: 'Temporarily disable user access', enabled: false },
            { label: 'New User Registration', desc: 'Allow new accounts to register', enabled: true },
            { label: 'Live Streaming', desc: 'Allow hosts to go live', enabled: true },
        ]
    },
    {
        title: 'Financial Controls', icon: <Coins size={16} />, color: 'gold',
        settings: [
            { label: 'Coin Purchases', desc: 'Accept in-app coin transactions', enabled: true },
            { label: 'Diamond Trading', desc: 'Enable P2P diamond exchange', enabled: true },
            { label: 'Host Payouts', desc: 'Process host withdrawal requests', enabled: false },
        ]
    },
    {
        title: 'Security & Access', icon: <Shield size={16} />, color: 'red',
        settings: [
            { label: 'Two-Factor Auth Force', desc: 'Require 2FA for all admin roles', enabled: true },
            { label: 'Geo-Restriction', desc: 'Enable country-level blocking', enabled: false },
            { label: 'Anti-Fraud System', desc: 'Real-time fraud detection active', enabled: true },
        ]
    },
    {
        title: 'Notification System', icon: <Bell size={16} />, color: 'purple',
        settings: [
            { label: 'Push Notifications', desc: 'Send mobile push alerts', enabled: true },
            { label: 'Email Digests', desc: 'Weekly email summaries to users', enabled: true },
            { label: 'In-App Alerts', desc: 'Show system-level banners in app', enabled: true },
        ]
    },
];

export default function AppSettingsPage() {
    const [groups, setGroups] = useState(settingGroups);
    const [siteName, setSiteName] = useState('Spark Live');
    const [supportEmail, setSupportEmail] = useState('support@sparklive.com');
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

    const toggleSetting = (gIdx: number, sIdx: number) => {
        setGroups(prev => prev.map((g, gi) =>
            gi === gIdx ? { ...g, settings: g.settings.map((s, si) => si === sIdx ? { ...s, enabled: !s.enabled } : s) } : g
        ));
    };

    return (
        <PageContainer>
            <PageHeader
                title="Platform Configuration Terminal"
                description="Core system settings, feature flags, and operational controls"
                actions={
                    <GlowButton variant="cyan" size="sm" className="flex items-center gap-2" onClick={() => setIsSaveModalOpen(true)}>
                        <Save size={16} /> Save Configuration
                    </GlowButton>
                }
            />

            {/* Global Settings */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 rounded-2xl border border-white/5 mb-6">
                <div className="flex items-center gap-2 mb-5">
                    <Settings size={16} className="text-neon-cyan" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">Global Identity</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="text-[10px] text-text-muted uppercase font-black tracking-widest block mb-2">Platform Name</label>
                        <NeonInput value={siteName} onChange={(e) => setSiteName(e.target.value)} icon={<Globe size={14} />} />
                    </div>
                    <div>
                        <label className="text-[10px] text-text-muted uppercase font-black tracking-widest block mb-2">Support Email</label>
                        <NeonInput value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} icon={<Bell size={14} />} />
                    </div>
                </div>
            </motion.div>

            {/* Feature Toggle Groups */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groups.map((group, gIdx) => (
                    <motion.div key={gIdx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gIdx * 0.1 }}
                        className={cn("glass-card p-6 rounded-2xl border",
                            group.color === 'cyan' ? "border-neon-cyan/10" :
                                group.color === 'gold' ? "border-neon-gold/10" :
                                    group.color === 'red' ? "border-neon-red/10" : "border-neon-purple/10"
                        )}>
                        <div className={cn("flex items-center gap-2 mb-5",
                            group.color === 'cyan' ? "text-neon-cyan" :
                                group.color === 'gold' ? "text-neon-gold" :
                                    group.color === 'red' ? "text-neon-red" : "text-neon-purple")}>
                            {group.icon}
                            <h3 className="text-xs font-black uppercase tracking-widest">{group.title}</h3>
                        </div>
                        <div className="flex flex-col gap-4">
                            {group.settings.map((setting, sIdx) => (
                                <div key={sIdx} className="flex items-center justify-between gap-4">
                                    <div>
                                        <div className="text-sm font-bold text-text-primary">{setting.label}</div>
                                        <div className="text-[10px] text-text-muted">{setting.desc}</div>
                                    </div>
                                    <button onClick={() => toggleSetting(gIdx, sIdx)} className="transition-colors flex-shrink-0">
                                        {setting.enabled
                                            ? <ToggleRight size={28} className={cn(
                                                group.color === 'cyan' ? "text-neon-cyan" :
                                                    group.color === 'gold' ? "text-neon-gold" :
                                                        group.color === 'red' ? "text-neon-red" : "text-neon-purple"
                                            )} />
                                            : <ToggleLeft size={28} className="text-text-muted" />}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            <NeonModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                title="Commit Platform Configuration"
                description="Are you sure you want to write these settings to the master database? Some toggles may instantly drop user connections."
                variant="cyan"
                actions={
                    <GlowButton variant="cyan" onClick={() => setIsSaveModalOpen(false)} className="flex items-center gap-2">
                        <Check size={16} /> Confirm Changes
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <div className="text-sm text-text-primary p-4 border border-neon-cyan/20 bg-neon-cyan/5 rounded-xl">
                        <p className="font-bold flex items-center gap-2 mb-2"><Globe size={16} className="text-neon-cyan" /> Syncing Global Nodes...</p>
                        <ul className="list-disc pl-5 space-y-1 text-xs text-text-muted">
                            <li>Updating Master Config Registry</li>
                            <li>Broadcasting new Feature Flags to connected edge nodes</li>
                            <li>Refreshing Global State cache</li>
                        </ul>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
