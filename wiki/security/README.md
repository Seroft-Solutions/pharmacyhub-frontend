# Authentication & Security

## Authentication Flow

### Overview
PharmacyHub implements a robust authentication system using Keycloak and NextAuth.js. The authentication flow is designed to be secure, scalable, and maintainable.

### Implementation Details

#### 1. Authentication Provider
```typescript
// src/providers/AuthProvider.tsx
- Manages authentication state
- Handles token refresh
- Provides authentication context
```

#### 2. Auth Guards
Located in `src/components/auth/`:

- `AuthGuard.tsx`: Protects routes requiring authentication
- `RoleGuards.tsx`: Implements role-based access control
- `PermissionGuard.tsx`: Handles feature-level permissions

### Authentication Flow

1. **Initial Authentication**
   ```typescript
   // src/features/auth/api/authService.ts
   - Handles login requests
   - Manages token storage
   - Implements refresh token logic
   ```

2. **Token Management**
   - JWT token storage
   - Automatic token refresh
   - Secure token handling

3. **Session Management**
   ```typescript
   // src/hooks/useSession.ts
   - Manages user sessions
   - Handles session expiry
   - Implements session persistence
   ```

## Role-Based Access Control (RBAC)

### Role Definitions
Located in `src/shared/config/roles.json`:

```json
{
  "ADMIN": {
    "permissions": ["all"]
  },
  "PHARMACIST": {
    "permissions": ["read:drugs", "write:prescriptions"]
  },
  "PHARMACY_MANAGER": {
    "permissions": ["manage:inventory", "read:reports"]
  }
}
```

### Permission Implementation

1. **Permission Guards**
   ```typescript
   // src/components/auth/PermissionGuard.tsx
   - Checks user permissions
   - Implements permission inheritance
   - Handles permission denial
   ```

2. **Permission Hooks**
   ```typescript
   // src/hooks/usePermissions.ts
   - Provides permission checking
   - Handles role-based permissions
   - Implements permission caching
   ```

### Role-Based Components
Located in `src/components/auth/RoleGuards.tsx`:

```typescript
- AdminOnly
- PharmacistOnly
- ManagerOnly
```

## Security Mechanisms

### 1. API Security

#### Request Interceptors
```typescript
// src/lib/api.ts
- Adds authentication headers
- Handles token refresh
- Implements request signing
```

#### Response Interceptors
```typescript
// src/lib/api.ts
- Validates responses
- Handles authentication errors
- Implements retry logic
```

### 2. CORS Configuration
```typescript
// next.config.ts
- Defines allowed origins
- Implements CORS policies
- Handles preflight requests
```

### 3. Input Validation
```typescript
// src/features/auth/lib/validation.ts
- Implements Zod schemas
- Validates user input
- Sanitizes data
```

## Security Best Practices

### 1. Password Security
```typescript
// src/utils/password.ts
- Implements password validation
- Enforces password policies
- Handles password hashing
```

### 2. Session Security
- Implements session timeouts
- Handles concurrent sessions
- Manages session invalidation

### 3. Error Handling
```typescript
// src/components/common/ErrorBoundary.tsx
- Implements secure error handling
- Prevents error information leakage
- Handles authentication errors
```

## Features & Components

### 1. Login Component
```typescript
// src/features/auth/ui/login/LoginForm.tsx
- Implements secure login
- Handles multi-factor authentication
- Manages login errors
```

### 2. Password Recovery
```typescript
// src/features/auth/ui/password-recovery/
- Implements secure password reset
- Handles verification
- Manages reset tokens
```

### 3. Registration
```typescript
// src/features/auth/ui/register/RegisterForm.tsx
- Implements secure registration
- Handles email verification
- Manages user creation
```

## Configuration

### Environment Variables
Required environment variables for security:

```
NEXT_PUBLIC_KEYCLOAK_URL=
NEXT_PUBLIC_KEYCLOAK_REALM=
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=
NEXT_PUBLIC_API_URL=
```

### Keycloak Configuration
Located in `keycloak-realm/`:
- Realm configuration
- Client settings
- Role mappings

## Maintenance Guidelines

### 1. Token Renewal
- Implement proper token refresh
- Handle token expiration
- Manage refresh token rotation

### 2. Security Updates
- Regular dependency updates
- Security patch application
- Vulnerability scanning

### 3. Access Review
- Regular role review
- Permission audit
- Access log monitoring

## Error Handling

### Authentication Errors
```typescript
// src/features/auth/api/authService.ts
- Handles login failures
- Manages token errors
- Implements retry logic
```

### Authorization Errors
```typescript
// src/components/auth/Unauthorized.tsx
- Handles permission denied
- Manages role conflicts
- Implements error recovery
```