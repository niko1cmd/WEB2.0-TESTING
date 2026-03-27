import { createServer } from 'http';
import { readFile, writeFile } from 'fs/promises';
import { extname, join, resolve, normalize } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const nodemailer = require('nodemailer');
const puppeteer = require('C:/Users/Niko/puppeteer-test/node_modules/puppeteer');

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = 3000;
const ACCOUNTS_FILE  = join(__dirname, 'accounts.json');
const SETTINGS_FILE  = join(__dirname, 'settings.json');

// ── FALLBACK CONFIG ────────────────────────────────────────────────────────────
// Admin password is now read from settings.json at request time.
// This fallback is only used if settings.json is missing entirely.
const DEFAULT_PIN     = '8155';           // Fallback if account has no pin

// Files that must never be served directly to the browser
const BLOCKED_FILES = new Set(['accounts.json', 'settings.json']);

// ── BRUTE-FORCE RATE LIMITER ───────────────────────────────────────────────────
// Tracks failed attempts per IP. After 10 failures in 15 min → lockout for 15 min.
const RATE_LIMIT = new Map(); // ip → { count, lockedUntil }
const MAX_ATTEMPTS = 10;
const WINDOW_MS    = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS   = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip) {
  const now = Date.now();
  let entry = RATE_LIMIT.get(ip);
  if (!entry) { entry = { count: 0, lockedUntil: 0 }; RATE_LIMIT.set(ip, entry); }
  if (entry.lockedUntil > now) return false; // still locked
  if (now - entry.windowStart > WINDOW_MS) { entry.count = 0; entry.windowStart = now; }
  return true; // allowed
}

function recordFailure(ip) {
  const now = Date.now();
  let entry = RATE_LIMIT.get(ip);
  if (!entry) { entry = { count: 0, windowStart: now, lockedUntil: 0 }; RATE_LIMIT.set(ip, entry); }
  if (now - (entry.windowStart || 0) > WINDOW_MS) { entry.count = 0; entry.windowStart = now; }
  entry.count++;
  if (entry.count >= MAX_ATTEMPTS) entry.lockedUntil = now + LOCKOUT_MS;
}

function recordSuccess(ip) {
  RATE_LIMIT.delete(ip); // reset on successful login
}

// ── MIME TYPES ────────────────────────────────────────────────────────────────
const mime = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
  '.pdf': 'application/pdf', '.json': 'application/json',
};

// ── HELPERS ───────────────────────────────────────────────────────────────────
async function loadAccounts() {
  try {
    const data = await readFile(ACCOUNTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { accounts: [] };
  }
}

async function saveAccounts(db) {
  await writeFile(ACCOUNTS_FILE, JSON.stringify(db, null, 2));
}

async function loadSettings() {
  try {
    const data = await readFile(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { defaultPin: DEFAULT_PIN };
  }
}

async function saveSettings(s) {
  await writeFile(SETTINGS_FILE, JSON.stringify(s, null, 2));
}

const MAX_BODY_BYTES = 5 * 1024 * 1024; // 5 MB limit

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) { req.destroy(); return resolve({}); }
      body += chunk;
    });
    req.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve({}); } });
    req.on('error', () => resolve({}));
  });
}

// Fix 5: CORS restricted to same-origin (localhost only)
function json(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': `http://localhost:${PORT}`,
  });
  res.end(JSON.stringify(data));
}

async function isAdmin(req) {
  const settings = await loadSettings();
  const adminPassword = settings.adminPassword || '';
  // Guard: never grant access if no password is configured
  if (!adminPassword) return false;
  return req.headers['x-admin-password'] === adminPassword;
}

