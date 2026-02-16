import { useEffect, useState } from 'react';
import { authService } from '../services/authService';

export const useSession = () => {
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
      console.error('Error checking session:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    setIsAuthenticated(true);
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      authService.setAuthToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    isAuthenticated,
    loading,
    signIn,
    signOut,
    checkSession,
  };
};