import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Extract token from query params
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/verification-failed', request.url));
  }

  try {
    // Forward the request to the backend
    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/auth/verify?token=${encodeURIComponent(token)}`;
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      // Redirect to success page
      return NextResponse.redirect(new URL('/verification-successful', request.url));
    } else {
      // Redirect to error page
      return NextResponse.redirect(new URL('/verification-failed', request.url));
    }
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.redirect(new URL('/verification-failed', request.url));
  }
}
