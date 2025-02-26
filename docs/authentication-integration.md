# Authentication Integration for PharmacyHub Exam Feature

## Overview

This document explains how authentication has been integrated with the Exam feature to ensure proper authorization.

## Implementation Details

### 1. Token Management

The exam service now includes utility functions to retrieve authentication tokens and add them to API requests:

```typescript
// Function to get the auth token from local storage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// Function to add auth header to request options
const addAuthHeader = (options: Record<string, any>): Record<string, any> => {
  const token = getAuthToken();
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }
  return options;
};
```

### 2. Authenticated API Requests

All exam API methods have been updated to include authentication headers:

```typescript
// Example for getPublishedExams
let options = {
  method: 'GET',
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  },
  credentials: 'include'
};

// Add authentication headers
options = addAuthHeader(options);
```

### 3. Enhanced Error Handling

The UI has been improved to handle authentication errors more gracefully:

- Detects 401/403 errors and shows more specific guidance
- Provides a direct login button when authentication is required
- Shows relevant troubleshooting steps based on the error type

## Security Considerations

1. **Token Storage**: Authentication tokens are stored in localStorage. For production, consider using more secure options like HttpOnly cookies.

2. **Request Protection**: All exam-related endpoints require authentication as per backend security configuration.

3. **Error Exposure**: Care has been taken to provide helpful error messages without exposing sensitive details.

## Usage

When a user tries to access the exam feature:

1. If they're already authenticated, their token will be included in requests
2. If they're not authenticated or their token is invalid, they'll see an error with a login button
3. After logging in, they can return to the exams page and access protected content

## Integration Points

This integration connects with the existing authentication system through:

1. The standard token storage in localStorage
2. JWT validation on the backend through Spring Security
3. Protected API routes as defined in SecurityConfig.java

## Testing

To test the authentication integration:

1. Clear localStorage and try to access exams (should show auth error)
2. Login with valid credentials
3. Return to exams page (should now load successfully)
4. Check network requests to confirm Authorization headers are present
