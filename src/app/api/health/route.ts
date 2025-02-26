import { API_CONFIG } from '@/shared/auth/apiConfig';
import { NextResponse } from 'next/server';

/**
 * Health Check Handler
 * 
 * This API route checks the health of the backend authentication service
 */
export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return NextResponse.json({
          status: 'error',
          message: `API server returned an error: ${response.status} ${response.statusText}`,
          details: {
            timestamp: new Date().toISOString(),
          }
        }, { status: response.status });
      }

      return NextResponse.json({
        status: 'ok',
        message: 'API server is available',
        details: {
          timestamp: new Date().toISOString(),
        }
      });

    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);

      if (fetchError && typeof fetchError === 'object' && 'name' in fetchError && fetchError.name === 'AbortError') {
        return NextResponse.json({
          status: 'error',
          message: 'Connection to API server timed out',
          details: {
            timestamp: new Date().toISOString(),
          }
        }, { status: 504 });
      }

      return NextResponse.json({
        status: 'error',
        message: `Network error: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`,
        details: {
          timestamp: new Date().toISOString(),
        }
      }, { status: 503 });
    }

  } catch (error: unknown) {
    return NextResponse.json({
      status: 'error',
      message: `Failed to check API connectivity: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: {
        timestamp: new Date().toISOString(),
      }
    }, { status: 500 });
  }
}
