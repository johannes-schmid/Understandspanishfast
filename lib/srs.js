// SM-2 spaced repetition algorithm
// rating: 0=again, 1=hard, 2=good, 3=easy
export function computeSRS(interval = 1, easeFactor = 2.5, repetitions = 0, rating) {
  let newInterval = interval
  let newEF = easeFactor
  let newReps = repetitions

  if (rating === 0) {
    newInterval = 1
    newEF = Math.max(1.3, easeFactor - 0.2)
    newReps = 0
  } else {
    newReps = repetitions + 1
    if (rating === 1) {
      newInterval = repetitions < 1 ? 1 : Math.ceil(interval * 1.2)
      newEF = Math.max(1.3, easeFactor - 0.15)
    } else if (rating === 2) {
      newInterval = repetitions < 1 ? 1 : repetitions === 1 ? 6 : Math.ceil(interval * easeFactor)
    } else {
      newInterval = repetitions < 1 ? 4 : Math.ceil(interval * easeFactor * 1.3)
      newEF = easeFactor + 0.15
    }
  }

  const nextReview = new Date()
  if (rating === 0) {
    nextReview.setMinutes(nextReview.getMinutes() + 10)
  } else {
    nextReview.setDate(nextReview.getDate() + newInterval)
  }

  return {
    interval: newInterval,
    ease_factor: newEF,
    repetitions: newReps,
    next_review: nextReview.toISOString(),
  }
}

export const RATING = { again: 0, hard: 1, good: 2, easy: 3 }
