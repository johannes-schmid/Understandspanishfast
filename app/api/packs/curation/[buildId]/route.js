import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getArtifact } from '@/lib/packArtifacts'

// Returns the curation payload (auto-selected words + in-context token stream)
// produced by the agent's prepareCuration step, for the review UI.
export async function GET(request, { params }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { buildId } = await params
  const curation = await getArtifact(buildId, 'curation')
  if (!curation) return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (curation.userId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { title, sourceType, sourceLabel, words, tokens } = curation
  return NextResponse.json({
    title, sourceType, sourceLabel, words, tokens,
    counts: {
      auto: words.filter((w) => w.isAuto).length,
      candidate: words.filter((w) => !w.isAuto).length,
    },
  })
}
