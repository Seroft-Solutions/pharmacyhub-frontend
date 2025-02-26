# Authentication Module Documentation

## Overview

PharmacyHub implements a robust authentication system using JWT tokens and a custom backend authentication service. The authentication flow is designed to be secure, scalable, and maintainable.

## Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [Auth Service](#auth-service)
3. [Permission System](#permission-system)

## Authentication Flow

1. User submits credentials through login form
2. Credentials are sent to backend auth endpoint
3. Backend validates and returns JWT tokens
4. Frontend stores tokens securely
5. Subsequent requests include token in Authorization header
6. Token refresh happens automatically when needed

## Auth Service

The authentication service provides a centralized way to handle all auth-related operations:

```typescript
// Usage example
import { authService } from '@/shared/auth';

// Login
const userProfile = await authService.login(username, password);

// Check authentication status
const isLoggedIn = authService.isAuthenticated();

// Get current token
const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
```

### Key Features

- JWT token management
- Automatic token refresh
- Secure token storage
- Permission-based access control
- Session management

## Permission System

Permissions are managed through a role-based access control (RBAC) system:

```typescript
// Check if user has specific permission
const hasPermission = await authService.hasPermission('create:pharmacy');
console.log('Can create pharmacy:', hasPermission);

// Check if user has role
const hasRole = await authService.hasRole('PHARMACIST');
console.log('Is pharmacist:', hasRole);
```

### Permission Guards

Use permission guards to protect routes and components:

```typescript
import { PermissionGuard } from '@/shared/auth';

function ProtectedComponent() {
  return (
    <PermissionGuard permission="create:pharmacy">
      <CreatePharmacyForm />
    </PermissionGuard>
  );
}
```

## Configuration

Auth-related configuration is managed through environment variables:

```env
# Auth Configuration
API_BASE_URL=http://localhost:8081
API_AUTH_SECRET=your-secret-here
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Security Settings
SESSION_MAX_AGE=86400
REFRESH_TOKEN_ROTATION=true
LOGIN_ATTEMPTS_LIMIT=5
```

## Related Documentation

- [Permission System Architecture](./permission-system.md)
- [Authentication Flow Details](./auth-flow.md)
- [API Documentation](../api/auth.md)
