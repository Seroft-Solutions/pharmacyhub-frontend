import { NextRequest, NextResponse } from 'next/server';
import { keycloakConfig } from '@/config/env';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

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

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error_description || 'Token refresh failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}