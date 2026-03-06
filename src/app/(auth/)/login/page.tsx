'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';

import { ParticleBackground } from '@/components/gaming/ParticleBackground';
import { useLoginMutation } from '@/store/api/authApi';
import { setCredentials } from '@/store/slices/authSlice';
import { setToken, setUser, getRoleDashboard } from '@/lib/auth-helpers';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setError(null);
        try {
            // For demonstration, since the backend might not be ready, 
            // we'll simulate a successful login or handle error if API fails
            const result = await login({
                email: data.email,
                password: data.password,
            }).unwrap();

            const { token, user, role } = result;

            dispatch(setCredentials({ user, token, role }));
            setToken(token);
            setUser(user);

            const redirectPath = getRoleDashboard(role);
            router.push(redirectPath);
        } catch (err: unknown) {
            const errorData = (err as { data?: { message?: string } })?.data;
            setError(errorData?.message || 'Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
            <ParticleBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="glass-card p-8 rounded-2xl border border-neon-cyan/30 shadow-2xl relative overflow-hidden">
                    {/* Decorative neon pulse */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-pulse" />

                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gaming-header neon-text-cyan mb-2">
                            SPARK LIVE
                        </h1>
                        <p className="text-text-muted text-sm uppercase tracking-widest font-medium">
                            Admin Dashboard
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-primary flex items-center gap-2">
                                <Mail size={16} className="text-neon-cyan" />
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    {...register('email')}
                                    type="email"
                                    className="w-full bg-dark-bg/50 border border-card-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                                    placeholder="admin@sparklive.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-neon-red text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-primary flex items-center gap-2">
                                <Lock size={16} className="text-neon-purple" />
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full bg-dark-bg/50 border border-card-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-neon-purple transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-neon-red text-xs mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        {...register('rememberMe')}
                                        type="checkbox"
                                        className="peer hidden"
                                    />
                                    <div className="w-5 h-5 border-2 border-card-border rounded peer-checked:bg-neon-cyan peer-checked:border-neon-cyan transition-all" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                                        <div className="w-1.5 h-3 border-r-2 border-b-2 border-dark-bg rotate-45 mb-1" />
                                    </div>
                                </div>
                                <span className="text-sm text-text-muted group-hover:text-text-primary transition-colors">
                                    Remember me
                                </span>
                            </label>
                            <button
                                type="button"
                                className="text-sm text-neon-cyan hover:underline transition-all"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="bg-neon-red/10 border border-neon-red/30 p-3 rounded-lg text-neon-red text-sm text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full relative group overflow-hidden bg-transparent border-2 border-neon-cyan text-neon-cyan font-bold py-3 rounded-lg hover:bg-neon-cyan hover:text-dark-bg transition-all duration-300 shadow-neon-cyan/20 hover:shadow-neon-cyan flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                'ENTER DASHBOARD'
                            )}
                            <div className="absolute inset-0 bg-neon-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-card-border/50 text-center">
                        <p className="text-text-muted text-xs">
                            Secure Access Layer v1.0.4. Protected by Neural Cryptography.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
