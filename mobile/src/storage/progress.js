import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  PROGRESS: 'srs_progress_v2',
  SESSION_COUNT: 'session_card_count',
  UNLOCKED: 'unlocked',
  USER_ID: 'user_id',
};

// progress[rank] = { status: 'again'|'hard'|'good'|'easy', interval: days, due: ISO string }

function computeNextDue(current, rating) {
  const now = new Date();
  const intervals = {
    again: 0.007, // ~10 min
    hard:  1,
    good:  3,
    easy:  7,
  };
  const days = current ? intervals[rating] * (current.interval || 1) : intervals[rating];
  const clampedDays = Math.min(days, 30);
  const due = new Date(now.getTime() + clampedDays * 86400 * 1000);
  return { interval: clampedDays, due: due.toISOString() };
}

export async function getProgress() {
  const [progress, sessionCount, unlocked, userId] = await Promise.all([
    AsyncStorage.getItem(KEYS.PROGRESS),
    AsyncStorage.getItem(KEYS.SESSION_COUNT),
    AsyncStorage.getItem(KEYS.UNLOCKED),
    AsyncStorage.getItem(KEYS.USER_ID),
  ]);
  const progressMap = JSON.parse(progress ?? '{}');
  const now = new Date();

  const known = [];
  const learning = [];
  const due = [];

  Object.entries(progressMap).forEach(([rank, data]) => {
    const r = parseInt(rank, 10);
    if (['good', 'easy'].includes(data.status)) known.push(r);
    else learning.push(r);
    if (new Date(data.due) <= now) due.push(r);
  });

  return {
    progressMap,
    known,
    learning,
    due,
    sessionCount: parseInt(sessionCount ?? '0', 10),
    unlocked: unlocked === 'true',
    userId: userId ?? null,
  };
}

export async function rateWord(rank, rating) {
  const raw = await AsyncStorage.getItem(KEYS.PROGRESS);
  const progressMap = JSON.parse(raw ?? '{}');
  const current = progressMap[rank];
  const { interval, due } = computeNextDue(current, rating);
  progressMap[rank] = { status: rating, interval, due };
  await AsyncStorage.setItem(KEYS.PROGRESS, JSON.stringify(progressMap));
  return progressMap;
}

export async function incrementSessionCount() {
  const current = parseInt((await AsyncStorage.getItem(KEYS.SESSION_COUNT)) ?? '0', 10);
  const next = current + 1;
  await AsyncStorage.setItem(KEYS.SESSION_COUNT, String(next));
  return next;
}

export async function setUserId(id) {
  await AsyncStorage.setItem(KEYS.USER_ID, id);
}

export async function setUnlocked(value) {
  await AsyncStorage.setItem(KEYS.UNLOCKED, value ? 'true' : 'false');
}

export async function resetSessionCount() {
  await AsyncStorage.setItem(KEYS.SESSION_COUNT, '0');
}
