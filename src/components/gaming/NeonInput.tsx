'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface NeonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const NeonInput = React.forwardRef<HTMLInputElement, NeonInputProps>(
    ({ className, label, error, icon, ...props }, ref) => {
        return (
            <div className="space-y-1.5 w-full group">
                {label && (
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted group-focus-within:text-neon-cyan transition-colors ml-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-neon-cyan transition-colors">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            "w-full bg-dark-bg/50 border border-card-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/50",
                            "focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 transition-all",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            icon && "pl-10",
                            error && "border-neon-red/50 focus:border-neon-red focus:ring-neon-red/20",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-[10px] font-bold text-neon-red uppercase tracking-wider ml-1 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

NeonInput.displayName = "NeonInput";
