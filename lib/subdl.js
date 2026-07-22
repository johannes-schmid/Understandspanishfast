// Minimal Subdl API client (https://subdl.com/api-doc).
// Search: GET https://api.subdl.com/api/v1/subtitles?api_key=…
// Download: https://dl.subdl.com + <subtitle.url> → a ZIP containing the .srt.
// Free anonymous downloads: 300/day per IP; authenticated via api_key for higher quota.

import { unzipSync } from 'fflate'

const API_BASE = 'https://api.subdl.com/api/v1/subtitles'
const DL_BASE = 'https://dl.subdl.com'

class SubdlError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

export async function searchSubtitles({ query, season, episode, languages = 'ES' }) {
  const params = new URLSearchParams({
    api_key: process.env.SUBDL_API_KEY || '',
    film_name: query,
    languages,
    subs_per_page: '30',
  })
  if (season != null || episode != null) params.set('type', 'tv')
  if (season != null) params.set('season_number', String(season))
  if (episode != null) params.set('episode_number', String(episode))

  const res = await fetch(`${API_BASE}?${params}`)
  if (res.status === 429) throw new SubdlError('rate limited', 429)
  if (!res.ok) throw new SubdlError(`search failed (${res.status})`, res.status)
  const json = await res.json()
  if (json.status === false) throw new SubdlError(json.error || 'search error', 400)

  const results = (json.subtitles || []).slice(0, 30).map((s) => ({
    url: s.url,
    releaseName: s.release_name || s.name || 'unknown',
    language: s.language || s.lang || null,
    season: s.season ?? null,
    episode: s.episode ?? null,
    hearingImpaired: !!s.hi,
  })).filter((r) => r.url)
  return { results }
}

export async function downloadSubtitleText(url) {
  const res = await fetch(`${DL_BASE}${url}`, {
    headers: process.env.SUBDL_API_KEY ? { 'x-api-key': process.env.SUBDL_API_KEY } : {},
  })
  if (res.status === 429) throw new SubdlError('download quota exceeded', 429)
  if (!res.ok) throw new SubdlError(`download failed (${res.status})`, res.status)

  const buf = new Uint8Array(await res.arrayBuffer())
  const files = unzipSync(buf)
  // Pick the largest .srt in the archive (season packs may bundle several).
  let best = null
  for (const [name, bytes] of Object.entries(files)) {
    if (!/\.srt$/i.test(name)) continue
    if (!best || bytes.length > best.bytes.length) best = { name, bytes }
  }
  if (!best) throw new SubdlError('no .srt found in subtitle archive', 500)
  return new TextDecoder('utf-8').decode(best.bytes)
}

// Strip .srt formatting down to spoken text.
export function stripSrt(srt) {
  return srt
    .split(/\r?\n/)
    .filter((line) => {
      const t = line.trim()
      if (!t) return false
      if (/^\d+$/.test(t)) return false // index line
      if (/-->/.test(t)) return false // timestamp line
      return true
    })
    .map((line) => line.replace(/<[^>]+>/g, '').replace(/\{[^}]*\}/g, '').trim())
    .join(' ')
}

export { SubdlError }
