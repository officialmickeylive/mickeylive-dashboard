'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ── Skeleton base ─────────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
    return (
        <motion.div
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className={cn("rounded-lg bg-white/5", className)}
        />
    );
}

// ── Stat Card Skeleton ────────────────────────────────────────────────────────
export function StatCardSkeleton() {
    return (
        <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col gap-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-2.5 w-16" />
        </div>
    );
}

// ── Table Row Skeleton ────────────────────────────────────────────────────────
export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
    return (
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
            <div className="flex gap-4 px-5 py-3 border-b border-white/5">
                {Array.from({ length: cols }).map((_, i) => (
                    <Skeleton key={i} className="h-3 flex-1" />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, ri) => (
                <div key={ri} className="flex gap-4 px-5 py-4 border-b border-white/5 last:border-0">
                    {Array.from({ length: cols }).map((_, ci) => (
                        <Skeleton key={ci} className={cn("h-4 flex-1", ci === 0 ? "w-20" : "")} />
                    ))}
                </div>
            ))}
        </div>
    );
}

// ── Page Loading Overlay ──────────────────────────────────────────────────────
export function PageLoader() {
    return (
        <div className="flex flex-col gap-8 p-6 w-full">
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
            <div className="grid grid-cols-4 gap-5">
                {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
            </div>
            <TableSkeleton rows={6} cols={5} />
        </div>
    );
}

// ── Neon Spinner ──────────────────────────────────────────────────────────────
export function NeonSpinner({ size = 32, color = '#00ffff' }: { size?: number; color?: string }) {
    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                border: `3px solid transparent`,
                borderTopColor: color,
                boxShadow: `0 0 12px ${color}`,
            }}
        />
    );
}
