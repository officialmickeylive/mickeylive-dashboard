'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlowButton } from './GlowButton';

interface NeonModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    variant?: 'cyan' | 'purple' | 'gold' | 'red' | 'green';
    actions?: React.ReactNode;
}

export const NeonModal = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    variant = 'cyan',
    actions
}: NeonModalProps) => {
    // Prevent scrolling on body when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-dark-bg/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className={cn(
                                "w-full max-w-lg overflow-hidden glass-card pointer-events-auto border",
                                variant === 'cyan' && "border-neon-cyan/30 shadow-[0_0_20px_rgba(0,255,255,0.1)]",
                                variant === 'purple' && "border-neon-purple/30 shadow-[0_0_20px_rgba(191,0,255,0.1)]",
                                variant === 'gold' && "border-neon-gold/30 shadow-[0_0_20px_rgba(255,215,0,0.1)]",
                                variant === 'red' && "border-neon-red/30 shadow-[0_0_20px_rgba(255,0,0,0.1)]",
                                variant === 'green' && "border-neon-green/30 shadow-[0_0_20px_rgba(0,255,0,0.1)]"
                            )}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between p-6 border-b border-card-border/50">
                                <div>
                                    <h2 className={cn(
                                        "text-xl font-bold tracking-tight",
                                        variant === 'cyan' && "text-neon-cyan",
                                        variant === 'purple' && "text-neon-purple",
                                        variant === 'gold' && "text-neon-gold",
                                        variant === 'red' && "text-neon-red",
                                        variant === 'green' && "text-neon-green"
                                    )}>
                                        {title}
                                    </h2>
                                    {description && (
                                        <p className="mt-1 text-xs text-text-muted">{description}</p>
                                    )}
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                {children}
                            </div>

                            {/* Footer/Actions */}
                            {actions && (
                                <div className="flex items-center justify-end gap-3 p-4 bg-black/20 border-t border-card-border/50">
                                    <GlowButton variant="purple" onClick={onClose}>
                                        Cancel
                                    </GlowButton>
                                    {actions}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
