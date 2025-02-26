import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/shared/lib/logger';
import { withApiLogger } from '@/shared/lib/api-logger';
import axios from 'axios';

/**
 * This API route acts as a proxy for user registration
 */
async function handler(request: NextRequest) {
  try {
    // Parse the registration data from the request
    const userData = await request.json();
    
    // Validate required fields
    const { firstName, lastName, emailAddress, password } = userData;
    
    if (!firstName || !lastName || !emailAddress || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    logger.info('Registration attempt', {
      path: request.nextUrl.pathname,
      email: emailAddress
    });
    
    // Create a new request to backend API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    try {
      const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signup`;
      const registerResponse = await axios.post(
        backendUrl,
        userData,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      // Log successful registration
      logger.info('Registration successful', {
        email: emailAddress,
        path: request.nextUrl.pathname
      });
      
      // Return the response
      return NextResponse.json(registerResponse.data);
    } catch (error: any) {
      clearTimeout(timeoutId);
      logger.error('Registration proxy error', {
        email: emailAddress,
        error: error.message,
        path: request.nextUrl.pathname
      });
      
      // Determine appropriate status code and message
      let status = error.response?.status || 500;
      let errorMessage = error.response?.data?.error || error.response?.data || 'Registration failed';
      
      if (error.code === 'ECONNABORTED' || error.name === 'AbortError') {
        status = 504;
        errorMessage = 'Registration request timed out';
      }
      
      // Email already exists or other validation errors
      if (status === 409 || status === 400) {
        return NextResponse.json(
          { error: errorMessage },
          { status }
        );
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status }
      );
    }
  } catch (error: any) {
    logger.error('Registration proxy error', {
      error: error.message,
      stack: error.stack,
      path: request.nextUrl.pathname
    });
    
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}

// Wrap the handler with apiLogger middleware
export const POST = withApiLogger(handler);