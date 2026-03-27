import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/PC/puppeteer-test/node_modules/puppeteer');

const pdfUrl = 'file:///C:/Claude/FinXtra%20NEW%20WEBSITE/Brand_Assets/FinXtra_Accountants_CPA_Partnership.pdf';
const outputDir = 'C:/Claude/FinXtra NEW WEBSITE/temporary screenshots';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: puppeteer.executablePath()
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1100 });

  await page.goto(pdfUrl, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));

  const TOTAL_PAGES = 7;
  // Page input is at x=582, y=22 based on toolbar analysis

  for (let p = 1; p <= TOTAL_PAGES; p++) {
    // Click on the page number input
    await page.mouse.click(582, 22);
    await new Promise(r => setTimeout(r, 400));

    // Select all and type the page number
    await page.keyboard.down('Control');
    await page.keyboard.press('a');
    await page.keyboard.up('Control');
    await new Promise(r => setTimeout(r, 200));

    await page.keyboard.type(String(p));
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 3000));

    // Check toolbar to confirm we're on the right page
    await page.screenshot({
      path: `${outputDir}/brand-cpa-p${p}.png`
    });
    console.log(`Page ${p} saved`);
  }

  await browser.close();
  console.log('All 7 pages done!');
})();
