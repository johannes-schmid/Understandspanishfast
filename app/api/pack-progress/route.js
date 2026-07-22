import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { computeSRS, RATING } from '@/lib/srs'
import { bumpStudyActivity } from '@/lib/studyActivity'

// SRS write for NON-corpus pack words (keyed on pack_word_id).
// Corpus pack words go through /api/progress by word_rank instead.
export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { pack_word_id, status } = await request.json()
  if (!pack_word_id || !['again', 'hard', 'good', 'easy'].includes(status)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('user_pack_word_progress')
    .select('interval, ease_factor, repetitions')
    .eq('user_id', user.id)
    .eq('pack_word_id', pack_word_id)
    .maybeSingle()

  const srs = computeSRS(
    existing?.interval ?? 1,
    existing?.ease_factor ?? 2.5,
    existing?.repetitions ?? 0,
    RATING[status]
  )

  const { error } = await supabase
    .from('user_pack_word_progress')
    .upsert(
      { user_id: user.id, pack_word_id, status, ...srs },
      { onConflict: 'user_id,pack_word_id' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const activity = await bumpStudyActivity(supabase, user.id)
  return NextResponse.json({ ok: true, activity })
}
