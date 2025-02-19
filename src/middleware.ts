/**
 * Next.js Middleware for Authentication Protection
 *
 * This middleware protects routes based on authentication status.
 * It intercepts navigation requests and verifies authentication
 * before allowing access to protected routes.
 */

import {NextRequest, NextResponse} from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/pharmacy',
  '/exams',
  '/admin',
];

// Routes that should be redirected if user is already authenticated
const AUTH_ROUTES = [
  '/login',
  '/register',
  '/reset-password',
];

/**
 * Check if a route matches any of the patterns
 */
const matchesRoute = (path: string, patterns: string[]): boolean => {
  return patterns.some(pattern =>
    path === pattern || path.startsWith(`${pattern}/`)
  );
};

/**
 * Middleware function to protect routes
 */
export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // Skip for API routes and static assets
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }

  // Check for authentication token
  const hasToken = request.cookies.has('pharmacyhub_access_token');

  // Redirect unauthenticated users away from protected routes
  if (!hasToken && matchesRoute(pathname, PROTECTED_ROUTES)) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth routes
  if (hasToken && matchesRoute(pathname, AUTH_ROUTES)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

/**
 * Configure which routes this middleware applies to
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public directory
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};