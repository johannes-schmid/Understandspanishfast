import { SEQUENCE } from './sequence'

// Whole days between signup and now, in UTC. study_activity.date is written in
// UTC by /api/progress, so the whole system stays on one clock.
export function daysSinceSignup(createdAt, now = new Date()) {
  const start = Date.UTC(
    new Date(createdAt).getUTCFullYear(),
    new Date(createdAt).getUTCMonth(),
    new Date(createdAt).getUTCDate()
  )
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  return Math.round((today - start) / 86400000)
}

// Never send more than one email per user per run. If two land on the same day
// (only possible after a missed cron), the later one wins.
export function dueTemplate(profile, now = new Date()) {
  const age = daysSinceSignup(profile.created_at, now)
  const matches = SEQUENCE.filter(t => t.dayOffset === age)
  return matches.length ? matches[matches.length - 1] : null
}

const NEVER_STUDIED_CUTOFF_DAY = 14

// Returns { send: true, template } or { send: false, reason }.
export function evaluate({ profile, ctx, template }) {
  if (profile.email_opt_out) return { send: false, reason: 'opted-out' }
  if (!profile.email) return { send: false, reason: 'no-email' }
  if (!template) return { send: false, reason: 'not-due' }

  // A user who has never once studied will not engage on day 30. Sending anyway
  // is pure spam-complaint risk, so the sequence stops for them after day 14.
  if (!ctx.hasEverStudied && template.dayOffset > NEVER_STUDIED_CUTOFF_DAY) {
    return { send: false, reason: 'inactive-cutoff' }
  }

  return { send: true, template }
}
