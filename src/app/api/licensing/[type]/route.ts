import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/shared/lib/logger';
import { withApiLogger } from '@/shared/lib/api-logger';

type EntityType = 'pharmacist' | 'pharmacy-manager' | 'proprietor' | 'salesman';

async function getHandler(
  request: NextRequest,
  { params }: { params: { type: string } }
): Promise<NextResponse> {
  const startTime = Date.now();
  const type = params.type as EntityType;

  try {
    logger.info(`Processing ${type} API request`, {
      method: request.method,
      path: request.nextUrl.pathname,
      entityType: type
    });

    // Mock response for now - replace with actual database call
    const mockData = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    };

    logger.info(`Successfully processed ${type} request`, {
      method: request.method,
      path: request.nextUrl.pathname,
      entityType: type,
      responseTime: `${Date.now() - startTime}ms`
    });

    return NextResponse.json({ data: mockData });

  } catch (error) {
    logger.error(`Error processing ${type} request`, {
      method: request.method,
      path: request.nextUrl.pathname,
      entityType: type,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      responseTime: `${Date.now() - startTime}ms`
    });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Wrap the handler with apiLogger middleware and export
export const GET = withApiLogger(getHandler);