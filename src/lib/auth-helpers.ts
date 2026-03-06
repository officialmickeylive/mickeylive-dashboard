import Cookies from 'js-cookie';

export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'auth_user';

export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    [key: string]: string | number | boolean | null | undefined | unknown;
}

export const setToken = (token: string) => {
    Cookies.set(TOKEN_KEY, token, { expires: 7 }); // 7 days
};

export const getToken = () => {
    return Cookies.get(TOKEN_KEY);
};

export const removeToken = () => {
    Cookies.remove(TOKEN_KEY);
};

export const setUser = (user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
    localStorage.removeItem(USER_KEY);
};

export const getRoleDashboard = (role: string) => {
    const roleMap: Record<string, string> = {
        APP_OWNER: '/app-owner/dashboard',
        SUPER_ADMIN: '/super-admin/dashboard',
        ADMIN: '/admin/dashboard',
        AGENCY: '/agency/dashboard',
        HOST: '/host/dashboard',
        SELLER: '/seller/dashboard',
        CUSTOMER: '/profile',
    };
    return roleMap[role] || '/profile';
};
