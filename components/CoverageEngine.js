// Pure tokenizer + coverage math, shared by the /how-much-spanish-do-i-understand
// tool (client) and scripts/coverage/*.mjs (build-time show stats). No React.

// Grammar words that data/words.json leaves out (articles, core prepositions,
// conjunctions, clitic and possessive pronouns). The headline numbers count them as
// known, because they are taught in the first lessons; "list only" numbers do not.
export const FUNCTION_WORDS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'del', 'al',
  'a', 'de', 'en', 'por', 'para', 'desde', 'entre', 'hacia', 'contra', 'según', 'durante',
  'y', 'e', 'u', 'que', 'no', 'sí',
  'me', 'se', 'mi', 'mis', 'su', 'sus', 'os',
  'vosotros', 'vosotras', 'vuestro', 'vuestra', 'vuestros', 'vuestras',
])

// Fillers and interjections are left out of the count, like names and numbers.
export const IGNORED = new Set([
  'ah', 'oh', 'eh', 'ay', 'uh', 'um', 'mm', 'mmm', 'hmm', 'hum', 'ok', 'okay', 'okey', 'hey', 'ey',
  'ja', 'jaja', 'jajaja', 'je', 'uy', 'huy', 'ajá', 'aja', 'bah', 'buah', 'puf', 'ups', 'quot', 'amp',
])

export const LEVELS = [100, 500, 1000, 1500]

export function stripAccents(s) {
  return s.replace(/[áàâä]/g, 'a').replace(/[éèêë]/g, 'e').replace(/[íìîï]/g, 'i').replace(/[óòôö]/g, 'o').replace(/[úùû]/g, 'u')
}

// Removes subtitle numbering, timestamps, tags, sound cues and speaker labels.
export function cleanSubtitles(raw) {
  return raw
    .replace(/^﻿/, '')
    .replace(/^WEBVTT.*$/m, '')
    .replace(/^(NOTE|STYLE|REGION)\b[\s\S]*?(\n\n|$)/gm, '')
    .replace(/^\s*\d+\s*$/gm, '')
    .replace(/^.*\d{1,2}:\d{2}(:\d{2})?[.,]\d{1,3}\s*-->.*$/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/^\s*[-–—]\s*/gm, '')
    .replace(/^\s*[A-ZÁÉÍÓÚÑ ]{2,}:\s*/gm, '')
}

const WORD_RE = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g
const DIGIT_ADJ_RE = /[0-9]/

// Returns [{ w (lowercased), cap (capitalised), start (sentence/line start) }]
export function tokenize(text) {
  const out = []
  let m
  WORD_RE.lastIndex = 0
  while ((m = WORD_RE.exec(text))) {
    const raw = m[0]
    const before = text[m.index - 1]
    const after = text[m.index + raw.length]
    if ((before && DIGIT_ADJ_RE.test(before)) || (after && DIGIT_ADJ_RE.test(after))) continue
    let j = m.index - 1
    while (j >= 0 && /[ \t"'«“‘(*_]/.test(text[j])) j--
    const start = j < 0 || /[\n.!?¿¡…:;—–-]/.test(text[j])
    out.push({ w: raw.toLowerCase(), cap: raw[0] !== raw[0].toLowerCase(), start })
  }
  return out
}

export function buildIndex(data) {
  const map = new Map()
  for (const [rank, list] of Object.entries(data.forms)) {
    const r = Number(rank)
    for (const f of list.split(' ')) map.set(f, r)
  }
  const verbs = new Set()
  data.lemmas.forEach((l, i) => { if (l[2]) verbs.add(i + 1) })
  return { map, lemmas: data.lemmas, verbs }
}

const CLITIC_RE = /(me|te|se|lo|la|le|nos|os|los|las|les)$/

// Rank of the list word this form belongs to; 0 = core grammar word; null = not in the top 1,500.
export function lookup(w, idx) {
  if (FUNCTION_WORDS.has(w)) return 0
  const hit = idx.map.get(w)
  if (hit !== undefined) return hit
  // Verb + attached pronouns: dímelo, cállate, decírselo, haciéndolo, vámonos
  let stem = w
  for (let i = 0; i < 2; i++) {
    const c = stem.match(CLITIC_RE)
    if (!c || stem.length - c[0].length < 2) break
    stem = stem.slice(0, -c[0].length)
    const plain = stripAccents(stem)
    const cand = idx.map.get(plain) ?? idx.map.get(stem) ?? idx.map.get(plain + 's')
    if (cand !== undefined && idx.verbs.has(cand)) return cand
  }
  return null
}

// Words that are capitalised everywhere they appear, and at least once mid-sentence,
// are treated as names (Tokio, Madrid, Berlín) and left out of the count.
function properNouns(tokens) {
  const stats = new Map()
  for (const t of tokens) {
    const s = stats.get(t.w) || { lower: 0, midCap: 0 }
    if (!t.cap) s.lower++
    else if (!t.start) s.midCap++
    stats.set(t.w, s)
  }
  const out = new Set()
  for (const [w, s] of stats) if (s.lower === 0 && s.midCap > 0) out.add(w)
  return out
}

export function analyze(text, idx, { subtitles = false, topUncovered = 25 } = {}) {
  const decoded = text.replace(/&(quot|amp|apos|lt|gt|nbsp|#\d+);/g, ' ')
  const tokens = tokenize(subtitles ? cleanSubtitles(decoded) : decoded).filter((t) => !IGNORED.has(t.w))
  const names = properNouns(tokens)
  const counts = new Map()
  const caps = new Map()
  let total = 0
  let excluded = 0
  for (const t of tokens) {
    if (names.has(t.w) && !FUNCTION_WORDS.has(t.w) && !idx.map.has(t.w)) { excluded++; continue }
    total++
    counts.set(t.w, (counts.get(t.w) || 0) + 1)
    if (t.cap && !t.start) caps.set(t.w, (caps.get(t.w) || 0) + 1)
  }
  const ranked = []
  for (const [w, n] of counts) ranked.push({ w, n, rank: lookup(w, idx), capShare: (caps.get(w) || 0) / n })
  ranked.sort((a, b) => b.n - a.n)

  let functionTokens = 0
  for (const r of ranked) if (r.rank === 0) functionTokens += r.n
  const coverage = {}
  const listOnly = {}
  for (const L of LEVELS) {
    let known = 0
    for (const r of ranked) if (r.rank !== null && r.rank <= L) known += r.n
    coverage[L] = total ? known / total : 0
    listOnly[L] = total ? (known - functionTokens) / total : 0
  }

  // Missing at each level, grouped by lemma when the word is in the list.
  const missing = {}
  for (const L of LEVELS) {
    const groups = new Map()
    for (const r of ranked) {
      if (r.rank !== null && r.rank <= L) continue
      const key = r.rank ? `#${r.rank}` : r.w
      const g = groups.get(key) || { word: r.rank ? idx.lemmas[r.rank - 1][0] : r.w, meaning: r.rank ? idx.lemmas[r.rank - 1][1] : null, rank: r.rank, n: 0, forms: [], capShare: r.capShare }
      g.n += r.n
      if (g.forms.length < 4 && g.word !== r.w) g.forms.push(r.w)
      groups.set(key, g)
    }
    missing[L] = [...groups.values()].sort((a, b) => b.n - a.n).slice(0, topUncovered)
  }

  return { total, excluded, unique: counts.size, coverage, listOnly, functionShare: total ? functionTokens / total : 0, missing }
}
