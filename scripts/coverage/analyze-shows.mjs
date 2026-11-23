// Computes vocabulary coverage per show/podcast and writes data/shows.json.
// Only derived statistics and short word lists are written; subtitle and
// transcript text stays in a temp cache outside the repo and is never committed.
//
// Sources:
//  - TV shows: Spanish subtitles from the OPUS OpenSubtitles corpus (v2018 / v2024,
//    Lison & Tiedemann 2016, http://www.opensubtitles.org/), read file-by-file from
//    the public raw zip with HTTP range requests. Files are listed in sources.json.
//  - Podcasts: public episode transcripts listed in sources.json.
//
// Run: PATH="/opt/homebrew/bin:$PATH" node scripts/coverage/analyze-shows.mjs [--verbose]
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import zlib from 'node:zlib'
import crypto from 'node:crypto'
import { analyze, buildIndex, lookup, LEVELS } from '../../components/CoverageEngine.js'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const CACHE = path.join(os.tmpdir(), 'mcs-coverage-cache')
const VERBOSE = process.argv.includes('--verbose')
fs.mkdirSync(CACHE, { recursive: true })

const sources = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/coverage/sources.json'), 'utf8'))
const meta = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/coverage/shows.meta.json'), 'utf8'))
const idx = buildIndex(JSON.parse(fs.readFileSync(path.join(ROOT, 'public/coverage/forms.json'), 'utf8')))

// Subtitle typos that glue two words together (porfavor, ysi, aver) are not vocabulary.
function joined(w) {
  for (let i = 1; i < w.length - 1; i++) {
    const rest = w.slice(i)
    if (lookup(w.slice(0, i), idx) === 0 && (rest === 'favor' || lookup(rest, idx) !== null)) return true
  }
  return false
}

function cached(key, fn) {
  const f = path.join(CACHE, crypto.createHash('sha1').update(key).digest('hex'))
  if (fs.existsSync(f)) return Promise.resolve(fs.readFileSync(f, 'utf8'))
  return fn().then((t) => { fs.writeFileSync(f, t); return t })
}

const secs = (t) => { const [h, m, x] = t.split(':'); return h * 3600 + m * 60 + Number(x.replace(',', '.')) }

