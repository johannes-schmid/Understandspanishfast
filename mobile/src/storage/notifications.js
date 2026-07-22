import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETUP_KEY = 'notifications_v2';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestAndScheduleReminders() {
  try {
    const already = await AsyncStorage.getItem(SETUP_KEY);
    if (already) return;

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;

    await Notifications.cancelAllScheduledNotificationsAsync();

    // Evening reminder — 8 PM daily
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Spanish practice time 🇪🇸',
        body: 'You have words due for review. 5 minutes keeps your progress going.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 20,
        minute: 0,
      },
    });

    // Morning nudge — 9 AM daily
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Good morning ☀️',
        body: 'Start with a few Spanish words — it only takes 2 minutes.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 9,
        minute: 0,
      },
    });

    await AsyncStorage.setItem(SETUP_KEY, 'true');
  } catch (e) {
    // Notifications may not work in Expo Go on all platforms — fail silently
  }
}

export async function sendMilestoneNotification(known, total = 1500) {
  try {
    const pct = Math.round((known / total) * 100);
    const message = getMilestoneMessage(known);
    if (!message) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${known} words · ${pct}% coverage 🧠`,
        body: message,
      },
      trigger: null, // fire immediately
    });
  } catch (e) {
    // fail silently
  }
}

function getMilestoneMessage(known) {
  const milestones = {
    10:   "First 10 words! You're building momentum.",
    50:   '50 words down — you know the most common Spanish verbs.',
    100:  '100 words! You understand ~50% of everyday Spanish.',
    250:  '250 words — tourist-level comprehension unlocked.',
    500:  '500 words! Basic conversation is within reach.',
    1000: "1,000 words — you're in the top 5% of Spanish learners.",
    1500: '🏆 All 1,500 words! You understand ~87% of everyday Spanish.',
  };
  return milestones[known] ?? null;
}
