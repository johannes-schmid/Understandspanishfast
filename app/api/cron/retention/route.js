import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { SEND_DAYS, buildContext, render } from '@/lib/email/sequence'
import { dueTemplate, evaluate, daysSinceSignup } from '@/lib/email/eligibility'
import { sendEmail } from '@/lib/email/send'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Service-role client: there is no request session in a cron, so the cookie-bound
// helper in lib/supabase/server.js cannot be used here.
function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

function groupBy(rows, key) {
  const map = new Map()
  for (const row of rows) {
    if (!map.has(row[key])) map.set(row[key], [])
    map.get(row[key]).push(row)
  }
  return map
}

export async function GET(request) {
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dry = new URL(request.url).searchParams.get('dry') === '1'
  const supabase = admin()
  const now = new Date()

  // Only users whose signup age matches a send day are candidates. Anyone older
  // than the last offset falls out naturally, so the backfill can never trigger
  // a retroactive blast at existing users.
  const oldest = new Date(now)
  oldest.setUTCDate(oldest.getUTCDate() - (Math.max(...SEND_DAYS) + 1))

  const { data: candidates, error: profilesError } = await supabase
    .from('profiles')
    .select('id, email, full_name, created_at, unsubscribe_token, email_opt_out')
    .eq('email_opt_out', false)
    .gte('created_at', oldest.toISOString())

  if (profilesError) {
    return NextResponse.json({ error: profilesError.message }, { status: 500 })
  }

  const cohort = (candidates ?? []).filter(p => SEND_DAYS.includes(daysSinceSignup(p.created_at, now)))

  if (cohort.length === 0) {
    return NextResponse.json({ processed: 0, sent: 0, skipped: 0, failed: 0, dry })
  }

  const ids = cohort.map(p => p.id)

  // Two queries for the whole cohort rather than two per user.
  const [progressResult, activityResult] = await Promise.all([
    supabase.from('user_word_progress').select('user_id, word_rank, status, next_review').in('user_id', ids),
    supabase.from('study_activity').select('user_id, date, cards_reviewed').in('user_id', ids),
  ])

  const progressByUser = groupBy(progressResult.data ?? [], 'user_id')
  const activityByUser = groupBy(activityResult.data ?? [], 'user_id')

  const results = { processed: cohort.length, sent: 0, skipped: 0, failed: 0, dry, detail: [] }

  for (const profile of cohort) {
    const template = dueTemplate(profile, now)
    const activityRows = (activityByUser.get(profile.id) ?? [])
      .map(r => ({ date: r.date, count: r.cards_reviewed ?? 0 }))

    const ctx = template
      ? buildContext({
          profile,
          progressRows: progressByUser.get(profile.id) ?? [],
          activityRows,
          emailKey: template.key,
        })
      : null

    const verdict = evaluate({ profile, ctx, template })

    if (!verdict.send) {
      results.skipped++
      results.detail.push({ email: profile.email, skipped: verdict.reason })
      continue
    }

    const { subject, html } = render(template, ctx, profile)

    if (dry) {
      results.detail.push({ email: profile.email, key: template.key, subject, dryRun: true })
      continue
    }

    // Claim the send BEFORE calling Resend. A duplicate insert (23505) means
    // another run already took it — that is a skip, not an error.
    const { error: claimError } = await supabase
      .from('email_sends')
      .insert({ user_id: profile.id, email_key: template.key })

    if (claimError) {
      results.skipped++
      results.detail.push({
        email: profile.email,
        skipped: claimError.code === '23505' ? 'already-sent' : claimError.message,
      })
      continue
    }

    try {
      await sendEmail({
        to: profile.email,
        subject,
        html,
        userId: profile.id,
        emailKey: template.key,
        unsubToken: profile.unsubscribe_token,
      })
      results.sent++
      results.detail.push({ email: profile.email, key: template.key, subject })
    } catch (err) {
      // Release the claim so the next run can retry this one.
      await supabase.from('email_sends').delete()
        .eq('user_id', profile.id).eq('email_key', template.key)

      results.failed++
      results.detail.push({ email: profile.email, key: template.key, error: err.message })
      console.error(`[retention] ${template.key} -> ${profile.email}:`, err.message)
    }
  }

  return NextResponse.json(results)
}