// Returns the subtitle lines plus the seconds of on-screen dialogue (sum of subtitle block durations).
async function opusFile(url, rec) {
  const raw = await cached(url + rec.path + ':timed', async () => {
    const nameLen = Buffer.byteLength(rec.path)
    const end = rec.off + 30 + nameLen + 1024 + rec.cs
    const res = await fetch(url, { headers: { Range: `bytes=${rec.off}-${end}` } })
    if (res.status !== 206) throw new Error(`range ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    const start = 30 + buf.readUInt16LE(26) + buf.readUInt16LE(28)
    const xml = zlib.inflateRawSync(buf.subarray(start, start + rec.cs)).toString('utf8')
    let seconds = 0
    for (const m of xml.matchAll(/<s id="[^"]*">([\s\S]*?)<\/s>/g)) {
      const t = [...m[1].matchAll(/value="(\d\d:\d\d:\d\d,\d+)"/g)].map((x) => secs(x[1]))
      if (t.length >= 2) { const d = t[t.length - 1] - t[0]; if (d > 0 && d < 20) seconds += d }
    }
    const text = xml.split('\n').filter((l) => l.trim() && !l.trim().startsWith('<')).join('\n')
    return JSON.stringify({ text, seconds: Math.round(seconds) })
  })
  return JSON.parse(raw)
}

async function transcript(url) {
  return cached(url, async () => {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (coverage stats)' } })
    if (!res.ok) throw new Error(`${url} ${res.status}`)
    const html = await res.text()
    const paras = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)]
      .map((m) => m[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&#8217;|&rsquo;/g, '’').replace(/&#8220;|&#8221;|&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#\d+;/g, ' ').trim())
      .filter(Boolean)
    // Drop site boilerplate before the episode starts and the credits after it ends.
    const first = paras.findIndex((p) => /^\[[^\]]+\]:/.test(p))
    let last = paras.length
    for (let i = paras.length - 1; i > first; i--) if (/^\[[^\]]+\]:/.test(paras[i])) { last = i + 1; break }
    return paras.slice(Math.max(first, 0), last).map((p) => p.replace(/^\[[^\]]+\]:\s*/, '')).join('\n')
  })
}

function sentencesOverlap(a, b) {
  const sa = new Set(a.split('\n').slice(0, 200))
  let same = 0
  const lb = b.split('\n').slice(0, 200)
  for (const l of lb) if (sa.has(l)) same++
  return same / Math.max(1, lb.length)
}

// Easiness 1–100: vocabulary coverage at 1,500 words (60%), speaking speed (25%), rare-word variety (15%),
// each scaled between the 5th and 95th percentile of all titles. Level bands follow the score.
function score(out) {
  const q = (arr, p) => { const a = [...arr].sort((x, y) => x - y); return a[Math.min(a.length - 1, Math.max(0, Math.round(p * (a.length - 1))))] }
  const scale = (vals, v, higherIsEasier) => {
    const lo = q(vals, 0.05)
    const hi = q(vals, 0.95)
    const t = Math.min(1, Math.max(0, (v - lo) / (hi - lo || 1)))
    return higherIsEasier ? t : 1 - t
  }
  const cov = out.map((s) => s.coverage[1500])
  const wpm = out.filter((s) => s.wpm).map((s) => s.wpm)
  const medWpm = q(wpm, 0.5)
  const rare = out.map((s) => s.rarePer1000)
  for (const s of out) {
    const t = 0.6 * scale(cov, s.coverage[1500], true) + 0.25 * scale(wpm, s.wpm || medWpm, false) + 0.15 * scale(rare, s.rarePer1000, false)
    s.easiness = Math.max(1, Math.min(99, Math.round(4 + t * 94)))
    const [level, cefr] = s.easiness >= 70 ? ['Easy', 'A2–B1'] : s.easiness >= 50 ? ['Medium', 'B1'] : s.easiness >= 30 ? ['Hard', 'B2'] : ['Very hard', 'C1']
    s.level = level
    s.cefr = cefr
  }
}

async function main() {
  const out = []
  for (const [slug, src] of Object.entries(sources.shows)) {
    const m = meta[slug]
    if (!m) continue
    const texts = []
    const used = []
    let seconds = 0
    if (src.transcripts) {
      for (const t of src.transcripts) {
        try { texts.push(await transcript(t)); used.push(t) } catch (e) { console.warn(slug, e.message) }
      }
    } else {
      for (const rec of src.files) {
        const url = sources.urls[rec.v]
        let text
        let dur
        try { ({ text, seconds: dur } = await opusFile(url, rec)) } catch (e) { console.warn(slug, rec.path, e.message); continue }
        const lines = text.split('\n').length
        if (lines < 250) continue
        if (texts.some((t) => sentencesOverlap(t, text) > 0.3)) continue
        texts.push(text)
        seconds += dur
        used.push(rec.season && rec.season !== '?' ? `S${rec.season}E${rec.episode}` : rec.imdb)
      }
    }
    if (texts.length < (src.film ? 1 : 3)) { console.warn(`skip ${slug}: only ${texts.length} usable files`); continue }
    const r = analyze(texts.join('\n'), idx, { subtitles: !src.transcripts, topUncovered: 40 })
    if (r.total < 4000) { console.warn(`skip ${slug}: only ${r.total} words`); continue }
    // Rare-word variety on a fixed 5,000-word window so long and short samples compare fairly.
    const all = texts.join('\n').split('\n')
    let n = 0
    const window = []
    for (const line of all) { if (n >= 5000) break; window.push(line); n += line.split(/\s+/).filter(Boolean).length }
    const rw = analyze(window.join('\n'), idx, { subtitles: !src.transcripts, topUncovered: 2000 })
    const rarePer1000 = Math.round((rw.missing[1500].filter((g) => !g.rank && g.capShare < 0.5).length / rw.total) * 10000) / 10
    const wpmRaw = seconds > 600 ? Math.round(r.total / (seconds / 60)) : null
    const pick = (L, n) => r.missing[L].slice(0, n).map((g) => (g.rank ? { w: g.word, rank: g.rank, meaning: g.meaning, n: g.n } : { w: g.word, n: g.n }))
    out.push({
      slug,
      ...m,
      sample: { units: texts.length, unitLabel: src.transcripts ? 'episode transcripts' : src.film ? 'film' : 'episodes', words: r.total, uniqueForms: r.unique },
      wpm: wpmRaw && wpmRaw >= 90 && wpmRaw <= 400 ? wpmRaw : null,
      rarePer1000,
      coverage: Object.fromEntries(LEVELS.map((L) => [L, Math.round(r.coverage[L] * 1000) / 10])),
      listOnly: Object.fromEntries(LEVELS.map((L) => [L, Math.round(r.listOnly[L] * 1000) / 10])),
      functionShare: Math.round(r.functionShare * 1000) / 10,
      nextWords: r.missing[1000].filter((g) => g.rank && g.capShare < 0.5).map((g) => ({ w: g.word, rank: g.rank, meaning: g.meaning, n: g.n })).slice(0, 12),
      beyondList: r.missing[1500].slice(0, 40).filter((g) => !g.rank && g.n >= 3 && g.capShare < 0.5 && g.word.length > 1 && !joined(g.word)).slice(0, 15).map((g) => ({ w: g.word, n: g.n })),
    })
    console.log(`${slug.padEnd(26)} ${String(texts.length).padStart(2)} files ${String(r.total).padStart(7)} words  ` + LEVELS.map((L) => `${L}:${(r.coverage[L] * 100).toFixed(1)}%`).join('  ') + `  | list only ` + LEVELS.map((L) => `${(r.listOnly[L] * 100).toFixed(1)}`).join('/') + ` | fn ${(r.functionShare * 100).toFixed(1)}%`)
    if (VERBOSE) console.log('   missing@1500:', r.missing[1500].slice(0, 30).map((g) => `${g.word}(${g.n})`).join(' '), '\n   used:', used.join(' '))
  }
  score(out)
  out.sort((a, b) => b.easiness - a.easiness || b.coverage[1500] - a.coverage[1500])
  out.forEach((s, i) => { s.difficultyRank = i + 1 })
  fs.writeFileSync(path.join(ROOT, 'data/shows.json'), JSON.stringify({ updated: '2026-11-23', shows: out }, null, 1) + '\n')
  console.log(`wrote data/shows.json (${out.length} titles)`)
}

main().catch((e) => { console.error(e); process.exit(1) })
