'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth, UserRole } from '@/lib/authContext';
import { getDashboardPath } from '@/lib/authUtils';

type Props = {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
};

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/sign-up-login-screen',
}: Props) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace(redirectTo);
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace(getDashboardPath(user.role));
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-green-700" />
          <p className="text-sm text-gray-500">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
