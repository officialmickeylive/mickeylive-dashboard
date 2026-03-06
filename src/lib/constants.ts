import {
    BarChart3,
    Users,
    UserPlus,
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
    HelpCircle,
    Trophy,
    LayoutDashboard,
    ShieldAlert,
    Sword,
    LucideIcon
} from 'lucide-react';

export interface NavItem {
    title: string;
    href: string;
    icon: LucideIcon;
    roles: string[];
}

export const NAV_ITEMS: NavItem[] = [
    // APP_OWNER & SUPER_ADMIN Shared
    { title: 'Overview', href: '/dashboard', icon: LayoutDashboard, roles: ['APP_OWNER', 'SUPER_ADMIN', 'ADMIN', 'AGENCY', 'HOST', 'SELLER'] },

    { title: 'Users', href: '/users', icon: Users, roles: ['APP_OWNER', 'SUPER_ADMIN'] },
    { title: 'Admins', href: '/admins', icon: ShieldAlert, roles: ['APP_OWNER'] },
    { title: 'Agencies', href: '/agencies', icon: Briefcase, roles: ['APP_OWNER', 'SUPER_ADMIN'] },
    { title: 'Hosts', href: '/hosts', icon: Mic2, roles: ['APP_OWNER', 'SUPER_ADMIN'] },

    { title: 'Sellers', href: '/sellers', icon: UserPlus, roles: ['ADMIN'] },

    { title: 'Gifts', href: '/gifts', icon: Gift, roles: ['APP_OWNER', 'SUPER_ADMIN'] },
    { title: 'Store', href: '/store', icon: ShoppingBag, roles: ['APP_OWNER', 'SUPER_ADMIN'] },
    { title: 'Packages', href: '/packages', icon: Wallet, roles: ['APP_OWNER'] },

    { title: 'Coin Trading', href: '/coin-trading', icon: ArrowLeftRight, roles: ['APP_OWNER', 'ADMIN', 'SELLER'] },
    { title: 'Transactions', href: '/transactions', icon: ArrowLeftRight, roles: ['APP_OWNER'] },

    { title: 'Rooms', href: '/rooms', icon: Mic2, roles: ['APP_OWNER', 'SUPER_ADMIN', 'HOST'] },
    { title: 'PK Battles', href: '/pk-battles', icon: Sword, roles: ['APP_OWNER', 'SUPER_ADMIN', 'HOST'] },

    { title: 'Reports', href: '/reports', icon: Flag, roles: ['APP_OWNER', 'SUPER_ADMIN', 'ADMIN'] },
    { title: 'Notifications', href: '/notifications', icon: Bell, roles: ['APP_OWNER', 'SUPER_ADMIN'] },
    { title: 'Banners', href: '/banners', icon: ImageIcon, roles: ['APP_OWNER', 'SUPER_ADMIN'] },

    { title: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['APP_OWNER', 'SUPER_ADMIN'] },
    { title: 'Leaderboards', href: '/leaderboards', icon: Trophy, roles: ['APP_OWNER', 'SUPER_ADMIN', 'AGENCY', 'HOST'] },

    { title: 'Support', href: '/support', icon: HelpCircle, roles: ['APP_OWNER', 'SUPER_ADMIN', 'ADMIN'] },
    { title: 'Settings', href: '/settings', icon: Settings, roles: ['APP_OWNER', 'ADMIN'] },

    // Role specific overrides/additions
    { title: 'My Earnings', href: '/earnings', icon: Wallet, roles: ['AGENCY', 'HOST', 'SELLER'] },
    { title: 'My Inventory', href: '/inventory', icon: ShoppingBag, roles: ['SELLER'] },
];

export const ROLE_PATH_PREFIXES: Record<string, string> = {
    APP_OWNER: '/app-owner',
    SUPER_ADMIN: '/super-admin',
    ADMIN: '/admin',
    AGENCY: '/agency',
    HOST: '/host',
    SELLER: '/seller',
    CUSTOMER: '/profile',
};
