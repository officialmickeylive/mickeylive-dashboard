'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { ChevronLeft, Menu } from 'lucide-react';
import { RootState } from '@/store';
import { NAV_ITEMS, ROLE_PATH_PREFIXES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
    const pathname = usePathname();
    const { role } = useSelector((state: RootState) => state.auth);

    const filteredNavItems = NAV_ITEMS.filter((item) =>
        role && item.roles.includes(role)
    );

    const prefix = role ? ROLE_PATH_PREFIXES[role] : '';

    return (
        <motion.aside
            initial={false}
            animate={{
                width: isOpen ? 260 : 80,
                transition: { duration: 0.3, ease: 'easeInOut' }
            }}
            className="fixed left-0 top-0 h-screen bg-card-bg border-r border-card-border z-30 flex flex-col"
        >
            {/* Sidebar Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-card-border">
                <AnimatePresence mode="wait">
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="font-bold text-xl text-gaming-header neon-text-cyan"
                        >
                            SPARK
                        </motion.div>
                    )}
                </AnimatePresence>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-glass rounded-lg text-text-muted hover:text-neon-cyan transition-colors"
                >
                    {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-2 custom-scrollbar">
                {filteredNavItems.map((item) => {
                    
                    const href = `${prefix}${item.href}`;
                    const isActive = pathname === href || (item.href !== '/dashboard' && pathname.startsWith(href));
                    const Icon = item.icon;

                    return (
                        <Link key={href} href={href}>
                            <motion.div
                                whileHover={{ x: 4 }}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative group",
                                    isActive
                                        ? "bg-neon-cyan/10 text-neon-cyan neon-border-cyan border"
                                        : "text-text-muted hover:text-text-primary hover:bg-glass"
                                )}
                            >
                                <Icon size={20} className={cn("flex-shrink-0", isActive && "neon-text-cyan")} />

                                <AnimatePresence mode="wait">
                                    {isOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="text-sm font-medium whitespace-nowrap"
                                        >
                                            {item.title}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {isActive && (
                                    <motion.div
                                        layoutId="active-nav"
                                        className="absolute left-0 w-1 h-6 bg-neon-cyan rounded-r-full"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </div>

            {/* Footer / Logout Placeholder (Top bar has real logout) */}
            <div className="p-4 border-t border-card-border">
                <div className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl text-text-muted cursor-default",
                    !isOpen && "justify-center"
                )}>
                    <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple font-bold text-xs border border-neon-purple/30">
                        {role?.[0] || 'U'}
                    </div>
                    {isOpen && (
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-bold text-text-primary truncate uppercase">{role?.replace('_', ' ')}</span>
                            <span className="text-[10px] text-text-muted truncate italic leading-tight">Secured Access</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.aside>
    );
};
