# Authentication System Overview

## Introduction

The PharmacyHub frontend implements a robust authentication system using Keycloak as the Identity and Access Management (IAM) solution. This document provides a comprehensive overview of the authentication implementation.

## Authentication Architecture

### Core Components

1. **Keycloak Integration**
   - Implementation: `src/lib/auth/keycloak`
   - Configuration: `keycloak-realm/`
   - Environment Variables: `.env`

2. **Authentication Provider**
   - Location: `src/providers/AuthProvider`
   - Purpose: Manages authentication state and provides context
   - Features:
     - Token management
     - Session handling
     - Role-based access control
     - Auto-refresh mechanism

### Authentication Flow

1. **Initial Authentication**
```typescript
// src/lib/auth/keycloak/config.ts
export const keycloakConfig = {
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL
};
```

2. **Token Management**
```typescript
// Example token refresh implementation
const refreshToken = async () => {
  try {
    const response = await keycloak.updateToken(70);
    return response;
  } catch (error) {
    await keycloak.login();
  }
};
```

### RBAC Implementation

1. **Role Definition**
```typescript
// src/types/auth.ts
export enum UserRole {
  ADMIN = 'admin',
  PHARMACIST = 'pharmacist',
  TECHNICIAN = 'technician',
  STUDENT = 'student'
}
```

2. **Permission Guards**
```typescript
// src/components/guards/RoleGuard.tsx
export const RoleGuard: FC<RoleGuardProps> = ({
  children,
  requiredRoles
}) => {
  const { hasRoles } = useAuth();
  return hasRoles(requiredRoles) ? children : null;
};
```

## Security Measures

### Token Security
- JWT token storage in memory only
- Refresh token rotation
- Automatic token refresh before expiration
- Secure token transmission using HttpOnly cookies

### Session Management
- Configurable session timeouts
- Automatic session extension on activity
- Secure session termination
- Cross-tab session synchronization

### API Security
- Bearer token authentication
- CORS configuration
- CSP implementation
- Rate limiting

## Error Handling

### Authentication Errors
```typescript
// src/lib/auth/errors.ts
export class AuthenticationError extends Error {
  constructor(
    message: string,
    public code: string,
    public action?: () => void
  ) {
    super(message);
  }
}
```

### Error Recovery
1. Token expiration handling
2. Network error recovery
3. Session recovery
4. Invalid token handling

## Testing Strategy

### Unit Tests
- Authentication hook tests
- Guard component tests
- Token management tests
- Error handling tests

### Integration Tests
- Login flow tests
- Session management tests
- Role-based access tests
- API authentication tests

## Configuration Guide

### Environment Variables
```env
NEXT_PUBLIC_KEYCLOAK_URL=https://auth.pharmacyhub.com
NEXT_PUBLIC_KEYCLOAK_REALM=pharmacyhub
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=frontend-client
```

### Keycloak Realm Configuration
- Client configuration
- Role mapping
- Protocol mappers
- Authentication flows

## Usage Examples

### Protected Route Implementation
```typescript
// src/app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <RoleGuard requiredRoles={[UserRole.PHARMACIST]}>
      <Dashboard />
    </RoleGuard>
  );
}
```

### Authentication Hook Usage
```typescript
// Component example
const UserProfile = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginRedirect />;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

## Maintenance Guidelines

### Regular Tasks
1. Token signing key rotation
2. Session cleanup
3. Permission audit
4. Security patch updates

### Monitoring
1. Failed authentication attempts
2. Token refresh patterns
3. Session duration metrics
4. Role assignment changes

## Known Limitations

1. Single sign-on limitations with certain browsers
2. Token size constraints
3. Refresh token lifecycle management
4. Cross-origin authentication challenges

## Best Practices

1. Always use type-safe role checks
2. Implement