# Authentication Module

## Overview
This module handles all authentication-related functionality in PharmacyHub using a JWT-based authentication system.

## Structure
```
auth/
├── README.md           # This documentation
├── apiConfig.ts        # API and auth configuration
├── authService.ts      # Main authentication service
├── AuthContext.tsx     # React context for auth state
├── types.ts           # TypeScript interfaces
├── utils.ts           # Helper utilities
└── __tests__/         # Test files
```

## Key Components

### 1. AuthService (`authService.ts`)
Handles core authentication operations:
- Login/Logout
- Token management
- Session monitoring
- Token refresh
- Permission checks

```typescript
import { authService } from '@/shared/auth';

// Login
await authService.login(username, password);

// Check auth status
const isLoggedIn = authService.isAuthenticated();

// Logout
await authService.logout();
```

### 2. Auth Context (`AuthContext.tsx`)
Provides authentication state and methods to React components:

```typescript
import { useAuth } from '@/shared/auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  // ...
}
```

### 3. Configuration (`apiConfig.ts`)
Contains configuration for:
- API endpoints
- Token storage keys
- Auth-related settings

### 4. Types (`types.ts`)
Defines TypeScript interfaces for:
- Token responses
- User profiles
- Authentication state

## Token Management

Tokens are stored securely in localStorage with expiry management:
- `ACCESS_TOKEN_KEY`: Active JWT token
- `REFRESH_TOKEN_KEY`: Token for obtaining new access tokens
- `TOKEN_EXPIRY_KEY`: Token expiration timestamp
- `USER_PROFILE_KEY`: Cached user profile

## Testing

Run the test suite:
```bash
npm test
# or
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

## API Integration

Authentication endpoints:
- POST `/api/auth/login` - User login
- POST `/api/auth/signup` - User registration
- POST `/api/auth/token/refresh` - Refresh access token
- POST `/api/auth/logout` - User logout
- POST `/api/auth/reset-password` - Password reset

## Error Handling

The service includes comprehensive error handling:
- Network errors
- Invalid credentials
- Token expiration
- Session invalidation

## Security Features

1. Automatic token refresh
2. Session monitoring
3. Secure token storage
4. RBAC (Role-Based Access Control)
5. Permission-based guards

## Usage with Guards

Protect routes and components:
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

## Environment Configuration

Required environment variables:
```env
API_BASE_URL=http://localhost:8080
API_AUTH_SECRET=your-auth-secret
NEXTAUTH_SECRET=your-nextauth-secret
```

See `.env.example` for all available options.
