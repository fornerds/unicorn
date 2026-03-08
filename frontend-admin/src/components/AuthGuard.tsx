import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '@/stores/authStore';
import { paths } from '@/routes/paths';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <Navigate to={paths.login} state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
}
