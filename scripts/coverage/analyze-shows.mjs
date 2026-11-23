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

async function opusFile(url, rec) {
  return cached(url + rec.path, async () => {
    const nameLen = Buffer.byteLength(rec.path)
    const end = rec.off + 30 + nameLen + 1024 + rec.cs
    const res = await fetch(url, { headers: { Range: `bytes=${rec.off}-${end}` } })
    if (res.status !== 206) throw new Error(`range ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    const start = 30 + buf.readUInt16LE(26) + buf.readUInt16LE(28)
    const xml = zlib.inflateRawSync(buf.subarray(start, start + rec.cs)).toString('utf8')
    // Keep only the subtitle lines (text between the <time> markers).
    return xml.split('\n').filter((l) => l.trim() && !l.trim().startsWith('<')).join('\n')
  })
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

async function main() {
  const out = []
  for (const [slug, src] of Object.entries(sources.shows)) {
    const m = meta[slug]
    if (!m) continue
    const texts = []
    const used = []
    if (src.transcripts) {
      for (const t of src.transcripts) {
        try { texts.push(await transcript(t)); used.push(t) } catch (e) { console.warn(slug, e.message) }
      }
    } else {
      for (const rec of src.files) {
        const url = sources.urls[rec.v]
        let text
        try { text = await opusFile(url, rec) } catch (e) { console.warn(slug, rec.path, e.message); continue }
        const lines = text.split('\n').length
        if (lines < 250) continue
        if (texts.some((t) => sentencesOverlap(t, text) > 0.3)) continue
        texts.push(text)
        used.push(rec.season && rec.season !== '?' ? `S${rec.season}E${rec.episode}` : rec.imdb)
      }
    }
    if (texts.length < 3) { console.warn(`skip ${slug}: only ${texts.length} usable files`); continue }
    const r = analyze(texts.join('\n'), idx, { subtitles: !src.transcripts, topUncovered: 40 })
    const pick = (L, n) => r.missing[L].slice(0, n).map((g) => (g.rank ? { w: g.word, rank: g.rank, meaning: g.meaning, n: g.n } : { w: g.word, n: g.n }))
    out.push({
      slug,
      ...m,
      sample: { units: texts.length, unitLabel: src.transcripts ? 'episode transcripts' : 'episodes', words: r.total, uniqueForms: r.unique },
      coverage: Object.fromEntries(LEVELS.map((L) => [L, Math.round(r.coverage[L] * 1000) / 10])),
      listOnly: Object.fromEntries(LEVELS.map((L) => [L, Math.round(r.listOnly[L] * 1000) / 10])),
      functionShare: Math.round(r.functionShare * 1000) / 10,
      nextWords: r.missing[1000].filter((g) => g.rank && g.capShare < 0.5).map((g) => ({ w: g.word, rank: g.rank, meaning: g.meaning, n: g.n })).slice(0, 12),
      beyondList: r.missing[1500].slice(0, 40).filter((g) => !g.rank && g.n >= 3 && g.capShare < 0.5 && g.word.length > 1 && !joined(g.word)).slice(0, 15).map((g) => ({ w: g.word, n: g.n })),
    })
    console.log(`${slug.padEnd(26)} ${String(texts.length).padStart(2)} files ${String(r.total).padStart(7)} words  ` + LEVELS.map((L) => `${L}:${(r.coverage[L] * 100).toFixed(1)}%`).join('  ') + `  | list only ` + LEVELS.map((L) => `${(r.listOnly[L] * 100).toFixed(1)}`).join('/') + ` | fn ${(r.functionShare * 100).toFixed(1)}%`)
    if (VERBOSE) console.log('   missing@1500:', r.missing[1500].slice(0, 30).map((g) => `${g.word}(${g.n})`).join(' '), '\n   used:', used.join(' '))
  }
  out.sort((a, b) => b.coverage[1500] - a.coverage[1500] || b.coverage[1000] - a.coverage[1000])
  out.forEach((s, i) => { s.difficultyRank = i + 1 })
  fs.writeFileSync(path.join(ROOT, 'data/shows.json'), JSON.stringify({ updated: '2026-11-23', shows: out }, null, 1) + '\n')
  console.log(`wrote data/shows.json (${out.length} titles)`)
}

main().catch((e) => { console.error(e); process.exit(1) })
