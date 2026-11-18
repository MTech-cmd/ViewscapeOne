import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_ROOT = path.resolve(fileURLToPath(new URL('./app/', import.meta.url)));
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.svg': 'image/svg+xml',
  '.md': 'text/markdown; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

const server = http.createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end('Method not allowed');
    return;
  }

  try {
    const requestUrl = new URL(req.url ?? '/', 'http://localhost');
    const decodedPath = decodeURIComponent(requestUrl.pathname);
    const appMarker = decodedPath.indexOf('/app/');
    const appPath = appMarker >= 0 ? decodedPath.slice(appMarker + 4) : decodedPath;
    const relativePath = appPath === '/' ? '/index.html' : appPath;
    let target = path.resolve(APP_ROOT, `.${relativePath}`);
    if (target !== APP_ROOT && !target.startsWith(`${APP_ROOT}${path.sep}`)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    try { if ((await fs.stat(target)).isDirectory()) target = path.join(target, 'index.html'); } catch {}
    const body = await fs.readFile(target);
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[path.extname(target).toLowerCase()] ?? 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache'
    });
    if (req.method === 'HEAD') res.end();
    else res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
});

const port = Number(process.env.PORT ?? 8000);
server.listen(port, '127.0.0.1', () => {
  console.log(`Coverage Labs learner app: http://localhost:${port}`);
  console.log(`Serving only: ${APP_ROOT}`);
});
