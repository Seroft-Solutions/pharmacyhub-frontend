import { NextRequest, NextResponse } from 'next/server';
import { keycloakConfig } from '@/config/env';
import { logger } from '@/shared/lib/logger';
import { withApiLogger } from '@/shared/lib/api-logger';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  error?: string;
  error_description?: string;
}

async function handler(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      logger.warn('Token refresh failed - Missing refresh token', {
        path: request.nextUrl.pathname
      });
      
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    logger.info('Token refresh attempt', {
      path: request.nextUrl.pathname
    });

    const tokenEndpoint = `${keycloakConfig.baseUrl}/realms/pharmacyhub/protocol/openid-connect/token`;
    const formData = new URLSearchParams({
      'grant_type': 'refresh_token',
      'client_id': keycloakConfig.clientId,
      'client_secret': keycloakConfig.clientSecret,
      'refresh_token': refreshToken,
    });

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json() as TokenResponse;

    if (!response.ok) {
      logger.warn('Token refresh failed', {
        path: request.nextUrl.pathname,
        statusCode: response.status,
        error: data.error,
        errorDescription: data.error_description
      });

      return NextResponse.json(
        { error: data.error_description || 'Token refresh failed' },
        { status: response.status }
      );
    }

    logger.info('Token refresh successful', {
      path: request.nextUrl.pathname
    });

    return NextResponse.json(data);
  } catch (error: Error | unknown) {
    logger.error('Token refresh error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      path: request.nextUrl.pathname
    });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = withApiLogger(handler);