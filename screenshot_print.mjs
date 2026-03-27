import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/PC/puppeteer-test/node_modules/puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: 'C:/Users/PC/.cache/puppeteer/chrome/win64-146.0.7680.31/chrome-win64/chrome.exe' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  // Set auth in sessionStorage via about:blank trick
  await page.goto('http://localhost:3000/fx-hedging-tool.html');
  await page.evaluate(() => {
    sessionStorage.setItem('fx_auth', JSON.stringify({ id: '723572', name: 'Duponmar Inc.', tradingName: '', lei: '549300CWEYQHBJOEPU88' }));
  });
  await page.goto('http://localhost:3000/fx-hedging-tool.html');
  await page.waitForSelector('#panel-dashboard');

  // Emulate print media so print-logo-header becomes visible
  await page.emulateMediaType('print');

  // Add printing-all class to body so all panels show
  await page.evaluate(() => {
    document.body.classList.add('printing-all');
  });

  await page.screenshot({ path: 'temporary screenshots/screenshot-192-print-preview2.png', fullPage: true });
  console.log('Saved: temporary screenshots/screenshot-192-print-preview2.png');
  await browser.close();
})();
