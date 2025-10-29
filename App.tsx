import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SystemUI from 'expo-system-ui';
import AppNavigator from './src/navigation/AppNavigator';
import { useAppStore } from './src/store/useAppStore';

export default function App() {
  const loadFromStorage = useAppStore(state => state.loadFromStorage);
  const darkMode = useAppStore(state => state.darkMode);
  const isLoaded = useAppStore(state => state.isLoaded);

  useEffect(() => {
    // Load data from AsyncStorage on app start
    loadFromStorage();
  }, []);

  useEffect(() => {
    // Set system UI colors based on theme
    if (darkMode) {
      SystemUI.setBackgroundColorAsync('#121212');
    } else {
      SystemUI.setBackgroundColorAsync('#F5F5F5');
    }
  }, [darkMode]);

  // Show loading screen while data is being loaded
  if (!isLoaded) {
    return null; // You can add a splash screen here
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style={darkMode ? 'light' : 'dark'} />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}