import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3002';

const ROLES = [
    { email: 'owner@spark.live', prefix: '/app-owner', key: 'APP_OWNER' },
    { email: 'super@spark.live', prefix: '/super-admin', key: 'SUPER_ADMIN' },
    { email: 'admin@spark.live', prefix: '/admin', key: 'ADMIN' },
    { email: 'agency@spark.live', prefix: '/agency', key: 'AGENCY' },
    { email: 'host@spark.live', prefix: '/host', key: 'HOST' },
    { email: 'seller@spark.live', prefix: '/seller', key: 'SELLER' },
];

const PAGES = {
    'APP_OWNER': ['/admins', '/agencies', '/analytics', '/banners', '/dashboard', '/gifts', '/hosts', '/leaderboards', '/ledger', '/notifications', '/packages', '/pk-battles', '/profile', '/reports', '/rooms', '/settings', '/store', '/support', '/trading', '/users'],
    'SUPER_ADMIN': ['/agencies-hosts', '/analytics', '/dashboard', '/operations', '/products', '/profile', '/settings', '/users'],
    'ADMIN': ['/coin-trading', '/dashboard', '/host-applications', '/profile', '/reports', '/sellers', '/settings'],
    'AGENCY': ['/dashboard', '/earnings', '/hosts', '/profile', '/settings'],
    'HOST': ['/dashboard', '/gifts', '/pk-battles', '/profile', '/rooms', '/settings', '/wallet'],
    'SELLER': ['/coin-trading', '/dashboard', '/inventory', '/profile', '/settings']
};

async function testRoles() {
    console.log('Starting Route Integration Tests...');
    let totalErrors = 0;

    for (const role of ROLES) {
        console.log(`\n--- Testing ${role.key} (Email: ${role.email}) ---`);

        // 1. Login
        const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: role.email, password: 'password' })
        });

        if (!loginRes.ok) {
            const errText = await loginRes.text();
            console.error(`❌ Failed to login as ${role.email} (Status: ${loginRes.status}) - ${errText}`);
            totalErrors++;
            continue;
        }

        const cookies = loginRes.headers.raw()['set-cookie'];
        const authCookie = cookies ? cookies.map(c => c.split(';')[0]).join('; ') : '';

        // 2. Test pages
        const pages = PAGES[role.key];
        for (const page of pages) {
            const url = `${BASE_URL}${role.prefix}${page}`;
            try {
                const res = await fetch(url, {
                    headers: { 'Cookie': authCookie }
                });
                if (res.ok) {
                    console.log(`✅ [200 OK] ${url}`);
                } else if (res.status === 500) {
                    console.error(`❌ [500 ERROR] ${url} - Page crashed!`);
                    totalErrors++;
                } else {
                    console.warn(`⚠️ [${res.status}] ${url}`);
                }
            } catch (err) {
                console.error(`❌ [NETWORK ERROR] ${url}: ${err.message}`);
                totalErrors++;
            }
        }
    }

    console.log(`\n--- Test Summary ---`);
    if (totalErrors === 0) {
        console.log(`✅ All Next.js pages rendered successfully with NO server crashes (500s).`);
    } else {
        console.error(`❌ Found ${totalErrors} errors during rendering.`);
    }
}

testRoles().catch(console.error);
