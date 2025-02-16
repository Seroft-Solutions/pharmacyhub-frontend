import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected route patterns
const protectedRoutes = [
  '/dashboard',
  '/prescriptions',
  '/inventory',
  '/orders',
  '/billing',
  '/settings',
];

// Define public routes that should be accessible without auth
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

// Define auth routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies
  const token = request.cookies.get('auth-token')?.value;
  
  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the path is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // If accessing auth routes with valid token, redirect to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // For API routes, ensure proper CORS and authentication headers
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_FRONTEND_URL || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return response;
    }

    // For protected API routes, check token
    if (isProtectedRoute && !token) {
      return new NextResponse(
        JSON.stringify({ message: 'Authentication required' }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return response;
  }

  return NextResponse.next();
}

// Configure which routes should be processed by this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 