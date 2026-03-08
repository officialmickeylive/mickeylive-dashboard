'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Crown, Star, Shield, Trophy, Diamond, Zap, LucideIcon } from 'lucide-react';

type TierVariant = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'king' | 'emperor';

interface WealthTierBadgeProps {
    tier: TierVariant | string;
    className?: string;
    showIcon?: boolean;
}

const tierConfig: Record<TierVariant, { color: string; blur: string; icon: LucideIcon }> = {
    bronze: { color: 'text-[#CD7F32] border-[#CD7F32] bg-[#CD7F32]/10', blur: 'shadow-[#CD7F32]/20', icon: Star },
    silver: { color: 'text-[#C0C0C0] border-[#C0C0C0] bg-[#C0C0C0]/10', blur: 'shadow-[#C0C0C0]/20', icon: Shield },
    gold: { color: 'text-neon-gold border-neon-gold bg-neon-gold/10', blur: 'shadow-neon-gold/20', icon: Trophy },
    platinum: { color: 'text-[#E5E4E2] border-[#E5E4E2] bg-[#E5E4E2]/10', blur: 'shadow-[#E5E4E2]/20', icon: Zap },
    diamond: { color: 'text-[#B9F2FF] border-[#B9F2FF] bg-[#B9F2FF]/10', blur: 'shadow-[#B9F2FF]/20', icon: Diamond },
    king: { color: 'text-neon-purple border-neon-purple bg-neon-purple/10', blur: 'shadow-neon-purple/40', icon: Crown },
    emperor: { color: 'text-neon-red border-neon-red bg-neon-red/10', blur: 'shadow-neon-red/50', icon: Crown },
};

export const WealthTierBadge = ({ tier, className, showIcon = true }: WealthTierBadgeProps) => {
    const t = tier.toLowerCase() as TierVariant;
    const config = tierConfig[t] || tierConfig.bronze;
    const Icon = config.icon;

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all duration-300",
            "shadow-[inset_0_0_10px_rgba(255,255,255,0.02)]",
            config.color,
            config.blur,
            className
        )}>
            {showIcon && <Icon size={12} className="animate-pulse" />}
            {tier}
        </span>
    );
};
