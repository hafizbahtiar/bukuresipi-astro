// Indexable pages only (auth pages and 404 are noindex). Each page lists its other-language version (hreflang).
import { LANGS, pathIn, SITE } from '../i18n'

const PAGES = ['/', '/credits', '/privacy']

export const GET = () => {
    const urls = PAGES.flatMap(path => LANGS.map(lang => {
        const alternates = LANGS.map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${pathIn(path, l)}"/>`).join('\n')
        return `  <url>\n    <loc>${SITE}${pathIn(path, lang)}</loc>\n${alternates}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${pathIn(path, 'ms')}"/>\n  </url>`
    }))
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`
    return new Response(xml, { headers: { 'Content-Type': 'application/xml' } })
}
