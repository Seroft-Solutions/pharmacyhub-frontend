/**
 * Performs a health check on the backend API
 * This can be used during app initialization to check connectivity
 */
export async function checkApiConnectivity(): Promise<{
  isAvailable: boolean;
  message: string;
  endpoint?: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch('/api/health', {
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
          message: `API server returned an error: ${response.status} ${response.statusText}`,
          endpoint: '/api/health',
        };
      }

      return {
        isAvailable: true,
        message: 'API server is available',
        endpoint: '/api/health',
      };

    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);

      if (fetchError && typeof fetchError === 'object' && 'name' in fetchError && fetchError.name === 'AbortError') {
        return {
          isAvailable: false,
          message: 'Connection to API server timed out',
          endpoint: '/api/health',
        };
      }

      const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error';
      return {
        isAvailable: false,
        message: `Network error: ${errorMessage}`,
        endpoint: '/api/health',
      };
    }

  } catch (error: unknown) {
    return {
      isAvailable: false,
      message: `Failed to check API connectivity: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Helper function to find API connectivity issues
 * Can be used to detect network or CORS issues
 */
export async function detectConnectivityIssues() {
  try {
    const apiStatus = await checkApiConnectivity();

    if (!apiStatus.isAvailable) {
      return {
        status: 'error',
        message: apiStatus.message,
        details: {
          endpoint: apiStatus.endpoint,
          timestamp: new Date().toISOString(),
        }
      };
    }

    return {
      status: 'ok',
      message: 'API server is available',
      details: {
        endpoint: apiStatus.endpoint,
        timestamp: new Date().toISOString(),
      }
    };

  } catch (error) {
    return {
      status: 'error',
      message: 'Failed to detect connectivity issues',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
