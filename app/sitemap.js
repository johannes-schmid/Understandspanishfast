import fs from 'node:fs'
import path from 'node:path'

const BASE = 'https://mostcommonspanish.com'

const STATIC_ROUTES = [
  { path: '', priority: 1.0, changefreq: 'weekly', modified: '2026-11-08' },
  { path: 'words', priority: 0.9, changefreq: 'weekly', modified: '2026-11-08' },
  { path: 'level-test', priority: 0.9, changefreq: 'monthly', modified: '2026-11-09' },
  { path: 'workbook', priority: 0.9, changefreq: 'monthly', modified: '2026-11-09' },
  { path: 'spanish-vocabulary-app', priority: 0.8, changefreq: 'monthly', modified: '2026-11-08' },
  { path: 'vs-anki', priority: 0.8, changefreq: 'monthly', modified: '2026-11-08' },
  { path: 'anki-spanish-deck', priority: 0.9, changefreq: 'monthly', modified: '2026-11-09' },
  { path: 'vs-duolingo', priority: 0.8, changefreq: 'monthly', modified: '2026-11-09' },
  { path: 'frequency-dictionary-of-spanish', priority: 0.7, changefreq: 'monthly', modified: '2026-11-09' },
  { path: 'study', priority: 0.9, changefreq: 'monthly', modified: '2026-11-08' },
  { path: 'blog', priority: 0.7, changefreq: 'weekly', modified: '2026-11-09' },
  { path: 'about', priority: 0.5, changefreq: 'yearly', modified: '2026-11-09' },
  { path: 'privacy', priority: 0.3, changefreq: 'yearly', modified: '2026-05-20' },
  { path: 'terms', priority: 0.3, changefreq: 'yearly', modified: '2026-05-20' },
]

const FALLBACK_MODIFIED = '2026-11-08'

function listRouteDirs(relDir) {
  try {
    const dir = path.join(process.cwd(), 'app', relDir)
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith('[') && !d.name.startsWith('_'))
      .map((d) => d.name)
  } catch {
    return []
  }
}

function pageModified(relDir) {
  try {
    const src = fs.readFileSync(path.join(process.cwd(), 'app', relDir, 'page.jsx'), 'utf8')
    const dates = [...src.matchAll(/dateModified[=:]\s*["'](\d{4}-\d{2}-\d{2})["']/g)].map((m) => m[1]).sort()
    return dates.at(-1) || FALLBACK_MODIFIED
  } catch {
    return FALLBACK_MODIFIED
  }
}

export default function sitemap() {
  const staticEntries = STATIC_ROUTES.map((r) => ({
    url: r.path === '' ? `${BASE}/` : `${BASE}/${r.path}`,
    lastModified: new Date(r.modified),
    changeFrequency: r.changefreq,
    priority: r.priority,
  }))

  const blogEntries = listRouteDirs('blog').map((slug) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: new Date(pageModified(`blog/${slug}`)),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const wordEntries = listRouteDirs('words').map((slug) => ({
    url: `${BASE}/words/${slug}`,
    lastModified: new Date(slug === 'most-common-spanish-words-pdf' ? '2026-11-09' : FALLBACK_MODIFIED),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  return [...staticEntries, ...blogEntries, ...wordEntries]
}
