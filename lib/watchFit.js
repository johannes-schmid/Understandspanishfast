// Client-safe helpers that turn a vocabulary size into show fit and a product recommendation.
// Shows come in slim form: { slug, title, type, country, coverage: {100,500,1000,1500}, easiness, level, wpm }.

export const REACH_KEY = 'usf:lastReach'
const POINTS = [100, 500, 1000, 1500]

export function readReach() {
  try {
    const v = JSON.parse(localStorage.getItem(REACH_KEY) || 'null')
    return v && Number.isFinite(v.reach) ? v.reach : null
  } catch {
    return null
  }
}

export function coverageAt(show, n) {
  const c = show.coverage
  if (n <= POINTS[0]) return c[100] * Math.max(0, n) / 100
  if (n >= 1500) return c[1500]
  const i = POINTS.findIndex((p) => n < p)
  const a = POINTS[i - 1]
  const b = POINTS[i]
  return c[a] + ((c[b] - c[a]) * (n - a)) / (b - a)
}

export function fit(show, n) {
  const v = coverageAt(show, n)
  if (v >= 90) return { key: 'ready', label: 'Watch now', hint: 'with Spanish subtitles', value: v }
  if (v >= 86) return { key: 'stretch', label: 'Stretch', hint: 'subtitles on, pause often', value: v }
  return { key: 'later', label: 'Later', hint: 'learn more words first', value: v }
}

// Best picks for a vocabulary size: highest coverage at that size, ties broken by the easiness score.
export function picksFor(shows, n, count = 3) {
  return [...shows]
    .map((s) => ({ s, v: coverageAt(s, n) }))
    .sort((a, b) => b.v - a.v + (b.s.easiness - a.s.easiness) / 200)
    .slice(0, count)
    .map(({ s }) => s)
}

export const PRODUCTS = {
  readers1: { href: '/spanish-short-stories-for-beginners', name: '10 short stories, Level 1', price: '€9', meta: 'PDF + 10 MP3s', cover: '/readers/cover.webp', w: 900, h: 1273 },
  readers2: { href: '/spanish-short-stories-intermediate', name: '10 longer stories, Level 2', price: '€9', meta: 'PDF + 10 MP3s', cover: '/readers/cover-level-2.webp', w: 900, h: 1273 },
  anki: { href: '/anki-spanish-deck', name: 'Top 1,500 Anki deck', price: '€9', meta: 'Native audio, 1,500 notes', cover: '/anki/card-preview.webp', w: 840, h: 1260 },
  bundle: { href: '/bundle', name: 'Workbook + Anki deck', price: '€12', meta: 'Both downloads', cover: '/anki/card-preview.webp', w: 840, h: 1260 },
  workbook: { href: '/workbook', name: 'Top 1,500 workbook', price: '€5', meta: 'PDF · 119 pages' },
}

// The next step for a learner of a given vocabulary size, framed around watching shows.
export function productFor(n) {
  if (n < 500) {
    return {
      main: 'readers1',
      title: 'Get to 500 words with stories you can hear',
      body: 'Ten short stories built only from the top 500 words, each read by a native speaker. It is the closest thing to watching a show that works at your level.',
      also: ['anki', 'workbook'],
    }
  }
  if (n < 1450) {
    return {
      main: 'anki',
      title: `Close the gap from ${Math.round(n / 50) * 50} to 1,500 words`,
      body: 'Every show on this list jumps to 85–93% familiar words at 1,500. The Anki deck teaches them in frequency order, with native audio, so the next episode gets easier every week.',
      also: ['bundle', 'readers2'],
    }
  }
  return {
    main: 'readers2',
    title: 'You know the 1,500. Train your ear on longer stories',
    body: 'Ten 1,100-word stories with an MP3 each, built from the words you already know. The step between vocabulary and real episodes.',
    also: ['bundle', 'anki'],
  }
}

// Product for a show, when we don't know the visitor's level: based on how hard the show is.
export function productForShow(show) {
  if (show.level === 'Easy' || show.level === 'Medium') {
    return {
      main: 'anki',
      title: 'Get to 1,500 words before you press play',
      body: `With the top 1,500 Spanish words you recognise ${Math.round(show.coverage[1500])}% of ${show.title}. The Anki deck teaches exactly those words in frequency order, with native audio.`,
      also: ['readers1', 'bundle'],
    }
  }
  return {
    main: 'bundle',
    title: `${show.title} needs all 1,500 words, and more`,
    body: 'Fast dialogue and lots of slang. Learn the top 1,500 on paper and in Anki first, then add the show-specific words listed on this page.',
    also: ['readers2', 'anki'],
  }
}
