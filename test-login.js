const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log("Launching browser...");
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: 'new'
        });
        const page = await browser.newPage();

        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
        page.on('response', response => {
            if (response.url().includes('/api/auth/login')) {
                console.log('API RESPONSE:', response.status(), response.url());
            }
        });

        console.log("Navigating to login...");
        await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });

        console.log("Typing credentials...");
        await page.type('input[type="email"]', 'owner@spark.live');
        await page.type('input[type="password"]', '123456');

        console.log("Clicking submit...");

        await Promise.all([
            page.waitForNavigation({ timeout: 5000 }).catch(e => console.log("Timeout waiting for nav:", e.message)),
            page.click('button[type="submit"]')
        ]);

        console.log('Final URL:', page.url());
        await new Promise(r => setTimeout(r, 1000)); // wait for any extra logs
        await browser.close();
    } catch (err) {
        console.error("Test error:", err);
    }
})();
