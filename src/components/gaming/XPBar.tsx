'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface XPBarProps {
    current: number;
    total: number;
    label?: string;
    level?: number;
    variant?: 'cyan' | 'purple' | 'gold';
    className?: string;
}

export const XPBar = ({
    current,
    total,
    label = "Level Progress",
    level,
    variant = 'cyan',
    className
}: XPBarProps) => {
    const percentage = Math.min(Math.max((current / total) * 100, 0), 100);

    const colors = {
        cyan: "bg-neon-cyan shadow-[0_0_10px_#00F5FF]",
        purple: "bg-neon-purple shadow-[0_0_10px_#BF00FF]",
        gold: "bg-neon-gold shadow-[0_0_10px_#FFD700]",
    };

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <span className="text-text-muted">{label}</span>
                    {level !== undefined && (
                        <span className={cn(
                            "px-1.5 py-0.5 rounded bg-dark-bg border border-card-border",
                            variant === 'cyan' && "text-neon-cyan border-neon-cyan/30",
                            variant === 'purple' && "text-neon-purple border-neon-purple/30",
                            variant === 'gold' && "text-neon-gold border-neon-gold/30",
                        )}>
                            LVL {level}
                        </span>
                    )}
                </div>
                <span className="text-text-primary">
                    {current.toLocaleString()} / {total.toLocaleString()} XP
                </span>
            </div>

            <div className="h-2 w-full bg-dark-bg rounded-full border border-card-border overflow-hidden p-[1px]">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={cn("h-full rounded-full", colors[variant])}
                />
            </div>
        </div>
    );
};
