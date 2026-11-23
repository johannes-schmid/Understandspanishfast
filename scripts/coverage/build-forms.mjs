// Builds public/coverage/forms.json: inflected form -> rank in data/words.json.
// Forms come from the open lemmatization-lists dataset (Michal Měchura, ODbL 1.0,
// https://github.com/michmech/lemmatization-lists), plus rule-based plurals,
// adjective agreement and regular verb conjugations as a fallback.
//
// Run: PATH="/opt/homebrew/bin:$PATH" node scripts/coverage/build-forms.mjs
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { FUNCTION_WORDS, stripAccents } from '../../components/CoverageEngine.js'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const LEMMA_URL = 'https://raw.githubusercontent.com/michmech/lemmatization-lists/master/lemmatization-es.txt'
const CACHE = path.join(os.tmpdir(), 'lemmatization-es.txt')
const OUT = path.join(ROOT, 'public/coverage/forms.json')

// sólo (#51) and solo (#76) are the same word; count both spellings as #51.
const SAME_AS = { 76: 51 }

const MULTIWORD = { 'de acuerdo': 'acuerdo', 'a través de': 'través', 'respecto a': 'respecto', 'de repente': 'repente', 'a menudo': 'menudo' }

// Forms that belong to a list word but that the dataset maps elsewhere or misses.
const EXTRA = {
  usted: ['ustedes'],
  él: ['ellas'],
  ella: ['ellas'],
  nosotros: ['nosotras'],
  este: ['estos', 'estas', 'esta'],
  ese: ['esos', 'esas', 'esa'],
  aquel: ['aquella', 'aquellos', 'aquellas', 'aquello'],
  eso: ['esa'],
  todo: ['toda', 'todos', 'todas'],
  mucho: ['mucha', 'muchos', 'muchas'],
  poco: ['poca', 'pocos', 'pocas'],
  otro: ['otra', 'otros', 'otras'],
  alguno: ['algún', 'alguna', 'algunos', 'algunas'],
  ninguno: ['ningún', 'ninguna', 'ningunos', 'ningunas'],
  tanto: ['tanta', 'tantos', 'tantas', 'tan'],
  nuestro: ['nuestra', 'nuestros', 'nuestras'],
  tu: ['tus'],
  mío: ['mía', 'míos', 'mías'],
  tuyo: ['tuya', 'tuyos', 'tuyas'],
  suyo: ['suya', 'suyos', 'suyas'],
  cuál: ['cuáles'],
  quién: ['quiénes'],
  bueno: ['buen'],
  malo: ['mal'],
  grande: ['gran'],
  primero: ['primer'],
  tercero: ['tercer'],
  uno: ['un', 'una', 'unos', 'unas'],
}

async function loadDataset() {
  if (!fs.existsSync(CACHE)) {
    const res = await fetch(LEMMA_URL)
    if (!res.ok) throw new Error(`lemma list ${res.status}`)
    fs.writeFileSync(CACHE, await res.text())
  }
  const byLemma = new Map()
  for (const line of fs.readFileSync(CACHE, 'utf8').replace(/^﻿/, '').split(/\r?\n/)) {
    const [lemma, form] = line.split('\t')
    if (!lemma || !form || /[\s\d]/.test(form)) continue
    const l = lemma.toLowerCase()
    if (!byLemma.has(l)) byLemma.set(l, new Set())
    byLemma.get(l).add(form.toLowerCase())
  }
  return byLemma
}

function lemmasOf(entry) {
  const raw = entry.word.toLowerCase().trim()
  if (MULTIWORD[raw]) return [MULTIWORD[raw]]
  return raw
    .split(/\s+(?=(?:un|una)\s)/)
    .map((s) => s.replace(/^(un|una|el|la|los|las)\s+/, '').trim())
    .filter((s) => s && !s.includes(' '))
}

function plural(w) {
  if (/[aeiouáéó]$/.test(w)) return [w + 's']
  if (w.endsWith('z')) return [w.slice(0, -1) + 'ces']
  if (/[íú]$/.test(w)) return [w + 's', w + 'es']
  const unacc = w.replace(/á(?=[nsl]$)/, 'a').replace(/é(?=[nsl]$)/, 'e').replace(/í(?=[nsl]$)/, 'i').replace(/ó(?=[nsl]$)/, 'o').replace(/ú(?=[nsl]$)/, 'u')
  return [unacc + 'es']
}

function adjForms(w) {
  if (w.endsWith('o')) { const s = w.slice(0, -1); return [s + 'a', s + 'os', s + 'as'] }
  if (/(ón|or|án|ín)$/.test(w)) { const base = stripAccents(w); return [base + 'a', base + 'as', ...plural(w)] }
  return plural(w)
}

