// CDN smoke tests: start server.js, load every page that links CDN assets,
// and check that each CDN URL (and each font/image its CSS points to) loads.
// Run with: npm test   (needs network access to the CDN)
//
// Pages covered:
//   /                  app/template.ejs   (outdated-browser js, css, languagePath + other CDN assets)
//   /activate          app/views/activate.html (jquery, bootstrap js)
//   /app/css/main.css  app/css/main.css   (bootstrap css, font-awesome css via @import)

import { test, before, after } from 'node:test';
import assert                  from 'node:assert/strict';
import { spawn }               from 'node:child_process';
import { createServer }        from 'node:net';
import { fileURLToPath }       from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

const CDN_URL_RE = /https:\/\/(?:cdn\.cbd\.int|cdn\.jsdelivr\.net)\/[^\s"'()<>`]+/g;

// The CDN assets each page must load, and a string proving the right library came back.
// The outdated-browser language file is fetched by XHR and injected, and both CDNs serve
// .html as text/plain, so text/plain is accepted for it.
const HTML = /text\/(html|plain)/;
const REQUIRED = [
    { page: '/',                 file: 'outdated-browser@1.0.2/outdatedbrowser/outdatedbrowser.min.js',  type: /javascript/, sign: 'outdatedBrowser' },
    { page: '/',                 file: 'outdated-browser@1.0.2/outdatedbrowser/outdatedbrowser.min.css', type: /css/,        sign: '#outdated'       },
    { page: '/',                 file: 'outdated-browser@1.0.2/outdatedbrowser/lang/en.html',            type: HTML,         sign: 'btnUpdateBrowser'},
    { page: '/activate',         file: 'jquery@2.1.4/dist/jquery.min.js',                                type: /javascript/, sign: 'jQuery v2.1.4'   },
    { page: '/activate',         file: 'bootstrap@3.3.5/dist/js/bootstrap.min.js',                       type: /javascript/, sign: 'Bootstrap v3.3.5'},
    { page: '/app/css/main.css', file: 'bootstrap@3.3.5/dist/css/bootstrap.min.css',                     type: /css/,        sign: 'Bootstrap v3.3.5'},
    { page: '/app/css/main.css', file: 'font-awesome@4.7.0/css/font-awesome.css',                        type: /css/,        sign: 'Font Awesome 4.7.0'},
];

const PAGES = [...new Set(REQUIRED.map(r => r.page))];

let server;
let baseUrl;
let output = '';
const pageUrls = {};          // page -> [cdn urls]
const fetched  = new Map();   // url  -> { status, type, body }

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

async function get(url) {
    if (!fetched.has(url)) {
        const res = await fetch(url);
        fetched.set(url, { status: res.status, type: res.headers.get('content-type') || '', body: await res.text() });
    }
    return fetched.get(url);
}

// Files a CDN URL serves: one for a plain URL, several for a jsDelivr combine/ URL.
function filesOf(url) {
    const path = new URL(url).pathname.replace(/^\//, '');
    if (path.startsWith('combine/')) return path.slice('combine/'.length).split(',').map(f => f.replace(/^npm\//, ''));
    return [path.replace(/^npm\//, '')];
}

function expectedType(url) {
    const path = new URL(url).pathname;
    if (/\.js$/.test(path))   return /javascript/;
    if (/\.css$/.test(path))  return /css/;
    if (/\.html$/.test(path)) return HTML;
    return null;
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

    for (const page of PAGES) {
        const res  = await fetch(baseUrl + page);
        const body = await res.text();
        assert.equal(res.status, 200, `GET ${page}`);
        pageUrls[page] = [...new Set(body.match(CDN_URL_RE) || [])];
    }
});

after(() => { if (server && server.exitCode === null) server.kill('SIGTERM'); });

for (const req of REQUIRED) {
    test(`${req.page} loads ${req.file}`, async () => {
        const url = pageUrls[req.page].find(u => filesOf(u).includes(req.file));
        assert.ok(url, `${req.file} not found in ${req.page}; CDN URLs found:\n${pageUrls[req.page].join('\n')}`);

        const res = await get(url);
        assert.equal(res.status, 200, url);
        assert.match(res.type, req.type, `${url} content-type ${res.type}`);
        assert.ok(res.body.includes(req.sign), `${url} does not contain "${req.sign}"`);
    });
}

for (const page of PAGES) {
    test(`every CDN URL on ${page} returns 200 with the right content type`, async () => {
        assert.ok(pageUrls[page].length > 0, `no CDN URLs on ${page}`);
        for (const url of pageUrls[page]) {
            const res = await get(url);
            assert.equal(res.status, 200, url);
            const type = expectedType(url);
            if (type) assert.match(res.type, type, `${url} content-type ${res.type}`);
        }
    });

    test(`every relative url() in CDN CSS on ${page} returns 200 (fonts, icons)`, async () => {
        for (const url of pageUrls[page].filter(u => /\.css$/.test(new URL(u).pathname))) {
            const { body } = await get(url);
            const refs = [...body.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)]
                .map(m => m[1])
                .filter(r => !/^(data:|https?:|\/\/|#)/.test(r));
            for (const ref of new Set(refs)) {
                const target = new URL(ref, url);
                target.hash = '';
                const res = await fetch(target);
                await res.arrayBuffer();
                assert.equal(res.status, 200, `${target} (from ${url})`);
            }
        }
    });
}
