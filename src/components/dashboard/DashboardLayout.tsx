'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { PageTransition } from '@/components/gaming/PageTransition';
import { cn } from '@/lib/utils';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setSidebarOpen } from '@/store/slices/uiSlice';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch();
    const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);

    return (
        <div className="min-h-screen bg-dark-bg text-text-primary">
            <Sidebar isOpen={sidebarOpen} setIsOpen={(v) => dispatch(setSidebarOpen(v))} />

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
                    <PageTransition>
                        {children}
                    </PageTransition>
                </main>

                {/* Mobile Overlay */}
                <div
                    className={cn(
                        "fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity duration-300",
                        sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                    onClick={() => dispatch(setSidebarOpen(false))}
                />
            </motion.div>
        </div>
    );
};