const ENDINGS = {
  ar: ['o', 'as', 'a', 'amos', 'áis', 'an', 'é', 'aste', 'ó', 'asteis', 'aron', 'aba', 'abas', 'ábamos', 'abais', 'aban', 'aré', 'arás', 'ará', 'aremos', 'aréis', 'arán', 'aría', 'arías', 'aríamos', 'aríais', 'arían', 'e', 'es', 'emos', 'éis', 'en', 'ara', 'aras', 'áramos', 'arais', 'aran', 'ase', 'ases', 'ásemos', 'aseis', 'asen', 'ando', 'ado', 'ada', 'ados', 'adas', 'ad', 'ar'],
  er: ['o', 'es', 'e', 'emos', 'éis', 'en', 'í', 'iste', 'ió', 'imos', 'isteis', 'ieron', 'ía', 'ías', 'íamos', 'íais', 'ían', 'eré', 'erás', 'erá', 'eremos', 'eréis', 'erán', 'ería', 'erías', 'eríamos', 'eríais', 'erían', 'a', 'as', 'amos', 'áis', 'an', 'iera', 'ieras', 'iéramos', 'ierais', 'ieran', 'iese', 'ieses', 'iésemos', 'ieseis', 'iesen', 'iendo', 'ido', 'ida', 'idos', 'idas', 'ed', 'er'],
  ir: ['o', 'es', 'e', 'imos', 'ís', 'en', 'í', 'iste', 'ió', 'isteis', 'ieron', 'ía', 'ías', 'íamos', 'íais', 'ían', 'iré', 'irás', 'irá', 'iremos', 'iréis', 'irán', 'iría', 'irías', 'iríamos', 'iríais', 'irían', 'a', 'as', 'amos', 'áis', 'an', 'iera', 'ieras', 'iéramos', 'ierais', 'ieran', 'iese', 'ieses', 'iésemos', 'ieseis', 'iesen', 'iendo', 'ido', 'ida', 'idos', 'idas', 'id', 'ir'],
}

function regularVerb(inf) {
  const base = inf.replace(/se$/, '')
  const m = base.match(/^(.*)(ar|er|ir|ír)$/)
  if (!m) return []
  const cls = m[2] === 'ír' ? 'ir' : m[2]
  return ENDINGS[cls].map((e) => m[1] + e)
}

async function main() {
  const words = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/words.json'), 'utf8'))
  const dataset = await loadDataset()
  const best = new Map()
  const add = (form, rank, weak = false) => {
    const f = form.toLowerCase()
    if (!f || FUNCTION_WORDS.has(f)) return
    const cur = best.get(f)
    if (cur === undefined || (!weak && rank < cur)) best.set(f, rank)
  }

  const lemmas = []
  let fromDataset = 0
  let fromRules = 0
  for (const w of words) {
    const ls = lemmasOf(w)
    const rank = SAME_AS[w.rank] || w.rank
    lemmas[w.rank - 1] = [w.word.replace(/^(un|una|el|la) /, '').replace(/^(.+) (?:un|una) (.+)$/, (m, a, b) => (a === b ? a : `${a} / ${b}`)), Array.isArray(w.meanings) ? w.meanings[0] : w.meanings, w.pos === 'v.' ? 1 : 0]
    for (const l of ls) {
      add(l, rank)
      const ds = dataset.get(l)
      if (ds && ds.size) { fromDataset++; for (const f of ds) add(f, rank) }
      for (const f of EXTRA[l] || []) add(f, rank)
      let rules = []
      if (w.pos === 'v.') { if (!ds || ds.size < 30) rules = regularVerb(l) }
      else if (w.pos === 'adj.' || w.pos === 'det.') rules = adjForms(l)
      else if (w.pos.startsWith('n')) rules = plural(l)
      if (rules.length) fromRules++
      for (const f of rules) add(f, rank)
    }
  }
  best.set('sé', 13)
  // Accent-less spellings are common in subtitles; add them without overriding real forms.
  for (const [f, r] of [...best]) { const u = stripAccents(f); if (u !== f) add(u, r, true) }

  const byRank = {}
  for (const [f, r] of best) (byRank[r] ||= []).push(f)
  const forms = {}
  for (const r of Object.keys(byRank).sort((a, b) => a - b)) forms[r] = byRank[r].sort().join(' ')

  fs.mkdirSync(path.dirname(OUT), { recursive: true })
  fs.writeFileSync(OUT, JSON.stringify({ v: 1, source: 'lemmatization-lists (ODbL 1.0) + rules', lemmas, forms }))
  const kb = (fs.statSync(OUT).size / 1024).toFixed(0)
  console.log(`forms: ${best.size} → ${path.relative(ROOT, OUT)} (${kb} kB). dataset lemmas: ${fromDataset}, rule fallbacks: ${fromRules}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
