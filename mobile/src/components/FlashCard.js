import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Animated, Pressable, Dimensions, Image, ScrollView,
} from 'react-native';
import { speakWord, speakSentence } from '../storage/audio';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = 340;
const IMAGE_BASE = 'https://mostcommonspanish.com/word-images/';

const RATINGS = [
  { key: 'again', label: 'Again', hint: "Didn't know", color: '#D4537E', bg: '#FBEAF0', border: '#F0C4D4' },
  { key: 'hard',  label: 'Hard',  hint: 'Struggled',   color: '#C07050', bg: '#FFF3E0', border: '#EACFBB' },
  { key: 'good',  label: 'Good',  hint: 'Got it',       color: '#534AB7', bg: '#EEEDF8', border: '#C8C2F0' },
  { key: 'easy',  label: 'Easy',  hint: 'Instant',      color: '#276749', bg: '#F0FFF4', border: '#C6F6D5' },
];

export default function FlashCard({ word, onResult, rank, total }) {
  const [revealed, setRevealed] = useState(false);
  const [imageError, setImageError] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const sentenceTimer = useRef(null);

  // Auto-play word audio when card mounts
  useEffect(() => {
    speakWord(word.word);
    return () => {
      if (sentenceTimer.current) clearTimeout(sentenceTimer.current);
    };
  }, [word.word]);

  function flip() {
    if (revealed) return;
    setRevealed(true);
    Animated.spring(flipAnim, {
      toValue: 1,
      friction: 8,
      tension: 50,
      useNativeDriver: true,
    }).start();
    sentenceTimer.current = setTimeout(() => speakSentence(word.word), 1500);
  }

  // Front rotates 0→90deg (disappears), back rotates -90deg→0deg (appears)
  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });
  // Hide the correct face during each half of the flip
  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.49, 0.5, 1],
    outputRange: [1, 1, 0, 0],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.49, 0.5, 1],
    outputRange: [0, 0, 1, 1],
  });

  const imageUri = word.image ? `${IMAGE_BASE}${encodeURIComponent(word.image)}` : null;

  return (
    <View style={styles.container}>

      {/* ── Card flip container ── */}
      <Pressable onPress={flip} style={styles.cardWrapper}>

        {/* FRONT — Spanish word */}
        <Animated.View style={[
          styles.card, styles.front,
          { opacity: frontOpacity, transform: [{ rotateY: frontRotate }] },
        ]}>
          <View style={styles.frontTopRow}>
            <Text style={styles.rankBadge}>#{rank} of {total}</Text>
            <Pressable onPress={(e) => { e.stopPropagation?.(); speakWord(word.word); }} hitSlop={8}>
              <Text style={{ fontSize: 18 }}>🔊</Text>
            </Pressable>
          </View>
          <View style={styles.frontCenter}>
            <Text style={styles.posText}>{word.pos}</Text>
            <Text style={styles.wordText}>{word.word}</Text>
          </View>
          <Text style={styles.tapHint}>tap to flip</Text>
        </Animated.View>

        {/* BACK — Meaning + image + example */}
        <Animated.View style={[
          styles.card, styles.back,
          { opacity: backOpacity, transform: [{ rotateY: backRotate }] },
        ]}>
          {imageUri && !imageError && (
            <Image
              source={{ uri: imageUri }}
              style={styles.wordImage}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          )}
          <ScrollView style={styles.backScroll} contentContainerStyle={styles.backContent}>
            <View style={styles.backWordRow}>
              <Text style={styles.backWord}>{word.word}</Text>
              <Pressable onPress={() => speakSentence(word.word)} hitSlop={8}>
                <Text style={{ fontSize: 16 }}>🔊</Text>
              </Pressable>
            </View>
            <Text style={styles.backMeaning}>{word.meanings[0]}</Text>
            {word.meanings[1] ? (
              <Text style={styles.backMeaning2}>{word.meanings[1]}</Text>
            ) : null}
            {word.example_es ? (
              <View style={styles.exampleBox}>
                <Text style={styles.exampleEs}>"{word.example_es}"</Text>
                <Text style={styles.exampleEn}>{word.example_en}</Text>
              </View>
            ) : null}
          </ScrollView>
        </Animated.View>

      </Pressable>

      {/* ── Rating buttons — appear after flip ── */}
      <View style={styles.ratingRow}>
        {RATINGS.map(r => (
          <Pressable
            key={r.key}
            style={[
              styles.ratingBtn,
              { backgroundColor: revealed ? r.bg : '#F0EFF8', borderColor: revealed ? r.border : '#E5E3F0' },
            ]}
            onPress={() => revealed && onResult(r.key)}
          >
            <Text style={[styles.ratingLabel, { color: revealed ? r.color : '#C8C8D8' }]}>
              {r.label}
            </Text>
            <Text style={[styles.ratingHint, { color: revealed ? r.color : '#D8D8E8' }]}>
              {r.hint}
            </Text>
          </Pressable>
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },

  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },

  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
    shadowColor: '#1C1A3A',
    shadowOpacity: 0.22,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },

  // Front
  front: {
    backgroundColor: '#1C1A3A',
    padding: 24,
    justifyContent: 'space-between',
  },
  frontTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankBadge: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.28)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  frontCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordText: {
    fontSize: 72,
    fontWeight: '900',
    color: '#FAF7F2',
    letterSpacing: -3,
    textAlign: 'center',
    lineHeight: 76,
  },
  posText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    textAlign: 'center',
  },
  tapHint: {
    textAlign: 'center',
    fontSize: 11,
    color: 'rgba(255,255,255,0.22)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600',
  },

  // Back
  back: {
    backgroundColor: '#FFFFFF',
  },
  wordImage: {
    width: '100%',
    height: 140,
  },
  backScroll: {
    flex: 1,
  },
  backContent: {
    padding: 20,
    paddingBottom: 16,
  },
  backWordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  backWord: {
    fontSize: 12,
    color: '#9A9AB0',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  backMeaning: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1C1A3A',
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  backMeaning2: {
    fontSize: 16,
    fontWeight: '500',
    color: '#534AB7',
    marginTop: 4,
  },
  exampleBox: {
    marginTop: 14,
    padding: 12,
    backgroundColor: '#F7F7FC',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#534AB7',
  },
  exampleEs: {
    fontSize: 13,
    color: '#3A3A5C',
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 4,
  },
  exampleEn: {
    fontSize: 12,
    color: '#9A9AB0',
    lineHeight: 18,
  },

  // Ratings
  ratingRow: {
    flexDirection: 'row',
    gap: 6,
    width: CARD_WIDTH,
  },
  ratingBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  ratingLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  ratingHint: {
    fontSize: 9,
    fontWeight: '500',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});
