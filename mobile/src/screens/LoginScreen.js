import React from 'react';
import {
  View, Text, StyleSheet, Pressable, SafeAreaView,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  async function openSignIn() {
    const redirectUrl = Linking.createURL('auth-success');
    const result = await WebBrowser.openAuthSessionAsync(
      `https://mostcommonspanish.com/login?from=app&redirectUrl=${encodeURIComponent(redirectUrl)}`,
      redirectUrl
    );
    if (result.type === 'success') {
      navigation.goBack();
    }
  }

  async function openCreateAccount() {
    const redirectUrl = Linking.createURL('auth-success');
    const result = await WebBrowser.openAuthSessionAsync(
      `https://mostcommonspanish.com/get-started?from=app&redirectUrl=${encodeURIComponent(redirectUrl)}`,
      redirectUrl
    );
    if (result.type === 'success') {
      navigation.goBack();
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Header */}
        <Pressable style={styles.closeRow} onPress={() => navigation.goBack()}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>

        <View style={styles.body}>
          <Text style={styles.logo}>Most Common Spanish</Text>
          <Text style={styles.tagline}>Frequency-ranked vocabulary</Text>

          <View style={styles.divider} />

          <Text style={styles.title}>Sign in to your account</Text>
          <Text style={styles.subtitle}>
            Your progress, streak, and unlocked words sync across all your devices.
          </Text>

          {/* Sign in with Google */}
          <Pressable style={styles.googleBtn} onPress={openSignIn}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </Pressable>

          {/* Divider */}
          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>No account yet?</Text>
            <View style={styles.orLine} />
          </View>

          {/* Create account */}
          <Pressable style={styles.createBtn} onPress={openCreateAccount}>
            <Text style={styles.createBtnText}>Create a free account →</Text>
          </Pressable>

          <Text style={styles.footnote}>
            Free to start · Progress saved automatically
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1C1A3A' },
  container: { flex: 1, paddingHorizontal: 24, paddingBottom: 40 },

  closeRow: {
    alignSelf: 'flex-end',
    paddingTop: 16,
    paddingBottom: 8,
    paddingLeft: 20,
  },
  closeText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
  },

  body: {
    flex: 1,
    backgroundColor: '#FAF7F2',
    borderRadius: 32,
    padding: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  logo: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1C1A3A',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 11,
    color: '#9A9AB0',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },

  divider: {
    width: 40,
    height: 3,
    backgroundColor: '#E5E3F0',
    borderRadius: 99,
    marginVertical: 28,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1C1A3A',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#6A6A8A',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    maxWidth: 280,
  },

  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignSelf: 'stretch',
    borderWidth: 1.5,
    borderColor: '#E5E3F0',
    gap: 10,
    shadowColor: '#1C1A3A',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    marginBottom: 20,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: '900',
    color: '#4285F4',
    lineHeight: 22,
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1A3A',
    letterSpacing: 0.1,
  },

  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 10,
    marginBottom: 20,
  },
  orLine: { flex: 1, height: 1, backgroundColor: '#E5E3F0' },
  orText: { fontSize: 11, color: '#B0B0C0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },

  createBtn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#534AB7',
    borderRadius: 14,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#534AB7',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  createBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },

  footnote: {
    fontSize: 11,
    color: '#B0B0C0',
    textAlign: 'center',
    lineHeight: 18,
  },
});
