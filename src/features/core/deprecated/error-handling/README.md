# Deprecated Error Handling Components

The components in this directory are deprecated and will be removed in a future release. Please use the new error handling components from `@/features/core/error` instead.

## Migration Guide

### Replace Legacy Error Handlers

1. **DirectErrorDialog** → Use `SessionConflictHandler` instead
   ```tsx
   // Old
   import { DirectErrorDialog } from '@/features/core/deprecated/error-handling/DirectErrorDialog';
   
   // New
   import { SessionConflictHandler } from '@/features/core/error';
   ```

2. **LoginValidationError** → Use `ErrorDialog` instead
   ```tsx
   // Old
   import { LoginValidationError } from '@/features/core/deprecated/error-handling/LoginValidationError';
   
   // New
   import { ErrorDialog } from '@/features/core/error';
   ```

3. **errorHandler.ts** → Use `ErrorHandlingService` instead
   ```tsx
   // Old
   import { parseApiError } from '@/features/core/deprecated/error-handling/errorHandler';
   
   // New
   import { errorHandlingService } from '@/features/core/error';
   ```

### Using the Error Store

```tsx
import { useErrorStore } from '@/features/core/error';

// In your component
const { setGlobalError, showToastError } = useErrorStore();

try {
  // Your code
} catch (error) {
  showToastError({
    code: 'ERROR_CODE',
    message: 'Something went wrong',
    resolution: 'Please try again later',
    category: 'server',
    severity: 'error',
    recoverable: true
  });
}
```

### Using Error Interceptors

```tsx
import { configureAxiosInterceptors } from '@/features/core/error';
import axios from 'axios';

// Configure Axios with error handling
const api = configureAxiosInterceptors(axios.create({
  baseURL: '/api',
}));
```

### Adding Error Components to Your Layout

```tsx
import { ErrorToast, ErrorDialog, SessionConflictHandler, SessionExpiredHandler } from '@/features/core/error';

// In your layout component
return (
  <>
    <YourComponent />
    
    {/* Error handling components */}
    <ErrorToast />
    <ErrorDialog />
    <SessionConflictHandler 
      onForceLogout={handleForceLogout} 
      onCancel={handleCancel} 
    />
    <SessionExpiredHandler
      onLogin={handleLogin}
      onRefresh={handleRefresh}
    />
  </>
);
```
