import { h1, h2, p, button, statRow, progressBar, callout, divider, link, C } from '../layout'

export const key = 'welcome'
export const dayOffset = 0

export const subject = () => 'Your first words are saved'
export const preheader = () => '1,500 words is the whole job. Here is the map.'

export function body(ctx) {
  const href = link('/study', key)

  return `
${h1(`Welcome, ${ctx.firstName}.`)}
${p('Your progress is saved from here on. Every word you rate gets scheduled for review at the moment you are about to forget it — you never have to decide what to study next.')}

${p('Here is the whole plan, and it is shorter than you think:')}

${statRow([
  { value: '100', label: 'Basics', color: C.signal },
  { value: '500', label: 'Simple stories', color: C.iris },
  { value: '1,500', label: 'Full foundation', color: C.gold },
])}

${p(`Spanish has hundreds of thousands of words. You do not need them. The <b>most common 1,500</b> account for roughly <b>80% of everything said in everyday conversation</b> — which is why this app only contains those, ranked in the order that buys you the most comprehension per word.`)}

${callout({
  title: 'Why the order matters',
  body: 'Learning <i>ser</i>, <i>estar</i>, <i>ir</i> and <i>tener</i> unlocks more real sentences than a hundred words about the zoo. Frequency order means your comprehension climbs from the first session, not the fiftieth.',
})}

${h2('Where you are now')}
${p(ctx.knownCount > 0
  ? `${ctx.knownCount} word${ctx.knownCount === 1 ? '' : 's'} known — about <b>${ctx.coveragePct}%</b> coverage of everyday spoken Spanish.`
  : 'Nothing yet. Ten minutes gets you your first 20 words.')}
${progressBar({ pct: (ctx.knownCount / 1500) * 100, caption: `${ctx.knownCount} of 1,500 words` })}

${button({ href, label: ctx.knownCount > 0 ? 'Continue where you left off →' : 'Start your first session →' })}

${divider()}
${p('Over the next month I will send you a handful of these: your real numbers, a few high-value words, and what you can understand that you could not before. No streaks to protect, no guilt.', { muted: true, small: true })}
`
}
