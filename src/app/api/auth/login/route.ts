import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/shared/lib/logger';
import { withApiLogger } from '@/shared/lib/api-logger';
import axios from 'axios';

/**
 * This API route acts as a proxy for backend login
 */
async function handler(request: NextRequest) {
  try {
    // Get the request body
    const requestBody = await request.json();
    const { emailAddress, password } = requestBody;
    
    if (!emailAddress || !password) {
      logger.warn('Login attempt failed - Missing credentials', {
        path: request.nextUrl.pathname,
        email: emailAddress || 'unknown'
      });
      
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    logger.info('Login attempt', {
      path: request.nextUrl.pathname,
      email: emailAddress
    });
    
    // Create a new request to backend API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`;
      const loginResponse = await axios.post(
        backendUrl,
        { emailAddress, password },
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      // Log successful authentication
      logger.info('Authentication successful', {
        email: emailAddress,
        path: request.nextUrl.pathname
      });
      
      // Return the token response
      return NextResponse.json(loginResponse.data);
    } catch (error: any) {
      clearTimeout(timeoutId);
      logger.error('Login proxy error', {
        email: emailAddress,
        error: error.message,
        path: request.nextUrl.pathname
      });
      
      // Determine appropriate status code and message
      let status = error.response?.status || 500;
      let errorMessage = error.response?.data?.error || 'Login failed';
      
      if (error.code === 'ECONNABORTED' || error.name === 'AbortError') {
        status = 504;
        errorMessage = 'Login request timed out';
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status }
      );
    }
  } catch (error: any) {
    logger.error('Login proxy error', {
      error: error.message,
      stack: error.stack,
      path: request.nextUrl.pathname
    });
    
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

// Wrap the handler with apiLogger middleware
export const POST = withApiLogger(handler);