// Narrates a story JSON with ElevenLabs in two candidate voices (Latin American + Spain).
// Usage: node --env-file=.env.local scripts/readers/audio.mjs samples/readers/level1-story01.json [--voices latam,spain | name:voiceId:accent,...] [--model eleven_v4_turbo] [--speed 0.9]
// Voice IDs: set ELEVENLABS_VOICE_LATAM / ELEVENLABS_VOICE_SPAIN, or the script picks the most-used
// narration voice for each accent from the public Voice Library and adds it to your account.
// Docs: POST /v1/text-to-speech/{voice_id}, request stitching via previous_request_ids (max 3), GET /v1/shared-voices.
import fs from 'node:fs'
import path from 'node:path'

const KEY = process.env.ELEVENLABS_API_KEY || process.env.ELEVEN_LAPS_API_KEY
if (!KEY) { console.error('ELEVENLABS_API_KEY (or ELEVEN_LAPS_API_KEY) missing in .env.local'); process.exit(1) }
const API = 'https://api.elevenlabs.io'
const arg = (k, d) => (process.argv.includes(`--${k}`) ? process.argv[process.argv.indexOf(`--${k}`) + 1] : d)
const file = process.argv[2]
const MODEL = arg('model', 'eleven_v4_turbo')
const SPEED = Number(arg('speed', 0.9))
const which = arg('voices', 'latam,spain').split(',')
const story = JSON.parse(fs.readFileSync(file, 'utf8'))
const outDir = path.dirname(file)

const CANDIDATES = {
  latam: { env: 'ELEVENLABS_VOICE_LATAM', accents: ['latin american', 'mexican', 'colombian', 'argentine'], locales: ['es-MX', 'es-CO', 'es-AR', 'es-419'] },
  spain: { env: 'ELEVENLABS_VOICE_SPAIN', accents: ['peninsular', 'castilian', 'spain', 'spanish'], locales: ['es-ES'] },
}

async function api(p, opts = {}) {
  const res = await fetch(API + p, { ...opts, headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json', ...(opts.headers || {}) } })
  if (!res.ok) throw new Error(`${opts.method || 'GET'} ${p} → ${res.status} ${await res.text()}`)
  return res
}

async function pickVoice(kind) {
  const c = CANDIDATES[kind]
  if (process.env[c.env]) return { voice_id: process.env[c.env], name: c.env }
  const q = new URLSearchParams({ language: 'es', use_cases: 'narrative_story', sort: 'usage_character_count_1y', page_size: '100' })
  const { voices } = await (await api(`/v1/shared-voices?${q}`)).json()
  const match = voices.find((v) => c.locales.includes(v.locale) || c.accents.some((a) => (v.accent || '').toLowerCase().includes(a)) ||
    (v.verified_languages || []).some((l) => l.language === 'es' && (c.locales.includes(l.locale) || c.accents.some((a) => (l.accent || '').toLowerCase().includes(a)))))
  if (!match) throw new Error(`no ${kind} narration voice found in the Voice Library`)
  const { voice_id } = await (await api(`/v1/voices/add/${match.public_owner_id}/${match.voice_id}`, { method: 'POST', body: JSON.stringify({ new_name: `Readers ${kind} – ${match.name}` }) })).json()
  console.log(`${kind}: added "${match.name}" (${match.accent || match.locale}) as ${voice_id}. Pin it with ${c.env}=${voice_id}`)
  return { voice_id, name: match.name, accent: match.accent, locale: match.locale }
}

// Title, then paragraphs grouped into chunks under ~2,500 chars; stitched so prosody carries over.
function chunks() {
  const parts = [`${story.title}.`, ...story.paragraphs]
  const out = []
  let cur = ''
  for (const p of parts) {
    if (cur && cur.length + p.length > 2500) { out.push(cur); cur = '' }
    cur = cur ? `${cur}\n\n${p}` : p
  }
  if (cur) out.push(cur)
  return out
}

async function narrate(spec) {
  const [kind, id, accent] = spec.split(':')
  const voice = id ? { voice_id: id, name: kind, accent } : await pickVoice(kind)
  const ids = []
  const buffers = []
  let chars = 0
  for (const text of chunks()) {
    const res = await api(`/v1/text-to-speech/${voice.voice_id}?output_format=mp3_44100_128`, {
      method: 'POST',
      body: JSON.stringify({
        text,
        model_id: MODEL,
        voice_settings: { stability: 0.6, similarity_boost: 0.75, style: 0, speed: SPEED, use_speaker_boost: true },
        previous_request_ids: ids.slice(-3),
        seed: 7,
      }),
    })
    ids.push(res.headers.get('request-id'))
    buffers.push(Buffer.from(await res.arrayBuffer()))
    chars += text.length
  }
  const out = path.join(outDir, `${story.id}${id ? '_' : '-'}${kind}.mp3`)
  fs.writeFileSync(out, Buffer.concat(buffers))
  console.log(`wrote ${out} · ${chars} characters · voice ${voice.name}`)
  return { kind, accent: accent || kind, file: path.basename(out), voice, characters: chars, model: MODEL, speed: SPEED }
}

const results = []
for (const k of which) results.push(await narrate(k))
story.audio = results
fs.writeFileSync(file, JSON.stringify(story, null, 2))
