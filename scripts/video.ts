/**
 * Render the "How it works" explainer (scripts/video.html) and one video per feature (scripts/video/<id>.html, text
 * from src/i18n.ts home.features, frame from scripts/video-kit.*), per language, from the same frames:
 *   public/video/how-it-works-<lang>.webm  AV1, what most browsers download (~30% smaller than H.264)
 *   public/video/how-it-works-<lang>.mp4   H.264 fallback (older Safari / iPhones without AV1)
 *   public/video/how-it-works-<lang>.webp  poster
 *   video-master/how-it-works-<lang>.mp4   near-lossless master, git-ignored: re-encode from it, never publish it
 * Sound: scripts/video-audio.ts synthesises the music and effects in code (nothing licensed), on video.html's CUES.
 * (Animated WebP was measured: 2.5x the MP4 at half the frame rate, so it is not used.)
 *   bun run video              all of them
 *   bun run video map family   only these (by name: how-it-works or a feature id)
 * Text comes from src/i18n.ts, so the video says what the page says. A headless Chromium (BROWSER env, default Brave,
 * like scripts/icons.ts) draws each frame over the DevTools protocol; ffmpeg (brew install ffmpeg) encodes them.
 */
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import sharp from 'sharp'
import { t } from '../src/i18n'
import { type Cue, soundtrack } from './video-audio'

type Home = ReturnType<typeof t>['home']

const FPS = 30
const SIZE = 1080
const out = `${import.meta.dir}/../public/video`
const masters = `${import.meta.dir}/../video-master`
const browser = process.env.BROWSER ?? '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'
const logo = await Bun.file(`${import.meta.dir}/../src/assets/logo-mark.svg`).text()
mkdirSync(out, { recursive: true })
mkdirSync(masters, { recursive: true })

const profile = mkdtempSync(`${tmpdir()}/video-`)
const port = 9333
const chrome = Bun.spawn([browser, '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
    '--hide-scrollbars', '--force-device-scale-factor=1', `--window-size=${SIZE},${SIZE}`, 'about:blank'], { stderr: 'ignore' })

try {
    let target: { webSocketDebuggerUrl: string } | undefined
    for (let i = 0; i < 50 && !target; i++) {
        await Bun.sleep(200)
        target = await fetch(`http://127.0.0.1:${port}/json/list`).then(r => r.json() as Promise<{ type: string; webSocketDebuggerUrl: string }[]>).then(l => l.find(x => x.type === 'page')).catch(() => undefined)
    }
    if (!target) throw new Error('browser did not start')

    const ws = new WebSocket(target.webSocketDebuggerUrl)
    await new Promise(r => ws.addEventListener('open', r, { once: true }))
    let id = 0
    const waiting = new Map<number, { ok: (v: any) => void; fail: (e: Error) => void }>()
    ws.addEventListener('message', e => {
        const m = JSON.parse(String(e.data))
        const w = waiting.get(m.id)
        if (!w) return
        waiting.delete(m.id)
        m.error ? w.fail(new Error(m.error.message)) : w.ok(m.result)
    })
    const send = (method: string, params: object = {}): Promise<any> =>
        new Promise((ok, fail) => { waiting.set(++id, { ok, fail }); ws.send(JSON.stringify({ id, method, params })) })
    const evaluate = async (expression: string) => {
        const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
        if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? 'page error')
        return r.result.value
    }

    await send('Emulation.setDeviceMetricsOverride', { width: SIZE, height: SIZE, deviceScaleFactor: 1, mobile: false })
    const jobs = [
        { name: 'how-it-works', page: 'video.html', data: (s: Home) => ({ stepsTitle: s.stepsTitle, steps: s.steps, nb: s.notebook }) },
        ...t('ms').home.features.map(({ id }) => ({
            name: id, page: `video/${id}.html`,
            data: (s: Home) => { const f = s.features.find(x => x.id === id)!; return { title: f.title, steps: f.steps } },
        })),
    ]
    const only = process.argv.slice(2)
    for (const job of jobs.filter(j => !only.length || only.includes(j.name))) for (const lang of ['ms', 'en'] as const) {
        const s = t(lang).home
        await send('Page.navigate', { url: `file://${import.meta.dir}/${job.page}` })
        for (let i = 0; i < 50 && !(await evaluate('typeof init === "function" && document.readyState === "complete"').catch(() => false)); i++) await Bun.sleep(100)
        const data = { lang, footer: s.footer, soon: s.soon, logo, ...job.data(s) }
        await evaluate(`init(${JSON.stringify(data)}); window.ready`)
        const duration: number = await evaluate('DURATION')
        const audio = `${profile}/soundtrack.wav`
        await Bun.write(audio, soundtrack((await evaluate('CUES')) as Cue[], duration))

        const name = `${job.name}-${lang}`
        const master = `${masters}/${name}.mp4`
        // One pass over the frames, three files. SVT_LOG=1: SVT-AV1 prints only fatal errors.
        // Sound: AAC for the MP4s, Opus for the WebM (small at 64-96 kb/s; the page starts muted, the user can unmute).
        const ffmpeg = Bun.spawn(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-', '-i', audio,
            '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow', '-crf', '12', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', master,
            '-map', '0:v', '-map', '1:a', '-c:v', 'libsvtav1', '-preset', '4', '-crf', '38', '-pix_fmt', 'yuv420p', '-c:a', 'libopus', '-b:a', '64k', '-shortest', `${out}/${name}.webm`,
            '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'veryslow', '-crf', '26', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', '-shortest', `${out}/${name}.mp4`,
        ], { stdin: 'pipe', env: { ...process.env, SVT_LOG: '1' } })
        const frames = Math.round(duration * FPS)
        for (let f = 0; f < frames; f++) {
            // Two animation frames after seek: the screenshot sees this frame's layout, not the last one's.
            await evaluate(`seek(${f / FPS}); new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))`)
            const { data: png } = await send('Page.captureScreenshot', { format: 'png' })
            ffmpeg.stdin.write(Buffer.from(png, 'base64'))
            if (f % FPS === 0) process.stdout.write(`\r${lang}: ${Math.round((f / frames) * 100)}%`)
        }
        ffmpeg.stdin.end()
        if ((await ffmpeg.exited) !== 0) throw new Error('ffmpeg failed')
        // Poster: the clearest single frame (each page's POSTER), taken from the master.
        const still = Bun.spawnSync(['ffmpeg', '-loglevel', 'error', '-ss', String(await evaluate('POSTER')), '-i', master, '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'png', '-'])
        await sharp(still.stdout).webp({ quality: 80 }).toFile(`${out}/${name}.webp`)
        console.log(`\r${lang}: ${out}/${name}.{webm,mp4,webp}`)
    }
    ws.close()
} finally {
    chrome.kill()
    rmSync(profile, { recursive: true, force: true })
}
