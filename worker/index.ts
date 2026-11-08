// The website Worker: static build (dist/) + two jobs in code.
// 1. bukuresipi.com/api/* -> the API Worker (bukuresipi-hono) through a service binding: the pages call their own
//    origin (no CORS, no preflight), and the request goes Worker-to-Worker with the visitor's headers (rate limits
//    still see CF-Connecting-IP). The app keeps calling api.bukuresipi.com directly.
// 2. www.bukuresipi.com -> bukuresipi.com (one canonical host).
// 3. A family invite opened in Android's browser (the App Link was not taken: not verified yet, or opened from a
//    browser) -> redirected into the app with an intent link; without the app, Android loads the page (`web=1`).
const APP_PATHS = new Set(['/family/join', '/en/family/join'])

function intoApp(request: Request, url: URL): Response | null {
    const ua = request.headers.get('User-Agent') ?? ''
    // A person's tap in a browser only: link previews (WhatsApp, crawlers) send no Sec-Fetch-Dest and get the page.
    if (!APP_PATHS.has(url.pathname) || url.searchParams.has('web') || !/Android/i.test(ua) || request.headers.get('Sec-Fetch-Dest') !== 'document') return null
    const page = new URL(url)
    page.searchParams.set('web', '1')
    const intent = `intent://${url.host}${url.pathname}${url.search}#Intent;scheme=https;package=com.bukuresipi;S.browser_fallback_url=${encodeURIComponent(page.toString())};end`
    return new Response(null, { status: 302, headers: { Location: intent, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } })
}

export default {
    async fetch(request: Request, env: { ASSETS: Fetcher; API: Fetcher }): Promise<Response> {
        const url = new URL(request.url)
        if (url.hostname === 'www.bukuresipi.com') {
            url.hostname = 'bukuresipi.com'
            return Response.redirect(url.toString(), 301)
        }
        if (url.pathname.startsWith('/api/')) return env.API.fetch(request)
        const app = intoApp(request, url)
        if (app) return app
        return env.ASSETS.fetch(request)
    },
}
