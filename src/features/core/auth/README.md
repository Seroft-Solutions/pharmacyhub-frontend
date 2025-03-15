# Authentication Feature

This feature provides authentication and authorization functionality for the PharmacyHub platform, including:

- User login and registration
- Password recovery
- Token management
- Role-based access control (RBAC)

## Directory Structure

```
auth/
├── api/               # API integration using TanStack Query
│   ├── constants/     # API endpoint constants
│   ├── hooks/         # React Query hooks for data fetching
│   ├── services/      # Extended API services
│   ├── types/         # API-specific types
│   ├── deprecated/    # Old implementations (to be removed)
│   └── index.ts       # Main API entry point
├── components/        # Legacy component structure (UI moved to /ui)
├── constants/         # Feature constants
├── core/              # Core auth functionality
│   ├── AuthContext.tsx # Context provider for auth state
│   ├── tokenManager.ts # Token handling utilities
│   ├── types.ts        # Core auth types
│   └── index.ts        # Core exports
├── hooks/             # React hooks for auth functionality
├── model/             # Data model (deprecated, use /types)
├── types/             # TypeScript type definitions
├── ui/                # UI components organized by feature
│   ├── login/         # Login-related components
│   ├── protection/    # Auth guards and protection components
│   ├── ...            # Other UI components
└── index.ts           # Main feature entry point
```

## Important Notes for Developers

1. **React Hooks Usage**:
   - The React Query hooks in `api/hooks/` **must only be used inside React functional components**
   - For non-React contexts like Zustand stores, use direct API calls with `apiClient` from tanstack-query-api
   - The `AuthContext.tsx` has been updated to use direct API calls instead of hooks

2. **Token Management**:
   - Use the `tokenManager` utility for token operations instead of direct localStorage access
   - Token refresh happens automatically via interceptors

3. **Authentication Context**:
   - Use the `useAuth()` hook for auth state, not direct context access
   - The hook provides user state, login/logout functions, and RBAC helpers

4. **RBAC (Role-Based Access Control)**:
   - Use protection components from `ui/protection` for conditional rendering
   - `hasRole`, `hasPermission`, and `hasAccess` functions handle authorization checks

## Usage Examples

### Authentication State

```tsx
import { useAuth } from '@/features/auth';

function MyComponent() {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) return <p>Loading...</p>;
  
  return isAuthenticated ? (
    <p>Welcome, {user?.firstName}!</p>
  ) : (
    <p>Please log in</p>
  );
}
```

### Login Form

The LoginForm component uses `useLoginForm` hook which handles the login logic:

```tsx
import { useLoginForm } from '@/features/auth';

function LoginForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleSubmit
  } = useLoginForm('/dashboard'); // Redirect path after login
  
  // Render form...
}
```

### Protected Routes

Use RequireAuth component to protect routes:

```tsx
import { RequireAuth } from '@/features/auth';

function ProtectedPage() {
  return (
    <RequireAuth>
      <YourProtectedContent />
    </RequireAuth>
  );
}
```

## API Reference

### Hooks

- `useAuth()` - Main auth hook for state and functions
- `useLoginForm()` - Hook for login form state and submit handler
- `useRegisterForm()` - Hook for registration form

### Context

- `AuthProvider` - Provider component for auth context
- `useAuthContext` - Low-level hook for auth context (prefer `useAuth()`)

### Components

- `LoginForm` - Complete login form component
- `RequireAuth` - Route protection component
- `PermissionGuard` - Conditional rendering based on permissions

## Configuration

The authentication feature can be configured using environment variables:

```
# .env or .env.local

# Base URL for API requests
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# API path prefix - can be modified if your backend expects a different path structure
# e.g. '/api', '/v1', or '' (empty string for no prefix)
NEXT_PUBLIC_API_PATH_PREFIX=/api

# API request timeout in milliseconds
NEXT_PUBLIC_API_TIMEOUT=15000
```

## Debugging and Troubleshooting

### Common Issues

1. **Login not working**:
   - Check that `NEXT_PUBLIC_API_BASE_URL` is correctly set in `.env`
   - Verify that `NEXT_PUBLIC_API_PATH_PREFIX` matches your backend API structure
   - Look for 401, 403, or 404 errors in the browser console
   - Ensure CORS is properly configured on the backend

2. **Token persistence issues**:
   - Clear browser localStorage and try again
   - Check for token expiration in tokenManager
   - Check network requests for proper Authorization headers

### Debugging Tools

For API connectivity issues, add the API Debugger component to your app:

```tsx
import { ApiDebugger } from '@/features/core/tanstack-query-api';

function YourApp() {
  return (
    <>
      <YourAppContent />
      {process.env.NODE_ENV === 'development' && (
        <ApiDebugger endpoints={[
          '/api/auth/login',
          '/api/users/me'
        ]} />
      )}
    </>
  );
}
```

## Best Practices

1. Always use the `useAuth()` hook, not direct context or localStorage access
2. Prefer the UI components from `ui/` over direct form implementation
3. Never use React hooks outside React components
4. For Zustand stores, use direct API calls via `apiClient`
5. Use the debugging tools in development to troubleshoot API connectivity issues
6. Keep environment variables consistent across development environments
