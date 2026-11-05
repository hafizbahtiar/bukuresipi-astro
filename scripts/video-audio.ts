/**
 * The explainer's soundtrack, synthesised here from plain maths: no samples, no stock music, nothing downloaded, so
 * nothing to license. A soft plucked tune (C - Am - F - G, 96 BPM) under sound effects placed on the video's cues
 * (`CUES` in scripts/video.html). Returns a 16-bit stereo WAV.
 */
export type Cue = { t: number; kind: 'whoosh' | 'tap' | 'pop' | 'marker' | 'pencil' | 'chime' | 'thud' | 'chord'; dur?: number; pitch?: number }

const SR = 44_100

export function soundtrack(cues: Cue[], duration: number): Uint8Array {
    const n = Math.round(duration * SR)
    const L = new Float32Array(n), R = new Float32Array(n)
    let seed = 12345
    const noise = () => ((seed = (seed * 1_103_515_245 + 12_345) >>> 0) / 2 ** 31) - 1 // repeatable: same render every time

    /** Adds a mono signal at time t, panned (-1 left .. 1 right). */
    const put = (t: number, signal: Float32Array, gain: number, pan = 0) => {
        const start = Math.round(t * SR), l = gain * Math.cos(((pan + 1) * Math.PI) / 4), r = gain * Math.sin(((pan + 1) * Math.PI) / 4)
        for (let i = 0; i < signal.length && start + i < n; i++) {
            if (start + i < 0) continue
            L[start + i] += signal[i] * l
            R[start + i] += signal[i] * r
        }
    }
    const env = (len: number, attack: number, release: number) => (i: number) =>
        Math.min(1, i / (attack * SR + 1)) * Math.min(1, (len - i) / (release * SR + 1))

    /** Karplus-Strong plucked string: a short noise burst that rings at `freq` and dies away like a guitar or kecapi. */
    const pluck = (freq: number, dur: number, bright = 0.5) => {
        const len = Math.round(dur * SR), p = Math.max(2, Math.round(SR / freq)), buf = new Float32Array(p), out = new Float32Array(len)
        for (let i = 0; i < p; i++) buf[i] = noise() * 0.5
        let lp = 0
        for (let i = 0; i < len; i++) {
            const j = i % p, next = buf[(j + 1) % p]
            const v = 0.5 * (buf[j] + next) * 0.996
            lp = lp + bright * (v - lp)
            buf[j] = lp
            out[i] = buf[j] * Math.min(1, (len - i) / (0.05 * SR))
        }
        return out
    }
    const sine = (freq: number, dur: number, attack: number, release: number, decay = 0) => {
        const len = Math.round(dur * SR), out = new Float32Array(len), e = env(len, attack, release)
        for (let i = 0; i < len; i++) out[i] = Math.sin((2 * Math.PI * freq * i) / SR) * e(i) * Math.exp((-decay * i) / SR)
        return out
    }
    /** Noise through a resonant band-pass whose centre moves from f0 to f1: whooshes, markers, pencils. */
    const sweep = (dur: number, f0: number, f1: number, q: number, shape: (x: number) => number, wobble = 0) => {
        const len = Math.round(dur * SR), out = new Float32Array(len)
        let low = 0, band = 0
        for (let i = 0; i < len; i++) {
            const x = i / len, f = f0 * Math.pow(f1 / f0, x), k = 2 * Math.sin((Math.PI * f) / SR)
            low += k * band
            band += k * (noise() - low - band / q)
            const trem = wobble ? 0.6 + 0.4 * Math.sin(2 * Math.PI * wobble * (i / SR)) : 1
            out[i] = band * shape(x) * trem
        }
        return out
    }
    const bell = (x: number) => Math.sin(Math.PI * x) ** 2

    // --- music: 96 BPM, 8 bars, C - Am - F - G twice; bass, a quiet pad and a plucked arpeggio
    const beat = 60 / 96
    const chords = [[48, 52, 55], [45, 48, 52], [41, 45, 48], [43, 47, 50]] // MIDI: C, Am, F, G
    const hz = (m: number) => 440 * 2 ** ((m - 69) / 12)
    const arp = [0, 1, 2, 1, 2, 3, 2, 1] // up and down the chord, with the octave on top
    for (let bar = 0; bar * 4 * beat < duration - 1; bar++) {
        const c = chords[bar % 4], t0 = bar * 4 * beat
        put(t0, sine(hz(c[0]), 4 * beat, 0.02, 0.6, 0.9), 0.12) // 87-131 Hz: phone speakers drop anything lower
        for (const m of c) put(t0, sine(hz(m + 12), 4 * beat, 0.6, 0.8), 0.018, (m % 3) - 1)
        arp.forEach((k, i) => {
            const m = k === 3 ? c[0] + 24 : c[k] + 12
            put(t0 + i * (beat / 2), pluck(hz(m), 1.2, 0.45), 0.16, i % 2 ? 0.35 : -0.35)
        })
    }

    // --- sound effects on the video's cues
    for (const c of cues) {
        const d = c.dur ?? 0.4
        switch (c.kind) {
            case 'whoosh': put(c.t, sweep(d, 300, 2400, 1.2, bell), 0.35, 0.3); break
            case 'tap': put(c.t, sine(1400, 0.06, 0.001, 0.05, 30), 0.35); put(c.t, sweep(0.03, 3000, 3000, 2, x => 1 - x), 0.15); break
            case 'pop': put(c.t, sine(c.pitch ?? 880, 0.15, 0.002, 0.12, 18), 0.32, 0.2); put(c.t, sine((c.pitch ?? 880) * 1.5, 0.1, 0.002, 0.08, 25), 0.12, 0.2); break
            case 'marker': put(c.t, sweep(d, 1800, 2600, 3, x => Math.min(1, x * 12) * (1 - x) ** 0.5, 0), 0.5, -0.2); break
            case 'pencil': put(c.t, sweep(d, 3200, 4200, 4, x => Math.min(1, x * 20) * (1 - x ** 3), 11), 0.45, 0.15); break
            case 'chime': for (const [k, f] of [523.25, 783.99].entries()) put(c.t + k * 0.09, sine(f, 1.2, 0.005, 0.3, 3), 0.18); break
            case 'thud': put(c.t, sine(140, 0.25, 0.002, 0.2, 14), 0.5); put(c.t, sine(420, 0.12, 0.002, 0.1, 30), 0.15); break
            case 'chord': for (const [k, f] of [523.25, 659.25, 783.99, 1046.5].entries()) put(c.t + k * 0.06, sine(f, 2.6, 0.01, 1.2, 1.2), 0.13, k / 2 - 0.75); break
        }
    }

    // --- master: 0.4 s fade in, 1.2 s fade out, soft limiter, 16-bit stereo WAV
    const wav = new DataView(new ArrayBuffer(44 + n * 4))
    const str = (o: number, s: string) => [...s].forEach((ch, i) => wav.setUint8(o + i, ch.charCodeAt(0)))
    str(0, 'RIFF'); wav.setUint32(4, 36 + n * 4, true); str(8, 'WAVEfmt ')
    wav.setUint32(16, 16, true); wav.setUint16(20, 1, true); wav.setUint16(22, 2, true); wav.setUint32(24, SR, true)
    wav.setUint32(28, SR * 4, true); wav.setUint16(32, 4, true); wav.setUint16(34, 16, true); str(36, 'data'); wav.setUint32(40, n * 4, true)
    for (let i = 0; i < n; i++) {
        const t = i / SR, fade = Math.min(1, t / 0.4, (duration - t) / 1.2)
        wav.setInt16(44 + i * 4, Math.tanh(L[i] * fade * 1.4) * 0.85 * 32767, true)
        wav.setInt16(46 + i * 4, Math.tanh(R[i] * fade * 1.4) * 0.85 * 32767, true)
    }
    return new Uint8Array(wav.buffer)
}
