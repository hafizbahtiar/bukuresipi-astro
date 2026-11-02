// @ts-check
import { defineConfig } from 'astro/config'

// Static site on Cloudflare (wrangler.jsonc). Pages are files (/auth/reset.html served at /auth/reset) so email links
// with ?token= never go through a trailing-slash redirect.
export default defineConfig({
    site: 'https://bukuresipi.com',
    trailingSlash: 'never',
    build: { format: 'file' },
    i18n: { defaultLocale: 'ms', locales: ['ms', 'en'], routing: { prefixDefaultLocale: false } },
    // `astro dev`: /api goes to the API's `wrangler dev`, as the service binding does in production (worker/index.ts).
    vite: { server: { proxy: { '/api': 'http://localhost:8787' } } },
})
