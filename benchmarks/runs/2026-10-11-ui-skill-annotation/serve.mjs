import http from 'node:http';
import { readFile } from 'node:fs/promises';
const files = new Map([
  ['/', ['index.html', 'text/html']], ['/index.html', ['index.html', 'text/html']],
  ['/style.css', ['style.css', 'text/css']], ['/app.js', ['app.js', 'text/javascript']], ['/model.mjs', ['model.mjs', 'text/javascript']],
  ['/task/input.json', ['task/input.json', 'application/json']], ['/task/existing-notebook.json', ['task/existing-notebook.json', 'application/json']],
]);
http.createServer(async (request, response) => {
  const entry = files.get(new URL(request.url, 'http://localhost').pathname);
  if (!entry) { response.writeHead(404); response.end('Not found'); return; }
  try { const bytes = await readFile(new URL(entry[0], import.meta.url)); response.writeHead(200, { 'Content-Type': entry[1] + '; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); response.end(bytes); }
  catch { response.writeHead(500); response.end('Local file unavailable'); }
}).listen(4192, '127.0.0.1', () => console.log('Field notes: http://127.0.0.1:4192'));
