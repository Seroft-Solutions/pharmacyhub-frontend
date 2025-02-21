import { KEYCLOAK_CONFIG } from '@/shared/auth/apiConfig';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/shared/lib/logger';
import { withApiLogger } from '@/shared/lib/api-logger';

interface HealthCheckResponse {
  status: 'ok' | 'error';
  message: string;
  timestamp: string;
  responseTime: string;
  details?: Record<string, unknown>;
}

/**
 * Health check endpoint for Keycloak connectivity
 * This route serves as both a proxy test and a way to verify Keycloak availability
 */
async function handler(request: NextRequest) {
  const startTime = Date.now();

  try {
    logger.info('Starting Keycloak health check', {
      path: request.nextUrl.pathname,
      keycloakBaseUrl: KEYCLOAK_CONFIG.BASE_URL
    });

    // Try to reach the Keycloak well-known endpoint
    const wellKnownUrl = `${KEYCLOAK_CONFIG.BASE_URL}/realms/${KEYCLOAK_CONFIG.REALM}/.well-known/openid-configuration`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const response = await fetch(wellKnownUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      
      if (!response.ok) {
        const errorResponse: HealthCheckResponse = {
          status: 'error',
          message: `Keycloak server returned an error: ${response.status} ${response.statusText}`,
          timestamp: new Date().toISOString(),
          responseTime: `${responseTime}ms`,
          details: {
            statusCode: response.status,
            statusText: response.statusText
          }
        };

        logger.error('Keycloak health check failed - Server Error', {
          statusCode: response.status,
          statusText: response.statusText,
          responseTime,
          path: request.nextUrl.pathname
        });

        return NextResponse.json(errorResponse, { status: 502 });
      }
      
      const successResponse: HealthCheckResponse = {
        status: 'ok',
        message: 'Keycloak server is available',
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        details: {
          url: wellKnownUrl
        }
      };

      logger.info('Keycloak health check successful', {
        responseTime,
        path: request.nextUrl.pathname
      });

      return NextResponse.json(successResponse, { status: 200 });
      
    } catch (fetchError: Error | unknown) {
      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        const timeoutResponse: HealthCheckResponse = {
          status: 'error',
          message: 'Connection to Keycloak server timed out',
          timestamp: new Date().toISOString(),
          responseTime: `${responseTime}ms`,
          details: {
            timeout: 5000
          }
        };

        logger.error('Keycloak health check failed - Timeout', {
          error: 'Connection timeout',
          responseTime,
          path: request.nextUrl.pathname
        });

        return NextResponse.json(timeoutResponse, { status: 504 });
      }
      
      const networkResponse: HealthCheckResponse = {
        status: 'error',
        message: `Network error: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`,
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        details: {
          error: fetchError instanceof Error ? fetchError.message : 'Unknown error'
        }
      };

      logger.error('Keycloak health check failed - Network Error', {
        error: fetchError instanceof Error ? fetchError.message : 'Unknown error',
        stack: fetchError instanceof Error ? fetchError.stack : undefined,
        responseTime,
        path: request.nextUrl.pathname
      });

      return NextResponse.json(networkResponse, { status: 502 });
    }
    
  } catch (error: Error | unknown) {
    const responseTime = Date.now() - startTime;
    const errorResponse: HealthCheckResponse = {
      status: 'error',
      message: `Failed to check Keycloak connectivity: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    };

    logger.error('Keycloak health check failed - Internal Error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      responseTime,
      path: request.nextUrl.pathname
    });

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export const GET = withApiLogger(handler);
