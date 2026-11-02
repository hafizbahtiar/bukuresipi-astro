import { expect, test } from 'bun:test'
import { parseEnv, plan } from '../scripts/secrets-push'

test('parseEnv: comments, export, quotes (single keeps JSON), trailing comments, bad lines', () => {
    const { values, badLines } = parseEnv([
        '# comment', '', 'export A=1', 'B="two\\nlines"', `C='{"k":"v"}'`, 'D=plain # note', 'not a pair', 'E=',
    ].join('\n'))
    expect(values).toEqual({ A: '1', B: 'two\nlines', C: '{"k":"v"}', D: 'plain', E: '' })
    expect(badLines).toEqual([7])
})

test('plan: empty skipped, wrangler vars refused, undeclared names warned but pushed', () => {
    const wrangler = '{ "vars": { "APP_URL": "https://x" } }'
    const bindings = 'interface Env { JWT_SECRET: string; RESEND_API_KEY: string; APP_URL: string }'
    const p = plan({ JWT_SECRET: 's', RESEND_API_KEY: '', APP_URL: 'http://localhost', TYPO_KEY: 'v' }, wrangler, bindings)
    expect(p).toEqual({ push: { JWT_SECRET: 's', TYPO_KEY: 'v' }, empty: ['RESEND_API_KEY'], clashes: ['APP_URL'], unknown: ['TYPO_KEY'], build: [] })
})

test('plan: PUBLIC_* build settings in .env are skipped, never pushed as Worker secrets', () => {
    const p = plan({ PUBLIC_API_URL: 'https://api.example', TURNSTILE_SECRET: 'x' }, '{}', 'env: { ASSETS: Fetcher; TURNSTILE_SECRET: string }')
    expect(p).toEqual({ push: { TURNSTILE_SECRET: 'x' }, empty: [], clashes: [], unknown: [], build: ['PUBLIC_API_URL'] })
})
