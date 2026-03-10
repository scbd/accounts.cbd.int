// Temp test file for parseTrustedDomains + receiveMessage trust check
// Run with: node tests/authorize-test.js

import { parseTrustedDomains } from '../utils/trusted-domains.js';

function isTrusted(trustedDomains, originStr) {
    var origin;
    try { origin = new URL(originStr); } catch(e) { return false; }
    return trustedDomains.some(d => new RegExp(d.regex, 'i').test(origin.origin));
}

// ── Test config ───────────────────────────────────────────────────────────────
const TRUSTED_DOMAINS = 'http://localhost;http://localhost:8080;staging.cbd.int;*.staging.cbd.int;cbddev.xyz;*.cbddev.xyz;cbd.int;*.cbd.int;kronos-events.net;*.kronos-events.net';
const trustedDomains  = parseTrustedDomains(TRUSTED_DOMAINS);

console.log('Parsed trusted domains:');
trustedDomains.forEach(d => console.log(' ', d.domain, '->', d.regex));
console.log('');

// ── Test cases ────────────────────────────────────────────────────────────────
const tests = [
    // Expected: trusted
    { origin: 'http://localhost',                 expect: true  },
    { origin: 'http://localhost:8080',            expect: true  },
    { origin: 'https://cbd.int',                  expect: true  },
    { origin: 'https://www.cbd.int',              expect: true  },
    { origin: 'https://absch.cbd.int',            expect: true  },
    { origin: 'https://beta.bch.cbd.int',         expect: true  },
    { origin: 'https://staging.cbd.int',          expect: true  },
    { origin: 'https://absch.staging.cbd.int',    expect: true  },
    { origin: 'https://cbddev.xyz',               expect: true  },
    { origin: 'https://app.cbddev.xyz',           expect: true  },
    { origin: 'https://kronos-events.net',        expect: true  },
    { origin: 'https://app.kronos-events.net',    expect: true  },
    // Expected: NOT trusted
    { origin: 'https://localhost',                expect: false }, // https localhost not listed
    { origin: 'http://cbd.int',                   expect: false }, // http not allowed for cbd.int
    { origin: 'https://evil.com',                 expect: false },
    { origin: 'https://evil-cbd.int',             expect: false },
    { origin: 'https://notcbd.int',               expect: false },
    { origin: 'https://fakecbddev.xyz',           expect: false },
    { origin: 'ftp://cbd.int',                    expect: false },
];

let pass = 0, fail = 0;
for (const t of tests) {
    const result = isTrusted(trustedDomains, t.origin);
    const ok     = result === t.expect;
    console.log(`${ok ? 'PASS' : 'FAIL'} [expect:${t.expect ? 'trusted  ' : 'untrusted'}] ${t.origin}`);
    ok ? pass++ : fail++;
}

console.log(`\n${pass} passed, ${fail} failed`);
