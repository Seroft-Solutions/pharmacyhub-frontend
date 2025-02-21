# PharmacyHub Logging Implementation

## Overview

PharmacyHub implements a comprehensive logging system that provides structured logging across different parts of the application. The logging system is built using Winston and provides consistent logging patterns for both frontend and API operations.

## Core Components

### 1. Logger Service (`@shared/lib/logger.ts`)
- Singleton logger instance using Winston
- Multiple log levels (error, warn, info, debug)
- File rotation with retention policies
- Structured JSON logging
- Development console output

### 2. API Logger Middleware (`@shared/lib/api-logger.ts`)
- Automatic request/response logging for API routes
- Error tracking and formatting
- Performance timing
- Route parameter logging
- Query parameter logging
- Headers logging (safe headers only)

### 3. Logging Configuration (`@shared/config/logger.ts`)
- Environment-based log levels
- File rotation settings
- Log format configuration
- Retention policies

## Feature-specific Logging

### 1. Authentication System
- Login attempts and results
- Token refresh operations
- Authentication failures
- Development fallback usage
- Health check status

### 2. Exam System
- Paper listing operations
- Exam session lifecycle
- Answer submissions
- Exam completion
- Performance metrics

### 3. Licensing System
- User listing operations
- Connection requests
- Status changes
- Entity relationships

## Log Types and Locations

### 1. API Logs (`/logs/api-%DATE%.log`)
```json
{
  "timestamp": "2024-02-21T02:00:00.000Z",
  "level": "info",
  "message": "API Request: GET /api/licensing/pharmacist",
  "method": "GET",
  "path": "/api/licensing/pharmacist",
  "params": {"type": "pharmacist"},
  "responseTime": "123ms"
}
```

### 2. Error Logs (`/logs/error-%DATE%.log`)
```json
{
  "timestamp": "2024-02-21T02:00:00.000Z",
  "level": "error",
  "message": "Authentication failed",
  "error": "Invalid credentials",
  "stack": "Error: Invalid credentials...",
  "path": "/api/auth/login"
}
```

### 3. Combined Logs (`/logs/combined-%DATE%.log`)
- Contains all log levels
- Includes application startup/shutdown
- System-wide events

## Best Practices

### 1. API Route Logging
```typescript
// Use the withApiLogger middleware
export const GET = withApiLogger(handler);
```

### 2. Service-level Logging
```typescript
logger.info('Operation description', {
  entityType: 'type',
  operationId: 'id',
  metadata: 'contextual data'
});
```

### 3. Error Logging
```typescript
try {
  // Operation
} catch (error) {
  logger.error('Operation failed', {
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    context: 'additional context'
  });
}
```

### 4. Performance Logging
```typescript
const startTime = Date.now();
// Operation
logger.info('Operation completed', {
  responseTime: `${Date.now() - startTime}ms`
});
```

## Log Retention and Rotation

- Log files are rotated daily
- 14-day retention period
- 10MB maximum file size
- Compressed archives for historical logs

## Security Considerations

1. **Sensitive Data**
   - No passwords or tokens in logs
   - Masked sensitive user information
   - No complete request bodies in production

2. **Access Control**
   - Log files have restricted permissions
   - Production logs accessible only to authorized personnel

3. **Compliance**
   - GDPR-compliant logging practices
   - No PII in logs
   - Data retention policies enforced

## Monitoring and Alerts

1. **Error Monitoring**
   - All error-level logs should be monitored
   - Critical errors require immediate attention
   - Error patterns should be analyzed

2. **Performance Monitoring**
   - Response times are logged for all API calls
   - Slow operations are tagged for investigation
   - Resource usage patterns are tracked

## Development Guidelines

1. **Adding New Logs**
   - Use appropriate log levels
   - Include relevant context
   - Follow existing patterns
   - Document new log types

2. **Log Levels Usage**
   - ERROR: Application errors requiring attention
   - WARN: Potential issues or edge cases
   - INFO: Normal operation information
   - DEBUG: Detailed debugging information

3. **Context Requirements**
   - Include operation identifiers
   - Add user context when available
   - Provide timing information
   - Reference related entities

## Future Enhancements

1. **Planned Improvements**
   - Centralized log aggregation
   - Real-time log streaming
   - Advanced log analytics
   - Automated alerting system

2. **Integration Opportunities**
   - APM integration
   - Error tracking services
   - Monitoring dashboards
   - Analytics platforms