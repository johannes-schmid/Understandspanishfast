import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getProgress } from '../storage/progress';
import { words } from '../data/words';

const TOTAL = 1500;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function comprehensionPct(knownCount) {
  return Math.round((knownCount / TOTAL) * 100);
}

function StatChip({ value, label, color }) {
  return (
    <View style={chip.wrap}>
      <Text style={[chip.value, { color }]}>{value}</Text>
      <Text style={chip.label}>{label}</Text>
    </View>
  );
}

const chip = StyleSheet.create({
  wrap: {
    flex: 1, backgroundColor: '#F5F3EE', borderRadius: 12,
    paddingVertical: 10, paddingHorizontal: 12,
    alignItems: 'center',
  },
  value: { fontSize: 22, fontWeight: '800', lineHeight: 26, letterSpacing: -0.5 },
  label: { fontSize: 10, color: '#9A9AB0', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: '600', marginTop: 2 },
});

function ProgressCard({ known }) {
  const pct = comprehensionPct(known);
  const barPct = Math.min(pct, 100);

  return (
    <View style={ring.container}>
      <View style={ring.topRow}>
        <View>
          <Text style={ring.pct}>{pct}%</Text>
          <Text style={ring.sub}>comprehension coverage</Text>
        </View>
        <View style={ring.badge}>
          <Text style={ring.badgeText}>{known} words</Text>
        </View>
      </View>
      <View style={ring.barTrack}>
        <View style={[ring.barFill, { width: `${barPct}%` }]} />
        {[100, 500, 1000, 1500].map(mark => (
          <View
            key={mark}
            style={[ring.marker, { left: `${(mark / TOTAL) * 100}%` }]}
          />
        ))}
      </View>
      <View style={ring.scaleRow}>
        <Text style={ring.scaleLabel}>0</Text>
        <Text style={ring.scaleLabel}>500</Text>
        <Text style={ring.scaleLabel}>1000</Text>
        <Text style={ring.scaleLabel}>1500</Text>
      </View>
    </View>
  );
}

