"use client";

import { ReactNode } from "react";
import { useAuth } from "@/features/auth/hooks";
import { Role, Permission } from "@/types/auth";
import { AuthLoading } from "../feedback/AuthLoading";
import { Unauthorized } from "../feedback/Unauthorized";
import { AuthGuardProps } from "./types";

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

  const hasRequiredAccess = hasAccess(requiredRoles as Role[], requiredPermissions as Permission[]);
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