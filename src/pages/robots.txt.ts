import { SITE } from '../i18n'

export const GET = () =>
    new Response(`User-agent: *\nDisallow: /auth/\nDisallow: /en/auth/\n\nSitemap: ${SITE}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain' } })
