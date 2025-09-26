"use client"

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import LoginForm from './LoginForm';
import { Loader2, Shield } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
    <div className="text-center">
      <div className="mx-auto h-16 w-16 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25 ring-1 ring-white/20 mb-6">
        <Shield className="h-8 w-8 text-white" />
      </div>
      <div className="mb-4">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600 mx-auto" />
      </div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">Loading...</h2>
      <p className="text-slate-600">Checking authentication status</p>
    </div>
  </div>
);

const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return fallback || <LoginForm />;
  }

  return <>{children}</>;
};

export default AuthGuard;