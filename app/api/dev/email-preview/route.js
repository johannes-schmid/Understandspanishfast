import { NextResponse } from 'next/server'
import { SEQUENCE, render } from '@/lib/email/sequence'
import { articles } from '@/data/articles'
import { words } from '@/data/words'
import { articleReadiness } from '@/lib/userStats'

export const dynamic = 'force-dynamic'

// Renders any template in either behaviour branch against fake stats so the
// design can be reviewed without sending anything. Dev only.
const VARIANTS = {
  active: {
    firstName: 'Johannes',
    knownCount: 212, learningCount: 34, dueCount: 18, streak: 6,
    coveragePct: 7, milestone: { words: 500, label: 'Simple stories', wordsUntil: 288 },
    daysSinceStudy: 0, isActive: true, hasEverStudied: true,
    daysPracticed: 11, totalReviews: 486,
  },
  idle: {
    firstName: 'Johannes',
    knownCount: 34, learningCount: 12, dueCount: 27, streak: 0,
    coveragePct: 1, milestone: { words: 100, label: 'Basics', wordsUntil: 66 },
    daysSinceStudy: 9, isActive: false, hasEverStudied: true,
    daysPracticed: 2, totalReviews: 61,
  },
  new: {
    firstName: 'Johannes',
    knownCount: 0, learningCount: 0, dueCount: 0, streak: 0,
    coveragePct: 0, milestone: { words: 100, label: 'Basics', wordsUntil: 100 },
    daysSinceStudy: null, isActive: false, hasEverStudied: false,
    daysPracticed: 0, totalReviews: 0,
  },
}

const PROFILE = {
  id: 'preview-user',
  full_name: 'Johannes Schmid',
  unsubscribe_token: '00000000-0000-4000-8000-000000000000',
}

function buildCtx(base) {
  return {
    ...base,
    wordPack: words.filter(w => w.example_es).slice(0, 5),
    articles: articles
      .map(a => ({ ...a, readiness: articleReadiness(a, base.knownCount) }))
      .sort((a, b) => b.readiness - a.readiness)
      .slice(0, 3),
  }
}

export async function GET(request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')
  const variant = searchParams.get('variant') || 'active'

  if (!key) {
    const rows = SEQUENCE.flatMap(t =>
      Object.keys(VARIANTS).map(v =>
        `<li><a href="?key=${t.key}&variant=${v}">Day ${t.dayOffset} — ${t.key} (${v})</a></li>`
      )
    ).join('')
    return new NextResponse(
      `<h1>Email previews</h1><ul style="font-family:sans-serif;line-height:2">${rows}</ul>`,
      { headers: { 'content-type': 'text/html' } }
    )
  }

  const template = SEQUENCE.find(t => t.key === key)
  if (!template) return NextResponse.json({ error: `Unknown key: ${key}` }, { status: 404 })

  const base = VARIANTS[variant]
  if (!base) return NextResponse.json({ error: `Unknown variant: ${variant}` }, { status: 404 })

  const { subject, html } = render(template, buildCtx(base), PROFILE)

  return new NextResponse(html, {
    headers: { 'content-type': 'text/html; charset=utf-8', 'x-subject': subject },
  })
}
