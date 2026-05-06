'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { User, LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from '@/lib/types';
import { getToken, setToken, removeToken, getStoredUser, setStoredUser, clearAuth } from '@/lib/auth';
import api from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// Mock user untuk development
const MOCK_USER: User = {
  id: 1,
  name: 'Tiara Putri',
  email: 'tiara@example.com',
  role: 'ROLE_USER',
};

const USE_MOCK = false;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getStoredUser();
    if (storedToken && storedUser) {
      setTokenState(storedToken);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    if (USE_MOCK) {
      // Simulate login delay
      await new Promise((r) => setTimeout(r, 800));
      const mockToken = 'mock-jwt-token-' + Date.now();
      setToken(mockToken);
      setStoredUser(MOCK_USER);
      setTokenState(mockToken);
      setUser(MOCK_USER);
      return;
    }
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    const authData = res.data.data;
    setToken(authData.accessToken);
    setStoredUser(authData.user);
    setTokenState(authData.accessToken);
    setUser(authData.user);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 800));
      return;
    }
    await api.post('/auth/register', data);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setTokenState(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
