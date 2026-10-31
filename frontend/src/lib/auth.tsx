'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import api, { setAccessToken, doRefresh } from './api';

export type User = { id: string; email: string; firstName: string; lastName: string; role: string };

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decode(token: string): { userId: string; role: string } | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { userId: payload.userId, role: payload.role };
  } catch { return null; }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const t = await doRefresh();
      if (t) {
        const p = decode(t);
        if (p) setUser({ id: p.userId, email: '', firstName: '', lastName: '', role: p.role });
      }
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const register = async (data: any) => {
    const res = await api.post('/auth/register', data);
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    setAccessToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

