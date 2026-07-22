/**
 * App Clip entry point.
 * Registers the same VocabScreen as the App Clip root component.
 * expo-app-clip handles the Xcode target; this file wires the JS side.
 */
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import VocabScreen from '../src/screens/VocabScreen';

function AppClipRoot() {
  return (
    <>
      <StatusBar style="dark" />
      <VocabScreen />
    </>
  );
}

registerRootComponent(AppClipRoot);
