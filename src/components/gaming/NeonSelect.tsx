'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface NeonSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { label: string; value: string }[];
    error?: string;
}

export const NeonSelect = React.forwardRef<HTMLSelectElement, NeonSelectProps>(
    ({ className, label, options, error, ...props }, ref) => {
        return (
            <div className="space-y-1.5 w-full group">
                {label && (
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted group-focus-within:text-neon-cyan transition-colors ml-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        className={cn(
                            "w-full bg-dark-bg/50 border border-card-border rounded-xl px-4 py-3 text-sm text-text-primary appearance-none cursor-pointer",
                            "focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 transition-all",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            error && "border-neon-red/50 focus:border-neon-red focus:ring-neon-red/20",
                            className
                        )}
                        {...props}
                    >
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-card-bg text-text-primary">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none group-focus-within:text-neon-cyan transition-colors">
                        <ChevronDown size={16} />
                    </div>
                </div>
                {error && (
                    <p className="text-[10px] font-bold text-neon-red uppercase tracking-wider ml-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

NeonSelect.displayName = "NeonSelect";
