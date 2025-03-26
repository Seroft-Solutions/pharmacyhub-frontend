
import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/features/core/tanstack-query-api';
import { AUTH_ENDPOINTS } from '@/features/core/auth/api/constants';

/**
 * API Route handler for resending verification emails
 */
export async function POST(req: NextRequest) {
  try {
    // Parse the request body to get the email
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Get device information for security
    const userAgent = req.headers.get('user-agent') || '';
    const ipAddress = req.headers.get('x-forwarded-for') || 
                      req.headers.get('x-real-ip') || 'unknown';
                      
    // Call backend API to resend verification
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const response = await fetch(`${backendUrl}${AUTH_ENDPOINTS.RESEND_VERIFICATION}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailAddress: email,
        ipAddress,
        userAgent
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error resending verification email:', errorData);
      
      return NextResponse.json(
        { error: 'Failed to resend verification email', details: errorData },
        { status: response.status }
      );
    }

    // Return success
    return NextResponse.json(
      { success: true, message: 'Verification email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in resend-verification API route:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
