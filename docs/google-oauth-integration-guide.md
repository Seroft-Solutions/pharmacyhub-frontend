# Google OAuth Integration for PharmacyHub

This document provides a comprehensive guide for setting up and configuring Google OAuth integration for the PharmacyHub application, including how it integrates with the anti-sharing protection system and session management.

## Table of Contents

1. [Google Cloud Platform Setup](#google-cloud-platform-setup)
2. [Backend Configuration](#backend-configuration)
3. [Frontend Configuration](#frontend-configuration)
4. [Integration with Anti-Sharing Protection](#integration-with-anti-sharing-protection)
5. [Session Management](#session-management)
6. [Testing the Integration](#testing-the-integration)
7. [Troubleshooting](#troubleshooting)
8. [Security Considerations](#security-considerations)

## Google Cloud Platform Setup

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top and select "New Project"
3. Enter a name for your project (e.g., "PharmacyHub")
4. Click "Create"
5. Wait for the project to be created, then select it from the dropdown

### 2. Configure the OAuth Consent Screen

1. In the left menu, navigate to "APIs & Services" > "OAuth consent screen"
2. Select "External" as the user type (this allows any user to log in with their Google account)
3. Click "Create"
4. Fill in the required information:
   - App name: "PharmacyHub"
   - User support email: Your support email address
   - Developer contact information: Your development team's email address
5. Click "Save and Continue"
6. Add the following scopes:
   - `userinfo.email` (required for getting user's email)
   - `userinfo.profile` (required for getting user's name)
   - `openid` (required for OpenID Connect)
7. Click "Save and Continue"
8. Add test users for development/testing environments:
   - Add your development team members' email addresses
9. Click "Save and Continue"
10. Review your settings and click "Back to Dashboard"

### 3. Create OAuth 2.0 Credentials

1. In the left menu, navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" and select "OAuth client ID"
3. Select "Web application" as the application type
4. Name your OAuth 2.0 client (e.g., "PharmacyHub Web Client")
5. Add authorized JavaScript origins:
   - Development: `http://localhost:3000`
   - Staging: `https://staging.pharmacyhub.pk`
   - Production: `https://pharmacyhub.pk`
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/auth/callback`
   - Staging: `https://staging.pharmacyhub.pk/auth/callback`
   - Production: `https://pharmacyhub.pk/auth/callback`
7. Click "Create"
8. You'll receive your Client ID and Client Secret - save these securely

## Backend Configuration

### 1. Update Application Properties

Add the following properties to your `application.properties` or `application.yml` file:

```properties
# Google OAuth Configuration
google.oauth.client-id=YOUR_CLIENT_ID
google.oauth.client-secret=YOUR_CLIENT_SECRET
google.oauth.default-user-role=ROLE_USER

# Session Configuration for Anti-Sharing
session.validation.enabled=true
session.max-active-sessions=1
session.require-otp-for-new-devices=true
session.device-tracking-enabled=true
```

### 2. Ensure Required Dependencies

Make sure these dependencies are in your `pom.xml`:

```xml
<!-- Google API Client -->
<dependency>
    <groupId>com.google.api-client</groupId>
    <artifactId>google-api-client</artifactId>
    <version>1.32.1</version>
</dependency>

<!-- For JWT handling -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.9.1</version>
</dependency>
```

### 3. Verify SocialAuthController Implementation

Ensure the `SocialAuthController.java` is properly set up:

- It should handle the `/api/social-auth/google/callback` endpoint
- It should call `AuthenticationService.processSocialLogin()`
- It should handle device information for anti-sharing protection

## Frontend Configuration

### 1. Environment Variables

Create or update your `.env.local` file in the root of your frontend project:

```
# Auth Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_API_PATH_PREFIX=/api

# Google OAuth Configuration
NEXT_PUBLIC_KEYCLOAK_BASE_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=pharmacyhub
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=YOUR_CLIENT_ID
```

### 2. Verify Frontend Implementation

Make sure these files are properly configured:

1. `authApiService.ts`: Should call `/api/social-auth/google/callback` endpoint
2. `useLoginForm.ts`: Should have `handleSocialLogin` method to initiate OAuth flow
3. `auth/callback/page.tsx`: Should handle the OAuth callback and process the code

## Integration with Anti-Sharing Protection

The Google login functionality integrates with PharmacyHub's anti-sharing protection system as follows:

### 1. Device Identification

When a user logs in with Google, the system:

- Collects device information (browser fingerprint, IP address, user agent)
- Sends this information along with the authorization code to the backend
- The backend associates this device with the user's account

### 2. Session Validation

After successful authentication, the system:

- Creates a new session for the user
- Validates the session against existing sessions
- Handles session conflicts according to the configured policy

### 3. OTP Verification

If the anti-sharing system requires OTP verification:

- The user will be redirected to the OTP verification page after Google login
- OTP will be sent to their email (same email used for Google login)
- The user must enter the OTP to complete the login process

### 4. Session Management

For users logged in with Google:

- Session limits apply (default: 1 active session per user)
- Forced logout functionality is available for conflicting sessions
- Session tracking includes login source (Google) for auditing

## Session Management

### 1. Session Creation

When a user logs in with Google:

```
User -> Google Login -> Authorization Code -> Backend -> JWT Token -> SessionValidationService
```

1. Backend validates the Google authorization code
2. User is authenticated or created if new
3. JWT token is generated
4. Session is created with device information
5. Session ID is included in the auth response

### 2. Session Validation

The `SessionValidationService` performs these checks:

1. Is the user already logged in on other devices?
2. Is this a new device for this user?
3. Has the maximum session limit been reached?

### 3. Session Conflicts

When a session conflict occurs:

1. User is presented with options:
   - Continue on this device (force logout other devices)
   - Cancel login attempt
2. If user chooses to continue:
   - All other sessions are terminated
   - A new session is created on the current device

### 4. Session Tracking

Each session tracks:

- Device ID
- IP Address
- User Agent
- Session start time
- Last activity time
- Login source (Google in this case)

## Testing the Integration

### 1. Test Account Setup

1. Create a test Google account or use an existing one
2. Add this account to the test users in the Google Cloud Console
3. Ensure the account is not already registered in PharmacyHub

### 2. Test Cases

#### New User Registration

1. Click "Continue with Google" on the login page
2. Log in with a Google account not registered in PharmacyHub
3. Verify a new account is created with the Google account's email
4. Verify the account is automatically marked as verified
5. Verify the user is redirected to the dashboard

#### Existing User Login

1. Click "Continue with Google" on the login page
2. Log in with a Google account already registered in PharmacyHub
3. Verify the user is logged in successfully
4. Verify the user is redirected to the dashboard

#### Session Conflict Handling

1. Log in with a Google account on Device A
2. Without logging out, log in with the same Google account on Device B
3. Verify the session conflict dialog is displayed
4. Test both options:
   - Continue on this device (force logout)
   - Cancel login

#### OTP Verification (if enabled)

1. Enable OTP for new devices in application properties
2. Log in with a Google account on a new device
3. Verify the OTP challenge is displayed
4. Verify the OTP is sent to the user's email
5. Verify the login completes after correct OTP entry

## Troubleshooting

### Common Issues and Solutions

#### Redirect URI Mismatch

**Error message:** "Error: redirect_uri_mismatch"

**Solution:**
1. Check the authorized redirect URIs in Google Cloud Console
2. Ensure they exactly match your application's callback URL
3. Include both HTTP and HTTPS versions if needed
4. Remember to include the port for local development (e.g., `:3000`)

#### Invalid Client ID

**Error message:** "Error: invalid_client"

**Solution:**
1. Verify the client ID in your frontend environment variables
2. Check that you're using the correct client ID for the environment
3. Ensure the client ID is for a web application type

#### Session Validation Failures

**Symptoms:** Users constantly get session conflict dialogs or OTP challenges

**Solution:**
1. Check the `SessionValidationService` configuration
2. Verify the device tracking implementation is working
3. Check the logging for session validation issues
4. Temporarily increase `session.max-active-sessions` for testing

#### Authorization Code Exchange Failures

**Error message:** "Failed to process social login: Invalid authorization code"

**Solution:**
1. Authorization codes are short-lived; ensure quick processing
2. Check network latency between frontend and backend
3. Verify the correct endpoint is being called
4. Check that `callbackUrl` matches the registered redirect URI

### Logs to Check

1. Frontend console logs:
   - Look for `[Auth] Processing Google social login with code`
   - Check for `[Auth] Google login error` messages

2. Backend logs:
   - Check `SocialAuthController` logs for Google callback requests
   - Look for `AuthenticationService` logs during social login processing
   - Check `SessionValidationService` logs for session validation issues

## Security Considerations

### 1. Token Storage

- JWT tokens are stored in localStorage
- Token expiry is enforced on both client and server
- Refresh tokens are handled securely
- Google tokens are never stored, only exchanged for JWT tokens

### 2. User Verification

- Google-authenticated users are automatically verified
- Email addresses from Google are trusted and marked as verified
- Additional verification can be enabled for sensitive operations

### 3. Session Security

- Sessions have limited lifetimes
- Inactive sessions are automatically terminated
- Suspicious activity can trigger additional verification
- Sessions track login source for audit purposes

### 4. Anti-Sharing Protection

- Google login is subject to the same anti-sharing rules as regular login
- Device tracking applies to Google-authenticated sessions
- OTP verification can be required for new devices
- Session limits are enforced regardless of login method

### 5. Best Practices

- Never expose your Google Client Secret in frontend code
- Keep OAuth scopes to the minimum required
- Regularly review active sessions and user activity
- Implement rate limiting on authentication endpoints
- Run security audits on your authentication system
