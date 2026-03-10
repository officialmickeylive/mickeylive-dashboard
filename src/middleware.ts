import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJwt } from 'jose';

const publicRoutes = ['/login', '/setup', '/api/auth/login'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Allow public routes
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // 2. Check for auth token
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
        // No token, redirect to login
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    try {
        // 3. Decode token to get role
        const decoded = decodeJwt(token as string) as { role?: string; roles?: string[] };
        const role = decoded.role || (decoded.roles?.[0]);

        if (typeof role !== 'string') {
            // Token exists but no role, redirect to login
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // 4. Role-based path protection
        const roleDashboardMap: Record<string, string> = {
            APP_OWNER: '/app-owner',
            SUPER_ADMIN: '/app-owner', // Super Admin shares App Owner routes (except Trading)
            ADMIN: '/admin',
            CUSTOMER: '/profile',
        };

        const currentRole = role as keyof typeof roleDashboardMap;

        // ── 4a. Explicit blocked routes per role ───────────────────────
        // ADMIN: blocked from settings, coin-trading, and all app-owner routes
        if (currentRole === 'ADMIN') {
            const adminBlocked = ['/admin/settings', '/admin/coin-trading', '/admin/profile'];
            const isBlocked =
                pathname.startsWith('/app-owner') ||
                adminBlocked.some(route => pathname.startsWith(route));
            if (isBlocked) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
        }

        // SUPER_ADMIN: blocked from coin trading / trading page
        if (currentRole === 'SUPER_ADMIN') {
            if (pathname.startsWith('/app-owner/trading')) {
                return NextResponse.redirect(new URL('/app-owner/dashboard', request.url));
            }
        }

        // Check if user is trying to access a dashboard route
        const dashboardRoutes = Object.values(roleDashboardMap);
        const requestedDashboard = dashboardRoutes.find(route => pathname.startsWith(route));

        if (requestedDashboard) {
            const allowedPath = roleDashboardMap[currentRole];
            if (allowedPath && !pathname.startsWith(allowedPath)) {
                // Role mismatch, redirect to their correct dashboard
                return NextResponse.redirect(new URL(`${allowedPath}/dashboard`, request.url));
            }
        }

        // 5. Redirect logged in users away from login
        if (pathname === '/login') {
            const allowedPath = roleDashboardMap[currentRole];
            if (allowedPath) {
                return NextResponse.redirect(new URL(`${allowedPath}/dashboard`, request.url));
            }
        }

        return NextResponse.next();
    } catch {
        // Malformed token, redirect to login
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
