/**
 * Re-export auth components from the features directory
 * This file serves as a compatibility layer for older code
 */

export {
  AuthLoading,
  InitialAuthCheck,
  PermissionCheck as AuthPermissionCheck,
  TokenRefresh,
  ProfileLoading
} from '@/features/core/auth/components/feedback';

export {
  AuthLayout
} from '@/features/core/auth/components/layout';

export {
  LoginForm
} from '@/features/core/auth/components/login';

export {
  ForgotPasswordForm,
  ResetPasswordForm
} from '@/features/core/auth/ui/password-recovery';

export {
  RegisterForm
} from '@/features/core/auth/ui/register';

export {
  AuthGuard,
  RequireAuth
} from '@/features/core/auth/components/protection';
