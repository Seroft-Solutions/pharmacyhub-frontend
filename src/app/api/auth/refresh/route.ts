import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/shared/lib/logger';
import { withApiLogger } from '@/shared/lib/api-logger';
import axios from 'axios';

/**
 * This API route acts as a proxy for token refresh
 */
async function handler(request: NextRequest) {
  try {
    // Get cookies from the request
    const refreshToken = request.cookies.get('refresh_token')?.value;
    
    if (!refreshToken) {
      logger.warn('Token refresh failed - No refresh token', {
        path: request.nextUrl.pathname
      });
      
      return NextResponse.json(
        { error: 'No refresh token available' },
        { status: 401 }
      );
    }
    
    logger.info('Token refresh attempt', {
      path: request.nextUrl.pathname
    });
    
    // Create a new request to backend API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/refresh`;
      const refreshResponse = await axios.post(
        backendUrl,
        { refreshToken },
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      // Log successful token refresh
      logger.info('Token refresh successful', {
        path: request.nextUrl.pathname
      });
      
      // Get the new tokens from the response
      const { token, refreshToken: newRefreshToken } = refreshResponse.data;
      
      // Create response
      const response = NextResponse.json({ token });
      
      // Set the new refresh token as an HTTP-only cookie
      if (newRefreshToken) {
        response.cookies.set({
          name: 'refresh_token',
          value: newRefreshToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        });
      }
      
      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      logger.error('Token refresh proxy error', {
        error: error.message,
        path: request.nextUrl.pathname
      });
      
      // Determine appropriate status code and message
      let status = error.response?.status || 500;
      let errorMessage = error.response?.data?.error || 'Token refresh failed';
      
      if (error.code === 'ECONNABORTED' || error.name === 'AbortError') {
        status = 504;
        errorMessage = 'Token refresh request timed out';
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status }
      );
    }
  } catch (error: any) {
    logger.error('Token refresh proxy error', {
      error: error.message,
      stack: error.stack,
      path: request.nextUrl.pathname
    });
    
    return NextResponse.json(
      { error: 'Token refresh failed' },
      { status: 500 }
    );
  }
}

// Wrap the handler with apiLogger middleware
export const POST = withApiLogger(handler);