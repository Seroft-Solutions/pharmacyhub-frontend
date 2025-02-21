import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';

export interface RouteContext<P = Record<string, string>> {
  params: P;
}

export type ApiResponse = {
  data?: unknown;
  error?: string;
  message?: string;
  status?: string;
};

type NextApiHandler<P = Record<string, string>> = (
  req: NextRequest,
  context: RouteContext<P>
) => Promise<NextResponse>;

export const withApiLogger = <P = Record<string, string>>(
  handler: NextApiHandler<P>
): NextApiHandler<P> => {
  return async (req: NextRequest, context: RouteContext<P>) => {
    const start = Date.now();
    
    try {
      // Log the request
      logger.info(`API Request: ${req.method} ${req.nextUrl.pathname}`, {
        method: req.method,
        path: req.nextUrl.pathname,
        params: JSON.stringify(context.params),
        query: Object.fromEntries(req.nextUrl.searchParams),
        headers: {
          'user-agent': req.headers.get('user-agent') || '',
          'content-type': req.headers.get('content-type') || '',
        },
      });

      // Execute handler
      const response = await handler(req, context);
      
      // Get response status
      const statusCode = response.status;
      
      // Log the response
      logger.info(`API Response: ${req.method} ${req.nextUrl.pathname}`, {
        method: req.method,
        path: req.nextUrl.pathname,
        params: JSON.stringify(context.params),
        statusCode, // Now passing number directly since LogMetadata accepts number
        responseTime: `${Date.now() - start}ms`
      });

      return response;
    } catch (error) {
      // Log error
      logger.error('API Error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        method: req.method,
        path: req.nextUrl.pathname,
        params: JSON.stringify(context.params),
        statusCode: 500 // Adding status code to error logs as well
      });

      // Return error response
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : 'Internal Server Error',
        } as ApiResponse,
        { status: 500 }
      );
    }
  };
};