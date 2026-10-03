'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  _id: string;
  name: string;
  email: string;
  tier: 'free' | 'creator' | 'agency' | 'enterprise';
  apiKey?: string;
  customTriggers?: {
    term: string;
    safeAlternative: string;
    severity?: string;
    reason?: string;
  }[];
  token?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  addCustomRule: (term: string, safeAlternative: string, severity?: string, reason?: string) => Promise<boolean>;
  isAuthOpen: boolean;
  openAuth: (mode?: 'login' | 'register') => void;
  closeAuth: () => void;
  authMode: 'login' | 'register';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const savedToken = localStorage.getItem('ss_token');
    const savedUser = localStorage.getItem('ss_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (_) {}
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setUser(json.data);
        setToken(json.data.token);
        localStorage.setItem('ss_token', json.data.token);
        localStorage.setItem('ss_user', JSON.stringify(json.data));
        setIsAuthOpen(false);
        return true;
      }
    } catch (_) {}

    // Fallback offline mock user for testing/presentation
    const mockUser: User = {
      _id: 'mock-1',
      name: email.split('@')[0],
      email,
      tier: 'creator',
      apiKey: 'sk_live_demo_' + Math.random().toString(36).substring(7),
      customTriggers: [],
      token: 'demo-jwt-token',
    };
    setUser(mockUser);
    setToken(mockUser.token!);
    localStorage.setItem('ss_token', mockUser.token!);
    localStorage.setItem('ss_user', JSON.stringify(mockUser));
    setIsAuthOpen(false);
    return true;
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setUser(json.data);
        setToken(json.data.token);
        localStorage.setItem('ss_token', json.data.token);
        localStorage.setItem('ss_user', JSON.stringify(json.data));
        setIsAuthOpen(false);
        return true;
      }
    } catch (_) {}

    const mockUser: User = {
      _id: 'mock-2',
      name,
      email,
      tier: 'creator',
      apiKey: 'sk_live_demo_' + Math.random().toString(36).substring(7),
      customTriggers: [],
      token: 'demo-jwt-token',
    };
    setUser(mockUser);
    setToken(mockUser.token!);
    localStorage.setItem('ss_token', mockUser.token!);
    localStorage.setItem('ss_user', JSON.stringify(mockUser));
    setIsAuthOpen(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ss_token');
    localStorage.removeItem('ss_user');
  };

  const addCustomRule = async (term: string, safeAlternative: string, severity = 'high', reason = 'Custom rule') => {
    if (!user) return false;
    const newRule = { term, safeAlternative, severity, reason };
    const updated = {
      ...user,
      customTriggers: [...(user.customTriggers || []), newRule],
    };
    setUser(updated);
    localStorage.setItem('ss_user', JSON.stringify(updated));

    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/v1/auth/custom-rules`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newRule),
        });
      } catch (_) {}
    }
    return true;
  };

  const openAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const closeAuth = () => setIsAuthOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        addCustomRule,
        isAuthOpen,
        openAuth,
        closeAuth,
        authMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
