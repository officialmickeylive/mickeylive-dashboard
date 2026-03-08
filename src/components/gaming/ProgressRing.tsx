'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
    current: number;
    total: number;
    size?: number;
    strokeWidth?: number;
    variant?: 'cyan' | 'purple' | 'gold' | 'red' | 'green';
    className?: string;
}

export const ProgressRing = ({
    current,
    total,
    size = 120,
    strokeWidth = 8,
    variant = 'cyan',
    className
}: ProgressRingProps) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const percentage = Math.min(Math.max((current / total) * 100, 0), 100);
    const offset = circumference - (percentage / 100) * circumference;

    const colors = {
        cyan: "stroke-neon-cyan shadow-neon-cyan",
        purple: "stroke-neon-purple shadow-neon-purple",
        gold: "stroke-neon-gold shadow-neon-gold",
        red: "stroke-neon-red shadow-neon-red",
        green: "stroke-neon-green shadow-neon-green",
    };

    return (
        <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-dark-bg border-card-border"
                />
                {/* Progress */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                    className={cn("transition-all duration-300", colors[variant])}
                    style={{ strokeLinecap: 'round' }}
                />
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold text-text-primary">
                    {Math.round(percentage)}%
                </span>
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-tighter">
                    Target
                </span>
            </div>

            {/* Global CSS for shadow on SVG stroke doesn't work well, 
          so neon shadow is applied via filter in globals.css or inline-style if needed.
          For now, standard stroke-neon-cyan handles the color. */}
        </div>
    );
};
