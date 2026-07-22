import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable,
  Image, FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { articles } from '../data/articles';
import { getProgress } from '../storage/progress';

const articleImages = {
  'una-manana-en-casa':   require('../../assets/article-images/una-manana-en-casa.png'),
  'en-el-parque':         require('../../assets/article-images/en-el-parque.png'),
  'el-mercado':           require('../../assets/article-images/el-mercado.png'),
  'un-dia-de-trabajo':    require('../../assets/article-images/un-dia-de-trabajo.png'),
  'el-viaje-en-tren':     require('../../assets/article-images/el-viaje-en-tren.png'),
  'una-cena-con-amigos':  require('../../assets/article-images/una-cena-con-amigos.png'),
};

function readiness(article, knownCount) {
  const ranks = new Set(article.content.filter(t => t.type === 'word' && t.rank !== null).map(t => t.rank));
  if (ranks.size === 0) return 0;
  const known = [...ranks].filter(r => knownCount >= r).length;
  return Math.round((known / ranks.size) * 100);
}

function ArticleCard({ article, knownCount, onPress }) {
  const pct = readiness(article, knownCount);
  const unlocked = pct >= 30;
  const barColor = pct >= 80 ? '#4CAF82' : pct >= 50 ? '#E8A838' : '#534AB7';

  return (
    <Pressable style={[card.wrap, !unlocked && card.locked]} onPress={onPress}>
      <Image source={articleImages[article.slug]} style={card.image} resizeMode="cover" />
      <View style={card.body}>
        {/* Readiness bar */}
        <View style={card.barTrack}>
          <View style={[card.barFill, { width: `${pct}%`, backgroundColor: barColor }]} />
        </View>
        <View style={card.row}>
          <Text style={[card.readiness, { color: unlocked ? '#276749' : '#9A9AB0' }]}>
            {unlocked ? '🔓' : '🔒'} {pct}% ready
          </Text>
        </View>
        <Text style={card.title}>{article.title}</Text>
        <Text style={card.desc}>{article.description}</Text>
        <Text style={card.meta}>{pct}% of words known</Text>
      </View>
    </Pressable>
  );
}

const card = StyleSheet.create({
  wrap: {
    backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginBottom: 16,
    shadowColor: '#1C1A3A', shadowOpacity: 0.07, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
  },
  locked: { opacity: 0.65 },
  image: { width: '100%', height: 140 },
  body: { padding: 16 },
  barTrack: { height: 3, backgroundColor: '#E5E3F0', borderRadius: 2, marginBottom: 10, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 2 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  readiness: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  title: { fontSize: 17, fontWeight: '800', color: '#1C1A3A', marginBottom: 4, letterSpacing: -0.3 },
  desc: { fontSize: 13, color: '#6A6A8A', lineHeight: 20, marginBottom: 8 },
  meta: { fontSize: 11, color: '#B0B0C0', fontWeight: '500' },
});

export default function ReadingScreen({ navigation }) {
  const [knownCount, setKnownCount] = useState(0);

  useFocusEffect(useCallback(() => {
    getProgress().then(p => setKnownCount(p.known.length));
  }, []));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Reading</Text>
        <Text style={styles.sub}>
          Articles unlock as you learn words. Tap any word while reading to see its meaning.
        </Text>
        {articles.map(article => (
          <ArticleCard
            key={article.slug}
            article={article}
            knownCount={knownCount}
            onPress={() => navigation.navigate('Article', { article, knownCount })}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F3EE' },
  scroll: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 28, fontWeight: '900', color: '#1C1A3A', letterSpacing: -0.8, marginBottom: 8 },
  sub: { fontSize: 14, color: '#9A9AB0', lineHeight: 22, marginBottom: 24 },
});
