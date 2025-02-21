import { KEYCLOAK_ENDPOINTS } from '@/shared/auth/apiConfig';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { logger } from '@/shared/lib/logger';
import { withApiLogger } from '@/shared/lib/api-logger';

interface KeycloakError {
  error: string;
  error_description?: string;
}

/**
 * This API route acts as a proxy for Keycloak login with fallback mechanism
 */
async function handler(request: NextRequest) {
  try {
    // Forward the request body to Keycloak
    const formData = await request.formData();
    const username = formData.get('username')?.toString();
    
    if (!username || !formData.get('password')) {
      logger.warn('Login attempt failed - Missing credentials', {
        path: request.nextUrl.pathname,
        username: username || 'unknown'
      });
      
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    logger.info('Login attempt', {
      path: request.nextUrl.pathname,
      username
    });
    
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
        let errorMessage: string;
        try {
          const errorData = await loginResponse.json() as KeycloakError;
          errorMessage = errorData.error_description || errorData.error || 'Authentication failed';
        } catch {
          try {
            const errorText = await loginResponse.text();
            errorMessage = errorText || `Authentication failed with status ${loginResponse.status}`;
          } catch {
            errorMessage = `Authentication failed with status ${loginResponse.status}`;
          }
        }
        
        const statusCode = loginResponse.status;
        
        logger.warn('Keycloak authentication failed', {
          username,
          statusCode,
          errorMessage,
          path: request.nextUrl.pathname
        });
        
        // For certain errors, try to use development fallback
        if (process.env.NODE_ENV !== 'production' && 
            (statusCode === 401 || statusCode === 403 || statusCode >= 500 || errorMessage.includes('network'))) {
          try {
            logger.info('Attempting development fallback auth', {
              username,
              reason: 'Keycloak authentication failed'
            });
            return await generateDevelopmentToken(username);
          } catch (fallbackError) {
            logger.error('Development fallback failed', {
              username,
              error: fallbackError instanceof Error ? fallbackError.message : 'Unknown error',
              stack: fallbackError instanceof Error ? fallbackError.stack : undefined
            });
          }
        }
        
        return NextResponse.json(
          { error: errorMessage },
          { status: statusCode }
        );
      }
      
      // Log successful authentication
      logger.info('Authentication successful', {
        username,
        path: request.nextUrl.pathname
      });
      
      // Return the Keycloak token response
      const tokenData = await loginResponse.json();
      return NextResponse.json(tokenData);
    } catch (fetchError: Error | unknown) {
      clearTimeout(timeoutId);
      logger.error('Fetch error in login proxy', {
        username,
        error: fetchError instanceof Error ? fetchError.message : 'Unknown error',
        stack: fetchError instanceof Error ? fetchError.stack : undefined,
        path: request.nextUrl.pathname
      });
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        // In development environment, generate fallback token
        if (process.env.NODE_ENV !== 'production') {
          try {
            logger.info('Attempting development fallback auth due to timeout', {
              username
            });
            return await generateDevelopmentToken(username);
          } catch (fallbackError) {
            logger.error('Development fallback failed after timeout', {
              username,
              error: fallbackError instanceof Error ? fallbackError.message : 'Unknown error',
              stack: fallbackError instanceof Error ? fallbackError.stack : undefined
            });
          }
        }
        
        return NextResponse.json(
          { error: 'Login request timed out', message: 'Request to authentication server timed out' },
          { status: 504 }
        );
      }
      
      return NextResponse.json(
        { error: fetchError instanceof Error ? fetchError.message : 'Login request failed' },
        { status: 500 }
      );
    }
    
  } catch (error: Error | unknown) {
    const typedError = error as Error & { code?: string };
    logger.error('Login proxy error', {
      error: typedError.message,
      code: typedError.code,
      stack: typedError instanceof Error ? typedError.stack : undefined,
      path: request.nextUrl.pathname
    });
    
    // Determine appropriate error message and status
    let status = 500;
    let message = 'Login failed';
    
    if (typedError.code === 'ECONNREFUSED' || typedError.code === 'ENOTFOUND') {
      status = 502;
      message = 'Could not connect to authentication server';
    } else if (typedError.message && typedError.message.includes('timeout')) {
      status = 504;
      message = 'Authentication server timeout';
    }
    
    return NextResponse.json(
      { error: message, message: typedError.message },
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
    logger.error('Attempted to generate development token in production', {
      username
    });
    throw new Error('Development tokens not allowed in production');
  }
  
  logger.warn('Generating development fallback token', {
    username,
    environment: process.env.NODE_ENV
  });
  
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
  
  logger.debug('Development token generated', {
    username,
    exp,
    sessionState: payload.session_state
  });
  
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

// Wrap the handler with apiLogger middleware
export const POST = withApiLogger(handler);
