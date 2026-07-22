import { h1, h2, p, button, statRow, progressBar, wordCard, divider, link, C } from '../layout'

export const key = 'milestone'
export const dayOffset = 3

export const subject = ctx => `You understand about ${ctx.coveragePct}% of everyday Spanish`
export const preheader = ctx => `${ctx.knownCount} words known. Here is what that unlocks.`

export function body(ctx) {
  const href = link('/study', key)
  const m = ctx.milestone

  if (ctx.isActive) {
    return `
${h1(`About ${ctx.coveragePct}% of everyday Spanish`)}
${p(`That is what <b>${ctx.knownCount} word${ctx.knownCount === 1 ? '' : 's'}</b> buys you — not a score, an actual share of the words in an ordinary conversation.`)}

${statRow([
  { value: ctx.knownCount, label: 'Known', color: C.signal },
  { value: ctx.dueCount, label: 'To review', color: C.iris },
  { value: ctx.streak, label: `Day streak`, color: C.gold },
])}

${progressBar({ pct: (ctx.knownCount / 1500) * 100, caption: `${ctx.knownCount} of 1,500 words` })}

${m ? `${h2(`Next up: ${m.label}`)}
${p(`<b>${m.wordsUntil} more word${m.wordsUntil === 1 ? '' : 's'}</b> and you reach <b>${m.label}</b>. At a normal pace that is a couple of weeks, not a couple of years.`)}`
    : `${h2('All 1,500 words')}
${p('You have covered the entire foundation. From here it is maintenance and real input — read, watch, listen.')}`}

${button({ href, label: 'Keep going →' })}

${divider()}
${p('Comprehension percentages are estimated from corpus frequency data — how often these words actually appear in spoken Spanish.', { muted: true, small: true })}
`
  }

  const cards = ctx.wordPack.slice(0, 3).map(wordCard).join('')

  return `
${h1('Three words, on the house')}
${p(ctx.dueCount > 0
    ? `You have <b>${ctx.dueCount} word${ctx.dueCount === 1 ? '' : 's'}</b> waiting in your review queue. But first, three worth keeping regardless:`
    : 'No pressure to open anything. Three words worth keeping regardless:')}

${cards}

${h2('Where you stand')}
${p(`${ctx.knownCount} word${ctx.knownCount === 1 ? '' : 's'} known — roughly <b>${ctx.coveragePct}%</b> coverage of everyday spoken Spanish.${m ? ` <b>${m.wordsUntil} more</b> and you hit <b>${m.label}</b>.` : ''}`)}
${progressBar({ pct: (ctx.knownCount / 1500) * 100, caption: `${ctx.knownCount} of 1,500 words` })}

${p('The queue does not expire and nothing resets. Pick it up whenever.')}

${button({ href, label: 'Pick up where you left off →' })}
`
}
