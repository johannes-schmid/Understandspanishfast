import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { start } from 'workflow/api'
import { buildPackWorkflow } from '@/workflows/buildPack'

export const maxDuration = 60

const MAX_PDF_BYTES = 8 * 1024 * 1024
const UPLOAD_BUCKET = 'pack-uploads'

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const buildId = crypto.randomUUID()
  const contentType = request.headers.get('content-type') || ''
  let source

  if (contentType.includes('multipart/form-data')) {
    const form = await request.formData()
    const file = form.get('file')
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'file required' }, { status: 400 })
    }
    if (file.size > MAX_PDF_BYTES) {
      return NextResponse.json({ error: 'PDF too large (max 8MB)' }, { status: 400 })
    }
    const path = `${user.id}/${buildId}.pdf`
    const admin = createAdminClient()
    const { error } = await admin.storage
      .from(UPLOAD_BUCKET)
      .upload(path, file, { contentType: 'application/pdf', upsert: true })
    if (error) {
      return NextResponse.json({ error: `upload failed: ${error.message}` }, { status: 500 })
    }
    source = { type: 'pdf', storagePath: path, label: file.name }
  } else {
    const body = await request.json().catch(() => ({}))
    if (body.source_type === 'url') {
      const url = (body.url || '').trim()
      if (!/^https?:\/\//i.test(url)) {
        return NextResponse.json({ error: 'valid url required' }, { status: 400 })
      }
      source = { type: 'url', url, label: url }
    } else if (body.source_type === 'srt') {
      const query = (body.query || '').trim()
      if (!query) return NextResponse.json({ error: 'series name required' }, { status: 400 })
      source = {
        type: 'srt', query, label: query,
        season: body.season != null ? Number(body.season) : undefined,
        episode: body.episode != null ? Number(body.episode) : undefined,
        year: body.year != null ? Number(body.year) : undefined,
      }
    } else {
      return NextResponse.json({ error: 'unknown source_type' }, { status: 400 })
    }
  }

  const run = await start(buildPackWorkflow, [{ userId: user.id, buildId, source }])
  return NextResponse.json({ runId: run.runId, buildId })
}
