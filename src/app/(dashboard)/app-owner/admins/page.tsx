'use client';

import React, { useState, useMemo } from 'react';
import { PageContainer } from '@/components/gaming/PageContainer';
import { PageHeader } from '@/components/gaming/PageHeader';
import { NeonTable, Column } from '@/components/gaming/NeonTable';
import { NeonInput } from '@/components/gaming/NeonInput';
import { GlowButton } from '@/components/gaming/GlowButton';
import {
    Search, Plus, ShieldCheck, ChevronRight, Users, Radio,
    Building2, Eye, Home, ChevronLeft, ChevronsLeft, ChevronsRight,
    Mail, Star, AtSign, Calendar, ArrowUpRight, ArrowDownLeft, X, Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type Level = 'admin' | 'agency' | 'host' | 'user';
const ITEMS_PER_PAGE = 5;

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const mockAdmins = [
    { id: 'A1', name: 'Zion Sentinel',  email: 'zion@spark.live',     level: 99, status: 'ACTIVE',   lastActive: '2 mins ago',  agencyCount: 3, joinDate: '2022-03-10' },
    { id: 'A2', name: 'Oracle Tech',    email: 'oracle@spark.live',   level: 85, status: 'ACTIVE',   lastActive: '1 hour ago',  agencyCount: 2, joinDate: '2022-07-14' },
    { id: 'A3', name: 'Vanguard X',     email: 'vanguard@spark.live', level: 78, status: 'INACTIVE', lastActive: '3 days ago',  agencyCount: 1, joinDate: '2023-01-22' },
    { id: 'A4', name: 'Cipher Zero',    email: 'cipher@spark.live',   level: 92, status: 'ACTIVE',   lastActive: 'Just now',    agencyCount: 4, joinDate: '2022-11-05' },
    { id: 'A5', name: 'Nexus Prime',    email: 'nexus@spark.live',    level: 70, status: 'ACTIVE',   lastActive: '5 mins ago',  agencyCount: 2, joinDate: '2023-04-18' },
    { id: 'A6', name: 'Specter Node',   email: 'specter@spark.live',  level: 65, status: 'INACTIVE', lastActive: '1 week ago',  agencyCount: 1, joinDate: '2023-08-30' },
    { id: 'A7', name: 'Iron Pulse',     email: 'iron@spark.live',     level: 88, status: 'ACTIVE',   lastActive: '20 mins ago', agencyCount: 3, joinDate: '2022-05-01' },
    { id: 'A8', name: 'Titan Echo',     email: 'titan@spark.live',    level: 95, status: 'ACTIVE',   lastActive: 'Just now',    agencyCount: 5, joinDate: '2021-12-20' },
];

const mockAgencies: Record<string, any[]> = {
    A1: [
        { id: 'AG1', name: 'Nebula Agency',   email: 'nebula@spark.live',  hostCount: 5, status: 'ACTIVE',   revenue: 128400, joinDate: '2023-02-10' },
        { id: 'AG2', name: 'Void Corp',       email: 'void@spark.live',    hostCount: 3, status: 'ACTIVE',   revenue: 74200,  joinDate: '2023-05-20' },
        { id: 'AG3', name: 'Phantom Guild',   email: 'phantom@spark.live', hostCount: 2, status: 'INACTIVE', revenue: 12000,  joinDate: '2023-09-15' },
    ],
    A2: [
        { id: 'AG4', name: 'Solar Syndicate', email: 'solar@spark.live',   hostCount: 6, status: 'ACTIVE',   revenue: 215000, joinDate: '2022-10-01' },
        { id: 'AG5', name: 'Apex Unit',       email: 'apex@spark.live',    hostCount: 4, status: 'ACTIVE',   revenue: 98000,  joinDate: '2023-03-12' },
    ],
    A3: [{ id: 'AG6', name: 'Dark Matter',    email: 'dark@spark.live',    hostCount: 2, status: 'INACTIVE', revenue: 8500,   joinDate: '2023-07-07' }],
    A4: [
        { id: 'AG7', name: 'Quantum Flux',    email: 'quantum@spark.live', hostCount: 7, status: 'ACTIVE',   revenue: 312000, joinDate: '2022-08-15' },
        { id: 'AG8', name: 'Nova Collective', email: 'nova@spark.live',    hostCount: 5, status: 'ACTIVE',   revenue: 187000, joinDate: '2022-12-01' },
    ],
    A5: [
        { id: 'AG9',  name: 'Storm Front',    email: 'storm@spark.live',   hostCount: 3, status: 'ACTIVE',   revenue: 54000,  joinDate: '2023-06-18' },
        { id: 'AG10', name: 'Frost Circuit',  email: 'frost@spark.live',   hostCount: 2, status: 'ACTIVE',   revenue: 39000,  joinDate: '2024-01-09' },
    ],
};

const mockHosts: Record<string, any[]> = {
    AG1: [
        { id: 'H1', name: 'Alpha Stream', email: 'alpha@spark.live',   roomName: 'Galaxy Room',  userCount: 142, status: 'LIVE',    earnings: 34200, totalHours: 312, activeDays: 28, joinDate: '2023-04-01' },
        { id: 'H2', name: 'Beta Wave',    email: 'beta@spark.live',    roomName: 'Neon Den',     userCount: 0,   status: 'OFFLINE', earnings: 18700, totalHours: 180, activeDays: 17, joinDate: '2023-06-15' },
        { id: 'H3', name: 'Gamma Force',  email: 'gamma@spark.live',   roomName: 'Cyber Lounge', userCount: 89,  status: 'LIVE',    earnings: 28900, totalHours: 240, activeDays: 22, joinDate: '2023-07-20' },
    ],
    AG2: [
        { id: 'H4', name: 'Delta Node',   email: 'delta@spark.live',   roomName: 'Void Space',   userCount: 0,   status: 'OFFLINE', earnings: 9400,  totalHours: 95,  activeDays: 10, joinDate: '2023-09-10' },
        { id: 'H5', name: 'Epsilon X',    email: 'epsilon@spark.live', roomName: 'Pulse Arena',  userCount: 201, status: 'LIVE',    earnings: 51200, totalHours: 420, activeDays: 38, joinDate: '2023-03-05' },
    ],
    AG4: [{ id: 'H6', name: 'Solar Host',   email: 'sh@spark.live',    roomName: 'Sun Chamber',  userCount: 312, status: 'LIVE',    earnings: 78000, totalHours: 510, activeDays: 45, joinDate: '2022-11-20' }],
    AG7: [{ id: 'H7', name: 'Quantum Host', email: 'qh@spark.live',    roomName: 'Quantum Rift', userCount: 0,   status: 'OFFLINE', earnings: 44100, totalHours: 290, activeDays: 26, joinDate: '2023-02-14' }],
};

// ── FLAT user list — no nesting under host ────────────────────────────────────
const allUsers = [
    { id: 'U1',  name: 'Nebula Knight',  email: 'nk@void.com',  joinType: 'CURRENT',  coins: 8400,  diamonds: 120,  level: 28, lastSeen: 'Now',       hostId: 'H1', totalSpent: 4200,  liveHours: 18, activeDays: 12, joinDate: '2023-06-01' },
    { id: 'U2',  name: 'Void Walker',    email: 'vw@null.ptr',  joinType: 'CURRENT',  coins: 1200,  diamonds: 0,    level: 8,  lastSeen: 'Now',       hostId: 'H1', totalSpent: 600,   liveHours: 5,  activeDays: 4,  joinDate: '2024-01-15' },
    { id: 'U3',  name: 'Solar Flare',    email: 'sf@nova.org',  joinType: 'PAST',     coins: 45000, diamonds: 2100, level: 56, lastSeen: '2h ago',    hostId: 'H1', totalSpent: 22000, liveHours: 140,activeDays: 60, joinDate: '2022-09-10' },
    { id: 'U4',  name: 'Cyber Phantom',  email: 'cp@ghost.net', joinType: 'PAST',     coins: 0,     diamonds: 5,    level: 15, lastSeen: '1d ago',    hostId: 'H1', totalSpent: 200,   liveHours: 8,  activeDays: 6,  joinDate: '2023-11-20' },
    { id: 'U5',  name: 'Alpha Draconis', email: 'ad@matrix.io', joinType: 'UPCOMING', coins: 15200, diamonds: 450,  level: 42, lastSeen: 'Scheduled', hostId: 'H1', totalSpent: 7600,  liveHours: 55, activeDays: 30, joinDate: '2023-03-05' },
    { id: 'U6',  name: 'Storm Rider',    email: 'sr@storm.io',  joinType: 'CURRENT',  coins: 3200,  diamonds: 80,   level: 22, lastSeen: 'Now',       hostId: 'H3', totalSpent: 1600,  liveHours: 22, activeDays: 14, joinDate: '2023-08-18' },
    { id: 'U7',  name: 'Pulse King',     email: 'pk@pulse.net', joinType: 'CURRENT',  coins: 9800,  diamonds: 310,  level: 38, lastSeen: 'Now',       hostId: 'H5', totalSpent: 4900,  liveHours: 48, activeDays: 25, joinDate: '2023-04-22' },
    { id: 'U8',  name: 'Frost Byte',     email: 'fb@frost.io',  joinType: 'PAST',     coins: 4200,  diamonds: 90,   level: 18, lastSeen: '3h ago',    hostId: 'H2', totalSpent: 2100,  liveHours: 14, activeDays: 9,  joinDate: '2023-10-01' },
    { id: 'U9',  name: 'Nova Shard',     email: 'ns@nova.net',  joinType: 'UPCOMING', coins: 700,   diamonds: 0,    level: 5,  lastSeen: 'Scheduled', hostId: 'H4', totalSpent: 350,   liveHours: 2,  activeDays: 2,  joinDate: '2024-02-28' },
    { id: 'U10', name: 'Binary Ghost',   email: 'bg@ghost.io',  joinType: 'CURRENT',  coins: 11000, diamonds: 220,  level: 31, lastSeen: 'Now',       hostId: 'H6', totalSpent: 5500,  liveHours: 62, activeDays: 32, joinDate: '2023-05-14' },
];

// ── History per entity id ─────────────────────────────────────────────────────
const historyData: Record<string, any[]> = {
    U1: [
        { id: 'T1', date: '2024-03-15', type: 'COIN_BUY',     desc: 'Purchased 2000 coins',      amount: +2000,  currency: 'coins'    },
        { id: 'T2', date: '2024-03-12', type: 'DIAMOND_EARN', desc: 'Diamond reward — live',     amount: +80,    currency: 'diamonds' },
        { id: 'T3', date: '2024-03-10', type: 'COIN_SPEND',   desc: 'Gift sent to host',         amount: -500,   currency: 'coins'    },
        { id: 'T4', date: '2024-03-08', type: 'COIN_BUY',     desc: 'Purchased 1000 coins',      amount: +1000,  currency: 'coins'    },
        { id: 'T5', date: '2024-03-05', type: 'DIAMOND_EARN', desc: 'Leaderboard bonus',         amount: +40,    currency: 'diamonds' },
        { id: 'T6', date: '2024-02-28', type: 'COIN_SPEND',   desc: 'Room entry fee',            amount: -200,   currency: 'coins'    },
        { id: 'T7', date: '2024-02-20', type: 'COIN_BUY',     desc: 'Purchased 5000 coins',      amount: +5000,  currency: 'coins'    },
    ],
    U3: [
        { id: 'T1', date: '2024-03-14', type: 'COIN_BUY',     desc: 'Purchased 10000 coins',     amount: +10000, currency: 'coins'    },
        { id: 'T2', date: '2024-03-11', type: 'DIAMOND_EARN', desc: 'VIP stream bonus',          amount: +200,   currency: 'diamonds' },
        { id: 'T3', date: '2024-03-09', type: 'COIN_SPEND',   desc: 'Super gift to host',        amount: -3000,  currency: 'coins'    },
        { id: 'T4', date: '2024-02-25', type: 'COIN_BUY',     desc: 'Purchased 20000 coins',     amount: +20000, currency: 'coins'    },
        { id: 'T5', date: '2024-02-18', type: 'DIAMOND_EARN', desc: 'Event participation reward',amount: +400,   currency: 'diamonds' },
    ],
    U5: [
        { id: 'T1', date: '2024-03-16', type: 'COIN_BUY',     desc: 'Purchased 5000 coins',      amount: +5000,  currency: 'coins'    },
        { id: 'T2', date: '2024-03-10', type: 'DIAMOND_EARN', desc: 'Event participation',       amount: +150,   currency: 'diamonds' },
        { id: 'T3', date: '2024-03-01', type: 'COIN_SPEND',   desc: 'Gift to broadcaster',       amount: -800,   currency: 'coins'    },
    ],
    H1: [
        { id: 'E1', date: '2024-03-15', type: 'LIVE_EARN',    desc: 'Galaxy Room — 4h session',  amount: +1200,  currency: 'coins'    },
        { id: 'E2', date: '2024-03-13', type: 'GIFT_EARN',    desc: 'Gift income from viewers',  amount: +3400,  currency: 'coins'    },
        { id: 'E3', date: '2024-03-11', type: 'LIVE_EARN',    desc: 'Galaxy Room — 6h session',  amount: +1800,  currency: 'coins'    },
        { id: 'E4', date: '2024-03-09', type: 'BONUS',        desc: 'Weekly performance bonus',  amount: +800,   currency: 'coins'    },
        { id: 'E5', date: '2024-03-07', type: 'GIFT_EARN',    desc: 'Gift income from viewers',  amount: +2200,  currency: 'coins'    },
        { id: 'E6', date: '2024-02-29', type: 'LIVE_EARN',    desc: 'Galaxy Room — 3h session',  amount: +900,   currency: 'coins'    },
    ],
    H3: [
        { id: 'E1', date: '2024-03-15', type: 'LIVE_EARN',    desc: 'Cyber Lounge — 5h session', amount: +1500,  currency: 'coins'    },
        { id: 'E2', date: '2024-03-12', type: 'GIFT_EARN',    desc: 'Gift income',               amount: +2100,  currency: 'coins'    },
        { id: 'E3', date: '2024-03-08', type: 'BONUS',        desc: 'Weekly top-host bonus',     amount: +1000,  currency: 'coins'    },
    ],
    H5: [
        { id: 'E1', date: '2024-03-15', type: 'LIVE_EARN',    desc: 'Pulse Arena — 8h session',  amount: +2400,  currency: 'coins'    },
        { id: 'E2', date: '2024-03-14', type: 'GIFT_EARN',    desc: 'Top viewer gift',           amount: +5800,  currency: 'coins'    },
        { id: 'E3', date: '2024-03-13', type: 'BONUS',        desc: 'Top host bonus',            amount: +1200,  currency: 'coins'    },
    ],
    AG1: [
        { id: 'R1', date: '2024-03-15', type: 'HOST_EARN',    desc: 'Alpha Stream commission',   amount: +3400,  currency: 'coins'    },
        { id: 'R2', date: '2024-03-14', type: 'HOST_EARN',    desc: 'Gamma Force commission',    amount: +2100,  currency: 'coins'    },
        { id: 'R3', date: '2024-03-12', type: 'BONUS',        desc: 'Agency performance bonus',  amount: +5000,  currency: 'coins'    },
        { id: 'R4', date: '2024-03-10', type: 'HOST_EARN',    desc: 'Beta Wave commission',      amount: +900,   currency: 'coins'    },
        { id: 'R5', date: '2024-02-28', type: 'HOST_EARN',    desc: 'Monthly host pool share',   amount: +8200,  currency: 'coins'    },
    ],
    AG4: [
        { id: 'R1', date: '2024-03-15', type: 'HOST_EARN',    desc: 'Solar Host commission',     amount: +7800,  currency: 'coins'    },
        { id: 'R2', date: '2024-03-13', type: 'BONUS',        desc: 'Top agency reward',         amount: +10000, currency: 'coins'    },
        { id: 'R3', date: '2024-03-05', type: 'HOST_EARN',    desc: 'Monthly host pool share',   amount: +15000, currency: 'coins'    },
    ],
    A1: [
        { id: 'L1', date: '2024-03-15', type: 'COMMISSION',   desc: 'Network commission earned', amount: +15000, currency: 'coins'    },
        { id: 'L2', date: '2024-03-12', type: 'AGENCY_ADD',   desc: 'Added agency: Nebula',      amount: null,   currency: null       },
        { id: 'L3', date: '2024-03-09', type: 'USER_BAN',     desc: 'Banned user: Void Walker',  amount: null,   currency: null       },
        { id: 'L4', date: '2024-02-28', type: 'COMMISSION',   desc: 'Monthly admin commission',  amount: +28000, currency: 'coins'    },
    ],
    A4: [
        { id: 'L1', date: '2024-03-15', type: 'COMMISSION',   desc: 'Network commission earned', amount: +32000, currency: 'coins'    },
        { id: 'L2', date: '2024-03-14', type: 'AGENCY_ADD',   desc: 'Added Quantum Flux',        amount: null,   currency: null       },
        { id: 'L3', date: '2024-03-01', type: 'COMMISSION',   desc: 'Monthly admin commission',  amount: +45000, currency: 'coins'    },
    ],
};

// ── History badge meta ────────────────────────────────────────────────────────
const HMETA: Record<string, { label: string; tc: string; bg: string; bc: string }> = {
    COIN_BUY:    { label: 'Buy',        tc: 'text-neon-gold',   bg: 'bg-neon-gold/10',   bc: 'border-neon-gold/30'   },
    COIN_SPEND:  { label: 'Spend',      tc: 'text-neon-red',    bg: 'bg-neon-red/10',    bc: 'border-neon-red/30'    },
    DIAMOND_EARN:{ label: 'Diamond',    tc: 'text-neon-purple', bg: 'bg-neon-purple/10', bc: 'border-neon-purple/30' },
    LIVE_EARN:   { label: 'Live',       tc: 'text-neon-cyan',   bg: 'bg-neon-cyan/10',   bc: 'border-neon-cyan/30'   },
    GIFT_EARN:   { label: 'Gift',       tc: 'text-neon-green',  bg: 'bg-neon-green/10',  bc: 'border-neon-green/30'  },
    BONUS:       { label: 'Bonus',      tc: 'text-amber-400',   bg: 'bg-amber-400/10',   bc: 'border-amber-400/30'   },
    HOST_EARN:   { label: 'Commission', tc: 'text-neon-green',  bg: 'bg-neon-green/10',  bc: 'border-neon-green/30'  },
    AGENCY_ADD:  { label: 'Action',     tc: 'text-neon-cyan',   bg: 'bg-neon-cyan/10',   bc: 'border-neon-cyan/30'   },
    USER_BAN:    { label: 'Moderation', tc: 'text-neon-red',    bg: 'bg-neon-red/10',    bc: 'border-neon-red/30'    },
    COMMISSION:  { label: 'Commission', tc: 'text-neon-green',  bg: 'bg-neon-green/10',  bc: 'border-neon-green/30'  },
};

// ── Level accent tokens ───────────────────────────────────────────────────────
const LC: Record<Level, { color: string; rgb: string; tw: string }> = {
    admin:  { color: 'neon-purple', rgb: '191,0,255', tw: 'text-neon-purple' },
    agency: { color: 'neon-gold',   rgb: '255,215,0', tw: 'text-neon-gold'   },
    host:   { color: 'neon-cyan',   rgb: '0,255,255', tw: 'text-neon-cyan'   },
    user:   { color: 'neon-green',  rgb: '0,255,100', tw: 'text-neon-green'  },
};

// ── Role stats cards ──────────────────────────────────────────────────────────
function getStats(item: any, level: Level) {
    if (level === 'user') return [
        { label: 'Coins',       value: item.coins?.toLocaleString() ?? '0',    icon: '🪙', tc: 'text-neon-gold'   },
        { label: 'Diamonds',    value: item.diamonds?.toLocaleString() ?? '0', icon: '💎', tc: 'text-neon-purple' },
        { label: 'Live Hrs',    value: `${item.liveHours ?? 0}h`,              icon: '⏱',  tc: 'text-neon-cyan'   },
        { label: 'Days Active', value: `${item.activeDays ?? 0}d`,             icon: '📅', tc: 'text-neon-green'  },
    ];
    if (level === 'host') return [
        { label: 'Earned',      value: item.earnings?.toLocaleString() ?? '0', icon: '💰', tc: 'text-neon-gold'   },
        { label: 'Live Hrs',    value: `${item.totalHours ?? 0}h`,             icon: '⏱',  tc: 'text-neon-cyan'   },
        { label: 'Days Active', value: `${item.activeDays ?? 0}d`,             icon: '📅', tc: 'text-neon-green'  },
        { label: 'Live Users',  value: `${item.userCount ?? 0}`,               icon: '👥', tc: 'text-neon-purple' },
    ];
    if (level === 'agency') return [
        { label: 'Revenue',     value: `$${item.revenue?.toLocaleString() ?? 0}`, icon: '📈', tc: 'text-neon-gold' },
        { label: 'Hosts',       value: `${item.hostCount ?? 0}`,               icon: '📡', tc: 'text-neon-cyan'   },
        { label: 'Status',      value: item.status,                            icon: '⚡', tc: item.status === 'ACTIVE' ? 'text-neon-green' : 'text-neon-red' },
    ];
    return [
        { label: 'Sec Level',   value: `LVL ${item.level}`,                    icon: '🛡',  tc: 'text-neon-gold'  },
        { label: 'Agencies',    value: `${item.agencyCount ?? 0}`,             icon: '🏢', tc: 'text-neon-cyan'   },
        { label: 'Status',      value: item.status,                            icon: '⚡', tc: item.status === 'ACTIVE' ? 'text-neon-green' : 'text-neon-red' },
    ];
}

function histLabel(l: Level) {
    if (l === 'user')   return 'Transaction History';
    if (l === 'host')   return 'Earning History';
    if (l === 'agency') return 'Revenue History';
    return 'Activity Log';
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS DOT
// ─────────────────────────────────────────────────────────────────────────────
function StatusDot({ status }: { status: string }) {
    const g = ['ACTIVE','LIVE','CURRENT'].includes(status);
    const u = status === 'UPCOMING';
    return (
        <div className="flex items-center gap-1.5">
            <div className={cn('w-1.5 h-1.5 rounded-full', g ? 'bg-neon-green shadow-[0_0_6px_rgba(0,255,100,0.6)]' : u ? 'bg-neon-gold' : 'bg-neon-red')} />
            <span className={cn('text-[10px] font-black uppercase tracking-wider', g ? 'text-neon-green' : u ? 'text-neon-gold' : 'text-neon-red')}>{status}</span>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// DETAIL MODAL — bottom sheet on mobile / centered card on desktop
// ─────────────────────────────────────────────────────────────────────────────
function DetailModal({ item, level, isOpen, onClose }: { item: any; level: Level; isOpen: boolean; onClose: () => void }) {
    const [from, setFrom] = useState('');
    const [to,   setTo  ] = useState('');
    React.useEffect(() => { setFrom(''); setTo(''); }, [item?.id]);

    const lc       = LC[level];
    const initials = item?.name?.split(' ').map((n: string) => n[0]).join('') ?? '';
    const rawHist  = historyData[item?.id] ?? [];
    const hist     = useMemo(() => rawHist.filter((h: any) => {
        const d = new Date(h.date);
        if (from && d < new Date(from)) return false;
        if (to   && d > new Date(to))   return false;
        return true;
    }), [rawHist, from, to]);

    const stats = item ? getStats(item, level) : [];

    return (
        <AnimatePresence>
            {isOpen && item && (
                <>
                    {/* Backdrop */}
                    <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />

                    {/* Sheet wrapper */}
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6 pointer-events-none">
                        <motion.div key="mc"
                            initial={{ opacity: 0, y: 64 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 64 }}
                            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                            className="pointer-events-auto w-full sm:max-w-[480px] relative"
                        >
                            {/* Outer glow ring */}
                            <div className="absolute -inset-px rounded-t-[28px] sm:rounded-2xl"
                                style={{ background: `linear-gradient(to bottom, rgba(${lc.rgb},0.2), transparent)`, filter: 'blur(8px)' }} />

                            {/* Card */}
                            <div className="relative rounded-t-[28px] sm:rounded-2xl border border-white/10 bg-[#080a10] flex flex-col overflow-hidden"
                                style={{ maxHeight: '92dvh', boxShadow: `0 0 80px rgba(${lc.rgb},0.12)` }}>

                                {/* Scanline */}
                                <motion.div animate={{ x: ['-100%','200%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 6 }}
                                    className={`absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-${lc.color} to-transparent z-20 pointer-events-none`} />

                                {/* Drag pill (mobile only) */}
                                <div className="flex justify-center pt-3 sm:hidden">
                                    <div className="w-10 h-1 rounded-full bg-white/15" />
                                </div>

                                {/* ── HEADER ── */}
                                <div className="relative px-5 pt-4 pb-5"
                                    style={{ background: `linear-gradient(135deg, rgba(${lc.rgb},0.08) 0%, transparent 60%)` }}>
                                    {/* faint grid */}
                                    <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
                                        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '22px 22px' }} />
                                    <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.06]" />

                                    {/* top row */}
                                    <div className="relative flex items-center justify-between mb-4">
                                        <span className={cn('text-[8px] font-black uppercase tracking-[0.35em] opacity-50', lc.tw)}>
                                            {level} · profile
                                        </span>
                                        <button onClick={onClose}
                                            className="w-7 h-7 rounded-xl bg-white/[0.06] hover:bg-red-500/20 hover:text-red-400 border border-white/[0.08] text-white/30 transition-all flex items-center justify-center">
                                            <X size={13} />
                                        </button>
                                    </div>

                                    {/* identity */}
                                    <div className="relative flex items-center gap-4">
                                        <div className={cn('w-[60px] h-[60px] rounded-2xl flex items-center justify-center font-black text-xl flex-shrink-0 border-2', lc.tw, `border-${lc.color}/40 bg-${lc.color}/10`)}
                                            style={{ boxShadow: `0 0 24px rgba(${lc.rgb},0.18)` }}>
                                            {initials}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-white text-[17px] leading-tight truncate">{item.name}</p>
                                            <p className="text-[11px] text-white/35 mt-0.5 truncate">{item.email}</p>
                                            {item.joinDate && (
                                                <p className="flex items-center gap-1 text-[9px] text-white/25 mt-1.5">
                                                    <Calendar size={8} />
                                                    Joined {new Date(item.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            )}
                                        </div>
                                        {item.status && <StatusDot status={item.status} />}
                                    </div>
                                </div>

                                {/* ── SCROLL BODY ── */}
                                <div className="flex-1 overflow-y-auto overscroll-contain">

                                    {/* ── Stats grid ── */}
                                    <div className="px-5 pt-5 pb-4">
                                        <SLabel text="Overview" />
                                        <div className={cn('grid gap-2 mt-3', stats.length === 4 ? 'grid-cols-4' : 'grid-cols-3')}>
                                            {stats.map(({ label, value, icon, tc }) => (
                                                <div key={label} className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.06] transition-all">
                                                    <span className="text-2xl leading-none">{icon}</span>
                                                    <span className={cn('text-[13px] font-black leading-none', tc)}>{value}</span>
                                                    <span className="text-[7px] uppercase tracking-widest text-white/25 text-center px-1 leading-snug">{label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ── Detail rows ── */}
                                    <div className="px-5 pb-4 space-y-1.5">
                                        <SLabel text="Details" />
                                        <div className="mt-3 space-y-1.5">
                                            {level === 'user' && <>
                                                <IRow label="Join Type"   value={item.joinType}              vc={item.joinType === 'CURRENT' ? 'text-neon-green' : item.joinType === 'UPCOMING' ? 'text-neon-gold' : 'text-white/40'} />
                                                <IRow label="Level"       value={`LVL ${item.level}`}        vc="text-neon-cyan" />
                                                <IRow label="Total Spent" value={`${item.totalSpent?.toLocaleString() ?? 0} coins`} vc="text-neon-red" />
                                                <IRow label="Last Seen"   value={item.lastSeen}              vc="text-white/40" />
                                            </>}
                                            {level === 'host' && <>
                                                <IRow label="Room"   value={item.roomName} vc="text-neon-cyan" />
                                                <IRow label="Status" value={item.status}   vc={item.status === 'LIVE' ? 'text-neon-green' : 'text-neon-red'} />
                                            </>}
                                            {level === 'agency' && <>
                                                <IRow label="Email"  value={item.email}    vc="text-white/60" />
                                                <IRow label="Joined" value={item.joinDate ?? '—'} vc="text-white/40" />
                                            </>}
                                            {level === 'admin' && <>
                                                <IRow label="Last Active" value={item.lastActive} vc="text-white/40" />
                                                <IRow label="Email"       value={item.email}      vc="text-white/60" />
                                            </>}
                                        </div>
                                    </div>

                                    {/* ── History ── */}
                                    <div className="px-5 pb-6">
                                        <div className="flex items-center justify-between">
                                            <SLabel text={histLabel(level)} />
                                            <span className="text-[8px] font-bold text-white/20">{hist.length} records</span>
                                        </div>

                                        {/* Date range */}
                                        <div className="mt-3 mb-3 flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                                            <Filter size={10} className="text-white/25 flex-shrink-0" />
                                            <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-0">
                                                <div>
                                                    <p className="text-[7px] uppercase tracking-widest text-white/20 mb-1">From</p>
                                                    <input type="date" value={from} onChange={e => setFrom(e.target.value)}
                                                        className="w-full bg-transparent text-[11px] font-bold text-white/60 focus:outline-none border-b border-white/10 focus:border-neon-cyan/40 pb-0.5 transition-colors" />
                                                </div>
                                                <div>
                                                    <p className="text-[7px] uppercase tracking-widest text-white/20 mb-1">To</p>
                                                    <input type="date" value={to} onChange={e => setTo(e.target.value)}
                                                        className="w-full bg-transparent text-[11px] font-bold text-white/60 focus:outline-none border-b border-white/10 focus:border-neon-cyan/40 pb-0.5 transition-colors" />
                                                </div>
                                            </div>
                                            {(from || to) && (
                                                <button onClick={() => { setFrom(''); setTo(''); }}
                                                    className="w-6 h-6 flex-shrink-0 rounded-lg bg-white/[0.05] hover:bg-red-500/20 hover:text-red-400 border border-white/[0.08] text-white/25 transition-all flex items-center justify-center">
                                                    <X size={9} />
                                                </button>
                                            )}
                                        </div>

                                        {/* Records */}
                                        {hist.length === 0 ? (
                                            <div className="py-10 text-center text-white/20 text-xs">No records in selected range.</div>
                                        ) : (
                                            <div className="space-y-2">
                                                {hist.map((h: any, i: number) => {
                                                    const m = HMETA[h.type] ?? { label: h.type, tc: 'text-white/40', bg: 'bg-white/5', bc: 'border-white/10' };
                                                    const pos = h.amount > 0;
                                                    return (
                                                        <motion.div key={h.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                                                            className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all">
                                                            <span className={cn('px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-wider border flex-shrink-0', m.tc, m.bg, m.bc)}>
                                                                {m.label}
                                                            </span>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-[11px] font-bold text-white/75 truncate">{h.desc}</p>
                                                                <p className="text-[9px] text-white/25 mt-0.5">
                                                                    {new Date(h.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                </p>
                                                            </div>
                                                            {h.amount !== null && (
                                                                <div className={cn('flex items-center gap-0.5 font-black text-xs flex-shrink-0', pos ? 'text-neon-green' : 'text-neon-red')}>
                                                                    {pos ? <ArrowUpRight size={11} /> : <ArrowDownLeft size={11} />}
                                                                    {Math.abs(h.amount).toLocaleString()}
                                                                    <span className="text-[8px] opacity-40 ml-0.5">{h.currency}</span>
                                                                </div>
                                                            )}
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

function SLabel({ text }: { text: string }) {
    return <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/25">{text}</p>;
}
function IRow({ label, value, vc = 'text-white/55' }: { label: string; value: string; vc?: string }) {
    return (
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[9px] uppercase tracking-widest text-white/25">{label}</span>
            <span className={cn('text-[11px] font-black truncate ml-2 max-w-[180px]', vc)}>{value}</span>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// BREADCRUMB
// ─────────────────────────────────────────────────────────────────────────────
function Breadcrumb({ items, onNavigate }: { items: { label: string; icon: React.ReactNode }[]; onNavigate: (i: number) => void }) {
    return (
        <div className="flex items-center gap-1 flex-wrap">
            {items.map((item, idx) => {
                const isLast = idx === items.length - 1;
                return (
                    <React.Fragment key={idx}>
                        <motion.button initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                            onClick={() => !isLast && onNavigate(idx)}
                            className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                                isLast ? 'bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan cursor-default'
                                       : 'bg-white/5 border border-card-border text-text-muted hover:text-neon-cyan hover:border-neon-cyan/20 cursor-pointer')}>
                            {item.icon}{item.label}
                        </motion.button>
                        {!isLast && <ChevronRight size={12} className="text-text-muted/40" />}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

function EyeBtn({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
    return (
        <button title="View Details" onClick={onClick}
            className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all border border-transparent hover:border-neon-cyan/30">
            <Eye size={14} />
        </button>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }: {
    currentPage: number; totalPages: number; totalItems: number; itemsPerPage: number; onPageChange: (p: number) => void;
}) {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end   = Math.min(currentPage * itemsPerPage, totalItems);
    const pages: (number | '...')[] = useMemo(() => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
        if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    }, [currentPage, totalPages]);
    const btn  = 'w-7 h-7 rounded-lg border transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed';
    const idle = 'bg-white/[0.03] border-card-border text-text-muted hover:bg-neon-cyan/10 hover:border-neon-cyan/30 hover:text-neon-cyan';
    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-card-border">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted hidden sm:block">
                Showing <span className="text-neon-cyan">{start}–{end}</span> of {totalItems}
            </span>
            <div className="flex items-center gap-1 mx-auto sm:mx-0">
                <button disabled={currentPage === 1} onClick={() => onPageChange(1)} className={cn(btn, idle)}><ChevronsLeft size={11} /></button>
                <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className={cn(btn, idle)}><ChevronLeft size={11} /></button>
                {pages.map((p, i) => p === '...'
                    ? <span key={`e${i}`} className="w-7 flex items-center justify-center text-[10px] text-text-muted">···</span>
                    : <motion.button key={p} whileTap={{ scale: 0.92 }} onClick={() => onPageChange(p as number)}
                        className={cn(btn, 'text-[10px] font-black', currentPage === p ? 'bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.2)]' : idle)}>
                        {p}
                      </motion.button>
                )}
                <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} className={cn(btn, idle)}><ChevronRight size={11} /></button>
                <button disabled={currentPage === totalPages} onClick={() => onPageChange(totalPages)} className={cn(btn, idle)}><ChevronsRight size={11} /></button>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted hidden sm:block">
                Page <span className="text-text-primary">{currentPage}/{totalPages}</span>
            </span>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADD ADMIN MODAL
// ─────────────────────────────────────────────────────────────────────────────
interface AdminForm { name: string; email: string; level: string; status: string; }
const DEF_FORM: AdminForm = { name: '', email: '', level: '', status: 'ACTIVE' };

function AddAdminModal({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (a: any) => void }) {
    const [form, setForm] = useState<AdminForm>(DEF_FORM);
    const [errs, setErrs] = useState<Partial<AdminForm>>({});
    const set = (k: keyof AdminForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(p => ({ ...p, [k]: e.target.value })); setErrs(p => ({ ...p, [k]: '' }));
    };
    const validate = () => {
        const e: Partial<AdminForm> = {};
        if (!form.name.trim()) e.name = 'Required';
        if (!form.email.includes('@')) e.email = 'Valid email required';
        if (!form.level || +form.level < 1 || +form.level > 100) e.level = '1–100 only';
        setErrs(e); return !Object.keys(e).length;
    };
    const submit = () => {
        if (!validate()) return;
        onAdd({ id: `A${Date.now()}`, name: form.name.trim(), email: form.email.trim(), level: +form.level, status: form.status, lastActive: 'Just now', agencyCount: 0, joinDate: new Date().toISOString().split('T')[0] });
        setForm(DEF_FORM); setErrs({});
    };
    const close = () => { setForm(DEF_FORM); setErrs({}); onClose(); };
    const iCls = 'w-full h-9 rounded-lg bg-dark-bg border border-card-border hover:border-neon-cyan/30 focus:border-neon-cyan/50 focus:outline-none text-xs font-bold text-text-primary placeholder-text-muted/40 transition-all pl-8 pr-3';
    const lCls = 'text-[9px] font-black uppercase tracking-[0.2em] text-text-muted block mb-1.5';
    const ico  = (i: React.ReactNode) => <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-cyan/40 pointer-events-none">{i}</span>;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={close} className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div initial={{ opacity: 0, scale: 0.93, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.93 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                            className="pointer-events-auto w-full max-w-md relative">
                            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-transparent blur-md" />
                            <div className="relative rounded-2xl border border-neon-cyan/20 bg-dark-bg overflow-hidden">
                                <motion.div animate={{ x: ['-100%','200%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
                                    className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent z-10" />
                                <div className="relative px-6 py-4 border-b border-card-border flex items-center justify-between"
                                    style={{ background: 'linear-gradient(135deg, rgba(0,255,255,0.06) 0%, transparent 60%)' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center shadow-[0_0_14px_rgba(0,255,255,0.15)]">
                                            <ShieldCheck size={16} className="text-neon-cyan" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-neon-cyan/50">Matrix Registry</p>
                                            <h2 className="text-sm font-black text-text-primary">Deploy New Admin</h2>
                                        </div>
                                    </div>
                                    <button onClick={close} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red border border-card-border text-text-muted transition-all flex items-center justify-center"><X size={13} /></button>
                                </div>
                                <div className="px-6 py-5 space-y-4">
                                    <Divider label="Core Identity" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={lCls}>Admin Alias *</label>
                                            <div className="relative">{ico(<AtSign size={11} />)}<input value={form.name} onChange={set('name')} placeholder="e.g. Cipher Zero" className={iCls} /></div>
                                            {errs.name && <p className="text-[9px] text-neon-red mt-1">{errs.name}</p>}
                                        </div>
                                        <div>
                                            <label className={lCls}>Contact Email *</label>
                                            <div className="relative">{ico(<Mail size={11} />)}<input type="email" value={form.email} onChange={set('email')} placeholder="admin@spark.live" className={iCls} /></div>
                                            {errs.email && <p className="text-[9px] text-neon-red mt-1">{errs.email}</p>}
                                        </div>
                                    </div>
                                    <Divider label="Access Level" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={lCls}>Security Level (1–100) *</label>
                                            <div className="relative">{ico(<Star size={11} />)}<input type="number" value={form.level} onChange={set('level')} placeholder="e.g. 85" className={iCls} /></div>
                                            {errs.level && <p className="text-[9px] text-neon-red mt-1">{errs.level}</p>}
                                        </div>
                                        <div>
                                            <label className={lCls}>Account Status</label>
                                            <select value={form.status} onChange={set('status')} className="w-full h-9 rounded-lg border border-card-border bg-dark-bg px-3 text-xs font-bold text-text-primary focus:outline-none focus:border-neon-cyan/50 transition-all hover:border-neon-cyan/30">
                                                <option value="ACTIVE">Active</option>
                                                <option value="INACTIVE">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                    <p className="text-xs text-neon-gold flex items-center gap-2 pt-1 border-t border-white/5">
                                        <ShieldCheck size={13} /> Role pre-set to <span className="font-black">ADMIN</span>. Requires Super Admin confirmation.
                                    </p>
                                    <div className="flex gap-2 pt-1">
                                        <button onClick={submit} className="flex-1 h-10 rounded-xl bg-neon-cyan/15 hover:bg-neon-cyan/25 border border-neon-cyan/30 hover:border-neon-cyan/60 text-neon-cyan text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                            <ShieldCheck size={13} /> Provision
                                        </button>
                                        <button onClick={close} className="flex-1 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-card-border text-text-muted text-xs font-black uppercase tracking-widest transition-all">Abort</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

function Divider({ label }: { label: string }) {
    return (
        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-neon-cyan/40 flex items-center gap-2">
            <span className="w-3 h-px bg-neon-cyan/30" />{label}<span className="flex-1 h-px bg-card-border" />
        </p>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminManagementPage() {
    const [search, setSearch]                 = useState('');
    const [level, setLevel]                   = useState<Level>('admin');
    const [selectedAdmin, setSelectedAdmin]   = useState<any>(null);
    const [selectedAgency, setSelectedAgency] = useState<any>(null);
    const [selectedHost, setSelectedHost]     = useState<any>(null);
    const [detailItem, setDetailItem]         = useState<any>(null);
    const [detailOpen, setDetailOpen]         = useState(false);
    const [addOpen, setAddOpen]               = useState(false);
    const [currentPage, setCurrentPage]       = useState(1);
    const [admins, setAdmins]                 = useState(mockAdmins);

    const openDetail = (e: React.MouseEvent, item: any) => { e.stopPropagation(); setDetailItem(item); setDetailOpen(true); };
    const closeDetail = () => { setDetailOpen(false); setTimeout(() => setDetailItem(null), 350); };

    const drillInto = (e: React.MouseEvent, next: Level, setter: (v: any) => void, item: any) => {
        e.stopPropagation(); setter(item); setLevel(next); setSearch(''); setCurrentPage(1);
    };

    const breadcrumbs = [
        { label: 'Admins',  icon: <Home size={10} className="mr-1" /> },
        ...(selectedAdmin  ? [{ label: selectedAdmin.name,  icon: <ShieldCheck size={10} className="mr-1" /> }] : []),
        ...(selectedAgency ? [{ label: selectedAgency.name, icon: <Building2   size={10} className="mr-1" /> }] : []),
        ...(selectedHost   ? [{ label: selectedHost.name,   icon: <Radio       size={10} className="mr-1" /> }] : []),
    ];

    const navigateTo = (idx: number) => {
        setCurrentPage(1);
        if (idx === 0) { setLevel('admin');  setSelectedAdmin(null); setSelectedAgency(null); setSelectedHost(null); }
        if (idx === 1) { setLevel('agency'); setSelectedAgency(null); setSelectedHost(null); }
        if (idx === 2) { setLevel('host');   setSelectedHost(null); }
    };

    const currentData = useMemo(() => {
        if (level === 'admin')  return admins;
        if (level === 'agency') return mockAgencies[selectedAdmin?.id]  ?? [];
        if (level === 'host')   return mockHosts[selectedAgency?.id]    ?? [];
        return allUsers.filter(u => u.hostId === selectedHost?.id);
    }, [level, admins, selectedAdmin, selectedAgency, selectedHost]);

    const filtered = useMemo(() => currentData.filter((r: any) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.email?.toLowerCase().includes(search.toLowerCase())
    ), [currentData, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const safePage   = Math.min(currentPage, totalPages);
    const paged      = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

    const levelMeta: Record<Level, { title: string; desc: string }> = {
        admin:  { title: 'Admin Control Matrix',                   desc: 'High-level security permissions and admin oversight' },
        agency: { title: `Agencies — ${selectedAdmin?.name}`,      desc: 'All agencies managed by this admin'                  },
        host:   { title: `Hosts — ${selectedAgency?.name}`,        desc: 'All hosts registered in this agency'                 },
        user:   { title: `Users — ${selectedHost?.roomName}`,      desc: 'Current, past and upcoming room participants'        },
    };

    // ── Columns ───────────────────────────────────────────────────────────────
    const adminCols: Column<any>[] = [
        {
            header: 'Admin Identity',
            accessor: (a) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple font-black text-xs">
                        {a.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                        <div className="font-bold text-text-primary text-sm flex items-center gap-1.5">{a.name} <ShieldCheck size={12} className="text-neon-cyan" /></div>
                        <div className="text-[10px] text-text-muted">{a.email}</div>
                    </div>
                </div>
            ),
        },
        { header: 'Level',       accessor: (a) => <span className="text-neon-gold font-black text-xs">LVL {a.level}</span> },
        { header: 'Agencies',    accessor: (a) => <span className="text-text-primary font-bold">{a.agencyCount}</span> },
        { header: 'Status',      accessor: (a) => <StatusDot status={a.status} /> },
        { header: 'Last Active', accessor: (a) => <span className="text-[10px] text-text-muted italic">{a.lastActive}</span> },
        { header: 'Actions',     accessor: (a) => (
            <div className="flex items-center gap-1">
                <EyeBtn onClick={(e) => openDetail(e, a)} />
                <button onClick={(e) => drillInto(e, 'agency', setSelectedAdmin, a)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neon-purple/10 hover:bg-neon-purple/20 border border-neon-purple/20 hover:border-neon-purple/40 text-neon-purple text-[10px] font-black uppercase tracking-widest transition-all">
                    <Building2 size={11} /><ChevronRight size={10} />
                </button>
            </div>
        )},
    ];

    const agencyCols: Column<any>[] = [
        {
            header: 'Agency',
            accessor: (a) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-gold/10 border border-neon-gold/20 flex items-center justify-center text-neon-gold font-black text-xs">
                        {a.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                        <div className="font-bold text-text-primary text-sm">{a.name}</div>
                        <div className="text-[10px] text-text-muted">{a.email}</div>
                    </div>
                </div>
            ),
        },
        { header: 'Hosts',   accessor: (a) => <span className="text-text-primary font-bold">{a.hostCount}</span> },
        { header: 'Revenue', accessor: (a) => <span className="text-neon-green font-black text-xs">${a.revenue.toLocaleString()}</span> },
        { header: 'Status',  accessor: (a) => <StatusDot status={a.status} /> },
        { header: 'Actions', accessor: (a) => (
            <div className="flex items-center gap-1">
                <EyeBtn onClick={(e) => openDetail(e, a)} />
                <button onClick={(e) => drillInto(e, 'host', setSelectedAgency, a)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neon-gold/10 hover:bg-neon-gold/20 border border-neon-gold/20 hover:border-neon-gold/40 text-neon-gold text-[10px] font-black uppercase tracking-widest transition-all">
                    <Radio size={11} /><ChevronRight size={10} />
                </button>
            </div>
        )},
    ];

    const hostCols: Column<any>[] = [
        {
            header: 'Host',
            accessor: (h) => (
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan font-black text-xs">
                            {h.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        {h.status === 'LIVE' && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-neon-green border border-dark-bg shadow-[0_0_6px_rgba(0,255,100,0.8)]" />}
                    </div>
                    <div>
                        <div className="font-bold text-text-primary text-sm">{h.name}</div>
                        <div className="text-[10px] text-text-muted">{h.roomName}</div>
                    </div>
                </div>
            ),
        },
        { header: 'Status',     accessor: (h) => <StatusDot status={h.status} /> },
        { header: 'Live Users', accessor: (h) => <span className={cn('font-black text-sm', h.userCount > 0 ? 'text-neon-green' : 'text-text-muted')}>{h.userCount}</span> },
        { header: 'Earnings',   accessor: (h) => <span className="text-neon-gold font-black text-xs">${h.earnings.toLocaleString()}</span> },
        { header: 'Actions',    accessor: (h) => (
            <div className="flex items-center gap-1">
                <EyeBtn onClick={(e) => openDetail(e, h)} />
                <button onClick={(e) => drillInto(e, 'user', setSelectedHost, h)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/20 hover:border-neon-cyan/40 text-neon-cyan text-[10px] font-black uppercase tracking-widest transition-all">
                    <Users size={11} /><ChevronRight size={10} />
                </button>
            </div>
        )},
    ];

    const userCols: Column<any>[] = [
        {
            header: 'User',
            accessor: (u) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-card-border flex items-center justify-center text-text-primary font-black text-xs">
                        {u.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                        <div className="font-bold text-text-primary text-sm">{u.name}</div>
                        <div className="text-[10px] text-text-muted">{u.email}</div>
                    </div>
                </div>
            ),
        },
        { header: 'Join Type', accessor: (u) => (
            <span className={cn('px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border',
                u.joinType === 'CURRENT'  ? 'text-neon-green  border-neon-green/30  bg-neon-green/10'
                : u.joinType === 'UPCOMING' ? 'text-neon-gold   border-neon-gold/30   bg-neon-gold/10'
                : 'text-text-muted border-card-border bg-white/5')}>
                {u.joinType}
            </span>
        )},
        { header: 'Level',    accessor: (u) => <span className="text-neon-cyan   font-black text-xs">LVL {u.level}</span> },
        { header: 'Coins',    accessor: (u) => <span className="text-neon-gold   font-black text-xs">{u.coins.toLocaleString()}</span> },
        { header: 'Diamonds', accessor: (u) => <span className="text-neon-purple font-black text-xs">{u.diamonds}</span> },
        { header: 'Last Seen',accessor: (u) => <span className="text-[10px] text-text-muted">{u.lastSeen}</span> },
        { header: 'Detail',   accessor: (u) => <EyeBtn onClick={(e) => openDetail(e, u)} /> },
    ];

    const colMap = { admin: adminCols, agency: agencyCols, host: hostCols, user: userCols };

    return (
        <PageContainer>
            <PageHeader
                title={levelMeta[level].title}
                description={levelMeta[level].desc}
                actions={
                    <div className="flex items-center gap-3">
                        <div className="w-56">
                            <NeonInput placeholder="Search..." value={search}
                                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                icon={<Search size={16} />} className="h-10" />
                        </div>
                        {level === 'admin' && (
                            <GlowButton variant="cyan" size="sm" className="flex items-center gap-2" onClick={() => setAddOpen(true)}>
                                <Plus size={16} /> Deploy Admin
                            </GlowButton>
                        )}
                    </div>
                }
            />

            {breadcrumbs.length > 1 && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                    <Breadcrumb items={breadcrumbs} onNavigate={navigateTo} />
                </motion.div>
            )}

            {/* Full-width table — no side panel */}
            <motion.div key={level} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                className="glass-card rounded-2xl border border-neon-purple/10 overflow-hidden">
                <div className="p-1">
                    <NeonTable columns={colMap[level]} data={paged}
                        onRowClick={(row) => { setDetailItem(row); setDetailOpen(true); }} />
                    {paged.length === 0 && <div className="py-16 text-center text-text-muted text-sm">No records found.</div>}
                </div>
                <Pagination currentPage={safePage} totalPages={totalPages} totalItems={filtered.length}
                    itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
            </motion.div>

            {/* Mobile-friendly detail modal */}
            <DetailModal item={detailItem} level={level} isOpen={detailOpen} onClose={closeDetail} />

            {/* Add admin modal */}
            <AddAdminModal isOpen={addOpen} onClose={() => setAddOpen(false)}
                onAdd={(a) => { setAdmins(p => [a, ...p]); setAddOpen(false); setCurrentPage(1); }} />
        </PageContainer>
    );
}