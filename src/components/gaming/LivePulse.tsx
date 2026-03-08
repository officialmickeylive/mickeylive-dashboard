'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export const LivePulse = ({ className }: { className?: string }) => {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-red opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-red shadow-[0_0_8px_#FF003C]"></span>
            </span>
            <span className="text-[10px] font-bold text-neon-red uppercase tracking-widest animate-pulse">
                Live
            </span>
        </div>
    );
};
