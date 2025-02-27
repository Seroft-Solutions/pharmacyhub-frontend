"use client";

import { AuthGuard } from '../protection/AuthGuard';
import { GuardProps, FeatureGuardProps } from '../protection/types';

export function AdminGuard({ children }: GuardProps) {
  return (
    <AuthGuard requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
      {children}
    </AuthGuard>
  );
}

export function ManagerGuard({ children }: GuardProps) {
  return (
    <AuthGuard requiredRoles={['MANAGER', 'ADMIN', 'SUPER_ADMIN']}>
      {children}
    </AuthGuard>
  );
}

export function FeatureGuard({ children, permissions }: FeatureGuardProps) {
  return (
    <AuthGuard requiredPermissions={permissions}>
      {children}
    </AuthGuard>
  );
}