// Finds candidate titles (scripts/coverage/candidates.json) in the OPUS Spanish subtitle corpus and
// adds them to sources.json + shows.meta.json. IMDb IDs come from the public IMDb title lists
// (title.basics / title.episode), downloaded to the temp cache and used only to look up IDs.
// Run: PATH="/opt/homebrew/bin:$PATH" node scripts/coverage/find-titles.mjs
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import zlib from 'node:zlib'
import readline from 'node:readline'
import { opusIndex } from './opus-index.mjs'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const CACHE = path.join(os.tmpdir(), 'mcs-coverage-cache')
const MAX_EPISODES = 14
const ACCENT = {
  Spain: 'Castilian Spanish (Spain)',
  'Spain / Mexico': 'Castilian Spanish (Spain)',
  Mexico: 'Mexican Spanish',
  'Mexico / USA': 'Mexican Spanish',
  Colombia: 'Colombian Spanish',
  Argentina: 'Rioplatense Spanish (Argentina)',
  Chile: 'Chilean Spanish',
  Cuba: 'Cuban Spanish',
  Peru: 'Peruvian Spanish',
  Venezuela: 'Venezuelan Spanish',
}
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

async function* tsv(file) {
  const rl = readline.createInterface({ input: fs.createReadStream(path.join(CACHE, file)).pipe(zlib.createGunzip()), crlfDelay: Infinity })
  let first = true
  for await (const line of rl) {
    if (first) { first = false; continue }
    yield line.split('\t')
  }
}

const candidates = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/coverage/candidates.json'), 'utf8'))
const sourcesFile = path.join(ROOT, 'scripts/coverage/sources.json')
const metaFile = path.join(ROOT, 'scripts/coverage/shows.meta.json')
const sources = JSON.parse(fs.readFileSync(sourcesFile, 'utf8'))
const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'))
const todo = candidates.filter(([slug]) => !sources.shows[slug])
const index = await opusIndex()
const num = (tt) => String(Number(tt.slice(2)))

const byTitle = new Map()
for (const c of todo) {
  const k = norm(c[1])
  if (!byTitle.has(k)) byTitle.set(k, [])
  byTitle.get(k).push(c)
}
const matches = new Map()
for await (const [tconst, type, primary, original, , start, end] of tsv('title.basics.tsv.gz')) {
  const film = type === 'movie'
  if (!film && type !== 'tvSeries' && type !== 'tvMiniSeries') continue
  for (const k of new Set([norm(primary), norm(original)])) {
    for (const c of byTitle.get(k) || []) {
      if ((c[3] === 'Film') !== film || Math.abs(Number(start) - c[5]) > 1) continue
      ;(matches.get(c[0]) || matches.set(c[0], []).get(c[0])).push({ tconst, start, end: end === '\\N' ? null : end })
    }
  }
}

const seriesIds = new Set([...matches.entries()].filter(([slug]) => todo.find((c) => c[0] === slug)[3] !== 'Film').flatMap(([, m]) => m.map((x) => x.tconst)))
const episodes = new Map()
for await (const [tconst, parent, season, ep] of tsv('title.episode.tsv.gz')) {
  if (!seriesIds.has(parent)) continue
  if (!episodes.has(parent)) episodes.set(parent, [])
  episodes.get(parent).push({ tconst, season, episode: ep })
}

const pickFile = (files) => [...files].sort((a, b) => b.us - a.us)[0]
let added = 0
for (const c of todo) {
  const [slug, title, english, type, country] = c
  const found = matches.get(slug) || []
  let best = null
  for (const m of found) {
    let files
    if (type === 'Film') {
      files = (index[num(m.tconst)] || []).sort((a, b) => b.us - a.us).slice(0, 3).map((f) => ({ imdb: m.tconst, ...f }))
    } else {
      const eps = (episodes.get(m.tconst) || []).filter((e) => index[num(e.tconst)])
      const bySeason = new Map()
      for (const e of eps) (bySeason.get(e.season) || bySeason.set(e.season, []).get(e.season)).push(e)
      for (const list of bySeason.values()) list.sort((a, b) => Number(a.episode) - Number(b.episode))
      const seasons = [...bySeason.values()]
      files = []
      for (let i = 0; files.length < MAX_EPISODES && seasons.some((s) => s[i]); i++) {
        for (const s of seasons) {
          if (s[i] && files.length < MAX_EPISODES) {
            const f = pickFile(index[num(s[i].tconst)])
            files.push({ season: s[i].season === '\\N' ? '?' : s[i].season, episode: s[i].episode === '\\N' ? '?' : s[i].episode, imdb: s[i].tconst, ...f })
          }
        }
      }
    }
    if (!best || files.length > best.files.length) best = { m, files }
  }
  const need = type === 'Film' ? 1 : 3
  if (!best || best.files.length < need) { console.log(`✗ ${slug.padEnd(40)} ${found.length ? `${best?.files.length || 0} subtitle files` : 'not on IMDb list'}`); continue }
  const strip = ({ year, ...f }) => f
  sources.shows[slug] = { imdb: best.m.tconst, ...(type === 'Film' ? { film: true } : {}), files: best.files.map(strip) }
  meta[slug] = { title, english, type, country, years: best.m.end && best.m.end !== best.m.start ? `${best.m.start}-${best.m.end}` : best.m.start, accent: ACCENT[country] }
  added++
  console.log(`✓ ${slug.padEnd(40)} ${best.m.tconst} ${best.files.length} files`)
}
fs.writeFileSync(sourcesFile, JSON.stringify(sources, null, 1) + '\n')
fs.writeFileSync(metaFile, JSON.stringify(meta, null, 1) + '\n')
console.log(`added ${added} of ${todo.length}`)
