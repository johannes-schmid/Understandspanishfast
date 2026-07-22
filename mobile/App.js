import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import * as Linking from 'expo-linking';

import DashboardScreen from './src/screens/DashboardScreen';
import VocabScreen from './src/screens/VocabScreen';
import ReadingScreen from './src/screens/ReadingScreen';
import ArticleScreen from './src/screens/ArticleScreen';
import LoginScreen from './src/screens/LoginScreen';

const Tab = createBottomTabNavigator();
const ReadStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

function TabIcon({ name, focused }) {
  const icons = {
    Dashboard: focused ? '▣' : '□',
    Study:     focused ? '◈' : '◇',
    Read:      focused ? '▤' : '▭',
  };
  return (
    <Text style={{ fontSize: 20, color: focused ? '#534AB7' : '#B0B0C0' }}>
      {icons[name]}
    </Text>
  );
}

function ReadStackNavigator() {
  return (
    <ReadStack.Navigator screenOptions={{ headerShown: false }}>
      <ReadStack.Screen name="ReadList" component={ReadingScreen} />
      <ReadStack.Screen name="Article" component={ArticleScreen} />
    </ReadStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#534AB7',
        tabBarInactiveTintColor: '#B0B0C0',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F0EFF8',
          borderTopWidth: 1,
          paddingTop: 6,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.3,
          marginBottom: 8,
        },
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Study" component={VocabScreen} />
      <Tab.Screen name="Read" component={ReadStackNavigator} />
    </Tab.Navigator>
  );
}

const linking = {
  prefixes: [Linking.createURL('/'), 'mostcommonspanish://'],
  config: {
    screens: {
      Main: {
        screens: {
          Dashboard: 'dashboard',
        },
      },
      // auth-success deep link just opens the app — no specific screen needed
    },
  },
};

function AppRoot() {
  return (
    <NavigationContainer linking={linking}>
      <StatusBar style="dark" />
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Main" component={MainTabs} />
        <RootStack.Screen
          name="Login"
          component={LoginScreen}
          options={{ presentation: 'modal' }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(AppRoot);
