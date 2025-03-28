"use client";

import React from 'react';
import { AccessCheck } from './PermissionCheck';
import { Role, Permission } from '../constants/permissions';

interface GuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  verifyOnBackend?: boolean;
}

interface FeatureGuardProps {
  children: React.ReactNode;
  permissions: Permission[];
  fallback?: React.ReactNode;
  verifyOnBackend?: boolean;
}

/**
 * Guard that only allows access to admin users
 */
export function AdminGuard({ children, fallback, verifyOnBackend }: GuardProps) {
  return (
    <AccessCheck 
      roles={[Role.ADMIN, 'SUPER_ADMIN']}
      requireAll={false}
      verifyOnBackend={verifyOnBackend}
      fallback={fallback}
    >
      {children}
    </AccessCheck>
  );
}

/**
 * Guard that only allows access to manager-level users (includes admins)
 */
export function ManagerGuard({ children, fallback, verifyOnBackend }: GuardProps) {
  return (
    <AccessCheck 
      roles={[Role.PHARMACY_MANAGER, Role.ADMIN, 'SUPER_ADMIN']}
      requireAll={false}
      verifyOnBackend={verifyOnBackend}
      fallback={fallback}
    >
      {children}
    </AccessCheck>
  );
}

/**
 * Guard that restricts access based on specific feature permissions
 */
export function FeatureGuard({ children, permissions, fallback, verifyOnBackend }: FeatureGuardProps) {
  return (
    <AccessCheck
      permissions={permissions}
      requireAll={true}
      verifyOnBackend={verifyOnBackend}
      fallback={fallback}
    >
      {children}
    </AccessCheck>
  );
}
