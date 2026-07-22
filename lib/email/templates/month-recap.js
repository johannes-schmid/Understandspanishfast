import { h1, h2, p, button, statRow, progressBar, articleRow, divider, link, C } from '../layout'

export const key = 'month-recap'
export const dayOffset = 30

export const subject = ctx => `One month in: ${ctx.knownCount} words`
export const preheader = ctx => `About ${ctx.coveragePct}% of everyday Spanish, up from zero.`

export function body(ctx) {
  const href = link('/study', key)
  const m = ctx.milestone

  const rows = ctx.articles.slice(0, 2).map(a => articleRow({
    title: a.title,
    description: a.description,
    readiness: a.readiness,
    href: link(`/articles/${a.slug}`, key),
  })).join('')

  return `
${h1('One month in')}
${p(`Thirty days ago you knew none of this, ${ctx.firstName}. Here is the honest accounting:`)}

${statRow([
  { value: ctx.knownCount, label: 'Words known', color: C.signal },
  { value: ctx.daysPracticed, label: 'Days practiced', color: C.iris },
  { value: ctx.totalReviews, label: 'Cards reviewed', color: C.gold },
])}

${progressBar({ pct: (ctx.knownCount / 1500) * 100, caption: `${ctx.knownCount} of 1,500 words · about ${ctx.coveragePct}% of everyday spoken Spanish` })}

${p(`That percentage is the one that matters. It is not a completion bar — it is the share of words in an ordinary Spanish conversation that you would now recognise.`)}

${m ? `${h2(`${m.wordsUntil} words to ${m.label}`)}
${p(`The next threshold is <b>${m.label}</b>, and it is <b>${m.wordsUntil} word${m.wordsUntil === 1 ? '' : 's'}</b> away. Month two is where this compounds: the words get rarer, but you already know the connective tissue holding every sentence together, so each new one slots into something.`)}`
    : `${h2('All 1,500')}
${p('You have the full foundation. Everything from here is input — read, watch, listen, and let the rare words arrive in context where they belong.')}`}

${rows ? `${h2('Ready for you now')}${rows}` : ''}

${button({ href, label: 'Start month two →' })}

${divider()}
${p('That is the end of the welcome sequence — no more scheduled emails from here. Your queue is always at mostcommonspanish.com whenever you want it.', { muted: true, small: true })}
`
}
