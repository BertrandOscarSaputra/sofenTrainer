'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { User, LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from '@/lib/types';
import { getToken, setToken, getStoredUser, setStoredUser, clearAuth } from '@/lib/auth';
import api, { getErrorMessage } from '@/lib/api';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ─── Restore session on mount ─────────────────────────────
  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getStoredUser();
    if (storedToken && storedUser) {
      setTokenState(storedToken);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  // ─── Login ────────────────────────────────────────────────
  const login = useCallback(async (data: LoginRequest) => {
    try {
      const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
      const authData = res.data.data;
      setToken(authData.accessToken);
      setStoredUser(authData.user);
      setTokenState(authData.accessToken);
      setUser(authData.user);
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err, 'Email atau password salah.'));
    }
  }, []);

  // ─── Register ─────────────────────────────────────────────
  const register = useCallback(async (data: RegisterRequest) => {
    try {
      await api.post('/auth/register', data);
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err, 'Registrasi gagal. Coba lagi.'));
    }
  }, []);

  // ─── Logout ───────────────────────────────────────────────
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
