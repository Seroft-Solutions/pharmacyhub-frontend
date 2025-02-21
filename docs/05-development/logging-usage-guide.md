# Logging System Usage Guide

## Overview
PharmacyHub implements a comprehensive logging system that provides structured logging across the application. The system supports different log levels, file rotation, and separate logging for API requests.

## Features
- Multiple log levels (error, warn, info, debug)
- Automatic log rotation and retention
- Structured JSON logging
- API request/response logging
- Development console output
- TypeScript support

## Basic Usage

### 1. Importing the Logger
```typescript
import { logger } from '@/shared/lib/logger';
```

### 2. Using Different Log Levels

```typescript
// Info level for general operational information
logger.info('Operation completed', {
  operation: 'data_sync',
  status: 'success'
});

// Error level for application errors
logger.error('Failed to process request', {
  error: error.message,
  stack: error.stack
});

// Warning level for potential issues
logger.warn('Rate limit approaching', {
  currentRate: '80%',
  endpoint: '/api/data'
});

// Debug level for detailed information
logger.debug('Processing request', {
  requestId: 'req-123',
  payload: requestData
});
```

### 3. API Route Logging

Use the `withApiLogger` middleware to automatically log API requests and responses:

```typescript
import { withApiLogger } from '@/shared/lib/api-logger';
import { NextRequest, NextResponse } from 'next/server';

async function handler(req: NextRequest) {
  // Your handler logic
}

export const GET = withApiLogger(handler);
```

### 4. Component Logging

Example of logging in React components:

```typescript
const MyComponent = () => {
  useEffect(() => {
    logger.info('Component mounted', {
      component: 'MyComponent',
      timestamp: new Date().toISOString()
    });

    return () => {
      logger.debug('Component unmounted', {
        component: 'MyComponent'
      });
    };
  }, []);
};
```

## Best Practices

1. **Use Appropriate Log Levels**
   - ERROR: For errors that need immediate attention
   - WARN: For potentially harmful situations
   - INFO: For general operational information
   - DEBUG: For detailed debugging information

2. **Include Relevant Context**
   ```typescript
   logger.info('User action', {
     userId: user.id,
     action: 'profile_update',
     timestamp: new Date().toISOString()
   });
   ```

3. **Avoid Sensitive Information**
   - Never log passwords or tokens
   - Mask sensitive user data
   - Be careful with error stack traces in production

4. **Structured Logging**
   - Always include relevant metadata
   - Use consistent property names
   - Include correlation IDs for request tracking

## Log File Locations

Logs are stored in the `/logs` directory with the following files:
- `error-%DATE%.log` - Error level logs
- `combined-%DATE%.log` - All log levels
- `api-%DATE%.log` - API-specific logs

## Configuration

The logging system can be configured in `src/shared/config/logger.ts`:

```typescript
export const loggerConfig: LoggerConfig = {
  level: isDevelopment ? 'debug' : 'info',
  directory: path.join(process.cwd(), 'logs'),
  maxSize: '10m',
  maxFiles: '14d',
  format: 'json'
};
```

## Error Handling Example

```typescript
try {
  await processData();
} catch (error) {
  logger.error('Data processing failed', {
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    operation: 'processData',
    timestamp: new Date().toISOString()
  });
  
  // Handle the error appropriately
}
```

## Performance Considerations

1. Use debug level logging judiciously
2. Avoid logging large objects in production
3. Use sampling for high-volume logs
4. Consider log aggregation for production environments