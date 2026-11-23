// Generates word + sentence audio for data/words-3000.json with the ElevenLabs text-to-speech API.
// Usage:
//   node --env-file=.env.local scripts/deck3000/audio.mjs                       # production: voices alternate by rank, writes audio fields back to the JSON
//   node --env-file=.env.local scripts/deck3000/audio.mjs --sample 5 --out samples/deck3000   # every candidate voice for the first 5 words
// Options: --voices isabel,javier  --out <dir>  --model eleven_v4  --force
// File names follow data/words.json: <word>_<voice>.mp3 and <word>_<voice>_<md5(example_es)[0:8]>.mp3
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

export const VOICES = {
  isabel: { id: 'rixsIpPlTphvsJd2mI03', name: 'Isabel - Neutral, Balanced and Calm', accent: 'Latin American (Mexico, neutral)', gender: 'female' },
  enrique: { id: 'gbTn1bmCvNgk0QEAVyfM', name: 'Enrique M. Nieto - Credible and Rich', accent: 'Latin American (Mexico)', gender: 'male' },
  javier: { id: 'eHAEFkimnYz57pupUMcq', name: 'Javier Rojas - Learning & Storytelling', accent: 'Spain (peninsular)', gender: 'male' },
}

const API = 'https://api.elevenlabs.io/v1/text-to-speech'
const KEY = process.env.ELEVENLABS_API_KEY || process.env.ELEVEN_LAPS_API_KEY
const DATA = 'data/words-3000.json'
const CONCURRENCY = 4

const args = process.argv.slice(2)
const opt = (name, fallback) => (args.includes(`--${name}`) ? args[args.indexOf(`--${name}`) + 1] : fallback)
const force = args.includes('--force')
const sample = Number(opt('sample', 0))
const outDir = opt('out', sample ? 'samples/deck3000' : 'workbook/audio-3000')
const model = opt('model', 'eleven_v4')
const voiceKeys = opt('voices', sample ? Object.keys(VOICES).join(',') : 'isabel,javier').split(',')

if (!KEY) { console.error('Missing ELEVENLABS_API_KEY in .env.local'); process.exit(1) }
for (const k of voiceKeys) if (!VOICES[k]) { console.error(`Unknown voice ${k}`); process.exit(1) }

const words = JSON.parse(fs.readFileSync(DATA, 'utf8'))
fs.mkdirSync(outDir, { recursive: true })

const hash = (s) => crypto.createHash('md5').update(s).digest('hex').slice(0, 8)
export const fileNames = (w, voice) => ({ audio: `${w.word}_${voice}.mp3`, sentence_audio: `${w.word}_${voice}_${hash(w.example_es)}.mp3` })

let chars = 0
async function tts(text, voice, file) {
  const dest = path.join(outDir, file)
  if (!force && fs.existsSync(dest)) return
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(`${API}/${VOICES[voice].id}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({ text, model_id: model, language_code: 'es', seed: 1501 }),
    })
    if (res.ok) {
      fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()))
      chars += text.length
      return
    }
    const body = await res.text()
    if (res.status === 409 || res.status === 429 || res.status >= 500) { await new Promise((r) => setTimeout(r, 5000 * attempt)); continue }
    throw new Error(`${voice} "${text}": ${res.status} ${body.slice(0, 300)}`)
  }
  throw new Error(`${voice} "${text}": gave up after retries`)
}

const jobs = []
const list = sample ? words.slice(0, sample) : words
list.forEach((w, i) => {
  const voices = sample ? voiceKeys : [voiceKeys[i % voiceKeys.length]]
  for (const v of voices) {
    const f = fileNames(w, v)
    jobs.push(() => tts(w.word, v, f.audio), () => tts(w.example_es, v, f.sentence_audio))
    if (!sample) Object.assign(w, f)
  }
})

let failed = 0
const queue = [...jobs]
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (queue.length) {
    try { await queue.shift()() } catch (e) { failed++; console.error(e.message) }
  }
}))

if (!sample) fs.writeFileSync(DATA, JSON.stringify(words, null, 1))
console.log(`${jobs.length - failed}/${jobs.length} files in ${outDir}, ${chars} characters billed this run (model ${model})`)
if (failed) process.exitCode = 1
