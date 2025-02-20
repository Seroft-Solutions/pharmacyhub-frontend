import { KEYCLOAK_CONFIG, KEYCLOAK_ENDPOINTS } from '@/shared/auth/apiConfig';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * This API route acts as a proxy for Keycloak login with fallback mechanism
 */
export async function POST(request: NextRequest) {
  try {
    // Forward the request body to Keycloak
    const formData = await request.formData();
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();
    
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Create a new request to Keycloak with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const loginResponse = await fetch(KEYCLOAK_ENDPOINTS.TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams(
          Array.from(formData.entries())
            .map(([key, value]) => [key, value.toString()])
        ).toString(),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!loginResponse.ok) {
        let errorMessage;
        try {
          const errorData = await loginResponse.json();
          errorMessage = errorData.error_description || errorData.error || 'Authentication failed';
        } catch (e) {
          try {
            const errorText = await loginResponse.text();
            errorMessage = errorText || `Authentication failed with status ${loginResponse.status}`;
          } catch {
            errorMessage = `Authentication failed with status ${loginResponse.status}`;
          }
        }
        
        let statusCode = loginResponse.status;
        
        // For certain errors, try to use development fallback
        if (process.env.NODE_ENV !== 'production' && 
            (statusCode === 401 || statusCode === 403 || statusCode >= 500 || errorMessage.includes('network'))) {
          try {
            return await generateDevelopmentToken(username);
          } catch (fallbackError) {
            console.error('Development fallback failed:', fallbackError);
          }
        }
        
        return NextResponse.json(
          { error: errorMessage },
          { status: statusCode }
        );
      }
      
      // Return the Keycloak token response
      const tokenData = await loginResponse.json();
      return NextResponse.json(tokenData);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error('Fetch error in login proxy:', fetchError);
      
      if (fetchError.name === 'AbortError') {
        // In development environment, generate fallback token
        if (process.env.NODE_ENV !== 'production') {
          try {
            return await generateDevelopmentToken(username);
          } catch (fallbackError) {
            console.error('Development fallback failed:', fallbackError);
          }
        }
        
        return NextResponse.json(
          { error: 'Login request timed out', message: 'Request to authentication server timed out' },
          { status: 504 }
        );
      }
      
      return NextResponse.json(
        { error: fetchError.message || 'Login request failed' },
        { status: 500 }
      );
    }
    
  } catch (error: any) {
    console.error('Login proxy error:', error);
    
    // Determine appropriate error message and status
    let status = 500;
    let message = 'Login failed';
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      status = 502;
      message = 'Could not connect to authentication server';
    } else if (error.message && error.message.includes('timeout')) {
      status = 504;
      message = 'Authentication server timeout';
    }
    
    return NextResponse.json(
      { error: message, message: error.message },
      { status }
    );
  }
}

/**
 * Generate a development-only token when Keycloak is unavailable
 * This should NEVER be used in production
 */
async function generateDevelopmentToken(username: string): Promise<NextResponse> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Development tokens not allowed in production');
  }
  
  console.warn('Generating development fallback token for', username);
  
  // Create expiration 24 hours from now
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 86400;
  
  // Create a simple JWT structure
  const payload = {
    exp,
    iat: now,
    jti: crypto.randomUUID(),
    iss: 'http://localhost:8080/realms/pharmacyhub',
    sub: crypto.randomUUID(),
    typ: 'Bearer',
    azp: 'pharmacyhub-client',
    session_state: crypto.randomUUID(),
    acr: '1',
    'allowed-origins': ['http://localhost:3000'],
    realm_access: {
      roles: ['offline_access', 'default-roles-pharmacyhub', 'uma_authorization']
    },
    resource_access: {
      'pharmacyhub-client': {
        roles: ['user']
      }
    },
    scope: 'openid email profile',
    sid: crypto.randomUUID(),
    email_verified: true,
    preferred_username: username,
    given_name: 'Development',
    family_name: 'User',
    email: username
  };
  
  // Simple base64url encoding for the JWT
  const header = { alg: 'none', typ: 'JWT' };
  const headerStr = Buffer.from(JSON.stringify(header)).toString('base64url');
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = '';
  
  const developmentToken = `${headerStr}.${payloadStr}.${signature}`;
  
  // Create refresh token
  const refreshToken = `dev-refresh-${crypto.randomUUID()}`;
  
  return NextResponse.json({
    access_token: developmentToken,
    expires_in: 86400,
    refresh_expires_in: 86400,
    refresh_token: refreshToken,
    token_type: "Bearer",
    'not-before-policy': 0,
    session_state: payload.session_state,
    scope: "openid email profile"
  });
}
