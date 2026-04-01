/**
 * Local H5 static server + API reverse proxy for testing.
 *
 * - Serves project files as static assets (so you can open the html via http://localhost:9000/...).
 * - Proxies /api/* to https://www.ok9288.com/api/* to avoid browser CORS blocks.
 *
 * Usage:
 *   node h5-proxy.js
 *   open http://localhost:9000/pagesC/waimaibinding/waimaibinding.html
 */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = Number(process.env.PORT || 9000);
const ROOT = path.resolve(__dirname);
const UPSTREAM = new URL('https://www.ok9288.com');

function setCors(res) {
  // same-origin is enough, but allow * for convenience during local testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type,token,X-Client-Hash,Authorization,X-Requested-With'
  );
  res.setHeader('Access-Control-Max-Age', '86400');
}

function send(res, code, body, headers = {}) {
  res.writeHead(code, { ...headers });
  res.end(body);
}

function contentTypeByExt(ext) {
  switch (ext.toLowerCase()) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.js':
      return 'application/javascript; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.svg':
      return 'image/svg+xml';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    case '.ico':
      return 'image/x-icon';
    case '.mp4':
      return 'video/mp4';
    default:
      return 'application/octet-stream';
  }
}

function safeResolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const rel = decoded.replace(/^\/+/, '');
  const abs = path.resolve(ROOT, rel);
  if (!abs.startsWith(ROOT)) return null;
  return abs;
}

function handleStatic(req, res) {
  const filePath = safeResolveFile(req.url || '/');
  if (!filePath) return send(res, 403, 'Forbidden');

  let stat;
  try {
    stat = fs.statSync(filePath);
  } catch (e) {
    return send(res, 404, 'Not Found');
  }

  let finalPath = filePath;
  if (stat.isDirectory()) {
    finalPath = path.join(filePath, 'index.html');
    try {
      stat = fs.statSync(finalPath);
    } catch (e) {
      return send(res, 404, 'Not Found');
    }
  }

  const ext = path.extname(finalPath);
  const ct = contentTypeByExt(ext);

  // Support simple range for media
  const range = req.headers.range;
  if (range && (ext === '.mp4' || ext === '.webm')) {
    const size = stat.size;
    const match = /bytes=(\d+)-(\d*)/.exec(range);
    if (!match) return send(res, 416, 'Range Not Satisfiable');
    const start = Number(match[1]);
    const end = match[2] ? Number(match[2]) : size - 1;
    if (start >= size || end >= size) return send(res, 416, 'Range Not Satisfiable');
    res.writeHead(206, {
      'Content-Type': ct,
      'Content-Length': end - start + 1,
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
    });
    fs.createReadStream(finalPath, { start, end }).pipe(res);
    return;
  }

  res.writeHead(200, { 'Content-Type': ct, 'Content-Length': stat.size });
  fs.createReadStream(finalPath).pipe(res);
}

function handleApiProxy(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const target = new URL(req.url, UPSTREAM);

  const headers = { ...req.headers };
  // Ensure host is upstream, keep token & X-Client-Hash forwarded
  headers.host = UPSTREAM.host;

  const options = {
    protocol: target.protocol,
    hostname: target.hostname,
    port: target.port || 443,
    path: target.pathname + target.search,
    method: req.method,
    headers,
  };

  const proxyReq = https.request(options, (proxyRes) => {
    const outHeaders = { ...proxyRes.headers };
    // Override CORS back to browser
    setCors(res);
    // Some upstream headers may conflict
    delete outHeaders['content-security-policy'];
    delete outHeaders['content-security-policy-report-only'];
    delete outHeaders['x-frame-options'];
    res.writeHead(proxyRes.statusCode || 502, { ...outHeaders });
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    send(res, 502, `Bad Gateway: ${err.message}`);
  });

  req.pipe(proxyReq);
}

const server = http.createServer((req, res) => {
  const url = req.url || '/';
  if (url.startsWith('/api/')) return handleApiProxy(req, res);
  return handleStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`[h5-proxy] listening on http://localhost:${PORT}`);
  console.log(`[h5-proxy] static root: ${ROOT}`);
  console.log(`[h5-proxy] proxy: /api/* -> ${UPSTREAM.origin}/api/*`);
});

