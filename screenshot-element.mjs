import { createRequire } from 'module';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const puppeteer = require('C:/Users/PC/puppeteer-test/node_modules/puppeteer');

const url = process.argv[2] || 'http://localhost:3000';
const selector = process.argv[3] || 'body';
const outFile = process.argv[4] || 'element-shot.png';

const screenshotDir = join(__dirname, 'temporary screenshots');
mkdirSync(screenshotDir, { recursive: true });

const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

await page.evaluate(sel => {
  const el = document.querySelector(sel);
  if (el) el.scrollIntoView({ block: 'center' });
}, selector);
await new Promise(r => setTimeout(r, 500));

const el = await page.$(selector);
const filepath = join(screenshotDir, outFile);
await el.screenshot({ path: filepath });
await browser.close();

console.log(`Saved: temporary screenshots/${outFile}`);
