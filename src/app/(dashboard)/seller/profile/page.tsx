'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { Save, Shield, Bell, UserCircle, Key, Camera, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminProfilePage() {
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [name, setName] = useState('Admin Commander');
    const [email, setEmail] = useState('admin@sparklive.com');
    const [notifs, setNotifs] = useState(true);
    const [twoFA, setTwoFA] = useState(true);

    return (
        <PageContainer>
            <PageHeader title="Admin Profile & Settings" description="Your account information, security preferences, and notification controls"
                actions={<GlowButton variant="cyan" size="sm" className="flex items-center gap-2" onClick={() => setIsSaveModalOpen(true)}><Save size={16} /> Save Changes</GlowButton>} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Avatar */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-neon-purple/10 border-2 border-neon-purple/30 flex items-center justify-center text-neon-purple text-3xl font-black">A</div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-neon-cyan border border-neon-cyan/50 text-black flex items-center justify-center hover:scale-110 transition-transform">
                            <Camera size={14} />
                        </button>
                    </div>
                    <div className="text-center">
                        <p className="font-black text-text-primary">{name}</p>
                        <p className="text-[10px] text-neon-purple uppercase font-bold tracking-widest">Admin</p>
                    </div>
                </motion.div>

                {/* Profile Info */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="md:col-span-2 glass-card p-6 rounded-2xl border border-white/5 flex flex-col gap-5">
                    <div className="flex items-center gap-2 mb-1"><UserCircle size={15} className="text-neon-cyan" /><h3 className="text-xs font-black uppercase tracking-widest text-neon-cyan">Profile Information</h3></div>
                    <NeonInput label="Display Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <NeonInput label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <NeonInput label="New Password" placeholder="Leave blank to keep current" type="password" icon={<Key size={14} />} />
                </motion.div>

                {/* Security */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="glass-card p-6 rounded-2xl border border-neon-red/10 flex flex-col gap-4">
                    <div className="flex items-center gap-2"><Shield size={15} className="text-neon-red" /><h3 className="text-xs font-black uppercase tracking-widest text-neon-red">Security</h3></div>
                    {[{ label: 'Two-Factor Auth', state: twoFA, set: setTwoFA }, { label: 'Login Alerts', state: notifs, set: setNotifs }].map(({ label, state, set }, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <span className="text-sm text-text-primary font-bold">{label}</span>
                            <button onClick={() => set(!state)} className="text-sm font-black uppercase tracking-widest transition-colors">
                                <span className={state ? "text-neon-green" : "text-text-muted"}>{state ? 'Enabled' : 'Disabled'}</span>
                            </button>
                        </div>
                    ))}
                </motion.div>

                {/* Notifications */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="md:col-span-2 glass-card p-6 rounded-2xl border border-neon-gold/10">
                    <div className="flex items-center gap-2 mb-4"><Bell size={15} className="text-neon-gold" /><h3 className="text-xs font-black uppercase tracking-widest text-neon-gold">Notification Preferences</h3></div>
                    {['New host application submitted', 'Coin trade completed', 'Report escalated to me', 'System maintenance scheduled'].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                            <span className="text-sm text-text-primary">{item}</span>
                            <button className="text-[10px] font-black uppercase text-neon-green tracking-widest">ON</button>
                        </div>
                    ))}
                </motion.div>
            </div>

            <NeonModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                title="Save Profile Update"
                description="Are you sure you want to save the changes made to your profile and security settings?"
                variant="cyan"
                actions={
                    <GlowButton variant="cyan" onClick={() => setIsSaveModalOpen(false)} className="flex items-center gap-2">
                        <Check size={16} />
                        Confirm & Save
                    </GlowButton>
                }
            >
                <div className="p-4 bg-neon-cyan/5 border border-neon-cyan/20 rounded-xl flex items-center gap-3 text-sm text-text-primary">
                    <Save size={24} className="text-neon-cyan" />
                    <p>Your new configurations will be applied immediately across all active sessions.</p>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
