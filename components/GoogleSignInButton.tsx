import { Ionicons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../utils/constants';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);

  const androidRedirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
  });

  const redirectUri = Platform.select({
    android: androidRedirectUri,
    ios: 'com.devgovind.mybnapp://oauthredirect/',
    default: 'https://auth.expo.io/@developewithgovind/MYBNApp'
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID || '',
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB || '',
    scopes: ['profile', 'email'],
    redirectUri: redirectUri,
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
          console.log('Google user info:', userInfo);
          // Navigate to main app after successful login
          router.replace('/business-list');
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
      {loading ? (
        <Text style={styles.buttonText}>Signing in...</Text>
      ) : (
        <>
          <Ionicons name="logo-google" size={24} color="#DB4437" />
          <Text style={styles.buttonText}>Continue with Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginLeft: 12,
  },
});
