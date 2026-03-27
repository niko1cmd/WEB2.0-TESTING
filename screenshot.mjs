import { createRequire } from 'module';
import { readdirSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const puppeteer = require('C:/Users/Niko/puppeteer-test/node_modules/puppeteer');

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? `-${process.argv[3]}` : '';

const screenshotDir = join(__dirname, 'temporary screenshots');
mkdirSync(screenshotDir, { recursive: true });

const existing = readdirSync(screenshotDir).filter(f => /^screenshot-\d+.*\.png$/.test(f));
const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)[1])).filter(n => !isNaN(n));
const nextNum = nums.length > 0 ? Math.max(...nums) + 1 : 1;

const filename = `screenshot-${nextNum}${label}.png`;
const filepath = join(screenshotDir, filename);

const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

// Scroll through page to trigger intersection observers, then return to top
const pageHeight = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y <= pageHeight; y += 500) {
  await page.evaluate(pos => window.scrollTo(0, pos), y);
  await new Promise(r => setTimeout(r, 80));
}
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 600));

await page.screenshot({ path: filepath, fullPage: true });
await browser.close();

console.log(`Saved: temporary screenshots/${filename}`);
