'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { GlowButton } from '@/components/gaming/GlowButton';
import { NeonModal } from '@/components/gaming/NeonModal';
import { NeonInput } from '@/components/gaming/NeonInput';
import { Package, Coins, TrendingDown, AlertTriangle, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const inventory = [
    { id: 'INV-01', name: 'Coin Pack A', unit: '1,000 coins/lot', limit: 10000, used: 6800, reserved: 1200 },
    { id: 'INV-02', name: 'Coin Pack B', unit: '5,000 coins/lot', limit: 50000, used: 38200, reserved: 5000 },
    { id: 'INV-03', name: 'Coin Pack C', unit: '10,000 coins/lot', limit: 20000, used: 9400, reserved: 2000 },
    { id: 'INV-04', name: 'Promotional Coins', unit: 'Bonus allocation', limit: 5000, used: 5000, reserved: 0 },
];

export default function SellerInventoryPage() {
    const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
    return (
        <PageContainer>
            <PageHeader title="Assigned Inventory" description="Your coin allocation limits, usage, and reserved stock"
                actions={<GlowButton variant="cyan" size="sm" className="flex items-center gap-2" onClick={() => setIsRestockModalOpen(true)}><Package size={16} /> Request Restock</GlowButton>} />

            <div className="grid grid-cols-3 gap-5 mb-8">
                {[
                    { label: 'Total Allocated', value: '85,000 Coins', icon: Coins, color: 'gold' },
                    { label: 'Used This Month', value: '59,400 Coins', icon: TrendingDown, color: 'red' },
                    { label: 'Available', value: '25,600 Coins', icon: Package, color: 'green' },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="glass-card p-5 rounded-2xl border border-white/5 flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center",
                            s.color === 'gold' ? "bg-neon-gold/10 text-neon-gold" : s.color === 'red' ? "bg-neon-red/10 text-neon-red" : "bg-neon-green/10 text-neon-green")}>
                            <s.icon size={18} />
                        </div>
                        <div><p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{s.label}</p><p className="text-xl font-black text-text-primary">{s.value}</p></div>
                    </motion.div>
                ))}
            </div>

            <div className="flex flex-col gap-4">
                {inventory.map((item, i) => {
                    const pct = (item.used / item.limit) * 100;
                    const isExhausted = pct >= 100;
                    const isLow = pct >= 80 && !isExhausted;
                    return (
                        <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                            className="glass-card p-5 rounded-2xl border border-white/5">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <div className="font-bold text-sm text-text-primary">{item.name}</div>
                                    <div className="text-[10px] text-text-muted">{item.unit}</div>
                                </div>
                                <div className="text-right">
                                    {isExhausted && <div className="flex items-center gap-1 text-neon-red text-[10px] font-black"><AlertTriangle size={10} /> EXHAUSTED</div>}
                                    {isLow && <div className="flex items-center gap-1 text-neon-gold text-[10px] font-black"><AlertTriangle size={10} /> LOW STOCK</div>}
                                    <div className="text-[10px] text-text-muted font-mono">{item.used.toLocaleString()} / {item.limit.toLocaleString()} used</div>
                                </div>
                            </div>
                            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                <div className={cn("h-full rounded-full transition-all duration-500",
                                    isExhausted ? "bg-neon-red" : isLow ? "bg-neon-gold" : "bg-neon-green"
                                )} style={{ width: `${Math.min(pct, 100)}%` }} />
                            </div>
                            <div className="flex justify-between text-[9px] text-text-muted mt-1">
                                <span>Reserved: {item.reserved.toLocaleString()}</span>
                                <span>{pct.toFixed(0)}% consumed</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <NeonModal
                isOpen={isRestockModalOpen}
                onClose={() => setIsRestockModalOpen(false)}
                title="Request Inventory Restock"
                description="Apply for additional coin limits from your assigned administrator."
                variant="cyan"
                actions={
                    <GlowButton variant="cyan" onClick={() => setIsRestockModalOpen(false)} className="flex items-center gap-2">
                        <Send size={16} />
                        Submit Request
                    </GlowButton>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Select Package Tier</label>
                        <select className="w-full bg-dark-bg/50 border border-card-border rounded-lg h-10 px-3 text-sm text-text-primary focus:outline-none focus:border-neon-cyan/50 focus:shadow-[0_0_10px_rgba(0,255,255,0.1)] transition-all">
                            <option value="pack_a">Coin Pack A (1,000 limit)</option>
                            <option value="pack_b">Coin Pack B (5,000 limit)</option>
                            <option value="pack_c">Coin Pack C (10,000 limit)</option>
                        </select>
                    </div>
                    <NeonInput label="Additional Notes/Justification" placeholder="E.g. Expected high volume during weekend event..." />
                    <div className="pt-2 border-t border-white/5">
                        <p className="text-xs text-text-muted mb-2">Your admin will receive this request for approval.</p>
                    </div>
                </div>
            </NeonModal>
        </PageContainer>
    );
}
