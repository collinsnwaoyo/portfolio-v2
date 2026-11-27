import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createGzip } from 'node:zlib';
import { extname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const COMPRESSIBLE = new Set(['.html', '.js', '.mjs', '.css', '.json', '.svg', '.xml', '.txt']);

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..', 'out');
const BASE_PATH = '/portfolio-v2';
const PORT = Number(process.env.PORT) || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

function resolveFile(urlPath) {
  let p = urlPath.replace(/\?.*$/, '');
  if (!p.startsWith(BASE_PATH)) return null;
  p = p.slice(BASE_PATH.length) || '/';

  let filePath = join(ROOT, decodeURIComponent(p));

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html');
  } else if (!existsSync(filePath) && !extname(filePath)) {
    const withHtml = `${filePath}.html`;
    filePath = existsSync(withHtml) ? withHtml : join(filePath, 'index.html');
  }

  return existsSync(filePath) ? filePath : null;
}

export function createServer() {
  return http.createServer((req, res) => {
    let filePath = resolveFile(req.url || '/');
    let status = 200;

    // GitHub Pages serves the site's 404.html (with a real 404 status) for
    // any unmatched path; mirror that here instead of a bare text response.
    if (!filePath) {
      status = 404;
      const notFound = join(ROOT, '404.html');
      filePath = existsSync(notFound) ? notFound : null;
    }

    if (!filePath) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = extname(filePath);
    const type = MIME[ext] || 'application/octet-stream';
    const acceptsGzip = (req.headers['accept-encoding'] || '').includes('gzip');

    if (COMPRESSIBLE.has(ext) && acceptsGzip) {
      res.writeHead(status, { 'Content-Type': type, 'Content-Encoding': 'gzip' });
      createReadStream(filePath).pipe(createGzip()).pipe(res);
    } else {
      res.writeHead(status, { 'Content-Type': type });
      createReadStream(filePath).pipe(res);
    }
  });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!existsSync(ROOT)) {
    console.error(`Build output not found at ${ROOT}. Run "npm run build" first.`);
    process.exit(1);
  }
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`Preview running at http://localhost:${PORT}${BASE_PATH}/`);
  });
}
