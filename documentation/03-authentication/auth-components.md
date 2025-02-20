# Authentication Components

## Overview

The PharmacyHub authentication system follows Feature-Sliced Design principles and offers a comprehensive set of user flows:

1. User Login/Logout
2. User Registration
3. Password Recovery
4. Email Verification

## Architecture

Authentication components follow the FSD architecture with clear layer separation:

```
/features/auth/
├── ui/               # User interface components
│   ├── login/
│   ├── register/
│   ├── password-recovery/
│   ├── verification/
│   └── layout/
├── model/            # Domain models and state
│   ├── types.ts
│   └── store.ts
├── api/              # API integration
│   ├── authService.ts
│   └── mutations.ts
└── lib/              # Utilities
    └── validation.ts
```

## Authentication Flows

### 1. Login Flow

The login flow supports:
- Email/password authentication
- "Remember me" functionality
- Social authentication providers (Google, Microsoft)
- Admin access mode
- Success animation on login

```typescript
// Usage example
const { login } = useAuthStore();
const loginMutation = useLogin();

// After successful authentication
login(result.token);
router.push(ROUTES.DASHBOARD);
```

### 2. Registration Flow

A multi-step registration process:
1. Account setup (email/password)
2. Personal information
3. Terms acceptance and confirmation

Features:
- Password strength visualization
- Step-by-step guidance
- Validation at each step
- Summary confirmation

### 3. Password Recovery

Two main components:
1. **Forgot Password** - Request password reset via email
2. **Reset Password** - Set new password with token validation

Features:
- Email verification
- Secure token handling
- Password strength guidance
- Multiple state handling (validating, success, error)

### 4. Email Verification

Secure email verification process:
- Automatic token validation
- Success/failure visualization
- Option to resend verification emails
- Clear guidance on next steps

## State Management

Authentication uses Zustand for global state:

```typescript
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}
```

## API Integration

Authentication components use React Query for API interactions:

```typescript
// Example mutation
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => 
      AuthService.login(credentials.email, credentials.password),
  });
};
```

## Key UI Components

1. **LoginForm** - Handles user authentication
2. **RegisterForm** - Multi-step registration
3. **ForgotPasswordForm** - Password recovery request
4. **ResetPasswordForm** - New password creation
5. **EmailVerificationView** - Email verification
6. **AuthLayout** - Shared layout with animated background

## Styling Approach

Authentication components use:
- ShadCN UI components
- Tailwind CSS for styling
- Consistent visual language
- Animated gradients and transitions
- Responsive design for all devices

## Security Considerations

1. **Token Management**
   - Secure token storage
   - Automatic token validation
   - Token expiration handling

2. **Password Security**
   - Strong password requirements
   - Password strength visualization
   - Secure reset process

3. **API Security**
   - Protected endpoints
   - Rate limiting
   - CSRF protection

## Future Enhancements

Planned enhancements for authentication:
1. Two-factor authentication
2. Device management
3. OAuth2 provider expansion
4. Session management improvements
