import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import serveHandler from 'serve-handler';
import puppeteer from 'puppeteer';

const DIST_DIR = 'dist/apps/tailng-ui/playground-tailwind/browser';
const ROUTES_FILE = 'apps/tailng-ui/playground-tailwind/prerender-routes.txt';
const PORT = 4174; // different from docs to avoid clashes locally
const HOST = '127.0.0.1';
const NAVIGATION_TIMEOUT_MS = Number(process.env.PUPPETEER_PRERENDER_NAV_TIMEOUT_MS ?? 120000);
const LAUNCH_TIMEOUT_MS = Number(process.env.PUPPETEER_PRERENDER_LAUNCH_TIMEOUT_MS ?? 120000);
const POST_GOTO_WAIT_MS = Number(process.env.PUPPETEER_PRERENDER_POST_GOTO_WAIT_MS ?? 1500);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const resolveChromeExecutablePath = () => {
  const explicitPath = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (explicitPath && fs.existsSync(explicitPath)) {
    return explicitPath;
  }

  const cacheDir = process.env.PUPPETEER_CACHE_DIR ?? path.join(os.homedir(), '.cache', 'puppeteer');
  const sortEntriesByVersion = (entries) =>
    [...entries].sort((a, b) => {
      const versionOf = (name) => {
        const match = name.match(/(\d+)\.(\d+)\.(\d+)\.(\d+)/);
        if (!match) return [0, 0, 0, 0];
        return match.slice(1).map((value) => Number.parseInt(value, 10));
      };
      const av = versionOf(a.name);
      const bv = versionOf(b.name);
      for (let index = 0; index < 4; index += 1) {
        if (av[index] !== bv[index]) {
          return bv[index] - av[index];
        }
      }
      return b.name.localeCompare(a.name);
    });

  const chromeRoot = path.join(cacheDir, 'chrome');
  if (fs.existsSync(chromeRoot)) {
    const entries = sortEntriesByVersion(
      fs.readdirSync(chromeRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()),
    );
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const versionDir = path.join(chromeRoot, entry.name);
      const candidate = path.join(
        versionDir,
        'chrome-mac-arm64',
        'Google Chrome for Testing.app',
        'Contents',
        'MacOS',
        'Google Chrome for Testing',
      );
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
  }

  const shellRoot = path.join(cacheDir, 'chrome-headless-shell');
  if (fs.existsSync(shellRoot)) {
    const entries = sortEntriesByVersion(
      fs.readdirSync(shellRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()),
    );
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const versionDir = path.join(shellRoot, entry.name);
      const candidate = path.join(versionDir, 'chrome-headless-shell-mac-arm64', 'chrome-headless-shell');
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
  }

  return null;
};

const indexHtmlPath = path.join(DIST_DIR, 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
  throw new Error(
    `index.html not found at ${indexHtmlPath}. Run "pnpm run playground:build" first.`,
  );
}
const indexHtml = fs.readFileSync(indexHtmlPath);

const routes = fs
  .readFileSync(ROUTES_FILE, 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'))
  .map((r) => (r.startsWith('/') ? r : `/${r}`));

const isAssetRequest = (url) =>
  url === '/favicon.ico' ||
  url.startsWith('/assets/') ||
  url.endsWith('.js') ||
  url.endsWith('.css') ||
  url.endsWith('.map') ||
  url.endsWith('.png') ||
  url.endsWith('.jpg') ||
  url.endsWith('.jpeg') ||
  url.endsWith('.svg') ||
  url.endsWith('.webp') ||
  url.endsWith('.woff') ||
  url.endsWith('.woff2') ||
  url.endsWith('.ttf') ||
  url.endsWith('.json') ||
  url.endsWith('.txt') ||
  url.endsWith('.xml');

const server = http.createServer((req, res) => {
  const url = req.url ?? '/';

  // Serve built assets from dist
  if (isAssetRequest(url)) {
    return serveHandler(req, res, { public: DIST_DIR });
  }

  // SPA fallback: always serve index.html for routes
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(indexHtml);
});

await new Promise((resolve) => server.listen(PORT, HOST, resolve));

const chromeExecutablePath = resolveChromeExecutablePath() ?? undefined;
console.log(`prerender: browser executable = ${chromeExecutablePath ?? 'puppeteer-managed default'}`);

const browser = await puppeteer.launch({
  headless: 'new',
  timeout: LAUNCH_TIMEOUT_MS,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  executablePath: chromeExecutablePath,
});
const page = await browser.newPage();
page.setDefaultNavigationTimeout(NAVIGATION_TIMEOUT_MS);
page.setDefaultTimeout(NAVIGATION_TIMEOUT_MS);

for (const route of routes) {
  const url = `http://${HOST}:${PORT}${route}`;
  console.log(`prerendering ${route}`);
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: NAVIGATION_TIMEOUT_MS });
  } catch (err) {
    console.warn(`goto failed for ${route} (${err?.message ?? String(err)}). Retrying...`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAVIGATION_TIMEOUT_MS });
  }
  await sleep(POST_GOTO_WAIT_MS);

  const html = await page.content();

  const dir = path.join(DIST_DIR, route === '/' ? '' : route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);

  console.log(`prerendered ${route}`);
}

await browser.close();
server.close();

console.log('prerender complete');
