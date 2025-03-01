import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { keycloakConfig } from '@/config/env';

// Pages that don't require authentication
const publicPages = ['/login', '/register', '/forgot-password', '/reset-password'];

/**
 * Check if a page is public (doesn't require authentication)
 */
function isPublicPage(path: string): boolean {
  return publicPages.some(page => path.startsWith(page)) || path.startsWith('/_next') || path.startsWith('/api/auth');
}

/**
 * Extract token from authorization header or cookie
 */
function getToken(request: NextRequest): string | null {
  // Try to get token from authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Try to get token from cookie
  const token = request.cookies.get('pharmacyhub_access_token');
  return token?.value || null;
}

/**
 * Validate token expiry
 */
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

/**
 * Authentication middleware
 */
export async function authMiddleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow public pages
  if (isPublicPage(path)) {
    return NextResponse.next();
  }

  // Get token
  const token = getToken(request);

  // If no token present, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Check token expiry
  if (isTokenExpired(token)) {
    // Try to refresh the token
    const refreshToken = request.cookies.get('pharmacyhub_refresh_token')?.value;
    
    if (refreshToken) {
      try {
        const response = await fetch(`${keycloakConfig.baseUrl}/protocol/openid-connect/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: keycloakConfig.clientId,
            client_secret: keycloakConfig.clientSecret,
            refresh_token: refreshToken,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const response = NextResponse.next();
          
          // Set new tokens in cookies
          response.cookies.set('pharmacyhub_access_token', data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: data.expires_in,
          });
          
          response.cookies.set('pharmacyhub_refresh_token', data.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: data.refresh_expires_in,
          });

          return response;
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    }

    // If refresh fails, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Token is valid, continue
  return NextResponse.next();
}