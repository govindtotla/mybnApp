import { Stack } from 'expo-router';
import { Drawer } from "expo-router/drawer";
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomDrawer from "../../components/CustomDrawer";
import { authService } from '../../services/authService';
import { COLORS } from '../../utils/constants';

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
        <Drawer
            drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={{
              headerTitleAlign: "center",
            }}
          >
        <Stack screenOptions={{ headerShown: false }}>
          <Drawer.Screen name="splash" />
          {!isAuthenticated ? (
            // Auth screens
            <Drawer.Screen name="(auth)" />
          ) : (
            <>
              <Drawer.Screen name="welcome" />
              <Drawer.Screen name="business-list" />
              <Drawer.Screen name="business-detail" />
            </>
          )}
        </Stack>
        </Drawer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
