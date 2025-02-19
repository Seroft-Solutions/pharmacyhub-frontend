# Keycloak Integration Guide

## Overview
This document describes the integration of Keycloak with our Next.js application, including authentication flow, configuration, and security measures.

## Table of Contents
1. [Setup and Configuration](#setup-and-configuration)
2. [Authentication Flow](#authentication-flow)
3. [Integration Components](#integration-components)
4. [Security Features](#security-features)
5. [API Integration](#api-integration)
6. [TypeScript Types](#typescript-types)

## Setup and Configuration

### Environment Variables
```env
KEYCLOAK_CLIENT_ID=pharmacyhub-client
KEYCLOAK_CLIENT_SECRET=your-client-secret
KEYCLOAK_ISSUER=http://localhost:8080/realms/pharmacyhub
KEYCLOAK_BASE_URL=http://localhost:8080
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

### Keycloak Client Configuration
1. Realm: pharmacyhub
2. Client ID: pharmacyhub-client
3. Access Type: confidential
4. Valid Redirect URIs: http://localhost:3000/*
5. Web Origins: http://localhost:3000

## Authentication Flow

1. **Initial Request**
   - User accesses protected route
   - AuthGuard checks authentication status
   - If not authenticated, redirects to Keycloak login

2. **Login Process**
   - Keycloak handles login form
   - Upon success, redirects back with authorization code
   - NextAuth processes code and creates session

3. **Token Management**
   - Access token stored in secure session
   - Refresh token handled automatically
   - Token rotation implemented for security

## Integration Components

### Core Components

1. **KeycloakProvider** (`src/app/providers/AuthProvider.tsx`)
   - Wraps application with authentication context
   - Handles session management
   - Provides authentication state

2. **AuthGuard** (`src/components/auth/AuthGuard.tsx`)
   - Protects routes
   - Handles role-based access
   - Manages redirect logic

3. **useAuth Hook** (`src/hooks/useAuth.ts`)
   - Provides authentication state
   - Handles login/logout
   - Manages user profile

### Services

1. **KeycloakService** (`src/services/keycloakService.ts`)
   - Manages Keycloak communication
   - Handles token refresh
   - Provides API methods

2. **AuthService** (`src/services/authService.ts`)
   - High-level auth operations
   - Session management
   - User profile handling

## Security Features

1. **Token Security**
   - HTTP-only cookies
   - Token rotation
   - CSRF protection
   - XSS prevention

2. **Role-Based Access**
   - Fine-grained permissions
   - Role mapping
   - Resource-level protection

3. **Session Management**
   - Secure session storage
   - Automatic timeout
   - Multiple device handling

## API Integration

### Protected API Routes
```typescript
// Example protected API route
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(null, { status: 401 });
  }
  // Protected route logic
}
```

### Client-Side API Calls
```typescript
// Example API call with auth header
const response = await fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${session.accessToken}`
  }
});
```

## TypeScript Types

### Session Types
```typescript
interface KeycloakSession {
  user: KeycloakUser;
  accessToken: string;
  refreshToken: string;
  roles: string[];
  permissions: string[];
}
```

### User Types
```typescript
interface KeycloakUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  realm_access: {
    roles: string[];
  };
}
```

## Implementation Details

1. **Authentication Context**
   ```typescript
   const AuthContext = createContext<AuthContextType>(null);
   export const useAuth = () => useContext(AuthContext);
   ```

2. **Role Guards**
   ```typescript
   export const withRoleGuard = (WrappedComponent: ComponentType, requiredRoles: string[]) => {
     return function WithRoleGuard(props: any) {
       const { hasRole } = useAuth();
       if (!hasRole(requiredRoles)) return <Unauthorized />;
       return <WrappedComponent {...props} />;
     };
   };
   ```

3. **Permission Hooks**
   ```typescript
   export const usePermissions = () => {
     const { session } = useSession();
     return {
       canAccess: (required: string[]) => checkPermissions(session, required),
       hasRole: (roles: string[]) => checkRoles(session, roles)
     };
   };
   ```

## Error Handling

1. **Authentication Errors**
   - Token expiration
   - Invalid credentials
   - Network issues
   - Session timeout

2. **Error Recovery**
   - Automatic retry
   - Refresh token rotation
   - Grace period handling

## Testing

1. **Unit Tests**
   - Auth hooks
   - Guard components
   - Permission checks

2. **Integration Tests**
   - Auth flow
   - Protected routes
   - Token management

## Deployment Considerations

1. **Environment Setup**
   - Production Keycloak URL
   - CORS configuration
   - SSL requirements

2. **Security Headers**
   - CSP configuration
   - HSTS setup
   - XFrame options

## Common Issues and Solutions

1. **Token Expiration**
   - Implement refresh token rotation
   - Handle grace period
   - Auto-retry failed requests

2. **CORS Issues**
   - Configure Keycloak allowed origins
   - Set proper CORS headers
   - Handle preflight requests

## Best Practices

1. **Security**
   - Use HTTPS only
   - Implement rate limiting
   - Validate all inputs
   - Use secure session storage

2. **Performance**
   - Implement token caching
   - Minimize redirects
   - Optimize API calls

3. **User Experience**
   - Smooth error handling
   - Clear error messages
   - Seamless token refresh

## Maintenance

1. **Regular Updates**
   - Keycloak version updates
   - Security patches
   - Dependency management

2. **Monitoring**
   - Auth failures logging
   - Session tracking
   - Performance metrics

## Additional Resources

1. **Documentation**
   - Keycloak official docs
   - NextAuth.js documentation
   - Security best practices

2. **Support**
   - Troubleshooting guide
   - Common issues FAQ
   - Support contacts