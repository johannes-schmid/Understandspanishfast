// Vocabulary checker for graded readers.
// Usage: node scripts/readers/check.mjs <story.json|story.txt> [--level 1|2]
// Level 1 = ranks 1–500, level 2 = ranks 1–1,000 of data/words.json, plus a fixed set of grammar words.
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { buildFormMap, stripClitics, deaccent, GRAMMAR } from './inflect.mjs'

export const LEVELS = { 1: 500, 2: 1500 }
const words = JSON.parse(fs.readFileSync(new URL('../../data/words.json', import.meta.url), 'utf8'))
const FORMS = buildFormMap(words)
const WORD = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g

export function lookup(tok) {
  const t = tok.toLowerCase()
  if (GRAMMAR.has(t)) return { rank: 0, lemma: t, grammar: true }
  const direct = FORMS.get(t)
  if (direct) return direct
  const cl = stripClitics(t, (x) => FORMS.get(x))
  if (cl) return cl
  const da = FORMS.get(deaccent(t))
  if (da && deaccent(t) !== t) return { ...da, viaDeaccent: true }
  return null
}

// paragraphs: string[]; opts: { level, names: string[], glossary: [{ word }] }
export function check(paragraphs, { level = 1, names = [], glossary = [] } = {}) {
  const limit = LEVELS[level]
  const nameSet = new Set(names.flatMap((n) => n.toLowerCase().split(/\s+/)))
  const glossSet = new Set(glossary.flatMap((g) => [g.word, g.form, ...(g.forms || [])].filter(Boolean).map((x) => x.toLowerCase())))
  const stats = { tokens: 0, names: 0, grammar: 0, inList: 0, glossed: 0, out: 0 }
  const outOfList = new Map()
  const lemmas = new Map()
  for (const p of paragraphs) {
    const sentences = p.split(/(?<=[.!?¡¿…:—"«»])\s*/)
    for (const s of sentences) {
      let first = true
      for (const m of s.matchAll(WORD)) {
        const tok = m[0]
        stats.tokens++
        const low = tok.toLowerCase()
        const hit = lookup(tok)
        const isName = nameSet.has(low) || (!first && /^[A-ZÁÉÍÓÚÑ]/.test(tok) && !(hit && hit.rank <= limit))
        first = false
        if (isName) { stats.names++; continue }
        if (hit?.grammar) { stats.grammar++; continue }
        if (hit && hit.rank <= limit) {
          stats.inList++
          const l = lemmas.get(hit.lemma) || { lemma: hit.lemma, rank: hit.rank, count: 0 }
          l.count++; lemmas.set(hit.lemma, l)
          continue
        }
        const glossed = glossSet.has(low) || (hit && glossSet.has(hit.lemma))
        if (glossed) stats.glossed++
        else stats.out++
        const key = hit ? hit.lemma : low
        const o = outOfList.get(key) || { lemma: key, rank: hit?.rank ?? null, forms: new Set(), count: 0, glossed }
        o.forms.add(low); o.count++; outOfList.set(key, o)
      }
    }
  }
  const counted = stats.tokens - stats.names
  const known = stats.grammar + stats.inList
  return {
    level,
    rankLimit: limit,
    ...stats,
    words: counted,
    coverage: +(100 * known / counted).toFixed(2),
    glossedPct: +(100 * stats.glossed / counted).toFixed(2),
    unglossed: stats.out,
    uniqueLemmas: lemmas.size,
    lemmasUsed: [...lemmas.values()].sort((a, b) => a.rank - b.rank),
    outOfList: [...outOfList.values()].map((o) => ({ ...o, forms: [...o.forms] })).sort((a, b) => b.count - a.count),
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const file = process.argv[2]
  const level = Number(process.argv.includes('--level') ? process.argv[process.argv.indexOf('--level') + 1] : 1)
  if (!file) { console.error('usage: check.mjs <story.json|story.txt> [--level 1|2]'); process.exit(1) }
  const raw = fs.readFileSync(file, 'utf8')
  let story = { paragraphs: raw.split(/\n\s*\n/) }
  if (file.endsWith('.json')) story = JSON.parse(raw)
  const paras = story.paragraphs || story.text
  const r = check(paras, { level: story.level || level, names: story.names || [], glossary: story.glossary || [] })
  console.log(`Level ${r.level} (ranks 1–${r.rankLimit}) · ${r.words} words (+${r.names} name tokens)`)
  console.log(`Coverage: ${r.coverage}%  (list ${r.inList}, grammar ${r.grammar}) · glossed ${r.glossed} (${r.glossedPct}%) · unglossed ${r.unglossed}`)
  console.log(`Unique list words used: ${r.uniqueLemmas}`)
  if (r.outOfList.length) {
    console.log('Out of list:')
    for (const o of r.outOfList) console.log(`  ${o.glossed ? '[glossed]' : '[MISSING]'} ${o.lemma}${o.rank ? ` (#${o.rank})` : ''} ×${o.count}: ${o.forms.join(', ')}`)
  }
  process.exitCode = r.coverage >= 98 && r.unglossed === 0 ? 0 : 2
}
