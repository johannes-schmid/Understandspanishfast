import fs from 'node:fs'
import path from 'node:path'

const BASE = 'https://mostcommonspanish.com'

// Static marketing routes with their priorities. App/auth-gated routes are
// intentionally excluded (dashboard, study, practice, packs, login, etc.).
const STATIC_ROUTES = [
  { path: '', priority: 1.0, changefreq: 'weekly' },
  { path: 'words', priority: 0.9, changefreq: 'weekly' },
  { path: 'level-test', priority: 0.9, changefreq: 'monthly' },
  { path: 'spanish-vocabulary-app', priority: 0.8, changefreq: 'monthly' },
  { path: 'vs-anki', priority: 0.8, changefreq: 'monthly' },
  { path: 'get-started', priority: 0.8, changefreq: 'monthly' },
  { path: 'reading', priority: 0.6, changefreq: 'monthly' },
  { path: 'blog', priority: 0.7, changefreq: 'weekly' },
  { path: 'privacy', priority: 0.3, changefreq: 'yearly' },
  { path: 'terms', priority: 0.3, changefreq: 'yearly' },
]

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

export default function sitemap() {
  const now = new Date()

  const staticEntries = STATIC_ROUTES.map((r) => ({
    url: r.path === '' ? `${BASE}/` : `${BASE}/${r.path}`,
    lastModified: now,
    changeFrequency: r.changefreq,
    priority: r.priority,
  }))

  const blogEntries = listRouteDirs('blog').map((slug) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const wordEntries = listRouteDirs('words').map((slug) => ({
    url: `${BASE}/words/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  return [...staticEntries, ...blogEntries, ...wordEntries]
}
