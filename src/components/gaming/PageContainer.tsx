'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PageContainerProps {
    children: React.ReactNode;
    className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn("container mx-auto p-6 space-y-8", className)}
        >
            {children}
        </motion.div>
    );
};
