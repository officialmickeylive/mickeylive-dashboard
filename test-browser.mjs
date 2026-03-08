import puppeteer from 'puppeteer';
import path from 'path';

const BASE_URL = 'http://localhost:3002';

const ROLES_TO_TEST = [
    { email: 'owner@spark.live', name: 'App Owner' },
    { email: 'admin@spark.live', name: 'Admin' },
];

(async () => {
    console.log('Starting In-Browser Tests using Puppeteer...');
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    for (const role of ROLES_TO_TEST) {
        console.log(`\n--- Testing Role: ${role.name} (${role.email}) ---`);
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(60000);

        try {
            // 1. Navigate to login
            console.log(`Navigating to ${BASE_URL}/login...`);
            await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });

            // 2. Type credentials
            console.log('Entering credentials...');
            const emailInput = await page.$('input[type="email"]');
            await emailInput.type(role.email);

            const passwordInput = await page.$('input[type="password"]');
            await passwordInput.type('password');

            // 3. Click Login Button
            console.log('Clicking login button...');
            const button = await page.$('button[type="submit"]');
            await button.click();

            // 4. Wait for navigation to complete
            console.log('Waiting for dashboard navigation...');
            await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });

            // 5. Check URL and Page Title
            const targetUrl = page.url();
            const pageTitle = await page.title();
            console.log(`Current URL: ${targetUrl}`);

            // 6. Check for a dashboard element to ensure the page rendered properly and not an Error page
            const hasErrorText = await page.evaluate(() => {
                return document.body.innerText.includes('Application Error') || document.body.innerText.includes('Cannot read properties');
            });

            if (hasErrorText) {
                console.error(`❌ PAGE ERROR DETECTED ON ${targetUrl}`);
            } else {
                console.log(`✅ ${role.name} Dashboard successfully loaded in the real browser!`);
            }

            // Save Screenshot
            const fileName = `dashboard_${role.email.split('@')[0]}.png`;
            await page.screenshot({ path: fileName, fullPage: true });
            console.log(`Screenshot saved to: ${fileName}`);

        } catch (error) {
            console.error(`❌ Browser Test Failed for ${role.email}:`, error.message);
            // Take error screenshot
            await page.screenshot({ path: `error_${role.email.split('@')[0]}.png` });
        } finally {
            await page.close();
        }
    }

    await browser.close();
    console.log('\n--- Browser Testing Complete ---');
})();
