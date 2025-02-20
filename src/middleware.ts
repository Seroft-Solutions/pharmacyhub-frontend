import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware to handle CORS and credentials for external API requests
 */
export function middleware(request: NextRequest) {
  // Only apply this middleware to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Get response to modify headers
    const response = NextResponse.next();
    
    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { 
        status: 204,
        headers: response.headers
      });
    }

    return response;
  }
  
  // For other routes, just continue
  return NextResponse.next();
}

// Configure the middleware to run only for API routes
export const config = {
  matcher: '/api/:path*',
};
