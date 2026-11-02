# bukuresipi-astro

Website for Bukuresipi at https://bukuresipi.com: the landing page (Malay at `/`, English at `/en`) and the pages that
email links open (`/auth/verify`, `/auth/reset`, `/auth/forgot`, and `/en/auth/...`). Those pages call the API
(`bukuresipi-hono`, https://api.bukuresipi.com), which allows this origin by CORS (`WEB_ORIGIN`).

| Command | Does |
|---|---|
| `bun run dev` | `astro dev` on :4321; talks to the API on `wrangler dev` (:8787, `.env.development`) |
| `bun run build` | static build to `dist/` |
| `bun run deploy` | build + `wrangler deploy` (Worker `bukuresipi-web`, domains bukuresipi.com + www) |
| `bun run secrets:push [--dry-run]` | push `.env` (production Worker secrets, none yet) to `bukuresipi-web`; refuses `PUBLIC_*` |
| `bun run icons` | regenerate `public/*.png` from `public/favicon.svg` and `scripts/og.html` (needs Brave/Chrome) |

- Copy for both languages: `src/i18n.ts`. Store links: `STORES` there (null = "coming soon").
- SEO: `src/layouts/Base.astro` (canonical, hreflang, Open Graph, X card, JSON-LD), `sitemap.xml`, `robots.txt`.
- App Links: add `public/.well-known/assetlinks.json` and `apple-app-site-association` once the app has its ids;
  the app should claim `/auth/*` and `/en/auth/*`.

Env files: `.env.production` / `.env.development` = public build settings (`PUBLIC_API_URL`), committed.
`.env` = production Worker secrets, git-ignored, template `.env.example`.
