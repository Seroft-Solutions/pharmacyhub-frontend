import { KEYCLOAK_CONFIG, KEYCLOAK_ENDPOINTS } from '@/shared/auth/apiConfig';
import { NextRequest, NextResponse } from 'next/server';

/**
 * This API route acts as a proxy for Keycloak user registration to avoid CORS issues.
 */
export async function POST(request: NextRequest) {
  try {
    // Get admin token first with timeout
    const adminToken = await getAdminToken();
    
    if (!adminToken) {
      return NextResponse.json(
        { error: 'Failed to obtain admin token for registration' },
        { status: 401 }
      );
    }
    
    // Parse the registration data from the request
    const userData = await request.json();
    
    // Create a new request to Keycloak with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for registration
    
    try {
      const registerResponse = await fetch(KEYCLOAK_ENDPOINTS.ADMIN_USERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(userData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!registerResponse.ok) {
        let errorMessage;
        let statusCode = registerResponse.status;
        
        try {
          const errorJson = await registerResponse.json();
          errorMessage = errorJson.errorMessage || 
                        errorJson.error || 
                        `Failed to register user: ${registerResponse.status} ${registerResponse.statusText}`;
                        
          // Set appropriate status code based on error content
          if (errorMessage.includes('already exists')) {
            statusCode = 409; // Conflict - username/email already exists
          }
        } catch (e) {
          try {
            const errorText = await registerResponse.text();
            errorMessage = errorText || `Failed to register user: ${registerResponse.status} ${registerResponse.statusText}`;
          } catch {
            errorMessage = `Failed to register user: ${registerResponse.status} ${registerResponse.statusText}`;
          }
        }
        
        return NextResponse.json(
          { error: errorMessage },
          { status: statusCode }
        );
      }
      
      // If successful, get the user ID from the Location header
      const locationHeader = registerResponse.headers.get('Location');
      const userId = locationHeader ? locationHeader.split('/').pop() : null;
      
      return NextResponse.json({ success: true, userId });
      
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error('Fetch error in registration proxy:', fetchError);
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Registration request timed out', message: 'Request to authentication server timed out' },
          { status: 504 }
        );
      }
      
      throw fetchError; // Let the outer catch handle it
    }
  } catch (error: any) {
    console.error('Registration proxy error:', error);
    
    // Determine appropriate error message and status
    let status = 500;
    let message = 'Registration failed';
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      status = 502;
      message = 'Could not connect to authentication server';
    } else if (error.message && error.message.includes('timeout')) {
      status = 504;
      message = 'Authentication server timeout';
    } else if (error.message && error.message.includes('401')) {
      status = 401;
      message = 'Unauthorized access to registration service';
    }
    
    return NextResponse.json(
      { error: message, message: error.message },
      { status }
    );
  }
}

/**
 * Helper function to obtain an admin token with timeout
 */
async function getAdminToken(): Promise<string | null> {
  try {
    const masterRealmTokenUrl = `${KEYCLOAK_CONFIG.BASE_URL}/realms/master/protocol/openid-connect/token`;
    
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('client_id', 'admin-cli');
    formData.append('username', KEYCLOAK_CONFIG.ADMIN_USERNAME);
    formData.append('password', KEYCLOAK_CONFIG.ADMIN_PASSWORD);
    
    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    try {
      const response = await fetch(masterRealmTokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error('Admin token acquisition failed:', {
          status: response.status,
          statusText: response.statusText,
        });
        return null;
      }
      
      const tokenData = await response.json();
      return tokenData.access_token;
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch error during admin token acquisition:', fetchError);
      return null;
    }
  } catch (error) {
    console.error('Error getting admin token in proxy:', error);
    return null;
  }
}
