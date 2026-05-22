'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'student' | 'landlord' | 'admin';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  compoundName?: string;
  university?: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<{ success: boolean; pending?: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  university?: string;
  compoundName?: string;
  nrcFront?: File;
  nrcBack?: File;
  verificationImages?: string[];
}


// Backend auth - http://localhost:5000/api/auth
const API_BASE = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';



const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: {children: ReactNode;}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('uniboard_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('uniboard_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) return false;
      const data = await response.json();
      localStorage.setItem('uniboard_token', data.token);
      localStorage.setItem('uniboard_user', JSON.stringify(data.user));
      setUser(data.user);
      return true;
    } catch {
      return false;
    }
  };


  const signup = async (data: SignupData): Promise<{ success: boolean; pending?: boolean; message?: string }> => {
    try {
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('role', data.role);
      if (data.phone) formData.append('phone', data.phone);
      if (data.university) formData.append('university', data.university);
      if (data.compoundName) formData.append('compoundName', data.compoundName);
      if (data.nrcFront) formData.append('nrcFront', data.nrcFront);
      if (data.nrcBack) formData.append('nrcBack', data.nrcBack);
      if (data.verificationImages && data.verificationImages.length) {
        // send as JSON string so backend can parse it from multipart
        formData.append('verificationImages', JSON.stringify(data.verificationImages));
      }


      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, message: errorData?.error || 'Signup failed' };
      }

      const result = await response.json();
      if (result.token && result.user) {
        localStorage.setItem('uniboard_token', result.token);
        localStorage.setItem('uniboard_user', JSON.stringify(result.user));
        setUser(result.user);
        return { success: true, pending: false, message: result.message };
      }

      return { success: true, pending: true, message: result.message };
    } catch {
      return { success: false, message: 'Signup failed' };
    }
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem('uniboard_token');
    localStorage.removeItem('uniboard_user');
  };


  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>);

}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}