import { logger } from '@/shared/lib/logger';
import { withApiLogger } from '@/shared/lib/api-logger';
import { NextRequest, NextResponse } from 'next/server';

async function handler(req: NextRequest) {
  try {
    // Example of using logger directly
    logger.info('Processing example request', {
      path: req.nextUrl.pathname,
      method: req.method,
    });

    // Simulate some processing
    const data = { message: 'Example API response' };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    logger.error('Error in example API', {
      error: error instanceof Error ? error.message : 'Unknown error',
      path: req.nextUrl.pathname,
      method: req.method,
    });

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Wrap the handler with apiLogger middleware
export const GET = withApiLogger(handler);