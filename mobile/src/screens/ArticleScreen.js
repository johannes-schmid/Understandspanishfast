import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable, Modal,
} from 'react-native';
import { speakWord } from '../storage/audio';

function WordToken({ token, knownCount, onPress }) {
  const isKnown = token.rank !== null && knownCount >= token.rank;
  return (
    <Pressable onPress={() => token.rank && onPress(token)}>
      <Text style={[tok.word, isKnown && tok.known, !isKnown && token.rank && tok.new]}>
        {token.es}
      </Text>
    </Pressable>
  );
}

const tok = StyleSheet.create({
  word: { fontSize: 18, color: '#1C1A3A', lineHeight: 32 },
  known: { color: '#1C1A3A' },
  new: { color: '#534AB7', textDecorationLine: 'underline', textDecorationStyle: 'dotted' },
});

export default function ArticleScreen({ route, navigation }) {
  const { article, knownCount } = route.params;
  const [tooltip, setTooltip] = useState(null); // { es, en, rank }

  function handleWordTap(token) {
    speakWord(token.es);
    setTooltip(token);
  }

  function renderContent() {
    return article.content.map((token, i) => {
      if (token.type === 'space') return <Text key={i} style={{ fontSize: 18 }}> </Text>;
      if (token.type === 'newline') return <Text key={i}>{'\n\n'}</Text>;
      if (token.type === 'punct') return <Text key={i} style={{ fontSize: 18, color: '#1C1A3A' }}>{token.text}</Text>;
      if (token.type === 'word') {
        return (
          <WordToken
            key={i}
            token={token}
            knownCount={knownCount}
            onPress={handleWordTap}
          />
        );
      }
      return null;
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Reading</Text>
        </Pressable>

        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.desc}>{article.description}</Text>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#1C1A3A' }]} />
            <Text style={styles.legendText}>Known word</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#534AB7' }]} />
            <Text style={styles.legendText}>New word — tap to see meaning</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text>
            {renderContent()}
          </Text>
        </View>
      </ScrollView>

      {/* Word tooltip modal */}
      <Modal visible={!!tooltip} transparent animationType="fade" onRequestClose={() => setTooltip(null)}>
        <Pressable style={styles.overlay} onPress={() => setTooltip(null)}>
          <View style={styles.tooltipCard}>
            <View style={styles.tooltipHeader}>
              <Text style={styles.tooltipEs}>{tooltip?.es}</Text>
              <Pressable onPress={() => speakWord(tooltip?.es)} hitSlop={12}>
                <Text style={styles.tooltipSpeaker}>🔊</Text>
              </Pressable>
            </View>
            <Text style={styles.tooltipEn}>{tooltip?.en}</Text>
            {tooltip?.rank && (
              <Text style={styles.tooltipRank}>#{tooltip.rank} most common word</Text>
            )}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF7F2' },
  scroll: { padding: 24, paddingBottom: 60 },
  backBtn: { marginBottom: 20 },
  backText: { fontSize: 14, color: '#534AB7', fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '900', color: '#1C1A3A', letterSpacing: -0.8, marginBottom: 6, lineHeight: 34 },
  desc: { fontSize: 14, color: '#9A9AB0', marginBottom: 20, lineHeight: 22 },
  legend: { flexDirection: 'row', gap: 16, marginBottom: 24, padding: 12, backgroundColor: '#F0EFF8', borderRadius: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: '#6A6A8A', fontWeight: '500' },
  content: { flexDirection: 'row', flexWrap: 'wrap' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  tooltipCard: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 28, margin: 16,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20,
  },
  tooltipHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  tooltipEs: { fontSize: 36, fontWeight: '900', color: '#1C1A3A', letterSpacing: -1 },
  tooltipSpeaker: { fontSize: 24 },
  tooltipEn: { fontSize: 20, fontWeight: '600', color: '#534AB7', marginBottom: 10 },
  tooltipRank: { fontSize: 12, color: '#B0B0C0', fontWeight: '500' },
});
