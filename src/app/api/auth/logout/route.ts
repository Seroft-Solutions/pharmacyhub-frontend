import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/shared/lib/logger';
import { withApiLogger } from '@/shared/lib/api-logger';

/**
 * This API route handles user logout
 */
async function handler(request: NextRequest) {
  try {
    logger.info('Logout attempt', {
      path: request.nextUrl.pathname
    });
    
    // Backend doesn't have a logout endpoint, so we just clear cookies here
    const response = NextResponse.json({ success: true });
    
    // Clear any cookies that might be set
    response.cookies.delete('refresh_token');
    
    logger.info('Logout successful', {
      path: request.nextUrl.pathname
    });
    
    return response;
  } catch (error: any) {
    logger.error('Logout error', {
      error: error.message,
      stack: error.stack,
      path: request.nextUrl.pathname
    });
    
    // Clear cookies even on error
    const response = NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
    response.cookies.delete('refresh_token');
    return response;
  }
}

// Wrap the handler with apiLogger middleware
export const POST = withApiLogger(handler);