import { words } from '@/data/words'

export const dynamic = 'force-static'

export function GET() {
  const deck = words.slice(0, 1500).map((w) => ({
    rank: w.rank,
    word: w.word,
    pos: w.pos ?? null,
    meanings: w.meanings,
    example_es: w.example_es ?? null,
    example_en: w.example_en ?? null,
    image: w.image ? w.image.replace(/\.(jpg|jpeg|png)$/i, '.webp') : null,
    audio: w.audio ?? null,
    sentence_audio: w.sentence_audio ?? null,
  }))
  return Response.json(deck, {
    headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
  })
}
