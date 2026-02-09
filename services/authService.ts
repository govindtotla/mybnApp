// services/authService.ts
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const GOOGLE_CONFIG = {
  iosClientId: '',
  androidClientId: '',
  scopes: ['profile', 'email'],
};

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  AUTH_TYPE: 'apple | google',
};

// User type
export interface User {
  id: string;
  email: string;
  name: string;
  photo?: string;
  authType: 'apple' | 'google';
}

export const authService = {
  // ---------------------------
  // Apple Sign-In
  // ---------------------------
  isAppleAuthAvailable: async (): Promise<boolean> => {
    try {
      return await AppleAuthentication.isAvailableAsync();
    } catch {
      return false;
    }
  },

  signInWithApple: async (): Promise<User | null> => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.user) return null;

      const user: User = {
        id: credential.user,
        email: credential.email ?? '',
        name: credential.fullName
          ? `${credential.fullName.givenName ?? ''} ${credential.fullName.familyName ?? ''}`.trim()
          : 'Apple User',
        authType: 'apple',
      };

      await authService.saveUserData(user);
      return user;
    } catch (error: any) {
      if (error.code !== 'ERR_CANCELED') {
        console.error('Apple Sign-In error:', error);
      }
      return null;
    }
  },

  // ---------------------------
  // Google Sign-In handler
  // (called AFTER auth-session succeeds)
  // ---------------------------
  handleGoogleLogin: async (googleUser: any): Promise<User> => {
    const user: User = {
      id: googleUser.sub,
      email: googleUser.email,
      name: googleUser.name,
      photo: googleUser.picture,
      authType: 'google',
    };

    await authService.saveUserData(user);
    return user;
  },

   // Sign in with Google
  signInWithGoogle: async (): Promise<User | null> => {
    try {
      const config = Platform.select({
        ios: { clientId: GOOGLE_CONFIG.iosClientId },
        android: { clientId: GOOGLE_CONFIG.androidClientId },
      });

      if (!config?.clientId) {
        throw new Error('Google Client ID not configured for this platform');
      }

      // Start Google authentication flow
      const result = await Google.logInAsync({
        ...config,
        scopes: GOOGLE_CONFIG.scopes,
      });

      if (result.type === 'success') {
        const { user } = result;

        // Create user object
        const authUser: User = {
          id: user.id,
          email: user.email,
          name: user.name || '',
          photo: user.photoUrl || undefined,
          authType: 'google',
        };

        // Save to secure storage
        await authService.saveUserData(authUser);

        return authUser;
      } else {
        // User canceled
        console.log('Google Sign-In was canceled');
        return null;
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      return null;
    }
  },

  // ---------------------------
  // Storage helpers
  // ---------------------------
  saveUserData: async (user: User): Promise<void> => {
    await Promise.all([
      SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(user)),
      SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TYPE, user.authType),
    ]);
  },

  getCurrentUser: async (): Promise<User | null> => {
    const data = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },

  isAuthenticated: async (): Promise<boolean> => {
    return !!(await authService.getCurrentUser());
  },

  signOut: async (): Promise<void> => {
    await Promise.all([
      SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA),
      SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TYPE),
    ]);
  },
};

export default authService;
