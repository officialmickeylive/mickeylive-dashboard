import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode('super-secret-key-for-development');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        // Simple mock validation (any password works for demo)
        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        // Determine role based on email suffix or explicit naming
        let role = 'HOST'; // Default fallback
        if (email.includes('owner')) role = 'APP_OWNER';
        else if (email.includes('super')) role = 'SUPER_ADMIN';
        else if (email.includes('admin')) role = 'ADMIN';
        else if (email.includes('agency')) role = 'AGENCY';
        else if (email.includes('seller')) role = 'SELLER';
        else if (email.includes('host')) role = 'HOST';

        // Sign a mock JWT using jose
        const token = await new SignJWT({
            userId: 'usr_' + Date.now(),
            email,
            role
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(JWT_SECRET);

        // Map for realistic user data response
        const user = {
            id: 'usr_' + Math.random().toString(36).substring(7),
            name: role.replace('_', ' ') + ' User',
            email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            role
        };

        // Create response and set HTTP-only cookie
        const response = NextResponse.json({
            message: 'Login successful',
            user,
            token
        }, { status: 200 });

        response.cookies.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return response;

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
