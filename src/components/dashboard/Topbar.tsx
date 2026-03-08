'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    Search,
    User,
    LogOut,
    Settings,
    HelpCircle,
    ChevronDown,
    KeyRound,
    ShieldCheck,
    Lock
} from 'lucide-react';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { removeToken, removeUser } from '@/lib/auth-helpers';
import { ROLE_PATH_PREFIXES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export const Topbar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, role } = useSelector((state: RootState) => state.auth);
    const prefix = role ? ROLE_PATH_PREFIXES[role] : '';

    const roleBadgeConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
        APP_OWNER: { label: 'App Owner', color: 'neon-gold', icon: <KeyRound size={12} /> },
        SUPER_ADMIN: { label: 'Super Admin', color: 'neon-cyan', icon: <ShieldCheck size={12} /> },
        ADMIN: { label: 'Admin', color: 'neon-purple', icon: <Lock size={12} /> },
    };
    const badge = role ? roleBadgeConfig[role] : null;

    const handleLogout = () => {
        dispatch(logout());
        removeToken();
        removeUser();
        router.push('/login');
    };

    return (
        <header className="h-16 bg-card-bg/80 backdrop-blur-md border-b border-card-border sticky top-0 z-20 px-6 flex items-center justify-between">
            {/* Search Bar Placeholder */}
            <div className="flex-1 max-w-md hidden md:block">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-neon-cyan transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search commands, users, reports..."
                        className="w-full bg-dark-bg/50 border border-card-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className="p-2 hover:bg-glass rounded-xl text-text-muted hover:text-neon-cyan transition-all relative"
                    >
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neon-red rounded-full shadow-[0_0_5px_#FF003C]" />
                    </button>

                    <AnimatePresence>
                        {isNotificationsOpen && (
                            <>
                                <div className="fixed inset-0" onClick={() => setIsNotificationsOpen(false)} />
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-2 w-80 bg-card-bg border border-card-border rounded-2xl shadow-2xl p-4 z-50 overflow-hidden"
                                >
                                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-card-border">
                                        <h3 className="font-bold text-sm uppercase tracking-wider">Signals</h3>
                                        <span className="text-[10px] text-neon-cyan cursor-pointer hover:underline">Mark all read</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="text-xs text-text-muted py-8 text-center bg-dark-bg/30 rounded-xl border border-dashed border-card-border">
                                            No new transmission signals.
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 p-1 pl-2 hover:bg-glass rounded-xl border border-transparent hover:border-card-border transition-all"
                    >
                        <div className="flex flex-col items-end hidden sm:flex">
                            <span className="text-xs font-bold text-text-primary uppercase truncate max-w-[120px]">
                                {user?.name || 'Commander'}
                            </span>
                            {badge && (
                                <span className={cn(
                                    "flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full border",
                                    `text-${badge.color} border-${badge.color}/30 bg-${badge.color}/10`
                                )}>
                                    {badge.icon}
                                    {badge.label}
                                </span>
                            )}
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple p-[1px]">
                            <div className="w-full h-full rounded-[11px] bg-dark-bg flex items-center justify-center overflow-hidden">
                                {user?.avatar ? (
                                    <Image
                                        src={user.avatar}
                                        alt="avatar"
                                        width={36}
                                        height={36}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={18} className="text-text-muted" />
                                )}
                            </div>
                        </div>
                        <ChevronDown size={14} className={cn("text-text-muted transition-transform", isProfileOpen && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <>
                                <div className="fixed inset-0" onClick={() => setIsProfileOpen(false)} />
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-2 w-56 bg-card-bg border border-card-border rounded-2xl shadow-2xl overflow-hidden z-50"
                                >
                                    <div className="p-3 border-b border-card-border bg-dark-bg/30">
                                        <p className="text-xs font-bold text-text-primary uppercase">{user?.name || 'System User'}</p>
                                        <p className="text-[10px] text-text-muted truncate">{user?.email}</p>
                                    </div>
                                    <div className="p-2">
                                        <Link href={`${prefix}/profile`} className="flex items-center gap-3 px-3 py-2 text-sm text-text-muted hover:text-neon-cyan hover:bg-glass rounded-xl transition-all">
                                            <User size={16} /> <span>Profile</span>
                                        </Link>
                                        {role !== 'ADMIN' && (
                                            <Link href={`${prefix}/settings`} className="flex items-center gap-3 px-3 py-2 text-sm text-text-muted hover:text-neon-cyan hover:bg-glass rounded-xl transition-all">
                                                <Settings size={16} /> <span>Settings</span>
                                            </Link>
                                        )}
                                        <Link href="/support" className="flex items-center gap-3 px-3 py-2 text-sm text-text-muted hover:text-neon-cyan hover:bg-glass rounded-xl transition-all">
                                            <HelpCircle size={16} /> <span>Help Sync</span>
                                        </Link>
                                        <div className="my-1 border-t border-card-border" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neon-red hover:bg-neon-red/10 rounded-xl transition-all"
                                        >
                                            <LogOut size={16} /> <span>Terminate Session</span>
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};
