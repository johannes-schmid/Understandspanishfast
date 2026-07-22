import { Audio } from 'expo-av';
import { audioMap } from '../data/audioMap';
import { sentenceAudioMap } from '../data/sentenceAudioMap';

const BASE = 'https://mostcommonspanish.com/audio/';

let currentSound = null;

async function play(filename) {
  try {
    if (currentSound) {
      await currentSound.unloadAsync();
      currentSound = null;
    }
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    const { sound } = await Audio.Sound.createAsync(
      { uri: BASE + encodeURIComponent(filename) },
      { shouldPlay: true }
    );
    currentSound = sound;
    sound.setOnPlaybackStatusUpdate(status => {
      if (status.didJustFinish) sound.unloadAsync();
    });
  } catch (e) {
    // fail silently if offline or file missing
  }
}

export async function speakWord(word) {
  const file = audioMap[word?.toLowerCase()];
  if (file) {
    await play(file);
  }
}

export async function speakSentence(word) {
  const file = sentenceAudioMap[word?.toLowerCase()];
  if (file) {
    await play(file);
  }
}

export function stopAudio() {
  if (currentSound) {
    currentSound.unloadAsync();
    currentSound = null;
  }
}
