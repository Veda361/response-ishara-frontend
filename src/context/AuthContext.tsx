import React, { createContext, useState, useEffect } from 'react';
import { setAdminKeyGetter } from '../api/client';
import { adminApi } from '../api/admin.api';

export interface AuthContextType {
  adminKey: string | null;
  isAuthenticated: boolean;
  isVerifying: boolean;
  authError: string | null;
  login: (key: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'isahara_admin_key';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminKey, setAdminKey] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY);
    }
    return null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    setAdminKeyGetter(() => adminKey);
  }, [adminKey]);

  useEffect(() => {
    const verifyStoredKey = async () => {
      const storedKey = localStorage.getItem(STORAGE_KEY);
      if (!storedKey) {
        setIsAuthenticated(false);
        setIsVerifying(false);
        return;
      }

      try {
        // Test key validity against analytics endpoint
        await adminApi.getAnalyticsOverview();
        setAdminKey(storedKey);
        setIsAuthenticated(true);
      } catch (err: unknown) {
        console.warn('Stored admin key was invalid or expired:', err);
        localStorage.removeItem(STORAGE_KEY);
        setAdminKey(null);
        setIsAuthenticated(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyStoredKey();
  }, []);

  const login = async (key: string): Promise<boolean> => {
    setIsVerifying(true);
    setAuthError(null);

    try {
      // Temporarily set getter to test this key
      setAdminKeyGetter(() => key);
      await adminApi.getAnalyticsOverview();

      // Successfully verified
      localStorage.setItem(STORAGE_KEY, key);
      setAdminKey(key);
      setIsAuthenticated(true);
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Invalid Admin Secret Key. Please verify and try again.';
      setAuthError(message);
      setAdminKeyGetter(() => null);
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAdminKey(null);
    setIsAuthenticated(false);
    setAuthError(null);
    setAdminKeyGetter(() => null);
  };

  return (
    <AuthContext.Provider
      value={{
        adminKey,
        isAuthenticated,
        isVerifying,
        authError,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
