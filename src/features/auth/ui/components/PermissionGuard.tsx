"use client";

import { useSession } from "next-auth/react";
import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { isAuthorized, type AuthConfig } from "@/features/auth/lib/auth-utils";
import { LoadingSpinner, LoadingOverlay } from "@/components/ui/loading-spinner";

interface PermissionGuardProps extends AuthConfig {
  children: ReactNode;
  fallback?: ReactNode;
  loader?: ReactNode;
  redirectTo?: string;
  showLoading?: boolean;
  loadingMessage?: string;
  loadingType?: "overlay" | "inline";
}

export function PermissionGuard({
  children,
  roles = [],
  permissions = [],
  requireAllRoles = false,
  requireAllPermissions = false,
  fallback,
  loader,
  redirectTo,
  showLoading = true,
  loadingMessage = "Checking permissions...",
  loadingType = "inline"
}: PermissionGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(redirectTo || "/login");
    }
  }, [status, router, redirectTo]);

  // Show loader while checking authentication
  if (status === "loading" && showLoading) {
    if (loader) {
      return <>{loader}</>;
    }

    return loadingType === "overlay" ? (
      <LoadingOverlay message={loadingMessage} />
    ) : (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <LoadingSpinner size="lg" />
        {loadingMessage && (
          <p className="mt-4 text-gray-600">{loadingMessage}</p>
        )}
      </div>
    );
  }

  // Not authenticated
  if (!session?.user) {
    return null;
  }

  // Check authorization
  const hasAccess = isAuthorized(
    session.user.roles,
    session.user.permissions,
    { roles, permissions, requireAllRoles, requireAllPermissions }
  );

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (redirectTo) {
      router.push(redirectTo);
      return showLoading ? (
        <LoadingSpinner size="lg" className="mx-auto" />
      ) : null;
    }

    return null;
  }

  return <>{children}</>;
}

// Higher-order component wrapper
export function withPermissionGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  config: AuthConfig & {
    fallback?: ReactNode;
    loader?: ReactNode;
    redirectTo?: string;
    showLoading?: boolean;
    loadingMessage?: string;
    loadingType?: "overlay" | "inline";
  }
) {
  return function PermissionGuardWrapper(props: P) {
    return (
      <PermissionGuard {...config}>
        <WrappedComponent {...props} />
      </PermissionGuard>
    );
  };
}

// Conditional rendering components
export function IfHasPermission({
  children,
  permission,
  fallback,
  loadingElement
}: {
  children: ReactNode;
  permission: string;
  fallback?: ReactNode;
  loadingElement?: ReactNode;
}) {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return loadingElement || <LoadingSpinner size="sm" className="mx-auto" />;
  }

  if (!session?.user?.permissions.includes(permission)) {
    return fallback || null;
  }

  return <>{children}</>;
}

export function IfHasRole({
  children,
  role,
  fallback,
  loadingElement
}: {
  children: ReactNode;
  role: string;
  fallback?: ReactNode;
  loadingElement?: ReactNode;
}) {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return loadingElement || <LoadingSpinner size="sm" className="mx-auto" />;
  }

  if (!session?.user?.roles.includes(role)) {
    return fallback || null;
  }

  return <>{children}</>;
}