const ring = StyleSheet.create({
  container: { padding: 24, paddingBottom: 16 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 },
  pct: { fontSize: 52, fontWeight: '900', color: '#1C1A3A', letterSpacing: -2, lineHeight: 56 },
  sub: { fontSize: 11, color: '#9A9AB0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  badge: { backgroundColor: '#F0FFF4', borderRadius: 10, paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: '#C6F6D5' },
  badgeText: { fontSize: 13, fontWeight: '700', color: '#276749' },
  barTrack: { height: 10, backgroundColor: '#E5E3F0', borderRadius: 99, overflow: 'visible', position: 'relative' },
  barFill: { height: '100%', backgroundColor: '#4CAF82', borderRadius: 99, minWidth: 4 },
  marker: { position: 'absolute', top: -3, width: 2, height: 16, backgroundColor: '#FFFFFF', borderRadius: 1 },
  scaleRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  scaleLabel: { fontSize: 9, color: '#C0BDD4', fontWeight: '600' },
});

function NextWordCard({ word, onStudy }) {
  if (!word) return null;
  return (
    <Pressable style={nwc.card} onPress={onStudy}>
      <View style={nwc.top}>
        <Text style={nwc.badge}>Next word · #{word.rank}</Text>
        <Text style={nwc.arrow}>→</Text>
      </View>
      <Text style={nwc.word}>{word.word}</Text>
      <Text style={nwc.pos}>{word.pos}</Text>
      <View style={nwc.divider} />
      <Text style={nwc.meaning}>{word.meanings[0]}</Text>
      {word.example_es ? (
        <Text style={nwc.example}>"{word.example_es}"</Text>
      ) : null}
    </Pressable>
  );
}

const nwc = StyleSheet.create({
  card: {
    backgroundColor: '#1C1A3A', borderRadius: 20, padding: 24, marginBottom: 16,
    shadowColor: '#1C1A3A', shadowOpacity: 0.25, shadowRadius: 20, shadowOffset: { width: 0, height: 8 },
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  badge: { fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  arrow: { fontSize: 16, color: '#4CAF82', fontWeight: '700' },
  word: { fontSize: 52, fontWeight: '900', color: '#FAF7F2', letterSpacing: -2, lineHeight: 56 },
  pos: { fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 4, marginBottom: 16 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: 16 },
  meaning: { fontSize: 20, fontWeight: '600', color: '#B8B0F0', marginBottom: 8 },
  example: { fontSize: 13, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', lineHeight: 20 },
});

export default function DashboardScreen({ navigation }) {
  const [data, setData] = useState(null);

  useFocusEffect(useCallback(() => {
    getProgress().then(p => {
      const knownSet = new Set(p.known);
      const nextWord = words.find(w => !knownSet.has(w.rank)) ?? null;
      setData({ ...p, nextWord });
    });
  }, []));

  if (!data) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#534AB7" />
      </View>
    );
  }

  const pct = comprehensionPct(data.known.length);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Greeting row */}
        <View style={styles.greetingRow}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          {!data.userId && (
            <Pressable style={styles.signInBtn} onPress={() => navigation.getParent().navigate('Login')}>
              <Text style={styles.signInBtnText}>Sign in</Text>
            </Pressable>
          )}
        </View>

        {/* Stats chips */}
        <View style={styles.chipsRow}>
          <StatChip value={data.known.length} label="Known" color="#276749" />
          <View style={{ width: 8 }} />
          <StatChip value={data.due.length} label="Due" color={data.due.length > 0 ? '#C05621' : '#9A9AB0'} />
          <View style={{ width: 8 }} />
          <StatChip value={data.learning.length} label="Reviewing" color="#534AB7" />
        </View>

        {/* Progress card */}
        <View style={styles.card}>
          <ProgressCard known={data.known.length} />
          <View style={styles.milestoneRow}>
            {[
              { words: 100,  label: '~50%' },
              { words: 500,  label: '~70%' },
              { words: 1000, label: '~80%' },
              { words: 1500, label: '~87%' },
            ].map(m => {
              const done = data.known.length >= m.words;
              return (
                <View key={m.words} style={[styles.milestone, done && styles.milestoneDone]}>
                  <Text style={[styles.milestonePct, done && styles.milestonePctDone]}>{m.label}</Text>
                  <Text style={styles.milestoneWords}>{m.words}w</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Next word card */}
        <NextWordCard word={data.nextWord} onStudy={() => navigation.navigate('Study')} />

        {/* Unlock banner */}
        {!data.unlocked && (
          <View style={styles.unlockBanner}>
            <Text style={styles.unlockTitle}>First 100 words are free</Text>
            <Text style={styles.unlockBody}>Unlock all 1,500 words for €5 — one-time, no subscription.</Text>
            <Pressable style={styles.unlockBtn} onPress={() => navigation.navigate('Study')}>
              <Text style={styles.unlockBtnText}>Get full access — €5</Text>
            </Pressable>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F3EE' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F3EE' },
  scroll: { padding: 20, paddingBottom: 40 },
  greetingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  greeting: { fontSize: 14, color: '#9A9AB0', fontWeight: '500' },
  signInBtn: { backgroundColor: '#F0EFF8', borderRadius: 10, paddingVertical: 6, paddingHorizontal: 14, borderWidth: 1, borderColor: '#DDD9F5' },
  signInBtnText: { fontSize: 12, fontWeight: '700', color: '#534AB7' },
  chipsRow: {
    flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 20,
    padding: 14, marginBottom: 16,
    shadowColor: '#1C1A3A', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
  },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 24, marginBottom: 16,
    shadowColor: '#1C1A3A', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    overflow: 'hidden',
  },
  milestoneRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F0EFF8', padding: 16, gap: 8 },
  milestone: { flex: 1, alignItems: 'center', backgroundColor: '#F5F3EE', borderRadius: 10, padding: 8 },
  milestoneDone: { backgroundColor: '#F0FFF4' },
  milestonePct: { fontSize: 13, fontWeight: '700', color: '#9A9AB0' },
  milestonePctDone: { color: '#276749' },
  milestoneWords: { fontSize: 10, color: '#B0B0C0', fontWeight: '600', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.4 },
  unlockBanner: {
    backgroundColor: '#F0EFF8', borderRadius: 20, padding: 24, borderWidth: 1,
    borderColor: '#DDD9F5', alignItems: 'center',
  },
  unlockTitle: { fontSize: 18, fontWeight: '800', color: '#1C1A3A', marginBottom: 6, letterSpacing: -0.3 },
  unlockBody: { fontSize: 13, color: '#6A6A8A', textAlign: 'center', lineHeight: 20, marginBottom: 16 },
  unlockBtn: {
    backgroundColor: '#534AB7', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24,
    shadowColor: '#534AB7', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
  },
  unlockBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});
