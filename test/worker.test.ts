import { expect, test } from 'bun:test'
import worker from '../worker/index'

const fetcher = (name: string, seen: Request[]) => ({ fetch: async (r: Request) => (seen.push(r), new Response(name)) }) as unknown as Fetcher
const setup = () => {
    const api: Request[] = [], assets: Request[] = []
    return { api, assets, env: { API: fetcher('api', api), ASSETS: fetcher('assets', assets) } }
}

test('/api/* goes to the API Worker unchanged (method, body, visitor IP header)', async () => {
    const { api, env } = setup()
    const req = new Request('https://bukuresipi.com/api/v1/auth/forgot-password', {
        method: 'POST', body: '{"email":"a@b.c"}', headers: { 'CF-Connecting-IP': '1.2.3.4', 'Content-Type': 'application/json' },
    })
    expect(await (await worker.fetch(req, env)).text()).toBe('api')
    expect([api[0].method, api[0].headers.get('CF-Connecting-IP'), await api[0].text()]).toEqual(['POST', '1.2.3.4', '{"email":"a@b.c"}'])
})

test('pages and files come from the static assets; /apix is not the API', async () => {
    const { assets, env } = setup()
    for (const path of ['/', '/auth/reset', '/apix']) expect(await (await worker.fetch(new Request(`https://bukuresipi.com${path}`), env)).text()).toBe('assets')
    expect(assets).toHaveLength(3)
})

test('www redirects to the bare domain, keeping path and query', async () => {
    const res = await worker.fetch(new Request('https://www.bukuresipi.com/auth/reset?token=x'), setup().env)
    expect([res.status, res.headers.get('Location')]).toEqual([301, 'https://bukuresipi.com/auth/reset?token=x'])
})

const android = { 'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Infinix X6731) Chrome/130.0 Mobile', 'Sec-Fetch-Dest': 'document' }

test('a family invite tapped in Android\'s browser goes into the app; no app = the page (web=1)', async () => {
    const res = await worker.fetch(new Request('https://bukuresipi.com/en/family/join?t=abc', { headers: android }), setup().env)
    expect(res.status).toBe(302)
    const loc = res.headers.get('Location')!
    expect(loc.startsWith('intent://bukuresipi.com/en/family/join?t=abc#Intent;scheme=https;package=com.bukuresipi;')).toBe(true)
    expect(decodeURIComponent(/S\.browser_fallback_url=([^;]+)/.exec(loc)![1])).toBe('https://bukuresipi.com/en/family/join?t=abc&web=1')
})

test('the invite page itself: the fallback, link previews, and other phones', async () => {
    const { assets, env } = setup()
    for (const [url, headers] of [
        ['https://bukuresipi.com/family/join?t=abc&web=1', android], // the fallback: no loop
        ['https://bukuresipi.com/family/join?t=abc', { 'User-Agent': android['User-Agent'] }], // a preview fetch
        ['https://bukuresipi.com/family/join?t=abc', { 'User-Agent': 'Mozilla/5.0 (iPhone)', 'Sec-Fetch-Dest': 'document' }],
        ['https://bukuresipi.com/auth/reset?token=x', android], // only the invite
    ] as const) expect((await worker.fetch(new Request(url, { headers }), env)).status).toBe(200)
    expect(assets).toHaveLength(4)
})
