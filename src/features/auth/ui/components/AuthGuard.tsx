"use client";

import { ReactNode } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Role, Permission } from "@/features/auth/model/types";
import { AuthLoading } from "./AuthLoading";
import { Unauthorized } from "./Unauthorized";

export interface AuthGuardProps {
  children: ReactNode;
  requiredRoles?: Role[];
  requiredPermissions?: Permission[];
  loadingComponent?: ReactNode;
  unauthorizedComponent?: ReactNode;
}

export function AuthGuard({
  children,
  requiredRoles,
  requiredPermissions,
  loadingComponent = <AuthLoading />,
  unauthorizedComponent = <Unauthorized />
}: AuthGuardProps) {
  const { isLoading, hasAccess } = useAuth();

  if (isLoading) {
    return loadingComponent;
  }

  const hasRequiredAccess = hasAccess(requiredRoles, requiredPermissions);
  if (!hasRequiredAccess) {
    return unauthorizedComponent;
  }

  return <>{children}</>;
}

// HOC for protecting components
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: Role[],
  requiredPermissions?: Permission[]
) {
  return function ProtectedComponent(props: P) {
    return (
      <AuthGuard
        requiredRoles={requiredRoles}
        requiredPermissions={requiredPermissions}
      >
        <Component {...props} />
      </AuthGuard>
    );
  };
}