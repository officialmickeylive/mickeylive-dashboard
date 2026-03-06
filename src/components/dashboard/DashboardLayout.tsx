'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { cn } from '@/lib/utils';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-dark-bg text-text-primary">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <motion.div
                initial={false}
                animate={{
                    marginLeft: sidebarOpen ? 260 : 80,
                    transition: { duration: 0.3, ease: 'easeInOut' }
                }}
                className="min-h-screen flex flex-col"
            >
                <Topbar />

                <main className="flex-1 p-6 overflow-x-hidden">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {children}
                    </motion.div>
                </main>

                {/* Mobile Overlay */}
                <div
                    className={cn(
                        "fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity duration-300",
                        sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                    onClick={() => setSidebarOpen(false)}
                />
            </motion.div>
        </div>
    );
};
