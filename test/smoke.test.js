// Smoke tests: start server.js and check that the main routes respond.
// Run with: npm test   (requires `yarn run build` first, for dist/)

import { test, before, after } from 'node:test';
import assert                  from 'node:assert/strict';
import { spawn }               from 'node:child_process';
import { createServer }        from 'node:net';
import { readFileSync }        from 'node:fs';
import { fileURLToPath }       from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const pkg  = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

let server;
let baseUrl;
let output = '';

function freePort() {
    return new Promise((resolve, reject) => {
        const srv = createServer();
        srv.unref();
        srv.on('error', reject);
        srv.listen(0, () => { const { port } = srv.address(); srv.close(() => resolve(port)); });
    });
}

async function waitForServer(url, timeoutMs = 20000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        if (server.exitCode !== null) throw new Error(`server exited early (${server.exitCode}):\n${output}`);
        try { await fetch(url); return; } catch { await new Promise(r => setTimeout(r, 200)); }
    }
    throw new Error(`server did not start within ${timeoutMs}ms:\n${output}`);
}

function compareVersions(a, b) {
    const pa = a.replace(/^v/, '').split('.').map(Number);
    const pb = b.replace(/^v/, '').split('.').map(Number);
    for (let i = 0; i < 3; i++) if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
    return 0;
}

before(async () => {
    const port = await freePort();
    baseUrl = `http://127.0.0.1:${port}`;
    server = spawn(process.execPath, ['server.js'], {
        cwd: root,
        env: {
            ...process.env,
            PORT       : String(port),
            API_URL    : process.env.API_URL     || 'https://api.cbddev.xyz',
            AUTH_ISSUER: process.env.AUTH_ISSUER || 'accounts.cbddev.xyz',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
    });
    server.stdout.on('data', d => { output += d; });
    server.stderr.on('data', d => { output += d; });
    await waitForServer(`${baseUrl}/favicon.png`);
});

after(() => { if (server && server.exitCode === null) server.kill('SIGTERM'); });

test('Node version satisfies engines.node', () => {
    const min = pkg.engines.node.replace(/^>=\s*/, '');
    assert.ok(compareVersions(process.version, min) >= 0, `${process.version} < ${min}`);
});

for (const path of ['/', '/signin', '/signup', '/password/reset', '/activate/resend']) {
    test(`GET ${path} returns 200 with the app template`, async () => {
        const res  = await fetch(baseUrl + path);
        const body = await res.text();
        assert.equal(res.status, 200);
        assert.match(res.headers.get('content-type'), /text\/html/);
        assert.match(body, /<title>Accounts: Convention on Biological Diversity<\/title>/);
        assert.equal(res.headers.get('x-frame-options'), 'DENY');
    });
}

test('GET /app/authorize.html returns 200 (built from dist/)', async () => {
    const res = await fetch(`${baseUrl}/app/authorize.html`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('x-frame-options'), 'ALLOW');
});

test('GET /activate returns 200', async () => {
    const res = await fetch(`${baseUrl}/activate`);
    assert.equal(res.status, 200);
});

test('GET /app/app.js returns 200 (static assets)', async () => {
    const res = await fetch(`${baseUrl}/app/app.js`);
    assert.equal(res.status, 200);
});

test('GET unknown /app/ file returns 404', async () => {
    const res = await fetch(`${baseUrl}/app/does-not-exist.js`);
    assert.equal(res.status, 404);
});

test('server logged no errors', () => {
    assert.doesNotMatch(output, /error|uncaught|deprecat/i, output);
});
