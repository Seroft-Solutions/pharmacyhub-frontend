import { NextRequest, NextResponse } from 'next/server';
import { keycloakConfig } from '@/config/env';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const tokenEndpoint = `${keycloakConfig.baseUrl}/realms/pharmacyhub/protocol/openid-connect/token`;
    const formData = new URLSearchParams({
      'grant_type': 'password',
      'client_id': keycloakConfig.clientId,
      'client_secret': keycloakConfig.clientSecret,
      'username': username,
      'password': password,
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
        { error: data.error_description || 'Authentication failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Token endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}