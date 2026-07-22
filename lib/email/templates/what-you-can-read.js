import { h1, h2, p, button, articleRow, wordCard, callout, divider, link } from '../layout'

export const key = 'what-you-can-read'
export const dayOffset = 7

export const subject = ctx => ctx.knownCount >= 50 ? 'You can read this now' : 'What 100 words gets you'
export const preheader = () => 'Real Spanish, matched to the words you actually know.'

// Tiered so the suggestion is always just above the user's current level.
function watchSuggestion(known) {
  if (known < 250) {
    return `<b>Extra en Español</b> — a sitcom written for learners. Deliberately slow, and you will catch whole lines already. Free on YouTube.`
  }
  if (known < 600) {
    return `<b>Destinos</b> or the <b>Dreaming Spanish</b> beginner videos — real speech, visual context, no subtitle crutch needed.`
  }
  if (known < 1100) {
    return `<b>Extraordinary Attorney Woo</b>-style dubbed shows on Netflix, or <b>Radio Ambulante</b> — journalism paced for adults. Spanish subtitles on, English off.`
  }
  return `<b>La Casa de Papel</b> or <b>Élite</b> in the original audio with Spanish subtitles. Native pace, native slang — you have the vocabulary for it.`
}

export function body(ctx) {
  const href = link('/reading', key)

  if (ctx.knownCount < 50) {
    const cards = ctx.wordPack.map(wordCard).join('')

    return `
${h1('First 100 words, then everything opens')}
${p('Real Spanish text becomes readable surprisingly early — but there is a floor, and it is around 100 words. Below that, too much of every sentence is missing for context to help.')}
${p(`You are at <b>${ctx.knownCount}</b>. Here are five to close the gap:`)}

${cards}

${callout({
  title: 'What happens at 100',
  body: 'Short stories written in frequency order become readable end to end. Not "you get the gist" — actually readable. That is one or two sessions away.',
})}

${button({ href: link('/study', key), label: 'Get to 100 words →' })}
`
  }

  const rows = ctx.articles.map(a => articleRow({
    title: a.title,
    description: a.description,
    readiness: a.readiness,
    href: link(`/articles/${a.slug}`, key),
  })).join('')

  return `
${h1('You can read this now')}
${p(`With <b>${ctx.knownCount} words</b>, these stories are within reach. The percentage is the share of each text you already know — anything above 80% reads smoothly, and the rest you will get from context.`)}

${rows}

${h2('And to listen to')}
${p(watchSuggestion(ctx.knownCount))}

${callout({
  title: 'Read it wrong, on purpose',
  body: 'Do not look up every unknown word. Read past it. Meaning arrives from context far more often than people expect, and stopping every line is what makes reading feel like homework.',
})}

${button({ href, label: 'Open the reading library →' })}

${divider()}
${p('These update as your vocabulary grows — the same story gets easier every time you come back to it.', { muted: true, small: true })}
`
}
