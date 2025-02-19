import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isTokenExpired } from './lib/auth';

// Define protected route patterns
const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/profile',
  '/inventory',
  '/orders'
];

// Define role-based route patterns
const roleBasedRoutes = {
  '/admin': ['SUPER_ADMIN', 'ADMIN'],
  '/inventory/manage': ['ADMIN', 'MANAGER'],
  '/reports': ['ADMIN', 'MANAGER']
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get the token from cookies
  const accessToken = request.cookies.get('access_token')?.value;

  if (!accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if token is expired
  if (isTokenExpired(accessToken)) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
  }

  // Check role-based access
  const userRoles = request.cookies.get('user_roles')?.value;
  if (userRoles) {
    const roles = JSON.parse(decodeURIComponent(userRoles));
    
    // Check if the current path requires specific roles
    for (const [routePattern, requiredRoles] of Object.entries(roleBasedRoutes)) {
      if (pathname.startsWith(routePattern)) {
        const hasRequiredRole = requiredRoles.some(role => roles.includes(role));
        if (!hasRequiredRole) {
          return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

// Configure middleware matching
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};