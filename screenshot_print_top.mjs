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

  await page.emulateMediaType('print');
  await page.evaluate(() => {
    document.body.classList.add('printing-all');
  });

  // Wait a moment for images to load
  await new Promise(r => setTimeout(r, 500));

  // Screenshot just the top portion to verify logo
  await page.screenshot({ path: 'temporary screenshots/screenshot-193-print-top.png', clip: { x: 0, y: 0, width: 1400, height: 200 } });
  console.log('Saved top crop');
  await browser.close();
})();
