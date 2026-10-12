const KEY = 'mcs:study:v1'

const EMPTY = { progress: {}, settings: { front: 'spanish', audio: true }, unlocked: false, activity: {} }

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return structuredClone(EMPTY)
    const s = JSON.parse(raw)
    return {
      progress: s.progress ?? {},
      settings: { ...EMPTY.settings, ...s.settings },
      unlocked: !!s.unlocked,
      activity: s.activity ?? {},
    }
  } catch {
    return structuredClone(EMPTY)
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {}
}

export function todayIso(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function streakFrom(activity) {
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  if (!(activity[todayIso(cursor)] > 0)) cursor.setDate(cursor.getDate() - 1)
  let streak = 0
  while (activity[todayIso(cursor)] > 0) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function isKnown(entry) {
  return entry && (entry.s === 'good' || entry.s === 'easy')
}
