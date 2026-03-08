'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'gold' | 'purple' | 'cyan' | 'orange' | 'green' | 'pink' | 'muted' | 'red';

interface NeonBadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

const roleColors: Record<string, BadgeVariant> = {
    APP_OWNER: 'gold',
    SUPER_ADMIN: 'purple',
    ADMIN: 'cyan',
    HOST: 'orange',
    AGENCY: 'green',
    SELLER: 'pink',
    CUSTOMER: 'muted',
};

const variantStyles: Record<BadgeVariant, string> = {
    gold: "border-neon-gold text-neon-gold bg-neon-gold/10",
    purple: "border-neon-purple text-neon-purple bg-neon-purple/10",
    cyan: "border-neon-cyan text-neon-cyan bg-neon-cyan/10",
    orange: "border-[#FF6B35] text-[#FF6B35] bg-[#FF6B35]/10",
    green: "border-neon-green text-neon-green bg-neon-green/10",
    pink: "border-[#FF00AA] text-[#FF00AA] bg-[#FF00AA]/10",
    muted: "border-text-muted text-text-muted bg-text-muted/10",
    red: "border-neon-red text-neon-red bg-neon-red/10",
};

export const NeonBadge = ({ children, variant = 'cyan', className }: NeonBadgeProps) => {
    // If children is a known role, use that color automatically
    const detectedVariant = (typeof children === 'string' && roleColors[children.toUpperCase()]) || variant;

    return (
        <span className={cn(
            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
            variantStyles[detectedVariant],
            className
        )}>
            {children}
        </span>
    );
};
