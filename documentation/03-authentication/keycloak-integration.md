# PharmacyHub Keycloak Integration Guide

## Overview

This document provides comprehensive documentation on the integration of Keycloak 25.0.2 with the PharmacyHub application. The integration supports custom frontend UI components while leveraging Keycloak's robust authentication and authorization capabilities.

## Table of Contents

1. [Architecture](#architecture)
2. [Configuration](#configuration)
3. [Authentication Flow](#authentication-flow)
4. [Permission System](#permission-system)
5. [Integration Components](#integration-components)
6. [User Management](#user-management)
7. [Security Considerations](#security-considerations)
8. [Troubleshooting](#troubleshooting)

## Architecture

### Components
- **Keycloak Server** (v25.0.2) - Running on port 8080
- **Frontend Application** (Next.js) - Running on port 3000
- **Backend API** (Spring Boot) - Running on port 8081

### High-Level Flow
1. User authenticates through custom UI
2. Frontend exchanges credentials for JWT tokens via Keycloak
3. Frontend stores tokens in secure storage
4. API requests include token in Authorization header
5. Backend validates tokens against Keycloak

## Configuration

### Environment Variables

Key environment variables for the integration:

```
# Keycloak Configuration
NEXT_PUBLIC_KEYCLOAK_BASE_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=pharmacyhub
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=pharmacyhub-client
KEYCLOAK_CLIENT_SECRET=your-client-secret

# API URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8081/api

# Token Settings
TOKEN_ACCESS_LIFESPAN=900
TOKEN_REFRESH_LIFESPAN=86400
```

### Realm Configuration

The Keycloak realm is configured with:

1. **Clients**:
   - `pharmacyhub-client` - Frontend application
   - `pharmacyhub-backend` - Spring Boot API (bearer-only)

2. **Roles Hierarchy**:
   ```
   SUPER_ADMIN
    └── ADMIN
         └── MANAGER
              └── USER
   PHARMACIST ──┐
   PROPRIETOR ──┼── USER
   SALESMAN ────┘
   INSTRUCTOR ──┘
   ```

3. **Group Structure**:
   ```
   System Administration
    ├── Super Administrators
    └── Administrators
   Pharmacy Staff
    ├── Managers
    ├── Pharmacists
    ├── Proprietors
    └── Salespeople
   Education
    ├── Instructors
    └── Students
   General Users
   ```

### Token Configuration

- **Access Token**: 15-minute lifespan (900 seconds)
- **Refresh Token**: 24-hour lifespan (86400 seconds)
- **Token Storage**: Browser local storage (with security considerations)
- **Refresh Strategy**: Automatic refresh before expiration

## Authentication Flow

### Login Flow
1. User submits credentials in custom login form
2. Frontend sends credentials to Keycloak token endpoint
3. Keycloak validates credentials and returns tokens
4. Frontend stores tokens and extracts user profile
5. User is redirected to dashboard

### Registration Flow
1. User completes multi-step registration form
2. Frontend obtains admin token from Keycloak
3. Frontend creates user in Keycloak via Admin API
4. User is assigned to appropriate group based on user type
5. Frontend logs in the user automatically

### Social Login Flow
1. User clicks social login button (Google/Microsoft)
2. Frontend redirects to Keycloak with identity provider hint
3. Keycloak handles the OAuth flow with the provider
4. After successful authentication, Keycloak redirects to callback endpoint
5. Callback endpoint exchanges code for tokens
6. User is redirected to dashboard

### Token Refresh
1. Before making API requests, frontend checks token expiration
2. If token is expired or close to expiry, refresh flow is triggered
3. Refresh token is sent to Keycloak token endpoint
4. New access and refresh tokens are stored
5. Original API request proceeds with new token

## Permission System

### Permission Structure
Permissions in PharmacyHub follow a hierarchical model:
- **Groups** contain users and assign roles
- **Roles** define sets of permissions
- **Permissions** are fine-grained access controls

### Centralized Permission Constants
All permissions are defined in a single source file (`permissions.ts`):

```typescript
export const PERMISSIONS = {
  SYSTEM: {
    MANAGE: 'manage:system',
    AUDIT: 'audit:system',
    // ...
  },
  USER: {
    MANAGE: 'manage:users',
    VIEW: 'view:users',
    // ...
  },
  // Additional permission categories...
};
```

### Permission Mapping
Roles map to sets of permissions:

```typescript
export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: [
    PERMISSIONS.SYSTEM.MANAGE,
    PERMISSIONS.SYSTEM.AUDIT,
    // ...
  ],
  ADMIN: [
    PERMISSIONS.USER.MANAGE,
    PERMISSIONS.USER.VIEW,
    // ...
  ],
  // Additional role mappings...
};
```

### Permission Enforcement
Permissions are enforced using:
1. **Frontend Guards**: React components that conditionally render based on permissions
2. **API Middleware**: Backend checks for required permissions
3. **Route Protection**: Next.js middleware for route-level access control

## Integration Components

### Core Components

1. **AuthContext** (`AuthContext.tsx`)
   - Provides authentication state
   - Exposes login/logout methods
   - Handles permission checks

2. **KeycloakService** (`keycloakService.ts`)
   - Handles token management
   - Provides user profile information
   - Manages registration process

3. **Permission Guards** (`PermissionGuard.tsx`)
   - `PermissionGuard` - Renders children only if user has specific permission
   - `RoleGuard` - Renders children only if user has specific role
   - Custom hooks for permission checking

4. **API Client** (`apiClient.ts`)
   - Attaches authentication tokens to requests
   - Handles token refresh during API calls
   - Provides consistent error handling

### Usage Examples

#### Permission Guard
```tsx
import { PermissionGuard, PERMISSIONS } from '@/shared/auth';

<PermissionGuard permission={PERMISSIONS.PHARMACY.CREATE}>
  <CreatePharmacyButton />
</PermissionGuard>
```

#### Authentication Hook
```tsx
import { useAuth } from '@/shared/auth';

function ProfilePage() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

#### API Request with Authentication
```tsx
import apiClient from '@/shared/api/apiClient';

async function fetchPharmacies() {
  const response = await apiClient.get('/pharmacies');
  return response.data;
}
```

## User Management

### User Types
The system supports multiple user types:
- **SUPER_ADMIN** - System administration access
- **ADMIN** - Administrative access
- **MANAGER** - Operational management
- **PHARMACIST** - Registered pharmacist
- **PROPRIETOR** - Pharmacy owner
- **SALESMAN** - Pharmacy sales staff
- **INSTRUCTOR** - Education content creator
- **USER** - Basic user access

### Registration Process
1. User fills out registration form
2. User selects account type
3. System creates user in Keycloak
4. User is assigned to appropriate group
5. Default permissions are applied based on role

### User Profile
User profiles contain:
- Basic information (name, email)
- Role assignments
- Permission grants
- Group memberships
- Custom attributes

## Security Considerations

### Token Security
- Tokens contain sensitive permissions data
- Access tokens have short lifespan (15 minutes)
- Refresh tokens have longer lifespan (24 hours)
- Consider using HTTP-only cookies in production

### Password Policies
Keycloak enforces password policies:
- Minimum length: 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 digit
- Cannot be same as username

### Brute Force Protection
- Failed login attempts are tracked
- Account lockout after 5 failed attempts
- Gradual delay increase between attempts
- Permanent lockout protection

### API Security
- JWT validation on all protected endpoints
- Permission checks at controller level
- CORS configuration to prevent unauthorized access
- Rate limiting to prevent abuse

## Troubleshooting

### Common Issues

1. **Token Refresh Failures**
   - Check refresh token expiration
   - Verify client secret is correct
   - Ensure Keycloak server is reachable

2. **Permission Denied Errors**
   - Verify user has required permission in Keycloak
   - Check permission constant matches Keycloak definition
   - Inspect token content for permission claims

3. **Registration Failures**
   - Verify admin token is being obtained correctly
   - Check group paths match Keycloak configuration
   - Ensure username/email uniqueness constraints

### Debugging Tools

1. **Token Inspection**
   ```javascript
   // Decode JWT payload
   const payload = JSON.parse(atob(token.split('.')[1]));
   console.log('Token payload:', payload);
   ```

2. **Permission Verification**
   ```javascript
   // Check if user has specific permission
   const hasPermission = await keycloakService.hasPermission('create:pharmacy');
   console.log('Can create pharmacy:', hasPermission);
   ```

3. **Group Membership Check**
   ```javascript
   // Check if user belongs to group
   const inGroup = await keycloakService.isInGroup('/Pharmacy Staff/Pharmacists');
   console.log('Is pharmacist:', inGroup);
   ```

## Additional Resources

- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [JWT.io](https://jwt.io/) - For token debugging
- [OpenID Connect Specifications](https://openid.net/specs/openid-connect-core-1_0.html)
