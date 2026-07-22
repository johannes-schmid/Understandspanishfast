import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getRun } from 'workflow/api'

export const maxDuration = 300

// Streams the pack builder's progress events (NDJSON) for a workflow run.
// Durable + resumable: pass ?startIndex to resume after a dropped connection.
export async function GET(request, { params }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { runId } = await params
  const { searchParams } = new URL(request.url)
  const startIndexParam = searchParams.get('startIndex')
  const startIndex = startIndexParam != null ? parseInt(startIndexParam, 10) : undefined

  const run = getRun(runId)
  const readable = run.getReadable({ namespace: 'progress', startIndex })

  const encoder = new TextEncoder()
  const ndjson = readable.pipeThrough(
    new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(encoder.encode(JSON.stringify(chunk) + '\n'))
      },
    })
  )

  return new Response(ndjson, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
    },
  })
}
