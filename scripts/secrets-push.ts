/**
 * Push .env (production, git-ignored) secrets to the deployed website Worker (bukuresipi-web).
 * Copied from bukuresipi-hono scripts/secrets-push.ts. .env also holds the build settings (PUBLIC_*): those are
 * baked into the public HTML/JS by `astro build`, so they are skipped here, never pushed as secrets.
 *
 *   bun run secrets:push              # .env
 *   bun run secrets:push other.env    # another file
 *   bun run secrets:push --dry-run    # names only, nothing sent
 *
 * - Empty values are skipped, so a blank line never wipes a live secret.
 * - Names that are wrangler.jsonc "vars" are refused (Cloudflare rejects the clash).
 * - PUBLIC_* names are skipped (build settings, read by astro build).
 * - Names the Worker doesn't read (worker/index.ts `env`) are pushed with a warning.
 * - One `wrangler secret bulk` call; if that fails, falls back to one
 *   `wrangler secret put` per key so one bad key can't block the rest.
 * - Values go to wrangler over stdin only - never argv, never a temp file, never logged.
 * - Exit 1 if anything was refused or failed.
 */
const ROOT = `${import.meta.dir}/..`

/** KEY=value lines; `export`, # comments, and "double" / 'single' quotes (single keeps JSON intact). */
export const parseEnv = (text: string): { values: Record<string, string>; badLines: number[] } => {
    const values: Record<string, string> = {}
    const badLines: number[] = []
    text.split(/\r?\n/).forEach((raw, i) => {
        const line = raw.trim()
        if (!line || line.startsWith('#')) return
        const m = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
        if (!m) return void badLines.push(i + 1)
        let value = m[2]
        const q = value[0]
        if ((q === '"' || q === "'") && value.length >= 2 && value.endsWith(q)) {
            value = value.slice(1, -1)
            if (q === '"') value = value.replace(/\\n/g, '\n').replace(/\\"/g, '"')
        } else {
            value = value.replace(/\s+#.*$/, '').trim()
        }
        values[m[1]] = value
    })
    return { values, badLines }
}

/** Sort parsed keys into what gets pushed and why the rest doesn't. */
export const plan = (values: Record<string, string>, wranglerConfig: string, bindings: string) => {
    const push: Record<string, string> = {}
    const empty: string[] = [], clashes: string[] = [], unknown: string[] = [], build: string[] = []
    for (const [key, value] of Object.entries(values)) {
        if (key.startsWith('PUBLIC_')) { build.push(key); continue }
        if (!value) { empty.push(key); continue }
        if (new RegExp(`"${key}"\\s*:`).test(wranglerConfig)) { clashes.push(key); continue }
        if (!new RegExp(`\\b${key}\\??:`).test(bindings)) unknown.push(key)
        push[key] = value
    }
    return { push, empty, clashes, unknown, build }
}

const wrangler = async (args: string[], stdin?: string) => {
    const proc = Bun.spawn(['npx', 'wrangler', ...args], {
        cwd: ROOT,
        stdin: stdin === undefined ? 'ignore' : new Blob([stdin]),
        stdout: 'pipe',
        stderr: 'pipe',
    })
    const [out, err, code] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited])
    return { ok: code === 0, out, err }
}

const main = async () => {
    const args = Bun.argv.slice(2)
    const dryRun = args.includes('--dry-run')
    const file = args.find(a => !a.startsWith('--')) ?? '.env'
    const path = file.startsWith('/') ? file : `${ROOT}/${file}`
    const die = (msg: string): never => { console.error(`secrets:push: ${msg}`); process.exit(1) }

    const src = Bun.file(path)
    if (!(await src.exists())) die(`${file} not found - create it with KEY=value lines`)

    const { values, badLines } = parseEnv(await src.text())
    for (const n of badLines) console.warn(`  ! ${file}:${n} is not KEY=value - ignored`)

    const { push, empty, clashes, unknown, build } = plan(
        values,
        await Bun.file(`${ROOT}/wrangler.jsonc`).text(),
        await Bun.file(`${ROOT}/worker/index.ts`).text(),
    )
    const names = Object.keys(push)
    if (build.length) console.log(`  - skipped (build settings, not secrets): ${build.join(', ')}`)
    if (empty.length) console.log(`  - skipped (empty): ${empty.join(', ')}`)
    for (const k of clashes) console.error(`  ✗ ${k} is a wrangler.jsonc var - change it there, not as a secret`)
    for (const k of unknown) console.warn(`  ! ${k} is not read in worker/index.ts - typo?`)

    if (names.length === 0) die('nothing to push')
    console.log(`  → ${dryRun ? 'would push' : 'pushing'}: ${names.join(', ')}`)
    if (dryRun) process.exit(clashes.length ? 1 : 0)

    if (!(await wrangler(['whoami'])).out.includes('You are logged in')) die('wrangler is not logged in - run `npx wrangler login`')

    const failed: string[] = []
    const bulk = await wrangler(['secret', 'bulk'], JSON.stringify(push))
    if (bulk.ok) {
        console.log(`  ✓ bulk upload: ${names.length} secret(s)`)
    } else {
        console.warn(`  ! bulk upload failed, falling back to one key at a time\n${bulk.err.trim()}`)
        for (const key of names) {
            const put = await wrangler(['secret', 'put', key], push[key])
            if (put.ok) console.log(`  ✓ ${key}`)
            else { failed.push(key); console.error(`  ✗ ${key}\n${put.err.trim()}`) }
        }
    }

    // Best-effort: remote secrets the Worker no longer reads.
    const list = await wrangler(['secret', 'list'])
    try {
        const remote = JSON.parse(list.out.slice(list.out.indexOf('['))) as { name: string }[]
        const bindings = await Bun.file(`${ROOT}/worker/index.ts`).text()
        const stale = remote.map(s => s.name).filter(n => !new RegExp(`\\b${n}\\??:`).test(bindings))
        if (stale.length) console.warn(`  ! on Cloudflare but unused by the Worker: ${stale.join(', ')} (npx wrangler secret delete <NAME>)`)
    } catch {
        console.warn('  ! could not read the remote secret list - skipped the stale check')
    }

    if (failed.length || clashes.length) die(`not pushed: ${[...failed, ...clashes].join(', ')}`)
    console.log('secrets:push: done')
}

if (import.meta.main) await main()
