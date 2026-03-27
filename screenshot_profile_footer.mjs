import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/PC/puppeteer-test/node_modules/puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: 'C:/Users/PC/.cache/puppeteer/chrome/win64-146.0.7680.31/chrome-win64/chrome.exe' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  await page.goto('http://localhost:3000/fx-hedging-tool.html');
  await page.evaluate(() => {
    sessionStorage.setItem('fx_auth', JSON.stringify({ id: '723572', name: 'Duponmar Inc.', tradingName: '', lei: '549300CWEYQHBJOEPU88' }));
  });
  await page.goto('http://localhost:3000/fx-hedging-tool.html');
  await page.waitForSelector('#panel-dashboard');

  // Navigate to Client Profile tab
  await page.click('#tab-profile');
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: 'temporary screenshots/screenshot-194-profile-email.png', fullPage: false });
  console.log('Saved profile screenshot');

  // Scroll to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: 'temporary screenshots/screenshot-195-footer-tollfree.png', fullPage: false });
  console.log('Saved footer screenshot');

  await browser.close();
})();
