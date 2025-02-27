import { ReactNode } from 'react';
import { Permission } from '@/types/auth';

export interface GuardProps {
  children: ReactNode;
}

export interface FeatureGuardProps extends GuardProps {
  permissions: Permission[];
}

export interface AuthGuardProps {
  children: ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  loadingComponent?: ReactNode;
  unauthorizedComponent?: ReactNode;
}