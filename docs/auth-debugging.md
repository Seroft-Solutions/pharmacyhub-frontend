# Authentication Debugging Guide

## Overview

This document provides guidance on debugging authentication issues in the PharmacyHub application, specifically related to API requests that require authentication.

## Common Issues

### Missing Authorization Header

If API requests are returning 401 Unauthorized or 403 Forbidden status codes, the most common issue is a missing or invalid Authorization header.

To troubleshoot:

1. Check the browser's Network tab in developer tools
2. Look for requests to `/api/exams/published` endpoint
3. Verify if the Authorization header is present in the request headers

### Fixing Authorization Issues

We've implemented a robust token extraction system that tries multiple methods to find and use a valid authentication token:

1. Checks localStorage for common token names:
   - `auth_token`
   - `token`
   - `jwtToken`

2. Checks sessionStorage for similar token names

3. Extracts tokens from cookies:
   - Standard auth cookies (containing 'token', 'auth', 'jwt')
   - JSESSIONID cookie
   - PGADMIN_LANGUAGE cookie format from the screenshot
   - Any cookie containing a JWT-like format

4. Adds the token as a Bearer token in the Authorization header

## Debugging Tools

### Token Extractor Script

We've created a token extractor script that can be run in the browser console:

```javascript
// Paste the content of src/features/exams/api/tokenExtractor.js here
```

This will output all potential tokens found in your browser's storage and cookies.

### Debug Mode

The examService includes a debug mode that can be enabled:

1. Open `src/features/exams/api/examService.ts`
2. Set `const DEBUG_AUTH = true;`
3. This will:
   - Add detailed console logging
   - Inject authentication headers into all fetch requests
   - Output token extraction attempts

## Authentication Flow

The authentication flow should work as follows:

1. User logs in through authentication endpoint
2. Token is stored (in localStorage, sessionStorage, or cookies)
3. examService extracts the token for each API request
4. Token is sent in the Authorization header
5. Backend validates the token and allows access to protected resources

## Troubleshooting Steps

If authentication is still failing:

1. Check if you're properly logged in
2. Verify the token format matches what the backend expects
3. Check token expiration (JWT tokens have expiry)
4. Ensure the backend CORS configuration accepts the Authorization header

## Manual Testing

You can manually test the API authentication with fetch:

```javascript
fetch('http://localhost:8080/api/exams/published', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE',
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Status:', response.status);
  return response.json();
})
.then(data => console.log(data))
.catch(err => console.error(err));
```

Replace `YOUR_TOKEN_HERE` with the token you extract from storage.
