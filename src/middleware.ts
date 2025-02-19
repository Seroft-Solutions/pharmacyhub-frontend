import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";
import { isAuthorized, type AuthConfig } from "@/utils/auth-utils";

const routeConfig: Record<string, AuthConfig> = {
  // Dashboard Routes
  "/dashboard": {
    roles: ["USER", "ADMIN", "PHARMACIST", "INSTRUCTOR"],
  },

  // Admin Routes
  "/admin": {
    roles: ["ADMIN"],
    requireAllRoles: true,
  },

  // Pharmacy Routes
  "/pharmacy": {
    roles: ["PHARMACIST", "ADMIN"],
    permissions: ["view:pharmacy"],
  },
  "/pharmacy/manage": {
    roles: ["PHARMACIST", "ADMIN"],
    permissions: ["create:pharmacy", "edit:pharmacy"],
    requireAllPermissions: true,
  },
  "/pharmacy/delete": {
    roles: ["ADMIN"],
    permissions: ["delete:pharmacy"],
    requireAllRoles: true,
    requireAllPermissions: true,
  },

  // Exam Routes
  "/exams": {
    roles: ["USER", "PHARMACIST"],
    permissions: ["take:exams"],
  },
  "/exams/manage": {
    roles: ["INSTRUCTOR", "ADMIN"],
    permissions: ["manage:exams"],
  },
  "/exams/grade": {
    roles: ["INSTRUCTOR", "ADMIN"],
    permissions: ["grade:exams"],
  },

  // User Management Routes
  "/users": {
    roles: ["ADMIN"],
    permissions: ["manage:users"],
    requireAllRoles: true,
  },
  "/users/view": {
    roles: ["ADMIN", "INSTRUCTOR"],
    permissions: ["view:users"],
  },

  // Settings Routes
  "/settings": {
    roles: ["USER", "ADMIN", "PHARMACIST", "INSTRUCTOR"],
  },
  "/settings/roles": {
    roles: ["ADMIN"],
    permissions: ["manage:roles"],
    requireAllRoles: true,
    requireAllPermissions: true,
  }
};

function getRouteConfig(pathname: string): [string, AuthConfig] | undefined {
  return Object.entries(routeConfig)
    .find(([route]) => pathname.startsWith(route));
}

function createUnauthorizedResponse(request: NextRequestWithAuth, pathname: string, config: AuthConfig): Response {
  const unauthorizedUrl = new URL('/unauthorized', request.url);
  unauthorizedUrl.searchParams.set('from', pathname);
  unauthorizedUrl.searchParams.set('roles', config.roles?.join(',') || '');
  unauthorizedUrl.searchParams.set('permissions', config.permissions?.join(',') || '');
  return NextResponse.redirect(unauthorizedUrl);
}

function createLoginResponse(request: NextRequestWithAuth, pathname: string): Response {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('callbackUrl', pathname);
  return NextResponse.redirect(loginUrl);
}

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const token = request.nextauth.token;
    const pathname = request.nextUrl.pathname;

    // Find matching route config
    const routeMatch = getRouteConfig(pathname);
    
    // If no matching route config, allow access
    if (!routeMatch) {
      return NextResponse.next();
    }

    const [, config] = routeMatch;

    // If no token, redirect to login
    if (!token) {
      return createLoginResponse(request, pathname);
    }

    const userRoles = token.roles || [];
    const userPermissions = token.permissions || [];

    // Check authorization
    if (!isAuthorized(userRoles, userPermissions, config)) {
      return createUnauthorizedResponse(request, pathname, config);
    }

    // Add auth info to headers for debugging
    const response = NextResponse.next();
    if (process.env.NODE_ENV === 'development') {
      response.headers.set('x-user-roles', userRoles.join(','));
      response.headers.set('x-user-permissions', userPermissions.join(','));
    }
    
    return response;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    // Match all protected routes
    '/dashboard/:path*',
    '/admin/:path*',
    '/pharmacy/:path*',
    '/exams/:path*',
    '/users/:path*',
    '/settings/:path*',
    
    // Don't match public routes
    '/((?!api|_next/static|_next/image|favicon.ico|login|register).*)',
  ],
};