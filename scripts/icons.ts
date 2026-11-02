/**
 * Regenerate the PNGs in public/ from the logo (public/favicon.svg) and the preview template (scripts/og.html):
 *   bun run icons
 * Icons via sharp; og-ms.png / og-en.png via a headless Chromium (BROWSER env, default Brave) so the web fonts render.
 */
import sharp from 'sharp'

const pub = `${import.meta.dir}/../public`
const logo = await Bun.file(`${pub}/favicon.svg`).text()
// iOS rounds the corners itself: give it a full square.
const square = logo.replace('rx="15"', 'rx="0"')

await sharp(Buffer.from(square), { density: 600 }).resize(180, 180).png().toFile(`${pub}/apple-touch-icon.png`)
for (const size of [192, 512]) await sharp(Buffer.from(logo), { density: 900 }).resize(size, size).png().toFile(`${pub}/icon-${size}.png`)

const browser = process.env.BROWSER ?? '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'
for (const lang of ['ms', 'en']) {
    const shot = Bun.spawnSync([browser, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1200,630',
        '--virtual-time-budget=4000', `--screenshot=${pub}/og-${lang}.png`, `file://${import.meta.dir}/og.html?lang=${lang}`])
    if (shot.exitCode !== 0) throw new Error(`screenshot failed: ${shot.stderr}`)
}
console.log('icons + og images written to public/')
