# bukuresipi-astro

Website for Bukuresipi at https://bukuresipi.com: the landing page (Malay at `/`, English at `/en`) and the pages that
email links open (`/auth/verify`, `/auth/reset`, `/auth/forgot`, and `/en/auth/...`). Those pages call
`/api/v1/auth/*` on their own origin; the Worker (`worker/index.ts`) passes `/api/*` to the API Worker
(`bukuresipi-hono`) through a service binding. Deploy the API first.

| Command | Does |
|---|---|
| `bun run dev` | `astro dev` on :4321; `/api` is proxied to the API's `wrangler dev` (:8787) |
| `bun run build` | static build to `dist/` |
| `bun run deploy` | build + `wrangler deploy` (Worker `bukuresipi-astro`, domains bukuresipi.com + www) |
| `bun run secrets:push [--dry-run]` | push `.env` Worker secrets (none yet) to `bukuresipi-astro`; skips `PUBLIC_*` build settings |
| `bun run icons` | regenerate `public/*.png` from `public/favicon.svg` and `scripts/og.html` (needs Brave/Chrome) |

- Copy for both languages: `src/i18n.ts`. Store links: `STORES` there (null = "coming soon").
- SEO: `src/layouts/Base.astro` (canonical, hreflang, Open Graph, X card, JSON-LD), `sitemap.xml`, `robots.txt`.
- App Links: add `public/.well-known/assetlinks.json` and `apple-app-site-association` once the app has its ids;
  the app should claim `/auth/*` and `/en/auth/*`.

Env: `.env` = production Worker secrets (git-ignored, template `.env.example`, none needed yet). No build settings.

## App Links (`public/.well-known/assetlinks.json`)

Android opens `bukuresipi.com/auth/*` and `/family/join` links in the app only when this file lists the app's
signing certificates (package `com.bukuresipi`). Without it, every such link opens in the browser. It lists three
SHA-256 fingerprints:
- Google Play's app signing key (every install from Play): Play Console > Test and release > Setup > App signing >
  "App signing key certificate" SHA-256;
- the upload key (`android/key.properties`: a release APK installed by hand);
- this machine's debug key (`flutter run`).

Android checks the file when the app is installed or updated, so after a change, reinstall the app to test it.
