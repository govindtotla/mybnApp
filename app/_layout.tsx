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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setLoading(true);

      // Check if user has a valid session (token exists)
      const hasValidSession = await authService.hasValidSession();

      if (hasValidSession) {
        // Set the token in API headers
        const token = await authService.getToken();
        if (token) {
          authService.setAuthToken(token);
        }

        // Check if user data exists
        const user = await authService.getCurrentUser();
        setIsAuthenticated(!!user);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    // Show loading screen while checking session
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
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
