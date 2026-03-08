'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
    className?: string;
}

export const PageHeader = ({ title, description, actions, className }: PageHeaderProps) => {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8", className)}>
            <div className="space-y-1">
                <h1 className="text-3xl font-black text-gaming-header neon-text-cyan tracking-wider">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-text-muted uppercase tracking-widest font-medium">
                        {description}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex items-center gap-3">
                    {actions}
                </div>
            )}
        </div>
    );
};
