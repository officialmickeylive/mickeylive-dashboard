'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface NeonTableProps<T> {
    columns: Column<T>[];
    data: T[];
    onRowClick?: (item: T) => void;
    isLoading?: boolean;
}

export const NeonTable = <T extends { id: string | number }>({
    columns,
    data,
    onRowClick,
    isLoading
}: NeonTableProps<T>) => {
    return (
        <div className="w-full overflow-hidden rounded-2xl border border-white/5 bg-dark-bg/40 backdrop-blur-xl group/table">
            {/* Top Border Glow Decor */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent opacity-50" />

            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-card-border bg-white/[0.02]">
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className={cn(
                                        "px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-text-muted",
                                        col.className
                                    )}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                        <AnimatePresence mode="popLayout">
                            {isLoading ? (
                                // Skeleton rows
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={`skeleton-${i}`} className="animate-pulse">
                                        {columns.map((_, idx) => (
                                            <td key={idx} className="px-6 py-5">
                                                <div className="h-4 bg-white/5 rounded w-2/3" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : data.length === 0 ? (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <td colSpan={columns.length} className="px-6 py-16 text-center">
                                        <p className="text-text-muted italic text-sm">No records found in the system matrix.</p>
                                    </td>
                                </motion.tr>
                            ) : (
                                data.map((item, rowIdx) => (
                                    <motion.tr
                                        key={item.id}
                                        onClick={() => onRowClick?.(item)}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: rowIdx * 0.05 }}
                                        whileHover={{ backgroundColor: 'rgba(0, 245, 255, 0.03)' }}
                                        className={cn(
                                            "group/row transition-colors relative",
                                            onRowClick && "cursor-pointer"
                                        )}
                                    >
                                        {columns.map((col, idx) => (
                                            <td
                                                key={`${item.id}-${idx}`}
                                                className={cn(
                                                    "px-6 py-5 text-sm text-text-primary border-transparent transition-all",
                                                    col.className
                                                )}
                                            >
                                                {typeof col.accessor === 'function'
                                                    ? col.accessor(item)
                                                    : (item[col.accessor] as React.ReactNode)}
                                            </td>
                                        ))}
                                    </motion.tr>
                                ))
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Footer / Info bar */}
            <div className="px-6 py-4 border-t border-card-border bg-black/20 flex justify-between items-center text-[10px] text-text-muted uppercase tracking-widest font-bold">
                <span>System Log: {data.length} records active</span>
                <span>Secure Protocol v1.4</span>
            </div>
        </div>
    );
};
