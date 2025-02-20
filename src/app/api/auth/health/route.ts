import { KEYCLOAK_CONFIG } from '@/shared/auth/apiConfig';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Health check endpoint for Keycloak connectivity
 * This route serves as both a proxy test and a way to verify Keycloak availability
 */
export async function GET(request: NextRequest) {
  try {
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
      
      if (!response.ok) {
        return NextResponse.json(
          { 
            status: 'error',
            message: `Keycloak server returned an error: ${response.status} ${response.statusText}`,
            timestamp: new Date().toISOString(),
          },
          { status: 502 }
        );
      }
      
      return NextResponse.json(
        {
          status: 'ok',
          message: 'Keycloak server is available',
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
      
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Connection to Keycloak server timed out',
            timestamp: new Date().toISOString(),
          },
          { status: 504 }
        );
      }
      
      return NextResponse.json(
        {
          status: 'error',
          message: `Network error: ${fetchError.message}`,
          timestamp: new Date().toISOString(),
        },
        { status: 502 }
      );
    }
    
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: `Failed to check Keycloak connectivity: ${error.message}`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
