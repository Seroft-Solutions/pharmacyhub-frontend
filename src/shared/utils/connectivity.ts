import { KEYCLOAK_CONFIG, KEYCLOAK_ENDPOINTS } from '@/shared/auth/apiConfig';

/**
 * Performs a health check on the Keycloak server
 * This can be used during app initialization to check connectivity
 */
export async function checkKeycloakConnectivity(): Promise<{
  isAvailable: boolean;
  message: string;
  endpoint?: string;
}> {
  try {
    // Try to reach the public Keycloak well-known endpoint
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
        return {
          isAvailable: false,
          message: `Keycloak server returned an error: ${response.status} ${response.statusText}`,
          endpoint: wellKnownUrl,
        };
      }
      
      const config = await response.json();
      
      return {
        isAvailable: true,
        message: 'Keycloak server is available',
        endpoint: wellKnownUrl,
      };
      
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return {
          isAvailable: false,
          message: 'Connection to Keycloak server timed out',
          endpoint: wellKnownUrl,
        };
      }
      
      return {
        isAvailable: false,
        message: `Network error: ${fetchError.message}`,
        endpoint: wellKnownUrl,
      };
    }
    
  } catch (error: any) {
    return {
      isAvailable: false,
      message: `Failed to check Keycloak connectivity: ${error.message}`,
    };
  }
}

/**
 * Helper function to find API connectivity issues
 * Can be used to detect network or CORS issues
 */
export async function detectConnectivityIssues() {
  try {
    const keycloakStatus = await checkKeycloakConnectivity();
    
    // If direct connection fails, try through proxy
    if (!keycloakStatus.isAvailable && typeof window !== 'undefined') {
      try {
        const proxyResponse = await fetch('/api/auth/health', {
          method: 'GET',
        });
        
        if (proxyResponse.ok) {
          return {
            directConnection: false,
            proxyConnection: true,
            recommendedApproach: 'proxy',
            message: 'Use proxy API to avoid CORS or network issues',
          };
        } else {
          return {
            directConnection: false,
            proxyConnection: false,
            recommendedApproach: 'none',
            message: 'Both direct and proxy connections failed',
          };
        }
      } catch (proxyError) {
        return {
          directConnection: false,
          proxyConnection: false,
          recommendedApproach: 'none',
          message: 'Both direct and proxy connections failed',
          errors: {
            direct: keycloakStatus.message,
            proxy: proxyError instanceof Error ? proxyError.message : 'Unknown proxy error',
          }
        };
      }
    }
    
    return {
      directConnection: keycloakStatus.isAvailable,
      proxyConnection: false, // Not tested if direct works
      recommendedApproach: keycloakStatus.isAvailable ? 'direct' : 'none',
      message: keycloakStatus.message,
    };
    
  } catch (error) {
    return {
      directConnection: false,
      proxyConnection: false,
      recommendedApproach: 'none',
      message: 'Failed to detect connectivity issues',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
