/**
 * Keycloak Authentication Callback Handler
 * 
 * This API route handles the OAuth callback from Keycloak after successful
 * authentication with an external identity provider (Google, Microsoft, etc.)
 */

import { NextRequest, NextResponse } from 'next/server';

const KEYCLOAK_BASE_URL = process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL || 'http://localhost:8080';
const KEYCLOAK_REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'pharmacyhub';
const KEYCLOAK_CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'pharmacyhub-client';
const KEYCLOAK_CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET || 'your-client-secret';

export async function GET(request: NextRequest) {
  // Extract the authorization code from the URL
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  
  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', request.url));
  }
  
  try {
    // Exchange the code for tokens using Keycloak token endpoint
    const tokenEndpoint = `${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;
    const redirectUri = new URL('/api/auth/callback', request.url).toString();
    
    const formData = new URLSearchParams();
    formData.append('grant_type', 'authorization_code');
    formData.append('client_id', KEYCLOAK_CLIENT_ID);
    formData.append('client_secret', KEYCLOAK_CLIENT_SECRET);
    formData.append('code', code);
    formData.append('redirect_uri', redirectUri);
    
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Token exchange error:', errorData);
      return NextResponse.redirect(new URL(`/login?error=${errorData.error || 'token_exchange_failed'}`, request.url));
    }
    
    const tokenData = await response.json();
    
    // Create response with cookies for the tokens
    const redirectUrl = new URL('/dashboard', request.url);
    const response2 = NextResponse.redirect(redirectUrl);
    
    // Store tokens in cookies
    const expiryTime = Date.now() + (tokenData.expires_in * 1000);
    response2.cookies.set('pharmacyhub_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in,
      path: '/',
    });
    
    response2.cookies.set('pharmacyhub_refresh_token', tokenData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.refresh_expires_in || 86400, // 24 hours default
      path: '/',
    });
    
    response2.cookies.set('pharmacyhub_token_expiry', expiryTime.toString(), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in,
      path: '/',
    });
    
    return response2;
    
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=server_error', request.url));
  }
}
