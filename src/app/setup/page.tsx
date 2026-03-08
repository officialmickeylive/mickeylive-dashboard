'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonInput } from '@/components/gaming/NeonInput';
import { Shield, User, Key, ArrowRight } from 'lucide-react';

export default function SetupPage() {
    const [step, setStep] = useState(1);
    const [platformName, setPlatformName] = useState('Spark Live');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const steps = [
        { label: 'Platform', icon: Shield },
        { label: 'Admin Account', icon: User },
        { label: 'Confirm', icon: Key },
    ];

    return (
        <div className="min-h-screen bg-[#050510] flex items-center justify-center p-6"
            style={{ backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(0,255,255,0.05) 0%, transparent 70%)' }}>

            {/* Step Progress */}
            <div className="w-full max-w-lg">
                <div className="flex items-center justify-center gap-4 mb-10">
                    {steps.map((s, i) => {
                        const Icon = s.icon;
                        const isActive = step === i + 1;
                        const isDone = step > i + 1;
                        return (
                            <React.Fragment key={i}>
                                <div className="flex flex-col items-center gap-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${isDone ? 'bg-neon-green/20 border-neon-green text-neon-green shadow-[0_0_12px_rgba(0,255,100,0.3)]' :
                                        isActive ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-[0_0_12px_rgba(0,255,255,0.3)]' :
                                            'bg-white/5 border-white/10 text-text-muted'}`}>
                                        <Icon size={16} />
                                    </div>
                                    <span className={`text-[9px] uppercase font-black tracking-widest ${isActive ? 'text-neon-cyan' : isDone ? 'text-neon-green' : 'text-text-muted'}`}>{s.label}</span>
                                </div>
                                {i < 2 && <div className={`flex-1 h-px ${isDone ? 'bg-neon-green/50' : 'bg-white/10'}`} />}
                            </React.Fragment>
                        );
                    })}
                </div>

                <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                    className="glass-card p-8 rounded-3xl border border-neon-cyan/10 backdrop-blur-xl">

                    {step === 1 && (
                        <div className="flex flex-col gap-6">
                            <div>
                                <h2 className="text-2xl font-black text-text-primary mb-1">Platform Setup</h2>
                                <p className="text-text-muted text-sm">Configure your platform&apos;s core identity</p>
                            </div>
                            <NeonInput label="Platform Name" value={platformName} onChange={(e) => setPlatformName(e.target.value)} icon={<Shield size={14} />} />
                            <GlowButton variant="cyan" onClick={() => setStep(2)} className="w-full flex items-center justify-center gap-2">
                                Continue <ArrowRight size={16} />
                            </GlowButton>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col gap-6">
                            <div>
                                <h2 className="text-2xl font-black text-text-primary mb-1">Admin Account</h2>
                                <p className="text-text-muted text-sm">Create the primary super-admin account</p>
                            </div>
                            <NeonInput label="Admin Email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} icon={<User size={14} />} />
                            <NeonInput label="Password" type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} icon={<Key size={14} />} />
                            <NeonInput label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} icon={<Key size={14} />} />
                            <div className="flex gap-3">
                                <GlowButton variant="purple" onClick={() => setStep(1)} className="flex-1">Back</GlowButton>
                                <GlowButton variant="cyan" onClick={() => setStep(3)} className="flex-1 flex items-center justify-center gap-2">Continue <ArrowRight size={16} /></GlowButton>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col gap-6 text-center">
                            <div>
                                <h2 className="text-2xl font-black text-text-primary mb-1">Confirm Setup</h2>
                                <p className="text-text-muted text-sm">Review and finalize your configuration</p>
                            </div>
                            <div className="glass-card p-4 rounded-xl border border-white/5 text-left flex flex-col gap-3">
                                <div className="flex justify-between text-sm"><span className="text-text-muted">Platform</span><span className="font-bold text-text-primary">{platformName}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-text-muted">Admin Email</span><span className="font-bold text-neon-cyan">{adminEmail || '—'}</span></div>
                            </div>
                            <div className="flex gap-3">
                                <GlowButton variant="purple" onClick={() => setStep(2)} className="flex-1">Back</GlowButton>
                                <GlowButton variant="green" className="flex-1 flex items-center justify-center gap-2">
                                    <Shield size={16} /> Launch Platform
                                </GlowButton>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
