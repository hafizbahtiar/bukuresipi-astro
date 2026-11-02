// The website Worker: static build (dist/) + two jobs in code.
// 1. bukuresipi.com/api/* -> the API Worker (bukuresipi-hono) through a service binding: the pages call their own
//    origin (no CORS, no preflight), and the request goes Worker-to-Worker with the visitor's headers (rate limits
//    still see CF-Connecting-IP). The app keeps calling api.bukuresipi.com directly.
// 2. www.bukuresipi.com -> bukuresipi.com (one canonical host).
export default {
    async fetch(request: Request, env: { ASSETS: Fetcher; API: Fetcher }): Promise<Response> {
        const url = new URL(request.url)
        if (url.hostname === 'www.bukuresipi.com') {
            url.hostname = 'bukuresipi.com'
            return Response.redirect(url.toString(), 301)
        }
        if (url.pathname.startsWith('/api/')) return env.API.fetch(request)
        return env.ASSETS.fetch(request)
    },
}
