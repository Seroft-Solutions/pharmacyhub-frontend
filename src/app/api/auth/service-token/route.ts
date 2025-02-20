import { KEYCLOAK_CONFIG } from '@/shared/auth/apiConfig';
import { NextRequest, NextResponse } from 'next/server';

/**
 * This API route acts as a proxy for Keycloak service account token requests
 */
export async function POST(request: NextRequest) {
  try {
    const tokenUrl = `${KEYCLOAK_CONFIG.BASE_URL}/realms/${KEYCLOAK_CONFIG.REALM}/protocol/openid-connect/token`;
    
    // Create form data for service account auth
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', KEYCLOAK_CONFIG.CLIENT_ID);
    formData.append('client_secret', KEYCLOAK_CONFIG.CLIENT_SECRET);
    
    // Create a new request to Keycloak with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    try {
      const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!tokenResponse.ok) {
        let errorMessage;
        try {
          const errorData = await tokenResponse.json();
          errorMessage = errorData.error_description || errorData.error || 'Service account token acquisition failed';
        } catch {
          errorMessage = `Service account token acquisition failed with status ${tokenResponse.status}`;
        }
        
        return NextResponse.json(
          { error: errorMessage },
          { status: tokenResponse.status }
        );
      }
      
      // Return the Keycloak token response
      const tokenData = await tokenResponse.json();
      return NextResponse.json(tokenData);
      
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Keycloak server timeout' },
          { status: 504 }
        );
      }
      
      return NextResponse.json(
        { error: fetchError.message || 'Service token request failed' },
        { status: 500 }
      );
    }
    
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
