import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Pressable,
} from 'react-native';
import FlashCard from '../components/FlashCard';
import StatsBar from '../components/StatsBar';
import GateScreen from './GateScreen';
import { words } from '../data/words';
import { getProgress, rateWord, incrementSessionCount } from '../storage/progress';
import { requestAndScheduleReminders, sendMilestoneNotification } from '../storage/notifications';

const FREE_LIMIT = 20;
const ACCOUNT_LIMIT = 100;
const AVAILABLE_FREE = Math.min(ACCOUNT_LIMIT, words.length);

export default function VocabScreen() {
  const [state, setState] = useState({
    loading: true,
    known: [],
    learning: [],
    due: [],
    sessionCount: 0,
    unlocked: false,
    userId: null,
    gate: null,
    queue: [],       // ordered list of ranks to study this session
    queueIndex: 0,
  });

  useEffect(() => {
    loadProgress();
  }, []);

  async function loadProgress() {
    requestAndScheduleReminders(); // fire-and-forget

    const p = await getProgress();
    const queue = buildQueue(p);

    setState(prev => ({
      ...prev,
      loading: false,
      known: p.known,
      learning: p.learning,
      due: p.due,
      sessionCount: p.sessionCount,
      unlocked: p.unlocked,
      userId: p.userId,
      queue,
      queueIndex: 0,
    }));
  }

  function buildQueue({ progressMap, known, learning, due, unlocked }) {
    const knownSet = new Set(known);
    const limit = unlocked ? words.length : AVAILABLE_FREE;
    const now = new Date();

    // Due reviews first, then unseen words
    const dueRanks = words
      .filter(w => w.rank <= limit && progressMap[w.rank] && new Date(progressMap[w.rank].due) <= now)
      .map(w => w.rank);

    const newRanks = words
      .filter(w => w.rank <= limit && !progressMap[w.rank])
      .map(w => w.rank)
      .slice(0, 20);

    return [...dueRanks, ...newRanks];
  }

  async function handleRating(rating) {
    const rank = state.queue[state.queueIndex];
    if (rank == null) return;

    const progressMap = await rateWord(rank, rating);
    const newSessionCount = await incrementSessionCount();

    // Recompute stats
    const knownSet = new Set();
    const learningSet = new Set();
    Object.entries(progressMap).forEach(([r, d]) => {
      if (['good', 'easy'].includes(d.status)) knownSet.add(parseInt(r, 10));
      else learningSet.add(parseInt(r, 10));
    });
    const known = [...knownSet];
    const learning = [...learningSet];

    // Fire milestone notification
    const milestones = [10, 50, 100, 250, 500, 1000, 1500];
    if (milestones.includes(known.length)) {
      sendMilestoneNotification(known.length);
    }

    const nextIndex = state.queueIndex + 1;
    let gate = null;

    if (!state.userId && newSessionCount >= FREE_LIMIT) {
      gate = 'signup';
    } else if (!state.unlocked && known.length >= ACCOUNT_LIMIT) {
      gate = 'payment';
    }

    setState(prev => ({
      ...prev,
      known,
      learning,
      sessionCount: newSessionCount,
      queueIndex: nextIndex,
      gate,
    }));
  }

  function dismissGate() {
    setState(prev => ({ ...prev, gate: null }));
  }

  if (state.loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#534AB7" />
      </View>
    );
  }

  if (state.gate) {
    return <GateScreen type={state.gate} onContinue={dismissGate} />;
  }

  const currentRank = state.queue[state.queueIndex];
  const word = currentRank != null ? words.find(w => w.rank === currentRank) : null;
  const limit = state.unlocked ? words.length : AVAILABLE_FREE;
  const progressPct = (state.known.length / limit) * 100;
  const sessionDone = state.queueIndex;
  const sessionTotal = state.queue.length;

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Most Common Spanish</Text>
          <Text style={styles.subtitle}>Frequency-ranked vocabulary</Text>
        </View>
        {sessionTotal > 0 && (
          <View style={styles.sessionBadge}>
            <Text style={styles.sessionBadgeText}>{sessionDone}/{sessionTotal}</Text>
          </View>
        )}
      </View>

      {/* ── Stats bar ── */}
      <StatsBar
        known={state.known.length}
        learning={state.learning.length}
        due={state.due.length}
      />

      {/* ── Progress bar ── */}
      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>
        <Text style={styles.progressLabel}>
          {state.known.length} / {limit} words known
          {!state.unlocked && (
            <Text style={styles.progressSub}> · {limit - state.known.length} to {state.unlocked ? 'complete' : 'unlock'}</Text>
          )}
        </Text>
      </View>

      {/* ── Card or all-done ── */}
      {word ? (
        <FlashCard
          key={`${currentRank}-${state.queueIndex}`}
          word={word}
          rank={currentRank}
          total={limit}
          onResult={handleRating}
        />
      ) : (
        <View style={styles.allDone}>
          <Text style={styles.allDoneEmoji}>🎉</Text>
          <Text style={styles.allDoneTitle}>All caught up!</Text>
          <Text style={styles.allDoneBody}>
            {state.known.length > 0
              ? `You know ${state.known.length} words. Come back tomorrow for your next review.`
              : 'No cards due right now. Check back later.'}
          </Text>
          <Pressable style={styles.refreshBtn} onPress={loadProgress}>
            <Text style={styles.refreshBtnText}>Refresh</Text>
          </Pressable>
        </View>
      )}

      {/* ── Footer notice ── */}
      {!state.unlocked && word && (
        <Text style={styles.footerNotice}>
          {state.userId
            ? `Unlock all 1,500 words — €5 one-time`
            : `${Math.max(0, FREE_LIMIT - state.sessionCount)} free cards remaining`}
        </Text>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F3EE',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F3EE',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1A3A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 11,
    color: '#9A9AB0',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '600',
  },
  sessionBadge: {
    backgroundColor: '#534AB7',
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  sessionBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  progressWrap: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#E5E3F0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF82',
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 11,
    color: '#9A9AB0',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  progressSub: {
    color: '#B0B0C8',
  },
  allDone: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  allDoneEmoji: {
    fontSize: 52,
    marginBottom: 16,
  },
  allDoneTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1C1A3A',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  allDoneBody: {
    fontSize: 16,
    color: '#9A9AB0',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
  },
  refreshBtn: {
    backgroundColor: '#534AB7',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  refreshBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  footerNotice: {
    textAlign: 'center',
    fontSize: 12,
    color: '#B0B0C0',
    paddingBottom: 16,
    paddingTop: 8,
    paddingHorizontal: 20,
    fontWeight: '500',
  },
});
