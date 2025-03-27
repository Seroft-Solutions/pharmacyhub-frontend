# Error Handling Module

This module provides centralized error handling for the PharmacyHub application.

## Components

### Error Display

- `ErrorToast`: Toast notification component for displaying errors
- `ErrorDialog`: Modal dialog for displaying errors that require user attention
- `InlineError`: Inline error message component for form validation errors
- `FormErrorSummary`: Summary of form validation errors

### Session Handling

- `SessionConflictHandler`: Component for handling session conflicts (multiple logins)
- `SessionExpiredHandler`: Component for handling expired sessions

## Services

- `ErrorHandlingService`: Core service for handling and parsing errors
- `ErrorInterceptor`: HTTP request/response interceptor for handling API errors
- `ErrorStore`: State management for errors using Zustand

## Usage

### Error Display

```tsx
import { ErrorToast, ErrorDialog } from '@/features/core/error';

// In your component
return (
  <>
    <YourComponent />
    <ErrorToast />
    <ErrorDialog />
  </>
);
```

### Error Interceptors

```tsx
import { configureAxiosInterceptors } from '@/features/core/error';
import axios from 'axios';

// Configure Axios with error handling
const api = configureAxiosInterceptors(axios.create({
  baseURL: '/api',
}));
```

### Error Handling Service

```tsx
import { errorHandlingService } from '@/features/core/error';

try {
  // Your code
} catch (error) {
  const errorDetails = await errorHandlingService.parseApiError(error);
  console.error('Error:', errorDetails.message);
}
```

### Error Store

```tsx
import { useErrorStore } from '@/features/core/error';

// In your component
const { setGlobalError, showToastError } = useErrorStore();

const handleError = (error) => {
  showToastError({
    code: 'ERROR_CODE',
    message: 'Something went wrong',
    resolution: 'Please try again later',
    category: 'server',
    severity: 'error',
    recoverable: true
  });
};
```

## Error Categories

- `AUTHENTICATION`: Issues with user authentication
- `AUTHORIZATION`: Permission-related issues
- `VALIDATION`: Input validation errors
- `NETWORK`: Network connectivity issues
- `SERVER`: Server-side errors
- `CLIENT`: Client-side errors
- `SESSION`: Session management issues

## Error Severities

- `INFO`: Informational messages
- `WARNING`: Warnings that don't prevent using the application
- `ERROR`: Errors that prevent completing a specific action
- `CRITICAL`: Critical errors that prevent using the application

## API Error Response Structure

The backend returns error responses with the following structure:

```ts
interface ApiErrorResponse {
  status: number;
  errorCode: string;
  message: string;
  resolution: string;
  timestamp: string;
  path: string;
  details?: Record<string, any>;
}
```
