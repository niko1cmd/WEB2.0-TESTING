/**
 * capture.mjs — starts a local server, screenshots the site, then exits.
 * Run with: node capture.mjs
 */
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join, dirname } from 'path';
import { readdirSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require   = createRequire(import.meta.url);

const PUPPETEER_PATH = 'C:/Users/nateh/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer';
const PORT = 3001; // use 3001 so it doesn't clash with an existing server on 3000

const mime = {
  '.html':'text/html','.css':'text/css','.js':'application/javascript',
  '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg',
  '.gif':'image/gif','.svg':'image/svg+xml','.woff2':'font/woff2',
  '.woff':'font/woff','.ttf':'font/ttf','.ico':'image/x-icon',
};

// ── 1. Start server ──────────────────────────────────────────────────────────
const server = createServer(async (req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  try {
    const data = await readFile(join(__dirname, urlPath));
    const ext  = extname(urlPath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404); res.end('Not found');
  }
});

await new Promise(resolve => server.listen(PORT, resolve));
console.log(`Server ready on http://localhost:${PORT}`);

// ── 2. Screenshot ────────────────────────────────────────────────────────────
let puppeteer;
try {
  puppeteer = require(PUPPETEER_PATH);
} catch (e) {
  console.error('Could not load Puppeteer from', PUPPETEER_PATH);
  console.error(e.message);
  server.close();
  process.exit(1);
}

const screenshotDir = join(__dirname, 'temporary screenshots');
mkdirSync(screenshotDir, { recursive: true });

function nextFilename(label = '') {
  const existing = readdirSync(screenshotDir).filter(f => /^screenshot-\d+.*\.png$/.test(f));
  const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)[1])).filter(n => !isNaN(n));
  const n = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `screenshot-${n}${label ? '-' + label : ''}.png`;
}

const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page    = await browser.newPage();

// Desktop screenshot
await page.setViewport({ width: 1440, height: 900 });
await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 800)); // let animations settle

const desktopFile = nextFilename('desktop');
await page.screenshot({ path: join(screenshotDir, desktopFile), fullPage: true });
console.log(`Saved: temporary screenshots/${desktopFile}`);

// Mobile screenshot
await page.setViewport({ width: 390, height: 844 });
await page.reload({ waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 600));

const mobileFile = nextFilename('mobile');
await page.screenshot({ path: join(screenshotDir, mobileFile), fullPage: true });
console.log(`Saved: temporary screenshots/${mobileFile}`);

await browser.close();
server.close();
console.log('Done.');
