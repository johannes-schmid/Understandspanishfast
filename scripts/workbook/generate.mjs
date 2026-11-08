// Generates exercise content for the Top 1,500 workbook.
// Usage: node --env-file=.env scripts/workbook/generate.mjs [--only unit-03,test-2] [--force]
import fs from 'node:fs'
import path from 'node:path'
import Anthropic from '@anthropic-ai/sdk'

const words = JSON.parse(fs.readFileSync('data/words.json', 'utf8'))
const OUT = 'workbook/content'
const UNIT_SIZE = 50
const UNITS = 30
const TEST_EVERY = 5
const CONCURRENCY = 6

const args = process.argv.slice(2)
const force = args.includes('--force')
const only = args.includes('--only') ? args[args.indexOf('--only') + 1].split(',') : null

const client = new Anthropic()
fs.mkdirSync(OUT, { recursive: true })

const SYSTEM = `You write exercises for a printed Spanish vocabulary workbook for English-speaking adult learners.
The book teaches the 1,500 most frequent Spanish words in frequency order. Learners study units of 50 words.

Rules for every sentence you write:
- Natural, everyday spoken Spanish that works in both Spain and Latin America. No regional slang.
- Short: 5 to 12 words. Level A1 to B1.
- Use mostly words from the current unit and earlier, more frequent words. Avoid rare vocabulary.
- Never reuse the example sentences provided with the word list.
- Correct accents and punctuation (¿ ¡).
- Each target word may appear inflected (conjugated verb, plural, feminine) when that is natural; the answer must be the exact form that fits the gap.
- Adults, not children: topics like work, family, food, travel, friends, money, time, home, health.
- English translations are natural English, not word-for-word.`

const S = (props, required = Object.keys(props)) => ({ type: 'object', additionalProperties: false, properties: props, required })
const STR = { type: 'string' }
const arr = (items) => ({ type: 'array', items })

const gapItem = S({ es: STR, answer: STR, base: STR, en: STR })
const trItem = S({ en: STR, es: STR })

const UNIT_SCHEMA = S({
  gapFill: arr(gapItem),
  translate: arr(trItem),
  story: S({ title: STR, text: STR, answers: arr(STR), en: STR }),
})
const TEST_SCHEMA = S({ gapFill: arr(gapItem), translate: arr(trItem) })

function wordList(list) {
  return list.map((w) => `#${w.rank} ${w.word} (${w.pos}) = ${w.meanings.slice(0, 2).join('; ')} | example: ${w.example_es}`).join('\n')
}

function unitPrompt(u, list) {
  return `Unit ${u} covers words #${list[0].rank}–#${list.at(-1).rank}:

${wordList(list)}

Write the exercises for this unit as JSON:

1. gapFill: exactly 8 items. Each "es" is a new Spanish sentence with exactly one gap written as ____ (four underscores) where a word from this unit belongs. "answer" is the exact form that fills the gap, "base" is the dictionary form as listed above, "en" is the English translation of the full sentence. Use 8 different target words.

2. translate: exactly 4 items. A short English sentence ("en") and the model Spanish translation ("es"). Each Spanish translation must use at least one word from this unit.

3. story: a mini-story of 80 to 110 words in Spanish with a short Spanish "title". Exactly 8 gaps, marked in the text as (1) to (8) in order, each standing for one word from this unit (8 different words). "answers" lists the exact form for gaps 1 to 8 in order. "en" is a one-sentence English summary of the story. The story should be about something adults recognise, with a small twist or a light touch of humour.`
}

function testPrompt(t, list) {
  return `Review test ${t} covers words #${list[0].rank}–#${list.at(-1).rank} (the last 250 words studied). Pick target words across the whole range, favouring verbs, nouns and adjectives:

${wordList(list)}

Write the test as JSON:

1. gapFill: exactly 10 items. Each "es" is a new Spanish sentence with exactly one gap written as ____ (four underscores) for a word from the list. "answer" is the exact form, "base" is the dictionary form, "en" is the English translation. 10 different target words.

2. translate: exactly 5 items. English sentence ("en") and model Spanish translation ("es"); each Spanish answer uses at least two words from the list.`
}

function validate(kind, d) {
  const errs = []
  const n = kind === 'unit' ? 8 : 10
  if (d.gapFill?.length !== n) errs.push(`gapFill has ${d.gapFill?.length}, need ${n}`)
  d.gapFill?.forEach((g, i) => { if ((g.es.match(/____/g) || []).length !== 1) errs.push(`gapFill ${i + 1} needs exactly one ____`) })
  const t = kind === 'unit' ? 4 : 5
  if (d.translate?.length !== t) errs.push(`translate has ${d.translate?.length}, need ${t}`)
  if (kind === 'unit') {
    const s = d.story
    if (s?.answers?.length !== 8) errs.push('story needs 8 answers')
    for (let i = 1; i <= 8; i++) if (!s?.text?.includes(`(${i})`)) errs.push(`story missing gap (${i})`)
    const wc = s?.text?.split(/\s+/).length || 0
    if (wc < 60 || wc > 140) errs.push(`story is ${wc} words`)
  }
  return errs
}

async function call(prompt, schema) {
  const stream = client.beta.messages.stream({
    model: 'claude-opus-5-5',
    max_tokens: 32000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: SYSTEM,
    output_config: { effort: 'medium', format: { type: 'json_schema', schema } },
    messages: [{ role: 'user', content: prompt }],
  })
  const msg = await stream.finalMessage()
  if (msg.stop_reason === 'refusal') throw new Error('refused')
  if (msg.stop_reason === 'max_tokens') throw new Error('hit max_tokens')
  const text = msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('')
  return { data: JSON.parse(text), usage: msg.usage }
}

const jobs = []
for (let u = 1; u <= UNITS; u++) {
  const list = words.slice((u - 1) * UNIT_SIZE, u * UNIT_SIZE)
  jobs.push({ id: `unit-${String(u).padStart(2, '0')}`, kind: 'unit', prompt: unitPrompt(u, list), schema: UNIT_SCHEMA })
}
for (let t = 1; t <= UNITS / TEST_EVERY; t++) {
  const list = words.slice((t - 1) * 250, t * 250)
  jobs.push({ id: `test-${t}`, kind: 'test', prompt: testPrompt(t, list), schema: TEST_SCHEMA })
}

const todo = jobs.filter((j) => (!only || only.includes(j.id)) && (force || !fs.existsSync(path.join(OUT, `${j.id}.json`))))
console.log(`${todo.length} of ${jobs.length} jobs to run`)

let inTok = 0, outTok = 0
async function run(job) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { data, usage } = await call(job.prompt, job.schema)
      inTok += usage.input_tokens; outTok += usage.output_tokens
      const errs = validate(job.kind, data)
      if (errs.length) { console.warn(`${job.id} attempt ${attempt}: ${errs.join('; ')}`); continue }
      fs.writeFileSync(path.join(OUT, `${job.id}.json`), JSON.stringify(data, null, 2))
      console.log(`done ${job.id}`)
      return
    } catch (e) {
      if (e instanceof Anthropic.RateLimitError) { await new Promise((r) => setTimeout(r, 20000)) }
      console.warn(`${job.id} attempt ${attempt} failed: ${e.message}`)
    }
  }
  console.error(`FAILED ${job.id}`)
  process.exitCode = 1
}

const queue = [...todo]
await Promise.all(Array.from({ length: CONCURRENCY }, async () => { while (queue.length) await run(queue.shift()) }))
console.log(`tokens in ${inTok}, out ${outTok}, est. cost $${((inTok * 4 + outTok * 20) / 1e6).toFixed(2)}`)
