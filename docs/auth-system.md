# Authentication System Design

## Overview
This document outlines the secure authentication system implementation using Keycloak for PharmacyHub.

## Architecture

### Components
1. **Keycloak Server**
   - Handles authentication & authorization
   - Manages user sessions
   - Provides token services
   - Implements security policies

2. **Frontend Integration (Next.js)**
   - Protected routes
   - Token management
   - User context
   - Role-based access control

3. **Backend Integration (Spring Boot)**
   - Resource server configuration
   - API protection
   - Token validation
   - Role-based endpoints

## Implementation Details

### 1. AuthContext Enhancement
```typescript
interface AuthState {
  user: {
    id: string;
    email: string;
    roles: string[];
    permissions: string[];
    profile: {
      firstName: string;
      lastName: string;
      phoneNumber?: string;
    };
  } | null;
  isAuthenticated: boolean;
  token: {
    access: string | null;
    refresh: string | null;
    expires: number;
  };
}

interface AuthContextType extends AuthState {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}
```

### 2. Security Measures

#### Token Handling
- Access tokens: 15-minute lifespan
- Refresh tokens: 24-hour lifespan with rotation
- Secure storage in HTTP-only cookies
- CSRF protection implementation

#### Session Management
```typescript
interface SessionConfig {
  maxAge: 3600,  // 1 hour
  cookieOptions: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  }
}
```

### 3. Role-Based Access Control (RBAC)

#### Role Hierarchy
```json
{
  "roles": {
    "SUPER_ADMIN": {
      "inherits": ["ADMIN"],
      "permissions": ["manage_system", "manage_users"]
    },
    "ADMIN": {
      "inherits": ["MANAGER"],
      "permissions": ["manage_staff", "view_reports"]
    },
    "MANAGER": {
      "inherits": ["USER"],
      "permissions": ["approve_orders", "manage_inventory"]
    },
    "USER": {
      "permissions": ["view_products", "place_orders"]
    }
  }
}
```

### 4. Protected Routes Implementation

#### Frontend Route Protection
```typescript
// Middleware configuration
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/profile/:path*'
  ]
};
```

#### Backend Endpoint Protection
```java
@PreAuthorize("hasRole('ADMIN') and hasAuthority('manage_users')")
@GetMapping("/admin/users")
public List<User> getUsers() {
    // Implementation
}
```

### 5. Error Handling & Security Events

#### Error Responses
```typescript
interface AuthError {
  code: string;
  message: string;
  action?: 'REFRESH_TOKEN' | 'LOGOUT' | 'RETRY';
}
```

#### Security Event Logging
- Failed login attempts
- Token refreshes
- Permission changes
- Role assignments
- Session terminations

## Security Best Practices

1. **Token Security**
   - Never store tokens in localStorage
   - Implement token refresh mechanism
   - Use secure HTTP-only cookies
   - Implement proper CORS policies

2. **API Security**
   - Rate limiting
   - Request validation
   - Error obscurity
   - Audit logging

3. **User Security**
   - Password policies
   - MFA support
   - Session management
   - Account lockout

4. **Infrastructure Security**
   - TLS everywhere
   - Security headers
   - CSRF protection
   - XSS prevention

## Implementation Steps

1. Configure Keycloak realm settings
2. Set up frontend authentication context
3. Implement protected routes
4. Configure backend security
5. Set up role-based access control
6. Implement token management
7. Add security headers and CORS
8. Set up logging and monitoring

## Development Guidelines

1. **Security First**
   - Always validate tokens
   - Implement proper error handling
   - Use secure communication channels
   - Regular security audits

2. **Code Organization**
   - Separate auth logic
   - Clear security boundaries
   - Consistent error handling
   - Comprehensive logging

3. **Testing Requirements**
   - Unit tests for auth logic
   - Integration tests for flows
   - Security penetration tests
   - Performance testing

## Monitoring & Maintenance

1. **Security Monitoring**
   - Failed authentication attempts
   - Token usage patterns
   - Role changes
   - Access patterns

2. **Regular Updates**
   - Security patches
   - Dependency updates
   - Policy reviews
   - Access audits