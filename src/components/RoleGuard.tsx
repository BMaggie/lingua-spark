import { ReactNode } from 'react';
import { useAuth, UserRole } from '@/hooks/useAuth';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

const RoleGuard = ({ children, allowedRoles, fallback = null }: RoleGuardProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  if (!allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default RoleGuard;