function clientIP(req) {
  return (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
}

// ── SERVER ────────────────────────────────────────────────────────────────────
createServer(async (req, res) => {
  const url = req.url.split('?')[0];

  // Fix 5: CORS preflight — same-origin only
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': `http://localhost:${PORT}`,
      'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS'
    });
    return res.end();
  }

  // ── POST /api/auth — client login ──────────────────────────────────────────
  if (url === '/api/auth' && req.method === 'POST') {
    const ip = clientIP(req);
    // Fix 2: rate limiting
    if (!checkRateLimit(ip)) {
      return json(res, 429, { success: false, error: 'Too many failed attempts. Please try again in 15 minutes.' });
    }
    const { accountNumber, pin } = await parseBody(req);
    const db = await loadAccounts();
    const account = db.accounts.find(
      a => a.id === String(accountNumber).trim()
    );
    if (!account) {
      recordFailure(ip);
      return json(res, 401, { success: false, error: 'Invalid account number or PIN.' });
    }
    const settings = await loadSettings();
    const expectedPin = account.pin || settings.defaultPin || DEFAULT_PIN;
    if (String(pin).trim() !== expectedPin) {
      recordFailure(ip);
      return json(res, 401, { success: false, error: 'Invalid account number or PIN.' });
    }
    recordSuccess(ip);
    return json(res, 200, {
      success: true,
      name: account.name,
      tradingName: account.tradingName || '',
      lei: account.lei || '',
      id: account.id
    });
  }

  // ── GET /api/accounts — admin: list accounts ───────────────────────────────
  if (url === '/api/accounts' && req.method === 'GET') {
    const ip = clientIP(req);
    if (!checkRateLimit(ip)) return json(res, 429, { error: 'Too many requests.' });
    if (!await isAdmin(req)) { recordFailure(ip); return json(res, 403, { error: 'Unauthorized' }); }
    recordSuccess(ip);
    const db = await loadAccounts();
    return json(res, 200, db.accounts);
  }

  // ── POST /api/accounts — admin: add account ────────────────────────────────
  if (url === '/api/accounts' && req.method === 'POST') {
    const ip = clientIP(req);
    if (!checkRateLimit(ip)) return json(res, 429, { error: 'Too many requests.' });
    if (!await isAdmin(req)) { recordFailure(ip); return json(res, 403, { error: 'Unauthorized' }); }
    recordSuccess(ip);
    const { id, name, tradingName, lei, pin } = await parseBody(req);
    if (!id || !name) return json(res, 400, { error: 'Account number and client name are required.' });
    const db = await loadAccounts();
    const settings = await loadSettings();
    const normalized = String(id).trim();
    if (db.accounts.find(a => a.id === normalized))
      return json(res, 409, { error: `Account ${normalized} already exists.` });
    db.accounts.push({
      id: normalized,
      name: String(name).trim(),
      tradingName: String(tradingName || '').trim(),
      lei: String(lei || '').trim(),
      pin: String(pin || settings.defaultPin || DEFAULT_PIN).trim(),
      createdAt: new Date().toISOString().split('T')[0]
    });
    await saveAccounts(db);
    return json(res, 200, { success: true, id: normalized });
  }

  // ── PATCH /api/accounts/:id — admin: update account fields ─────────────────
  if (url.startsWith('/api/accounts/') && req.method === 'PATCH') {
    const ip = clientIP(req);
    if (!checkRateLimit(ip)) return json(res, 429, { error: 'Too many requests.' });
    if (!await isAdmin(req)) { recordFailure(ip); return json(res, 403, { error: 'Unauthorized' }); }
    recordSuccess(ip);
    const id = decodeURIComponent(url.replace('/api/accounts/', '')).trim();
    const db = await loadAccounts();
    const idx = db.accounts.findIndex(a => a.id === id);
    if (idx === -1) return json(res, 404, { error: 'Account not found.' });
    const body = await parseBody(req);
    // Only allow updating specific fields
    const allowed = ['name', 'tradingName', 'lei', 'pin'];
    for (const key of allowed) {
      if (body[key] !== undefined) db.accounts[idx][key] = String(body[key]).trim();
    }
    await saveAccounts(db);
    return json(res, 200, { success: true, account: db.accounts[idx] });
  }

  // ── DELETE /api/accounts/:id — admin: remove account ──────────────────────
  if (url.startsWith('/api/accounts/') && req.method === 'DELETE') {
    const ip = clientIP(req);
    if (!checkRateLimit(ip)) return json(res, 429, { error: 'Too many requests.' });
    if (!await isAdmin(req)) { recordFailure(ip); return json(res, 403, { error: 'Unauthorized' }); }
    recordSuccess(ip);
    const id = decodeURIComponent(url.replace('/api/accounts/', '')).trim();
    const db = await loadAccounts();
    const before = db.accounts.length;
    db.accounts = db.accounts.filter(a => a.id !== id);
    if (db.accounts.length === before) return json(res, 404, { error: 'Account not found.' });
    await saveAccounts(db);
    return json(res, 200, { success: true });
  }

  // ── GET /api/settings — admin: get settings ───────────────────────────────
  if (url === '/api/settings' && req.method === 'GET') {
    const ip = clientIP(req);
    if (!checkRateLimit(ip)) return json(res, 429, { error: 'Too many requests.' });
    if (!await isAdmin(req)) { recordFailure(ip); return json(res, 403, { error: 'Unauthorized' }); }
    recordSuccess(ip);
    const settings = await loadSettings();
    // Never expose the admin password or SMTP credentials over the API
    const { adminPassword: _ap, smtp: _smtp, ...safe } = settings;
    return json(res, 200, safe);
  }

  // ── PUT /api/settings — admin: update settings ────────────────────────────
  if (url === '/api/settings' && req.method === 'PUT') {
    const ip = clientIP(req);
    if (!checkRateLimit(ip)) return json(res, 429, { error: 'Too many requests.' });
    if (!await isAdmin(req)) { recordFailure(ip); return json(res, 403, { error: 'Unauthorized' }); }
    recordSuccess(ip);
    const body = await parseBody(req);
    const settings = await loadSettings();
    if (body.defaultPin !== undefined) {
      if (!/^\d{4,8}$/.test(String(body.defaultPin))) {
        return json(res, 400, { error: 'PIN must be 4–8 digits.' });
      }
      settings.defaultPin = String(body.defaultPin).trim();
    }
    await saveSettings(settings);
    const { adminPassword: _ap, smtp: _smtp, ...safe } = settings;
    return json(res, 200, { success: true, settings: safe });
  }

  // ── POST /api/generate-and-email-pdf — render HTML to PDF via Puppeteer, email as attachment ──
  if (url === '/api/generate-and-email-pdf' && req.method === 'POST') {
    const ip = clientIP(req);
    if (!checkRateLimit(ip)) return json(res, 429, { error: 'Too many requests.' });
    const { to, clientName, reportHtml, accountId } = await parseBody(req);
    if (!to) return json(res, 400, { error: 'Recipient email is required.' });
    if (!reportHtml) return json(res, 400, { error: 'Report HTML is required.' });
    // Validate caller is a known account (prevents unauthenticated email relay)
    if (!accountId) return json(res, 401, { error: 'Account ID is required.' });
    const db = await loadAccounts();
    if (!db.accounts.find(a => a.id === String(accountId).trim())) {
      recordFailure(ip);
      return json(res, 403, { error: 'Unauthorized.' });
    }

    const settings = await loadSettings();
    const smtp = settings.smtp || {};
    if (!smtp.user || !smtp.pass) {
      return json(res, 503, { error: 'SMTP not configured. Please update settings.json with your email credentials.' });
    }

    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        executablePath: 'C:/Users/Niko/.cache/puppeteer/chrome/win64-146.0.7680.153/chrome-win64/chrome.exe',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      await page.setContent(reportHtml, { waitUntil: 'networkidle0', timeout: 30000 });
      const pdfBuffer = await page.pdf({
        format: 'Letter',
        landscape: true,
        printBackground: true,
        margin: { top: '16mm', bottom: '16mm', left: '14mm', right: '14mm' },
        scale: 0.7
      });
      await browser.close();
      browser = null;

      const transporter = nodemailer.createTransport({
        host: smtp.host || 'smtp.gmail.com',
        port: smtp.port || 587,
        secure: smtp.secure || false,
        auth: { user: smtp.user, pass: smtp.pass }
      });

      const safeName = (clientName || 'Client').replace(/[^a-zA-Z0-9_-]/g, '_');
      await transporter.sendMail({
        from: smtp.from || `FX Hedge Tool <${smtp.user}>`,
        to,
        subject: `FX Hedge Audit Report — ${clientName || 'Client'}`,
        html: `<p style="font-family:Arial,sans-serif;font-size:14px;">Please find attached the FX Hedge Audit Report for <strong>${clientName || 'your account'}</strong>.</p><p style="font-family:Arial,sans-serif;font-size:12px;color:#666;">This report was generated by the FinXtra FX Hedging Tool.</p>`,
        attachments: [{
          filename: `FX-Hedge-Report-${safeName}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }]
      });

      return json(res, 200, { success: true });
    } catch (err) {
      if (browser) { try { await browser.close(); } catch (_) {} }
      return json(res, 500, { error: `Failed to generate/send report: ${err.message}` });
    }
  }

  // ── POST /api/send-report — send HTML report by email ─────────────────────
  if (url === '/api/send-report' && req.method === 'POST') {
    const ip = clientIP(req);
    if (!checkRateLimit(ip)) return json(res, 429, { error: 'Too many requests.' });
    const { to, subject, reportHtml, clientName, accountId } = await parseBody(req);
    if (!to) return json(res, 400, { error: 'Recipient email is required.' });
    if (!accountId) return json(res, 401, { error: 'Account ID is required.' });
    const dbCheck = await loadAccounts();
    if (!dbCheck.accounts.find(a => a.id === String(accountId).trim())) {
      recordFailure(ip);
      return json(res, 403, { error: 'Unauthorized.' });
    }

    const settings = await loadSettings();
    const smtp = settings.smtp || {};
    if (!smtp.user || !smtp.pass) {
      return json(res, 503, { error: 'SMTP not configured. Please update settings.json with your email credentials.' });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: smtp.host || 'smtp.gmail.com',
        port: smtp.port || 587,
        secure: smtp.secure || false,
        auth: { user: smtp.user, pass: smtp.pass }
      });

      await transporter.sendMail({
        from: smtp.from || `FX Hedge Tool <${smtp.user}>`,
        to,
        subject: subject || `FX Hedge Audit Report — ${clientName || 'Client'}`,
        html: reportHtml
      });

      return json(res, 200, { success: true });
    } catch (err) {
      return json(res, 500, { error: `Failed to send email: ${err.message}` });
    }
  }

  // ── Static file serving — path traversal guard + block sensitive files ─────
  let urlPath = decodeURIComponent(url);
  if (urlPath === '/') urlPath = '/index.html';

  // Block direct access to data/config files
  const basename = urlPath.split('/').pop().toLowerCase();
  if (BLOCKED_FILES.has(basename)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  // Fix 3: Path traversal guard — resolve and verify path stays inside project root
  const projectRoot = resolve(__dirname);
  const filePath = resolve(join(__dirname, normalize(urlPath)));
  if (!filePath.startsWith(projectRoot + (process.platform === 'win32' ? '\\' : '/'))) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  try {
    const data = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    const headers = {
      'Content-Type': mime[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    };
    // Security headers for HTML pages
    if (ext === '.html') {
      headers['X-Frame-Options'] = 'DENY';
      headers['X-Content-Type-Options'] = 'nosniff';
      headers['Referrer-Policy'] = 'same-origin';
      headers['Content-Security-Policy'] =
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https://placehold.co;";
    }
    res.writeHead(200, headers);
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }

// Fix 1: Bind to 127.0.0.1 only — blocks access from other machines on the LAN
}).listen(PORT, '127.0.0.1', () => {
  console.log(`\n  FinXtra Server  →  http://localhost:${PORT}`);
  console.log(`  Admin Panel     →  http://localhost:${PORT}/admin.html`);
  console.log(`  Admin Password  →  [stored in settings.json]\n`);
});
