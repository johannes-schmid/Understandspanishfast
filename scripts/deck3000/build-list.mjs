// Builds the lemma-ranked candidate pool for words 1,501–3,000.
// Usage: node scripts/deck3000/build-list.mjs
// Output: scripts/deck3000/candidates.json (ranked lemmas not already in data/words.json)
import fs from 'node:fs'
import path from 'node:path'

const DIR = 'scripts/deck3000'
const CACHE = path.join(DIR, '.cache')
const SOURCES = {
  freq: {
    url: 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/es/es_50k.txt',
    file: 'es_50k.txt',
  },
  lemmas: {
    url: 'https://raw.githubusercontent.com/michmech/lemmatization-lists/master/lemmatization-es.txt',
    file: 'lemmatization-es.txt',
  },
}
const POOL_SIZE = 3500

fs.mkdirSync(CACHE, { recursive: true })

async function load({ url, file }) {
  const p = path.join(CACHE, file)
  if (!fs.existsSync(p)) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`${url}: ${res.status}`)
    fs.writeFileSync(p, await res.text())
  }
  return fs.readFileSync(p, 'utf8').replace(/^﻿/, '').split(/\r?\n/).filter(Boolean)
}

const freqLines = await load(SOURCES.freq)
const lemmaLines = await load(SOURCES.lemmas)

const formToLemmas = new Map()
const isLemma = new Set()
for (const line of lemmaLines) {
  const [lemma, form] = line.split('\t')
  if (!lemma || !form) continue
  isLemma.add(lemma)
  if (!formToLemmas.has(form)) formToLemmas.set(form, [])
  formToLemmas.get(form).push(lemma)
}

const surfaceFreq = new Map()
for (const line of freqLines) {
  const [f, n] = line.split(' ')
  surfaceFreq.set(f, Number(n))
}

function lemmatize(form) {
  const options = [...new Set([...(isLemma.has(form) ? [form] : []), ...(formToLemmas.get(form) ?? [])])]
  if (!options.length) return form
  return options.sort((a, b) => (surfaceFreq.get(b) ?? 0) - (surfaceFreq.get(a) ?? 0))[0]
}

const strip = (w) => w.toLowerCase().replace(/^(un|una|el|la|los|las|unos|unas)\s+/, '').trim()
const existing = JSON.parse(fs.readFileSync('data/words.json', 'utf8'))
const known = new Set()
for (const w of existing) {
  const base = strip(w.word)
  known.add(base)
  known.add(lemmatize(base))
  if (base.endsWith('se') && / /.test(base) === false) known.add(base.slice(0, -2))
}

const lemmas = new Map()
for (const [i, line] of freqLines.entries()) {
  const [form, n] = line.split(' ')
  const count = Number(n)
  if (!form || !count) continue
  if (!/^[a-záéíóúüñ]+$/.test(form)) continue
  if (form.length < 2 && !['a', 'o', 'y', 'e', 'u'].includes(form)) continue
  const lemma = lemmatize(form)
  if (!lemmas.has(lemma)) lemmas.set(lemma, { lemma, count: 0, firstFormRank: i + 1, forms: [], inLexicon: isLemma.has(lemma) })
  const e = lemmas.get(lemma)
  e.count += count
  if (e.forms.length < 6) e.forms.push(form)
}

const ranked = [...lemmas.values()].sort((a, b) => b.count - a.count)
ranked.forEach((e, i) => { e.lemmaRank = i + 1 })
const pool = ranked.filter((e) => !known.has(e.lemma) && !e.forms.some((f) => known.has(f)))

for (const n of [500, 1000, 1500, 2000, 2500, 3000]) {
  const top = ranked.slice(0, n)
  console.log(`source lemma rank <= ${n}: ${top.filter((e) => known.has(e.lemma) || e.forms.some((f) => known.has(f))).length} already in words.json`)
}
const out = pool.slice(0, POOL_SIZE).map(({ lemma, count, lemmaRank, forms, inLexicon }) => ({ lemma, count, lemmaRank, forms, inLexicon }))
fs.writeFileSync(path.join(DIR, 'candidates.json'), JSON.stringify(out, null, 1))
console.log(`${freqLines.length} surface forms -> ${ranked.length} lemmas; ${known.size} known keys; pool ${pool.length}; wrote ${out.length}`)
console.log('first 60:', out.slice(0, 60).map((e) => `${e.lemma}(${e.forms.slice(0, 3).join('/')})`).join(', '))
