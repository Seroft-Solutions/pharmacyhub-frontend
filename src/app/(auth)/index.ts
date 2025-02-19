// Page components
export { default as LoginPage } from './login/page';
export { default as RegisterPage } from './register/page';
export { default as ForgotPasswordPage } from './forgot-password/page';
export { default as ResetPasswordPage } from './reset-password/page';

// Layout and loading
export { default as AuthLayout } from './layout';
export { default as AuthLoading } from './loading';

// Re-export auth components
export {
  AuthGuard,
  AdminGuard,
  ManagerGuard,
  FeatureGuard,
  AuthLoading as AuthLoadingComponent,
  Unauthorized,
  withAuth,
} from '@/components/auth';

// Re-export auth hooks and utilities
export { useAuth } from '@/context/AuthContext';
export { useProfile } from '@/hooks/useProfile';
export { validatePassword, calculatePasswordStrength } from '@/utils/password';
export { default as AuthService } from '@/services/authService';

// Re-export types
export type {
  AuthUser,
  TokenData,
  Permission,
  Role,
  AuthError,
} from '@/types/auth';

// Re-export configuration
export {
  ROUTES,
  TOKEN,
  COOKIE,
  API,
  SESSION,
  PASSWORD,
} from '@/config/auth';