import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

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
    const filePath = resolveFile(req.url || '/');
    if (!filePath) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    const type = MIME[extname(filePath)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    createReadStream(filePath).pipe(res);
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
