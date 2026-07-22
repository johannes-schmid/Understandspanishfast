import { h1, h2, p, button, statRow, callout, wordCard, divider, link, C } from '../layout'

export const key = 'why-reviews'
export const dayOffset = 14

export const subject = ctx => ctx.dueCount > 0
  ? `${ctx.dueCount} words are about to slip`
  : 'The words you are about to forget'
export const preheader = () => 'Reviewing beats learning new ones. Here is why.'

const SCIENCE = `
Memory decays on a curve, and it decays fastest right after you learn something —
most of a new word is gone within a few days unless you meet it again. Meet it once
more at the right moment and the curve flattens. Meet it a third and fourth time and
it stops decaying in any practical sense.
`

export function body(ctx) {
  const href = link('/study', key)

  if (ctx.isActive) {
    return `
${h1('Reviews beat new words')}
${p(`Two weeks in, ${ctx.firstName}. Here is the counterintuitive part of what you are doing:`)}

${statRow([
  { value: ctx.knownCount, label: 'Known', color: C.signal },
  { value: ctx.dueCount, label: 'Due now', color: C.iris },
  { value: ctx.daysPracticed, label: 'Days practiced', color: C.gold },
])}

${p(`Those <b>${ctx.dueCount} due word${ctx.dueCount === 1 ? '' : 's'}</b> are worth more of your attention than ${ctx.dueCount} new ones. A due word is one you have already paid for — reviewing it is the cheapest possible way to keep it.`)}

${callout({ title: 'The forgetting curve', body: SCIENCE.trim() })}

${p('This is the entire reason the app decides your schedule instead of letting you pick. Every card is surfaced at the point where recalling it is just hard enough to strengthen the memory — a little earlier is wasted effort, a little later and it is gone.')}

${h2('So: clear the queue first')}
${p('If you only have five minutes, spend them on reviews, not new words. Growth still happens; it just stops leaking out the back.')}

${button({ href, label: `Clear ${ctx.dueCount} review${ctx.dueCount === 1 ? '' : 's'} →` })}
`
  }

  const cards = ctx.wordPack.slice(0, 3).map(wordCard).join('')

  return `
${h1('The words you are about to forget')}
${p(`It has been ${ctx.daysSinceStudy === null ? 'a while' : `${ctx.daysSinceStudy} days`}. That is not a scolding — it is just how forgetting works, and it is worth understanding because it changes what you should do next.`)}

${callout({ title: 'The forgetting curve', body: SCIENCE.trim() })}

${p(`You have <b>${ctx.knownCount} word${ctx.knownCount === 1 ? '' : 's'}</b> in the system${ctx.dueCount > 0 ? `, and <b>${ctx.dueCount}</b> of them are sitting right at the point where one review locks them in for weeks` : ''}. Nothing has been lost. The queue waited.`)}

${h2('Three to warm up with')}
${cards}

${p('One short session recovers more than it feels like it should. The scheduling picks up exactly where it stopped.')}

${button({ href, label: 'Restart in five minutes →' })}

${divider()}
${p('Not for you right now? Unsubscribing is one click at the bottom — no hard feelings.', { muted: true, small: true })}
`
}
