import authService from '@/services/authService';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Button } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '',
    // iosClientId: 'IOS_CLIENT_ID',
    webClientId: '',
    scopes: ['profile', 'email'],
    extraParams: {
      prompt: 'consent select_account',
    },
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
        .then(userInfo => {
          authService.handleGoogleLogin(userInfo);
        });
    }
  }, [response]);

  return (
    <Button
      title="Sign in with Google"
      disabled={!request}
      onPress={() => promptAsync()}
    />
  );
}
