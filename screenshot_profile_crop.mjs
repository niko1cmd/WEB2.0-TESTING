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
  await page.click('#tab-profile');
  await new Promise(r => setTimeout(r, 400));

  // Crop just the Core Settings area
  await page.screenshot({ path: 'temporary screenshots/screenshot-196-core-settings.png', clip: { x: 0, y: 120, width: 1400, height: 340 } });
  console.log('Saved core settings crop');
  await browser.close();
})();
