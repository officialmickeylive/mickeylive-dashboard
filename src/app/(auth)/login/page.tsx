'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import { Mail, Lock } from 'lucide-react';
import { useLoginMutation } from '@/store/api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { ROLE_PATH_PREFIXES } from '@/lib/constants';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Email is required for testing roles.');
            return;
        }

        try {
            const result = await login({ email, password }).unwrap();

            // Dispatch to Redux store
            dispatch(setCredentials({
                user: result.user,
                token: result.token,
                role: result.user.role
            }));

            // Route to correct dashboard
            const pathPrefix = ROLE_PATH_PREFIXES[result.user.role] || '/dashboard';
            router.push(`${pathPrefix}/dashboard`);

        } catch (err: any) {
            setError(err?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
            {/* Background Particles Placeholder */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md z-10"
            >
                <div className="text-center mb-8">
                    <motion.h1
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        className="text-4xl md:text-5xl font-black text-gaming-header neon-text-cyan mb-2"
                    >
                        SPARK LIVE
                    </motion.h1>
                    <p className="text-text-muted text-xs uppercase tracking-[0.3em]">System Authentication</p>
                </div>

                <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl border border-white/5 space-y-6">
                    {error && (
                        <div className="p-3 rounded bg-neon-red/10 border border-neon-red/30 text-neon-red text-xs font-bold text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <NeonInput
                            label="Email Address (Role Testing)"
                            placeholder="owner@spark.live"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={<Mail size={18} />}
                        />
                        <NeonInput
                            label="Password"
                            placeholder="Any password works"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={<Lock size={18} />}
                        />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="hidden" />
                            <div className="w-4 h-4 rounded border border-card-border group-hover:border-neon-cyan transition-colors" />
                            <span className="text-text-muted group-hover:text-text-primary transition-colors">Remember me</span>
                        </label>
                    </div>

                    <GlowButton type="submit" fullWidth variant="cyan" className="mt-4" disabled={isLoading}>
                        {isLoading ? 'Authenticating...' : 'System Interface Start'}
                    </GlowButton>
                </form>

                <p className="text-center mt-6 text-text-muted text-[10px] uppercase tracking-widest">
                    Secure Access Protocol v1.4.2
                </p>
            </motion.div>
        </div>
    );
}
