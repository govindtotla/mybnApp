import authService from '@/services/authService';
import { Ionicons } from '@expo/vector-icons';
import { Prompt } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../utils/constants';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton() {
  // Use the Expo auth redirect URI that matches Google Cloud Console configuration
  // This is the standard Expo redirect URI format
  const redirectUri = 'https://auth.expo.io/@developewithgovind/MYBNApp';

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID || '',
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS || '',
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB || '',
    scopes: ['profile', 'email'],
    redirectUri: redirectUri,
    prompt: Platform.OS === 'android' ? [Prompt.Consent, Prompt.SelectAccount] : [Prompt.Consent],
  });

  // This runs AFTER Google login completes
  useEffect(() => {
    if (response?.type === 'success') {
      const accessToken = response.authentication?.accessToken;

      if (!accessToken) return;

      // Fetch user profile from Google
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(res => res.json())
        .then(async (userInfo) => {
          await authService.handleGoogleLogin(userInfo);
          // Navigate to main app after successful login
          router.replace('/(tabs)');
        })
        .catch(error => {
          console.error('Error fetching user info:', error);
        });
    } else if (response?.type === 'error') {
      console.error('Google auth error:', response.error);
    }
  }, [response]);

  const handlePress = () => {
    if (!request) {
      console.warn('Google OAuth not configured. Please add Client IDs to .env file');
      return;
    }
    promptAsync();
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      disabled={!request}
    >
      <Ionicons name="logo-google" size={24} color="#DB4437" />
      <Text style={styles.buttonText}>Continue with Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginLeft: 12,
  },
});
