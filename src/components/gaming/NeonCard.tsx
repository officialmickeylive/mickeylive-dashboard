'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface NeonCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'cyan' | 'purple' | 'gold' | 'red' | 'green';
    glow?: boolean;
    pulse?: boolean;
}

const variantStyles = {
    cyan: "border-neon-cyan shadow-neon-cyan/20 hover:shadow-neon-cyan/40",
    purple: "border-neon-purple shadow-neon-purple/20 hover:shadow-neon-purple/40",
    gold: "border-neon-gold shadow-neon-gold/20 hover:shadow-neon-gold/40",
    red: "border-neon-red shadow-neon-red/20 hover:shadow-neon-red/40",
    green: "border-neon-green shadow-neon-green/20 hover:shadow-neon-green/40",
};

const pulseGlow = {
    cyan: "via-neon-cyan/50",
    purple: "via-neon-purple/50",
    gold: "via-neon-gold/50",
    red: "via-neon-red/50",
    green: "via-neon-green/50",
};

export const NeonCard = ({
    children,
    className,
    variant = 'cyan',
    glow = true,
    pulse = false
}: NeonCardProps) => {
    return (
        <div className={cn(
            "glass-card p-6 rounded-2xl relative overflow-hidden transition-all duration-500",
            glow && variantStyles[variant],
            className
        )}>
            {/* Pulse Line Animation */}
            {pulse && (
                <div className={cn(
                    "absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent to-transparent animate-pulse opacity-50",
                    pulseGlow[variant]
                )} />
            )}

            {/* Inner Content */}
            <div className="relative z-10">
                {children}
            </div>

            {/* Subtle Corner Glow */}
            <div className={cn(
                "absolute -top-4 -right-4 w-12 h-12 blur-2xl opacity-20 pointer-events-none",
                variant === 'cyan' && "bg-neon-cyan",
                variant === 'purple' && "bg-neon-purple",
                variant === 'gold' && "bg-neon-gold",
                variant === 'red' && "bg-neon-red",
                variant === 'green' && "bg-neon-green"
            )} />
        </div>
    );
};
