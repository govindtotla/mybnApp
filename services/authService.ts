// services/authService.ts
import * as AppleAuthentication from 'expo-apple-authentication';
import * as SecureStore from 'expo-secure-store';
import api, { otpService } from './api';

// Check if SecureStore is available
const isSecureStoreAvailable = () => {
  try {
    return SecureStore && typeof SecureStore.getItemAsync === 'function';
  } catch {
    return false;
  }
};

const GOOGLE_CONFIG = {
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS || '',
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID || '',
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB || '',
  scopes: ['profile', 'email'],
};

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  AUTH_TYPE: 'apple | google | otp',
};

// User type
export interface User {
  id: string;
  email: string;
  name: string;
  photo?: string;
  authType: 'apple' | 'google' | 'otp';
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

  // ---------------------------
  // Storage helpers
  // ---------------------------
  saveUserData: async (user: User): Promise<void> => {
    try {
      if (!isSecureStoreAvailable()) {
        console.warn('SecureStore is not available. User data will not be persisted. Create a development build to use SecureStore.');
        return;
      }
      await Promise.all([
        SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(user)),
        SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TYPE, user.authType),
      ]);
    } catch (error: any) {
      console.error('Error saving user data:', error);
      if (error?.message?.includes('not a function') || error?.message?.includes('not available')) {
        console.warn('SecureStore methods are not available. You may need to create a development build instead of using Expo Go.');
      }
      // Don't throw - allow app to continue without persistence
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      if (!isSecureStoreAvailable()) {
        console.warn('SecureStore is not available. This may be because you are using Expo Go. SecureStore requires a development build.');
        return null;
      }
      const data = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error: any) {
      console.error('Error getting user data:', error);
      // Return null if SecureStore is not available (e.g., on web or Expo Go)
      if (error?.message?.includes('not a function') || error?.message?.includes('not available')) {
        console.warn('SecureStore methods are not available. You may need to create a development build instead of using Expo Go.');
      }
      return null;
    }
  },

  isAuthenticated: async (): Promise<boolean> => {
    try {
      return !!(await authService.getCurrentUser());
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },

  signOut: async (): Promise<void> => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA),
        SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TYPE),
        SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN),
      ]);
    } catch (error) {
      console.error('Error signing out:', error);
      // Continue even if delete fails
    }
  },

  // ---------------------------
  // JWT Token Management
  // ---------------------------
  saveToken: async (token: string): Promise<void> => {
    try {
      if (!isSecureStoreAvailable()) {
        console.warn('SecureStore is not available. Token will not be persisted.');
        return;
      }
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error: any) {
      console.error('Error saving token:', error);
      if (error?.message?.includes('not a function') || error?.message?.includes('not available')) {
        console.warn('SecureStore methods are not available.');
      }
    }
  },

  getToken: async (): Promise<string | null> => {
    try {
      if (!isSecureStoreAvailable()) {
        console.warn('SecureStore is not available. Token cannot be retrieved.');
        return null;
      }
      return await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error: any) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  clearToken: async (): Promise<void> => {
    try {
      if (isSecureStoreAvailable()) {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      }
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  },

  // Validate if token exists and is valid
  hasValidSession: async (): Promise<boolean> => {
    try {
      const token = await authService.getToken();
      return !!(token && token.length > 0);
    } catch (error) {
      console.error('Error checking session:', error);
      return false;
    }
  },

  // Add token to API requests
  setAuthToken: (token: string | null): void => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  },

  // Refresh token (if needed in future)
  refreshSession: async (): Promise<boolean> => {
    try {
      const token = await authService.getToken();
      if (token) {
        authService.setAuthToken(token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return false;
    }
  },

  // ---------------------------
  // OTP Authentication
  // ---------------------------
  sendOTP: async (mobileNumber: string): Promise<boolean> => {
    try {
      const result = await otpService.sendOTP(mobileNumber);
      return result.success;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  },

  verifyOTP: async (mobileNumber: string, otp: string): Promise<User | null> => {
    try {
      const result = await otpService.verifyOTP(mobileNumber, otp);

      if (result.success && result.user) {
        const user: User = {
          id: result.user.id || mobileNumber,
          email: result.user.email || '',
          name: result.user.name || `User ${mobileNumber}`,
          photo: result.user.photo || undefined,
          authType: 'otp',
        };

        // Save user data and JWT token
        await authService.saveUserData(user);
        if (result.token) {
          await authService.saveToken(result.token);
          // Set the token in API headers for future requests
          authService.setAuthToken(result.token);
        }

        return user;
      }

      return null;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  },
};

export default authService;
