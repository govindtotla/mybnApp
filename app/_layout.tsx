import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { authService } from '../services/authService';
import { COLORS } from '../utils/constants';

export default function RootLayout() {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const authenticated = await authService.isAuthenticated();
    setIsAuthenticated(authenticated);
  };


  if (isAuthenticated === null) {
    // Show loading screen
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="splash" />
          {!isAuthenticated ? (
            // Auth screens
            <Stack.Screen name="(auth)" />
          ) : (
            <>
              <Stack.Screen name="welcome" />
              <Stack.Screen name="business-list" />
              <Stack.Screen name="business-detail" />
            </>
          )}
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}