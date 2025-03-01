"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { isAuthorized, type AuthConfig } from "@/utils/auth-utils";
import { LoadingSpinner, LoadingOverlay } from "@/components/ui/loading-spinner";
import { useAuth } from "@/features/auth/hooks";

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
  const { user, isLoadingUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoadingUser && !user) {
      router.push(redirectTo || "/login");
    }
  }, [isLoadingUser, user, router, redirectTo]);

  // Show loader while checking authentication
  if (isLoadingUser && showLoading) {
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
  if (!user) {
    return null;
  }

  // Check authorization
  const hasAccess = isAuthorized(
    user.roles,
    user.permissions,
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
  const { user, isLoadingUser } = useAuth();
  
  if (isLoadingUser) {
    return loadingElement || <LoadingSpinner size="sm" className="mx-auto" />;
  }

  if (!user?.permissions.includes(permission)) {
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
  const { user, isLoadingUser } = useAuth();
  
  if (isLoadingUser) {
    return loadingElement || <LoadingSpinner size="sm" className="mx-auto" />;
  }

  if (!user?.roles.includes(role)) {
    return fallback || null;
  }

  return <>{children}</>;
}

// Example usage:
/*
// As a wrapper component
<PermissionGuard
  roles={["ADMIN"]}
  permissions={["manage:users"]}
  requireAllPermissions
  fallback={<AccessDenied />}
  redirectTo="/unauthorized"
  loadingType="overlay"
  loadingMessage="Checking admin access..."
>
  <AdminDashboard />
</PermissionGuard>

// As a HOC
const ProtectedComponent = withPermissionGuard(MyComponent, {
  roles: ["ADMIN"],
  permissions: ["manage:users"],
  redirectTo: "/unauthorized",
  loadingType: "overlay"
});

// For conditional rendering
<IfHasPermission 
  permission="edit:pharmacy"
  fallback={<ReadOnlyView />}
  loadingElement={<CustomLoader />}
>
  <EditButton />
</IfHasPermission>

<IfHasRole 
  role="ADMIN"
  fallback={<UserView />}
  loadingElement={<CustomLoader />}
>
  <AdminPanel />
</IfHasRole>
*/
