import { h1, h2, p, button, wordCard, callout, divider, link } from '../layout'

export const key = 'first-words'
export const dayOffset = 1

export const subject = () => '5 words that do the heavy lifting'
export const preheader = () => 'Each one appears in roughly every third Spanish sentence.'

export function body(ctx) {
  const href = link('/study', key)
  const cards = ctx.wordPack.map(wordCard).join('')

  const opener = ctx.isActive
    ? p(`You are at <b>${ctx.knownCount} word${ctx.knownCount === 1 ? '' : 's'}</b> already. Here are five more worth knowing cold — free, no need to click anything.`)
    : p('Five words to keep, whether or not you open the app today. Each one appears constantly in real Spanish, which is exactly why they come first.')

  return `
${h1('The words that pay rent')}
${opener}

${cards}

${h2('Why these and not "airport" or "pineapple"')}
${p('Most courses teach vocabulary in themes — food, travel, animals. It feels organised. It is also the slowest possible route to understanding anything.')}
${p('Themed lists give you words that cluster in situations you are rarely in. Frequency lists give you words that appear in <i>every</i> situation. The top 100 Spanish words alone make up around half of all words in ordinary speech.')}

${callout({
  title: 'The rule',
  body: 'A word you meet ten times a day is worth more than ten words you meet once a year. Learn in frequency order and comprehension arrives early instead of at the end.',
})}

${button({ href, label: ctx.dueCount > 0 ? `Review your ${ctx.dueCount} due word${ctx.dueCount === 1 ? '' : 's'} →` : 'Learn 10 more words →' })}

${divider()}
${p('Roughly five minutes a day is enough to keep moving. Consistency beats intensity here — the scheduling does the rest.', { muted: true, small: true })}
`
}
