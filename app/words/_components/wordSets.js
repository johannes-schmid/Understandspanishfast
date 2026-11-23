import { words } from '@/data/words'

export const BASE = 'https://mostcommonspanish.com'
export const DATE_MODIFIED = '2026-11-23'

export function pageMetadata({ title, description, slug }) {
  const url = `${BASE}/words/${slug}`
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { type: 'article', title, description, url, siteName: 'Most Common Spanish', images: ['/og-default.png'] },
    twitter: { card: 'summary_large_image', title, description, images: ['/og-default.png'] },
  }
}

const first = (w) => (Array.isArray(w.meanings) ? w.meanings[0] : w.meanings)

export function itemListSchema({ name, slug, list, limit = list.length }) {
  const url = `${BASE}/words/${slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    url,
    ...(limit >= list.length ? { numberOfItems: list.length } : {}),
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: list.slice(0, limit).map((w, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@type': 'DefinedTerm', name: w.word, description: first(w), inDefinedTermSet: url },
    })),
  }
}

export function wordByText(text) {
  return words.find((w) => w.word === text || w.word === `un ${text}` || w.word === `una ${text}`)
}

const STRESSED_A = new Set(['agua', 'hambre', 'alma', 'arma', 'ala', 'águila', 'área', 'hacha', 'aula'])
const PLURAL_F = new Set(['ganas', 'felicitaciones'])
const COMMON_FIX = { 'un compañero una compañero': ['compañero', 'compañera'] }

function bare(word) {
  return word.replace(/^(un|una) /, '')
}

export function nounEntry(w) {
  if (w.pos === 'n.' || / una /.test(w.word)) {
    const pair = COMMON_FIX[w.word] || w.word.split(/\s*una\s+/).map((s) => bare(s.trim()))
    const [m, f] = pair
    const label = !f || m === f ? `el/la ${m}` : `el ${m}, la ${f}`
    return { ...w, word: label, gender: 'both' }
  }
  if (/^los /.test(w.word)) return { ...w, gender: 'masculine' }
  const base = bare(w.word)
  if (w.pos === 'n.m.') return { ...w, word: `el ${base}`, gender: 'masculine' }
  if (PLURAL_F.has(base)) return { ...w, word: `las ${base}`, gender: 'feminine' }
  const art = STRESSED_A.has(base) ? 'el' : 'la'
  return { ...w, word: `${art} ${base}`, gender: 'feminine', stressedA: art === 'el' }
}

export const allNouns = words.filter((w) => ['n.m.', 'n.f.', 'n.'].includes(w.pos)).map(nounEntry)

export function nounBase(n) {
  return n.word.replace(/^(el\/la|el|la|los|las) /, '').split(',')[0]
}

const INVARIABLE = new Set(['mejor', 'peor', 'mayor', 'menor', 'superior', 'inferior', 'interior', 'exterior', 'anterior', 'posterior'])

export function feminineOf(adj) {
  const w = adj.word
  if (INVARIABLE.has(w)) return 'same'
  if (/a$/.test(w)) return w
  if (/os$/.test(w)) return w.replace(/os$/, 'as')
  if (/o$/.test(w)) return w.replace(/o$/, 'a')
  if (/ón$/.test(w)) return w.replace(/ón$/, 'ona')
  if (/és$/.test(w)) return w.replace(/és$/, 'esa')
  if (/án$/.test(w)) return w.replace(/án$/, 'ana')
  if (/or$/.test(w)) return `${w}a`
  return 'same'
}

export const allAdjectives = words.filter((w) => w.pos === 'adj.')

const ADV_KIND = {
  time: ['ya', 'ahora', 'nunca', 'entonces', 'siempre', 'antes', 'después', 'mañana', 'hoy', 'luego', 'aún', 'tarde', 'todavía', 'pronto', 'jamás', 'anoche', 'ayer', 'enseguida', 'temprano', 'finalmente', 'últimamente', 'recién', 'nuevamente', 'inmediatamente', 'cuándo', 'a menudo', 'normalmente'],
  place: ['aquí', 'dónde', 'ahí', 'allí', 'allá', 'dentro', 'adelante', 'atrás', 'fuera', 'abajo', 'cerca', 'afuera', 'acá', 'adónde', 'arriba', 'lejos', 'encima', 'detrás', 'adentro', 'alrededor', 'debajo', 'delante', 'enfrente'],
  degree: ['más', 'muy', 'menos', 'demasiado', 'casi', 'bastante', 'apenas', 'muchísimo', 'suficientemente', 'completamente', 'totalmente', 'absolutamente'],
  focus: ['sólo', 'solo', 'solamente', 'también', 'tampoco', 'incluso', 'además', 'aun', 'siquiera', 'especialmente', 'precisamente', 'aparte'],
  certainty: ['quizá', 'quizás', 'realmente', 'seguramente', 'definitivamente', 'obviamente', 'aparentemente', 'acaso'],
}
const ADV_LOOKUP = Object.fromEntries(Object.entries(ADV_KIND).flatMap(([k, list]) => list.map((w) => [w, k])))

export function adverbKind(w) {
  return ADV_LOOKUP[w.word] || 'manner'
}

export const allAdverbs = words.filter((w) => w.pos === 'adv.')
