import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getArtifact } from '@/lib/packArtifacts'
import { canBuildPack } from '@/lib/packLimit'

export const maxDuration = 60

const MAX_PACK_WORDS = 80

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const buildId = String(body.buildId || '')
  const selectedKeys = Array.isArray(body.selectedKeys) ? body.selectedKeys : []
  if (!buildId) return NextResponse.json({ error: 'buildId required' }, { status: 400 })

  const curation = await getArtifact(buildId, 'curation')
  if (!curation) return NextResponse.json({ error: 'build not found' }, { status: 404 })
  if (curation.userId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Authoritative free-pack limit (the build pre-check can be raced/bypassed).
  const { allowed } = await canBuildPack(supabase, user.id)
  if (!allowed) {
    return NextResponse.json(
      { error: "You've used your free pack. Unlock for unlimited packs.", paywall: true },
      { status: 402 },
    )
  }

  const keep = new Set(selectedKeys)
  const words = curation.words.filter((w) => keep.has(w.key)).slice(0, MAX_PACK_WORDS)
  if (words.length === 0) {
    return NextResponse.json({ error: 'Select at least one word' }, { status: 400 })
  }

  const title = String(body.title || curation.title || 'Vocabulary pack').slice(0, 120)

  const { data: pack, error: packErr } = await supabase
    .from('vocab_packs')
    .insert({
      user_id: user.id, title, source_type: curation.sourceType,
      source_ref: curation.sourceLabel || null, status: 'ready',
      word_count: words.length, build_id: buildId,
    })
    .select('id')
    .single()

  if (packErr) {
    // Duplicate build_id → this build was already saved; return the existing pack.
    if (packErr.code === '23505') {
      const { data: existing } = await supabase
        .from('vocab_packs')
        .select('id, word_count')
        .eq('build_id', buildId)
        .eq('user_id', user.id)
        .maybeSingle()
      if (existing) return NextResponse.json({ packId: existing.id, wordCount: existing.word_count })
    }
    return NextResponse.json({ error: packErr.message }, { status: 500 })
  }

  const rows = words.map((w, i) => ({
    pack_id: pack.id, position: i, lemma: w.lemma, corpus_rank: w.corpus_rank ?? null,
    pos: w.pos, meanings: w.meanings, example_es: w.example_es, example_en: w.example_en,
    why: null, image: w.image ?? null, doc_freq: null,
  }))
  const { error: wordsErr } = await supabase.from('pack_words').insert(rows)
  if (wordsErr) {
    await supabase.from('vocab_packs').delete().eq('id', pack.id)
    return NextResponse.json({ error: wordsErr.message }, { status: 500 })
  }

  // New pack becomes the active pack.
  await supabase
    .from('user_settings')
    .upsert({ user_id: user.id, active_pack_id: pack.id }, { onConflict: 'user_id' })

  return NextResponse.json({ packId: pack.id, wordCount: words.length })
}
