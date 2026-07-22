import { emailShell } from './layout'
import { unsubscribeUrl } from './send'
import { pickWordPack } from './wordPacks'
import { articles } from '@/data/articles'
import {
  splitProgress, coveragePct, nextMilestone, toCountMap, computeStreak,
  daysSinceStudy, daysPracticed, totalCardsReviewed, articleReadiness,
} from '@/lib/userStats'

import * as welcome from './templates/welcome'
import * as firstWords from './templates/first-words'
import * as milestone from './templates/milestone'
import * as whatYouCanRead from './templates/what-you-can-read'
import * as whyReviews from './templates/why-reviews'
import * as monthRecap from './templates/month-recap'

// Order matters: later entries win when two land on the same day.
// The `key` values are primary keys in email_sends — renaming one re-sends it
// to every user who already received it. Do not rename after launch.
export const SEQUENCE = [welcome, firstWords, milestone, whatYouCanRead, whyReviews, monthRecap]

export const SEND_DAYS = SEQUENCE.map(t => t.dayOffset)

// A user counts as active if they have studied in the last 2 days — active
// users never get "we miss you" framing.
const ACTIVE_WITHIN_DAYS = 2

export function buildContext({ profile, progressRows, activityRows, emailKey }) {
  const { knownSet, learningSet, knownCount, learningCount, dueCount } = splitProgress(progressRows)
  const countMap = toCountMap(activityRows)
  const since = daysSinceStudy(activityRows)

  const seenRanks = new Set([...knownSet, ...learningSet])

  const scoredArticles = articles
    .map(a => ({ ...a, readiness: articleReadiness(a, knownCount) }))
    .sort((a, b) => b.readiness - a.readiness)
    .slice(0, 3)

  return {
    firstName: profile.full_name?.split(' ')[0] || 'there',
    knownCount,
    learningCount,
    dueCount,
    streak: computeStreak(countMap),
    coveragePct: coveragePct(knownCount),
    milestone: nextMilestone(knownCount),
    daysSinceStudy: since,
    isActive: since !== null && since <= ACTIVE_WITHIN_DAYS,
    hasEverStudied: since !== null,
    daysPracticed: daysPracticed(activityRows),
    totalReviews: totalCardsReviewed(activityRows),
    articles: scoredArticles,
    wordPack: pickWordPack({ userId: profile.id, emailKey, seenRanks }),
  }
}

export function render(template, ctx, profile) {
  return {
    subject: template.subject(ctx),
    html: emailShell({
      preheader: template.preheader(ctx),
      body: template.body(ctx),
      unsubscribeUrl: unsubscribeUrl(profile.unsubscribe_token),
    }),
  }
}
