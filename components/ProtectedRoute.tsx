import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { authService } from '../services/authService';
import { COLORS } from '../utils/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);

      // Check if user has a valid session
      const validSession = await authService.hasValidSession();

      if (validSession) {
        // Set the token in API headers
        const token = await authService.getToken();
        if (token) {
          authService.setAuthToken(token);
        }

        // Check if user data exists
        const user = await authService.getCurrentUser();

        if (user) {
          setHasValidSession(true);
        } else {
          // Token exists but no user data, redirect to login
          handleAuthFailure();
        }
      } else {
        // No valid session
        handleAuthFailure();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      handleAuthFailure();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthFailure = () => {
    setHasValidSession(false);

    if (requireAuth) {
      // Show alert before redirecting
      Alert.alert(
        'Authentication Required',
        'Please sign in to access this page.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Redirect to login
              router.replace('/(auth)/login');
            }
          }
        ]
      );
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (requireAuth && !hasValidSession) {
    // Don't render children if authentication is required and user is not authenticated
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;