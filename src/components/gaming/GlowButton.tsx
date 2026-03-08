'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'cyan' | 'purple' | 'gold' | 'red' | 'green';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    glow?: boolean;
}

export const GlowButton = ({
    children,
    className,
    variant = 'cyan',
    size = 'md',
    fullWidth = false,
    glow = true,
    disabled,
    ...props
}: GlowButtonProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const standardProps: any = { ...props };
    delete standardProps.onDrag;
    delete standardProps.onDragStart;
    delete standardProps.onDragEnd;
    delete standardProps.onAnimationStart;

    const sizeStyles = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
    };

    const variantStyles = {
        cyan: "border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-dark-bg shadow-neon-cyan/20 hover:shadow-neon-cyan/50",
        purple: "border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-dark-bg shadow-neon-purple/20 hover:shadow-neon-purple/50",
        gold: "border-neon-gold text-neon-gold hover:bg-neon-gold hover:text-dark-bg shadow-neon-gold/20 hover:shadow-neon-gold/50",
        red: "border-neon-red text-neon-red hover:bg-neon-red hover:text-dark-bg shadow-neon-red/20 hover:shadow-neon-red/50",
        green: "border-neon-green text-neon-green hover:bg-neon-green hover:text-dark-bg shadow-neon-green/20 hover:shadow-neon-green/50",
    };

    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            disabled={disabled}
            className={cn(
                "relative rounded-xl font-bold uppercase tracking-wider transition-all duration-300 border-2 overflow-hidden",
                sizeStyles[size],
                variantStyles[variant],
                fullWidth && "w-full",
                disabled && "opacity-50 cursor-not-allowed grayscale",
                className
            )}
            {...standardProps}
        >
            <span className="relative z-10">{children}</span>

            {/* Background Glow Pulse Animation */}
            {glow && !disabled && (
                <div className={cn(
                    "absolute inset-0 bg-current opacity-0 transition-opacity duration-300 group-hover:opacity-10",
                    variant === 'cyan' && "bg-neon-cyan",
                    variant === 'purple' && "bg-neon-purple",
                    variant === 'gold' && "bg-neon-gold"
                )} />
            )}

            {/* Animated Shine Effect */}
            {!disabled && (
                <motion.div
                    initial={{ left: '-100%' }}
                    animate={{ left: '200%' }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="absolute top-0 w-24 h-full bg-white/10 skew-x-[30deg] z-0"
                />
            )}
        </motion.button>
    );
};
