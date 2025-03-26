# Social Login Integration

This document describes the implementation of social login functionality in PharmacyHub, focusing on Google login integration.

## Architecture Overview

The social login integration follows OAuth 2.0 authorization code flow:

1. User clicks on a social login button (Google)
2. User is redirected to the provider's login page
3. After authentication, the provider redirects back to our application with an authorization code
4. Our application exchanges this code for access tokens
5. User information is retrieved and a session is created

## Frontend Components

### Components and Files

- **LoginForm.tsx/EnhancedLoginForm.tsx**: Contains the Google login button UI
- **useLoginForm.ts**: Contains the `handleSocialLogin` method that initiates the OAuth flow
- **auth/callback/page.tsx**: Handles the OAuth callback and processes the authorization code
- **useAuth.ts**: Contains the `processSocialLogin` method
- **authApiService.ts**: Handles the API call to exchange the authorization code for tokens

### Data Flow

1. User clicks the Google login button in `LoginForm.tsx`
2. `handleSocialLogin('google')` is called from `useLoginForm.ts`
3. User is redirected to Google's OAuth page
4. After authentication, Google redirects back to our callback page (`/auth/callback`) with an authorization code
5. The callback page uses `processSocialLogin` to exchange the code for tokens
6. After successful authentication, the user is redirected to the dashboard

## Backend Components

### Components and Files

- **SocialAuthController.java**: Handles the `/api/social-auth/google/callback` endpoint
- **AuthenticationService.java**: Contains the `processSocialLogin` method that verifies the authorization code
- **SessionValidationService.java**: Validates user sessions for anti-sharing protection

### Data Flow

1. The frontend sends the authorization code to `/api/social-auth/google/callback`
2. `SocialAuthController` processes the request and calls `AuthenticationService.processSocialLogin`
3. `AuthenticationService` verifies the code with Google and retrieves user information
4. If the user doesn't exist, a new user account is created
5. JWT tokens are generated and returned to the frontend
6. Session validation is performed to enforce security policies

## Configuration Requirements

### Google OAuth Configuration

1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/)
2. Set up OAuth consent screen
3. Create OAuth client ID credentials
4. Add authorized redirect URIs (e.g., `https://yourdomain.com/auth/callback`)

### Backend Configuration

The following properties need to be configured in `application.properties`:

```properties
# Google OAuth Configuration
google.oauth.client-id=your-client-id
google.oauth.client-secret=your-client-secret
google.oauth.default-user-role=ROLE_USER
```

### Frontend Configuration

The frontend needs the following environment variables:

```
NEXT_PUBLIC_KEYCLOAK_BASE_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=pharmacyhub
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=pharmacyhub-client
```

## Debugging Common Issues

### Redirect URI Mismatch

If the OAuth provider returns an error about redirect URI mismatch, ensure the URI configured in the Google Cloud Console exactly matches the callback URL used in the application.

### Invalid Client ID

Ensure the client ID is correctly set in both frontend and backend configurations.

### Session Validation Failures

If users are consistently redirected to session conflict pages:
1. Check the `SessionValidationService` configuration
2. Ensure device tracking is correctly implemented
3. Review the session validation rules

### Authorization Code Issues

If the authorization code exchange fails:
1. Check the logs for details (`[Auth] Google login error`)
2. Verify the code hasn't expired (authorization codes are short-lived)
3. Ensure the correct endpoint is being called

## User Flow

1. User navigates to the login page
2. User clicks the "Continue with Google" button
3. User is redirected to Google's login page
4. User authenticates with Google
5. Google redirects back to our application with an authorization code
6. Our application processes the code and creates a session
7. User is redirected to the dashboard

If the user already has an account with matching email, they will be logged into that account. If not, a new account will be created automatically.

## Security Considerations

1. User email addresses from Google are verified, so we mark them as verified automatically
2. Sessions created through social login are subject to the same anti-sharing protection as regular logins
3. OAuth tokens from providers are not stored - we generate our own JWT tokens after verification