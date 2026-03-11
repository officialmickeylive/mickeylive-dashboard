import {
    BarChart3,
    Users,
    Briefcase,
    Mic2,
    Gift,
    ShoppingBag,
    Wallet,
    ArrowLeftRight,
    Bell,
    Settings,
    Flag,
    Image as ImageIcon,

    Trophy,
    LayoutDashboard,
    ShieldAlert,
    Sword,
    Package,
    Receipt,
    Headphones,

    ClipboardCheck,
    Repeat,
    DollarSign,
    Video,
    LucideIcon
} from 'lucide-react';

export interface NavItem {
    title: string;
    href: string;
    icon: LucideIcon;
    roles: string[];
    group?: string;
    /** When true the page is view-only for a given role (no CRUD actions) */
    readOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
    // ── OVERVIEW (all roles) ───────────────────────────────────────────
    { title: 'Overview', href: '/dashboard', icon: LayoutDashboard, roles: ['APP_OWNER', 'SUPER_ADMIN', 'ADMIN']},

    // ── APP OWNER & SUPER ADMIN ────────────────────────────────────
    { title: 'Users', href: '/users', icon: Users, roles: ['APP_OWNER', 'SUPER_ADMIN'], group: 'People' },
    { title: 'Admins', href: '/admins', icon: ShieldAlert, roles: ['APP_OWNER', 'SUPER_ADMIN'], group: 'People' },
    { title: 'Agencies', href: '/agencies', icon: Briefcase, roles: ['APP_OWNER', 'SUPER_ADMIN'], group: 'People' },
    { title: 'Hosts', href: '/hosts', icon: Mic2, roles: ['APP_OWNER', 'SUPER_ADMIN'], group: 'People' },

    { title: 'Gifts', href: '/gifts', icon: Gift, roles: ['APP_OWNER', 'SUPER_ADMIN'], group: 'Catalogue' },
    { title: 'Store', href: '/store', icon: ShoppingBag, roles: ['APP_OWNER', 'SUPER_ADMIN'], group: 'Catalogue' },
    { title: 'Packages', href: '/packages', icon: Package, roles: ['APP_OWNER', 'SUPER_ADMIN'], group: 'Catalogue' },
    { title: 'Trading', href: '/trading', icon: ArrowLeftRight, roles: ['APP_OWNER'], group: 'Finance' },
    { title: 'Rooms', href: '/rooms', icon: Video, roles: ['APP_OWNER', 'SUPER_ADMIN'], group: 'Live' },
    { title: 'PK Battles', href: '/pk-battles', icon: Sword, roles: ['APP_OWNER', 'SUPER_ADMIN'], group: 'Live' },

    { title: 'Notifications', href: '/notifications', icon: Bell, roles: ['APP_OWNER', 'SUPER_ADMIN'], group: 'Moderation' },
    { title: 'Banners', href: '/banners', icon: ImageIcon, roles: ['APP_OWNER', 'SUPER_ADMIN'], group: 'Moderation' },
    { title: 'Leaderboards', href: '/leaderboards', icon: Trophy, roles: ['APP_OWNER', 'SUPER_ADMIN'], group: 'Insights' },
    { title: 'Support', href: '/support', icon: Headphones, roles: ['APP_OWNER', 'SUPER_ADMIN'], group: 'Insights' },
    { title: 'Settings', href: '/settings', icon: Settings, roles: ['APP_OWNER', 'SUPER_ADMIN'], group: 'Insights' },

    // ── ADMIN (scoped to agency ops + read-only analytics) ─────────
    { title: 'Agency Requests', href: '/agency-requests', icon: ClipboardCheck, roles: ['ADMIN'], group: 'Agency Ops' },
    { title: 'Agencies', href: '/agencies', icon: Briefcase, roles: ['ADMIN'], group: 'Agency Ops', readOnly: true },
    { title: 'Hosts', href: '/hosts', icon: Mic2, roles: ['ADMIN'], group: 'Agency Ops', readOnly: true },
    { title: 'Room Info', href: '/rooms', icon: Video, roles: ['ADMIN'], group: 'Agency Ops', readOnly: true },
    { title: 'Notifications', href: '/notifications', icon: Bell, roles: ['ADMIN'], group: 'Moderation' },
    { title: 'Leaderboards', href: '/leaderboards', icon: Trophy, roles: ['ADMIN'], group: 'Insights', readOnly: true },
    { title: 'Settings', href: '/settings', icon: Settings, roles: ["ADMIN"], group: 'Insights' },
];

export const ROLE_PATH_PREFIXES: Record<string, string> = {
    APP_OWNER: '/app-owner',
    SUPER_ADMIN: '/app-owner', // Super Admin routes exactly matching App Owner
    ADMIN: '/admin'
};

