'use client';

import React from 'react';
import { animate } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { NeonCard } from './NeonCard';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    trend?: number;
    trendType?: 'up' | 'down' | 'neutral';
    variant?: 'cyan' | 'purple' | 'gold' | 'red' | 'green';
    suffix?: string;
    prefix?: string;
}

const Counter = ({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) => {
    const [displayValue, setDisplayValue] = React.useState(0);

    React.useEffect(() => {
        const controls = animate(0, value, {
            duration: 2,
            ease: "easeOut",
            onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
        });
        return () => controls.stop();
    }, [value]);

    return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>;
};

export const StatCard = ({
    title,
    value,
    icon,
    trend,
    trendType = 'up',
    variant = 'cyan',
    suffix = '',
    prefix = ''
}: StatCardProps) => {
    return (
        <NeonCard variant={variant} className="group relative overflow-hidden">
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-text-muted uppercase tracking-widest">{title}</p>
                    <h3 className="text-3xl font-bold text-gaming-header">
                        <Counter value={value} suffix={suffix} prefix={prefix} />
                    </h3>
                </div>
                <div className={cn(
                    "p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
                    "bg-dark-bg/50 border border-card-border group-hover:border-opacity-50",
                    variant === 'cyan' && "group-hover:border-neon-cyan/50 text-neon-cyan",
                    variant === 'purple' && "group-hover:border-neon-purple/50 text-neon-purple",
                    variant === 'gold' && "group-hover:border-neon-gold/50 text-neon-gold",
                    variant === 'red' && "group-hover:border-neon-red/50 text-neon-red",
                    variant === 'green' && "group-hover:border-neon-green/50 text-neon-green",
                )}>
                    {icon}
                </div>
            </div>

            {(trend !== undefined) && (
                <div className="mt-4 flex items-center gap-2">
                    <div className={cn(
                        "flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full",
                        trendType === 'up' ? "text-neon-green bg-neon-green/10" : "text-neon-red bg-neon-red/10"
                    )}>
                        {trendType === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {trend}%
                    </div>
                    <span className="text-[10px] text-text-muted uppercase font-medium">vs last session</span>
                </div>
            )}

            {/* Background Decorative Element */}
            <div className={cn(
                "absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500 pointer-events-none [&>svg]:w-[120px] [&>svg]:h-[120px]",
                variant === 'cyan' && "text-neon-cyan",
                variant === 'purple' && "text-neon-purple",
                variant === 'gold' && "text-neon-gold"
            )}>
                {icon}
            </div>
        </NeonCard>
    );
};
