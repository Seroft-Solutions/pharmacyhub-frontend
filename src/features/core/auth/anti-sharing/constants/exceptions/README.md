# Exception Handling for Anti-Sharing Feature

This module provides a comprehensive approach to handling exceptions in the anti-sharing and single session features.

## Overview

The exception handling system is designed to:

1. Provide consistent error messages and actions across the application
2. Categorize errors by type for easier management
3. Include severity levels and recoverability information
4. Supply user-friendly messages and clear action items

## Key Components

1. **Exception Constants** (`exceptionConstants.ts`):
   - Defines error categories, severity levels, and detailed error information
   - Provides utility functions to retrieve error details by code or category
   - Maps login status values to appropriate error types

2. **Session Exception Handler** (`SessionExceptionHandler.tsx`):
   - React component for displaying error messages with appropriate styling
   - Supports multiple ways to specify errors (by category, code, login status)
   - Dynamic icon and styling based on error severity
   - Customizable action and cancel buttons

## Usage Examples

### 1. Using the SessionExceptionHandler Component

```tsx
import { SessionExceptionHandler } from '@/features/core/auth/anti-sharing/components';
import { ErrorCategory } from '@/features/core/auth/anti-sharing/constants/exceptions';

// Using error category and key
<SessionExceptionHandler
  isOpen={errorVisible}
  errorCategory={ErrorCategory.SESSION}
  errorKey="MULTIPLE_ACTIVE_SESSIONS"
  onAction={handleTerminateOtherSessions}
  onCancel={handleCancel}
  isProcessing={isProcessing}
/>

// Using login status directly
<SessionExceptionHandler
  isOpen={errorVisible}
  loginStatus={loginStatus}
  onAction={handleContinue}
  onCancel={handleCancel}
  isProcessing={isProcessing}
/>
```

### 2. Using Error Details in Custom Components

```tsx
import { getErrorDetailsForLoginStatus } from '@/features/core/auth/anti-sharing/constants/exceptions';

const MyComponent = ({ loginStatus }) => {
  const errorDetails = getErrorDetailsForLoginStatus(loginStatus);
  
  return (
    <div>
      <h2>{errorDetails?.message}</h2>
      <p>{errorDetails?.action}</p>
      <Button 
        variant={errorDetails?.severity === ErrorSeverity.ERROR ? 'destructive' : 'default'}
      >
        Continue
      </Button>
    </div>
  );
};
```

## Error Categories

The system defines the following error categories:

1. **Authentication Errors**: Related to user identity verification
2. **Session Errors**: Related to session management and concurrent logins
3. **Network Errors**: Related to connectivity and server communication
4. **Validation Errors**: Related to input validation
5. **Permission Errors**: Related to access control and permissions

Each error includes:
- A unique error code
- A user-friendly message
- A suggested action
- A severity level
- Recoverability information
- An icon identifier for visual representation

## Best Practices

1. Always use the exception constants for consistent messaging
2. Use the SessionExceptionHandler component for displaying errors when possible
3. Include clear action items for users to recover from errors
4. Consider error severity when styling error messages
5. Handle non-recoverable errors appropriately (e.g., by not showing a cancel button)
