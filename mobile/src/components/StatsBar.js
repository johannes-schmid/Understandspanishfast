import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TOTAL = 1500;

export default function StatsBar({ known, learning, due }) {
  const comprehension = Math.round((known / TOTAL) * 100);

  return (
    <View style={styles.container}>
      <Stat value={known} label="Known" color="#276749" />
      <Divider />
      <Stat value={learning} label="Reviewing" color="#534AB7" />
      <Divider />
      <Stat value={due > 0 ? due : '—'} label="Due" color={due > 0 ? '#C05621' : '#9A9AB0'} />
      <Divider />
      <Stat value={`${comprehension}%`} label="Coverage" color="#1C1A3A" />
    </View>
  );
}

function Stat({ value, label, color }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 4,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#1C1A3A',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 24,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 9,
    color: '#9A9AB0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: '#F0EFF8',
  },
});
