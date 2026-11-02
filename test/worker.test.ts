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
