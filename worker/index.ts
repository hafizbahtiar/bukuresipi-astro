// Serves the static build (dist/). Only job of code here: www.bukuresipi.com -> bukuresipi.com (one canonical host).
export default {
    async fetch(request: Request, env: { ASSETS: Fetcher }): Promise<Response> {
        const url = new URL(request.url)
        if (url.hostname === 'www.bukuresipi.com') {
            url.hostname = 'bukuresipi.com'
            return Response.redirect(url.toString(), 301)
        }
        return env.ASSETS.fetch(request)
    },
}
