import { KEYCLOAK_CONFIG } from '@/shared/auth/apiConfig';
import { NextRequest, NextResponse } from 'next/server';

/**
 * This API route acts as a proxy for Keycloak admin token requests to avoid CORS issues.
 * The frontend client makes requests to this endpoint instead of directly to Keycloak.
 */
export async function POST(request: NextRequest) {
  try {
    const masterRealmTokenUrl = `${KEYCLOAK_CONFIG.BASE_URL}/realms/master/protocol/openid-connect/token`;
    
    // Forward the request body to Keycloak
    const formData = await request.formData();
    
    // Create a new request to Keycloak with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const keycloakResponse = await fetch(masterRealmTokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(
          Array.from(formData.entries())
            .map(([key, value]) => [key, value.toString()])
        ).toString(),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!keycloakResponse.ok) {
        let errorDetails;
        try {
          errorDetails = await keycloakResponse.text();
        } catch {
          errorDetails = 'Could not retrieve error details';
        }
        
        console.error('Admin token proxy error:', {
          status: keycloakResponse.status,
          statusText: keycloakResponse.statusText,
          body: errorDetails,
        });
        
        return NextResponse.json(
          { error: 'Failed to obtain admin token', details: errorDetails },
          { status: keycloakResponse.status }
        );
      }
      
      // Return the Keycloak response
      const tokenData = await keycloakResponse.json();
      return NextResponse.json(tokenData);
      
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error('Fetch error in admin token proxy:', fetchError);
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Keycloak server timeout', message: 'Request to authentication server timed out' },
          { status: 504 }
        );
      }
      
      throw fetchError; // Let the outer catch handle it
    }
    
  } catch (error: any) {
    console.error('Proxy server error:', error);
    
    // Determine appropriate error message and status
    let status = 500;
    let message = 'Internal server error';
    
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
