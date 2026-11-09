// Shared frame of the feature videos (scripts/video/*.html). A scene file defines, before loading this:
//   DURATION, POSTER (seconds: the poster frame), CUES (sound, scripts/video-audio.ts), V = { ms, en } (in-phone text),
//   screens(d, v) -> the HTML of three screens with ids s1, s2, s3, FINGER = passes of { t, x, y } in screen pixels,
//   TAPS = times of a press, scene(t) -> its own animation.
// scripts/video.ts calls init(data) with the page's copy (src/i18n.ts home.features[i]), then seek(t) for every frame.
// Everything is a pure function of t, so a render is the same every time. Preview: open the scene file, run play().

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const p = (t, s, d) => clamp((t - s) / d)
const out3 = x => 1 - Math.pow(1 - x, 3)
const inOut = x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const back = x => { const c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2) }
const lerp = (a, b, x) => a + (b - a) * x
/** Fades in over [a, a+da], out over [b, b+db]; slides up while in, up again while out. */
const shown = (t, a, da, b, db) => ({ o: Math.min(out3(p(t, a, da)), 1 - inOut(p(t, b, db))), y: (1 - out3(p(t, a, da))) * 40 - inOut(p(t, b, db)) * 40 })
/** Pops in at `at` (scale with overshoot). */
const pop = (t, at, d = 0.4) => { const x = p(t, at, d); return { opacity: x > 0 ? 1 : 0, transform: `scale(${x > 0 ? back(x) : 0})` } }
/** Writes left to right from `at`. */
const write = (t, at, d = 0.5) => `inset(0 ${100 - out3(p(t, at, d)) * 100}% 0 0)`
const S = (el, css) => Object.assign(el.style, css)

const ICON = {
    pin: (fill = '#c43d34') => `<svg viewBox="0 0 52 68"><path d="M26 2C12.7 2 2 12.5 2 25.6 2 43 26 66 26 66s24-23 24-40.4C50 12.5 39.3 2 26 2z" fill="${fill}" stroke="#fff" stroke-width="3"/><circle cx="26" cy="25" r="8.5" fill="#fff"/></svg>`,
    search: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/></svg>',
    city: `<svg class="city" viewBox="0 0 376 836" preserveAspectRatio="none">
        <rect x="24" y="120" width="120" height="150" rx="10" fill="#d5e4c8"/><rect x="230" y="90" width="130" height="110" rx="10" fill="#dfe6d6"/>
        <rect x="250" y="420" width="110" height="160" rx="10" fill="#d5e4c8"/><rect x="20" y="430" width="140" height="120" rx="10" fill="#dfe6d6"/>
        <path d="M-20 600 C 90 560, 160 650, 400 590" stroke="#c6dbef" stroke-width="34" fill="none"/>
        <path d="M188 -10 V 846 M -10 330 H 386 M -10 220 C 120 240, 260 180, 386 250" stroke="#fff" stroke-width="16" fill="none"/>
        <path d="M60 -10 V 846 M 320 -10 V 846 M -10 470 H 386" stroke="#fff" stroke-width="8" fill="none"/></svg>`,
}

// The copy column and the screens follow one clock in every feature video: intro, then a step per screen.
const BLOCKS = [[0.2, 1.4], [1.6, 6.0], [6.4, 10.8], [11.2, 16.4]]
const SLIDES = [[6.2, 's2'], [11.0, 's3']]
const END = 17.0
// The screen's top-left corner in page pixels: FINGER is in screen pixels.
const SX = 592, SY = 122

let $ = {}
function init(d) {
    const v = V[d.lang]
    document.documentElement.lang = d.lang
    document.getElementById('root').innerHTML = `
    <div class="abs copy intro" id="c0"><h1><span class="hl" id="hl0">${d.title}</span></h1></div>
    ${d.steps.map(([title, text], i) => `<div class="abs copy" id="c${i + 1}"><div class="num">0${i + 1}</div><h2>${title}</h2><p>${text}</p></div>`).join('')}
    <div class="abs phone" id="phone"><div class="screen"><div class="notch"></div>${screens(d, v)}</div></div>
    <div class="abs ripple" id="ripple"></div><div class="abs finger" id="finger"></div>
    <div class="abs end" id="end"><span class="mk">${d.logo}</span><div class="word">bukuresipi</div><div class="tag">${d.footer}</div>
        <div class="pill">Android <small>· ${d.soon}</small></div></div>`
    for (const el of document.querySelectorAll('[id]')) $[el.id] = el
    $.v = v
    window.ready = Promise.all([document.fonts.ready, ...[...document.images].map(i => i.decode().catch(() => {}))]).then(() => true)
}

/** The finger's place and opacity at t: each pass glides between its keyframes, fading in and out at its ends. */
function fingerAt(t) {
    for (const pass of FINGER) {
        const a0 = pass[0].t, b0 = pass[pass.length - 1].t
        if (t < a0 - 0.3 || t > b0 + 0.3) continue
        let k = pass.findIndex(f => f.t > t)
        if (k === -1) k = pass.length - 1
        const a = pass[Math.max(0, k - 1)], b = pass[k], x = k === 0 ? 0 : inOut(clamp((t - a.t) / (b.t - a.t)))
        return { x: SX + lerp(a.x, b.x, x), y: SY + lerp(a.y, b.y, x), o: Math.min(p(t, a0 - 0.3, 0.3), 1 - p(t, b0, 0.3)) }
    }
    return { x: 0, y: 0, o: 0 }
}

function seek(t) {
    BLOCKS.forEach(([a, b], i) => {
        const s = shown(t, a, 0.6, b, 0.5)
        S($['c' + i], { opacity: s.o, transform: `translateY(calc(-50% + ${s.y}px))` })
    })
    $.hl0.style.setProperty('--hl', out3(p(t, 0.6, 0.6)))

    const pin = out3(p(t, 0.3, 0.9)), pout = inOut(p(t, 16.6, 0.7))
    S($.phone, { opacity: Math.min(pin, 1 - pout), transform: `translateX(${(1 - pin) * 260 + pout * 260}px)` })
    SLIDES.forEach(([at, id], i) => {
        const x = inOut(p(t, at, 0.6))
        const next = SLIDES[i + 1] ? inOut(p(t, SLIDES[i + 1][0], 0.6)) : 0
        S($[id], { transform: `translateX(${(1 - x) * 100 - next * 30}%)`, opacity: x > 0 ? 1 : 0 })
    })
    S($.s1, { transform: `translateX(${-inOut(p(t, SLIDES[0][0], 0.6)) * 30}%)` })

    scene(t)

    const f = fingerAt(t), press = TAPS.some(a => t >= a && t < a + 0.25)
    S($.finger, { opacity: f.o, transform: `translate(${f.x}px, ${f.y}px) scale(${press ? 0.85 : 1})` })
    const tap = TAPS.map(a => p(t, a, 0.5)).find(x => x > 0 && x < 1) ?? 0
    S($.ripple, { opacity: tap ? 1 - tap : 0, transform: `translate(${f.x}px, ${f.y}px) scale(${1 + tap * 1.6})` })

    const e = shown(t, END, 0.7, 99, 1)
    S($.end, { opacity: e.o, transform: `translateY(${e.y}px)` })
}

function play() { const t0 = performance.now(); const step = () => { seek(((performance.now() - t0) / 1000) % DURATION); requestAnimationFrame(step) }; step() }
