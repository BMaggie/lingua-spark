import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

type UserRole = 'admin' | 'user';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

const RoleGuard = ({ children, allowedRoles, fallback = null }: RoleGuardProps) => {
  const { userRole, isAuthenticated } = useAuth();

  if (!isAuthenticated || !userRole) {
    return <>{fallback}</>;
  }

  if (!allowedRoles.includes(userRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default RoleGuard;