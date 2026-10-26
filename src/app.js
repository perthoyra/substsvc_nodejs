import http from 'node:http';
import { encode, decode } from './cipher.js';

const MAX_BODY_BYTES = 1024 * 1024;

const routes = {
  '/encode': encode,
  '/decode': decode,
};

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('Request body too large'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch {
        reject(Object.assign(new Error('Invalid JSON body'), { status: 400 }));
      }
    });
    req.on('error', reject);
  });
}

export function createApp() {
  return http.createServer(async (req, res) => {
    const { pathname } = new URL(req.url, 'http://localhost');
    const handler = routes[pathname];

    if (!handler) return sendJson(res, 404, { error: 'Not found' });
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return sendJson(res, 405, { error: 'Method not allowed' });
    }

    try {
      const { text, key } = await readJson(req);
      if (typeof text !== 'string') {
        return sendJson(res, 400, { error: '"text" must be a string' });
      }
      if (key !== undefined && typeof key !== 'string') {
        return sendJson(res, 400, { error: '"key" must be a string' });
      }
      sendJson(res, 200, { result: handler(text, key) });
    } catch (err) {
      sendJson(res, err.status ?? 400, { error: err.message });
    }
  });
}
