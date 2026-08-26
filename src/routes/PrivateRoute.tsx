import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function PrivateRoute({
  children,
}: {
  children: ReactNode;
}) {
  const {
    isAuthenticated,
    isLoadingAuth,
  } = useAuth();

  if (isLoadingAuth) {
    return null;
  }

  return isAuthenticated
    ? children
    : <Navigate to="/auth" replace />;
}