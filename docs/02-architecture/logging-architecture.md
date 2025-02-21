# Logging Architecture

## Overview
This document outlines the logging architecture for the PharmacyHub Next.js application, designed to provide comprehensive logging capabilities across both frontend and API components.

## Core Components

### 1. Logger Service (`@shared/lib/logger`)
- Centralized logging service built on Winston
- Supports multiple logging levels (error, warn, info, debug)
- Provides structured logging with metadata
- Timestamp and log rotation functionality

### 2. Configuration (`@shared/config/logger`)
```typescript
interface LoggerConfig {
  level: 'error' | 'warn' | 'info' | 'debug';
  directory: string;
  maxSize: string;
  maxFiles: string;
  format: string;
}
```

### 3. Log Storage
- Location: `/logs` directory in project root
- Rotation: Daily rotation with date-based naming
- Retention: 14-day retention policy
- Maximum file size: 10MB per file

## Log Categories

1. **Application Logs**
   - System startup/shutdown
   - Configuration changes
   - Feature flags/toggles
   - Performance metrics

2. **Error Logs**
   - Unhandled exceptions
   - API failures
   - Authentication errors
   - Validation errors

3. **User Activity Logs**
   - Authentication events
   - Important user actions
   - Session management

4. **API Logs**
   - Request/Response details
   - API performance metrics
   - External service interactions

## Implementation Guidelines

### 1. Logging Levels Usage
- **ERROR**: Application errors that need immediate attention
- **WARN**: Potentially harmful situations
- **INFO**: General operational information
- **DEBUG**: Detailed information for debugging

### 2. Best Practices
- Always include contextual information
- Use structured logging format
- Avoid logging sensitive information
- Include correlation IDs for request tracing
- Use appropriate log levels

### 3. Example Usage

```typescript
// Component logging
logger.info('User action completed', {
  userId: user.id,
  action: 'exam_submission',
  timestamp: new Date()
});

// API route logging
logger.error('API error occurred', {
  path: req.path,
  method: req.method,
  statusCode: err.statusCode,
  errorMessage: err.message
});
```

## Security Considerations

1. **Data Privacy**
   - No PII in logs
   - Mask sensitive data
   - Comply with data protection regulations

2. **Access Control**
   - Restricted log file permissions
   - Secure log storage
   - Audit trail for log access

## Integration Points

1. **Application Entry Points**
   - Next.js middleware
   - API routes
   - Page components
   - Error boundaries

2. **External Services**
   - Backend API calls
   - Authentication service
   - Third-party integrations

## Required Dependencies

```json
{
  "winston": "^3.11.0",
  "winston-daily-rotate-file": "^4.7.1"
}
```

## Implementation Steps

1. Install required dependencies
2. Create logger configuration
3. Implement logger service
4. Set up log rotation
5. Create middleware for API logging
6. Add error boundary logging
7. Integrate with existing components

## Monitoring & Maintenance

1. **Log Analysis**
   - Regular log review
   - Error pattern detection
   - Performance monitoring

2. **Maintenance Tasks**
   - Log rotation verification
   - Storage space monitoring
   - Regular cleanup of old logs

## Future Enhancements

1. **Potential Improvements**
   - Centralized log aggregation
   - Real-time log streaming
   - Advanced log analytics
   - Integration with monitoring tools

2. **Scalability Considerations**
   - Distributed logging
   - Log compression
   - Log shipping to external services