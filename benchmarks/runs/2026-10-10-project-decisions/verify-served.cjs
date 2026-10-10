const fs = require('node:fs');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const dist = 'C:/Users/chris/Documents/GitHub/fancy-research-tools/dist';
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
(async () => {
  const base = 'http://127.0.0.1:4173';
  const paths = ['/pilot/', '/guides/getting-started.html', '/guides/customizing.html', '/guides/development-study.html', '/reference/testing.html'];
  const evidence = [];
  for (let i = 0; i < paths.length; i++) {
    const p = paths[i];
    const response = await fetch(base + p);
    assert.equal(response.status, 200, p);
    const bytes = Buffer.from(await response.arrayBuffer());
    const file = p.endsWith('/') ? p + 'index.html' : p;
    assert.equal(sha(bytes), sha(fs.readFileSync(dist + file)), p);
    evidence.push({path:p, sha256:sha(bytes), matchesFreshDist:true});
    if (p === '/pilot/') for (const match of bytes.toString().matchAll(/(?:src|href)="([^"]+)"/g)) {
      const target = new URL(match[1], base + p);
      if (target.origin === base && target.pathname.startsWith('/assets/') && !paths.includes(target.pathname)) paths.push(target.pathname);
    }
  }
  fs.writeFileSync(__dirname + '/served-build.json', JSON.stringify({checkedAt:new Date().toISOString(), evidence}, null, 2));
  console.log(`All ${evidence.length} served routes/assets match the current production build.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
