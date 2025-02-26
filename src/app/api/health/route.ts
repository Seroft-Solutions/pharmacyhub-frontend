import { NextResponse } from 'next/server';
import { API_CONFIG, AUTH_ENDPOINTS } from '@/shared/auth/apiConfig';

export async function GET() {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.HEALTH}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          status: 'error',
          message: `Backend health check failed: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to connect to backend service',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}
