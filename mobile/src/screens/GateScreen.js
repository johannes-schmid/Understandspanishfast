import React from 'react';
import {
  View, Text, StyleSheet, Pressable, Linking, SafeAreaView,
} from 'react-native';

export default function GateScreen({ type, onContinue }) {
  const isSignup = type === 'signup';

  function handleCTA() {
    // Both flows use Google OAuth via the get-started page
    Linking.openURL('https://mostcommonspanish.com/get-started?from=clip');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Top accent bar */}
        <View style={styles.accentBar} />

        <View style={styles.card}>
          <Text style={styles.emoji}>{isSignup ? '🎉' : '🔓'}</Text>

          <Text style={styles.title}>
            {isSignup ? "You've learned 20 words!" : 'First 100 words done'}
          </Text>

          <Text style={styles.body}>
            {isSignup
              ? 'Create a free account to save your progress and continue — no payment needed.'
              : 'Unlock all 1,500 high-frequency words for €5. One-time. No subscription.'}
          </Text>

          {!isSignup && (
            <View style={styles.bullets}>
              {[
                'All 1,500 frequency-ranked words',
                'Spaced repetition review engine',
                'Comprehension tracking dashboard',
              ].map(item => (
                <View key={item} style={styles.bulletRow}>
                  <Text style={styles.bulletCheck}>✓</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          <Pressable style={styles.primaryBtn} onPress={handleCTA}>
            <Text style={styles.primaryBtnText}>
              {isSignup ? 'Create free account →' : 'Get full access — €5 →'}
            </Text>
          </Pressable>

          {isSignup ? (
            <Pressable style={styles.skipBtn} onPress={onContinue}>
              <Text style={styles.skipBtnText}>Continue without saving</Text>
            </Pressable>
          ) : (
            <Text style={styles.footnote}>One-time · No subscription · Instant access</Text>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1C1A3A',
  },
  accentBar: {
    height: 4,
    backgroundColor: '#534AB7',
    borderRadius: 2,
    marginHorizontal: 60,
    marginTop: 20,
    marginBottom: 32,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  card: {
    flex: 1,
    backgroundColor: '#FAF7F2',
    borderRadius: 32,
    padding: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 56,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1C1A3A',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  body: {
    fontSize: 16,
    color: '#6A6A8A',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 28,
    maxWidth: 300,
  },
  bullets: {
    alignSelf: 'stretch',
    marginBottom: 28,
    gap: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  bulletCheck: {
    fontSize: 14,
    color: '#4CAF82',
    fontWeight: '800',
    lineHeight: 22,
  },
  bulletText: {
    fontSize: 14,
    color: '#3A3A5C',
    fontWeight: '500',
    lineHeight: 22,
    flex: 1,
  },
  primaryBtn: {
    backgroundColor: '#534AB7',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#534AB7',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  skipBtn: {
    paddingVertical: 12,
  },
  skipBtnText: {
    color: '#9A9AB0',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  footnote: {
    fontSize: 12,
    color: '#B0B0C0',
    marginTop: 4,
    textAlign: 'center',
  },
});
