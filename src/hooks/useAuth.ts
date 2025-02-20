import {signOut, useSession} from "next-auth/react";
import {Permission, Role} from "@/types/auth";
import {redirect} from "next/navigation";

export function useAuth() {
  const {data: session, status} = useSession({
    required: false,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const hasPermission = (permission: Permission) => {
    return session?.user?.permissions?.includes(permission) ?? false;
  };

  const hasRole = (role: Role) => {
    return session?.user?.roles?.includes(role) ?? false;
  };

  const hasAccess = (requiredRoles?: Role[], requiredPermissions?: Permission[]) => {
    if (!requiredRoles?.length && !requiredPermissions?.length) {
      return true;
    }

    const hasRequiredRole = requiredRoles?.some(role => hasRole(role)) ?? true;
    const hasRequiredPermission = requiredPermissions?.every(permission =>
      hasPermission(permission)
    ) ?? true;

    return hasRequiredRole && hasRequiredPermission;
  };

  const logout = async () => {
    await signOut({
      callbackUrl: "/login",
      redirect: true
    });
  };

  return {
    user: session?.user,
    isAuthenticated: !!session?.user,
    isLoading: status === "loading",
    hasPermission,
    hasRole,
    hasAccess,
    logout,
    session,
    status
  } as const;
}

// Custom hook to protect components
export function useRequireAuth(
  requiredRoles?: Role[],
  requiredPermissions?: Permission[]
) {
  const {hasAccess, isLoading} = useAuth();

  if (isLoading) {
    return {isLoading: true};
  }

  const hasRequiredAccess = hasAccess(requiredRoles, requiredPermissions);
  if (!hasRequiredAccess) {
    redirect("/unauthorized");
  }

  return {isLoading: false};
}