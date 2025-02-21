import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/shared/lib/logger';
import { withApiLogger } from '@/shared/lib/api-logger';

type EntityType = 'pharmacist' | 'pharmacy-manager' | 'proprietor' | 'salesman';

interface ConnectionRequest {
  userId: number;
  targetId: number;
  notes?: string;
}

interface ConnectionResponse {
  id: number;
  userId: number;
  targetId: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  notes?: string;
}

async function handler(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  const type = params.type as EntityType;
  const startTime = Date.now();

  try {
    if (request.method === 'POST') {
      const body = await request.json() as ConnectionRequest;

      logger.info(`Creating ${type} connection`, {
        entityType: type,
        userId: body.userId.toString(),
        targetId: body.targetId.toString(),
        path: request.nextUrl.pathname
      });

      // Mock response for now - replace with actual database call
      const connectionId = Date.now();
      const response: ConnectionResponse = {
        id: connectionId,
        userId: body.userId,
        targetId: body.targetId,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        notes: body.notes
      };

      logger.info(`Successfully created ${type} connection`, {
        entityType: type,
        connectionId: connectionId.toString(),
        userId: body.userId.toString(),
        targetId: body.targetId.toString(),
        responseTime: `${Date.now() - startTime}ms`
      });

      return NextResponse.json({ data: response });
    }

    if (request.method === 'GET') {
      const userId = request.nextUrl.searchParams.get('userId');
      
      if (!userId) {
        logger.warn(`Missing userId in ${type} connections request`, {
          entityType: type,
          path: request.nextUrl.pathname
        });

        return NextResponse.json(
          { error: 'userId is required' },
          { status: 400 }
        );
      }

      logger.info(`Fetching ${type} connections`, {
        entityType: type,
        userId,
        path: request.nextUrl.pathname
      });

      // Mock response for now - replace with actual database call
      const connections: ConnectionResponse[] = [{
        id: Date.now(),
        userId: parseInt(userId),
        targetId: 1,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      }];

      logger.info(`Successfully fetched ${type} connections`, {
        entityType: type,
        userId,
        count: connections.length,
        responseTime: `${Date.now() - startTime}ms`
      });

      return NextResponse.json({ data: connections });
    }

    logger.warn(`Method ${request.method} not allowed`, {
      method: request.method,
      path: request.nextUrl.pathname,
      entityType: type
    });

    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  } catch (error) {
    logger.error(`Error processing ${type} connections request`, {
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

export const GET = withApiLogger(handler);
export const POST = withApiLogger(handler);