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
} from '@/features/core/app-auth/components/feedback';

export {
  AuthLayout
} from '@/features/core/app-auth/components/layout';

export {
  LoginForm
} from '@/features/core/app-auth/components/login';

export {
  ForgotPasswordForm,
  ResetPasswordForm
} from '@/features/core/app-auth/ui/password-recovery';

export {
  RegisterForm
} from '@/features/core/app-auth/ui/register';

export {
  AuthGuard,
  RequireAuth
} from '@/features/core/app-auth/components/protection';
