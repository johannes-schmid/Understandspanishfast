import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { computeSRS, RATING } from '@/lib/srs'

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { word_rank, status } = await request.json()
  if (!word_rank || !['again', 'hard', 'good', 'easy'].includes(status)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('user_word_progress')
    .select('interval, ease_factor, repetitions')
    .eq('user_id', user.id)
    .eq('word_rank', word_rank)
    .maybeSingle()

  const srs = computeSRS(
    existing?.interval ?? 1,
    existing?.ease_factor ?? 2.5,
    existing?.repetitions ?? 0,
    RATING[status]
  )

  const { error } = await supabase
    .from('user_word_progress')
    .upsert(
      { user_id: user.id, word_rank, status, ...srs },
      { onConflict: 'user_id,word_rank' }
    )

  if (error) {
    // Check constraint blocks saves until migration is run in Supabase — return ok so session continues
    if (error.code === '23514') return NextResponse.json({ ok: true, pending_migration: true })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
