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
} from '../../features/auth/components/feedback';

export {
  AuthLayout
} from '../../features/auth/components/layout';

export {
  LoginForm
} from '../../features/auth/components/login';

export {
  ForgotPasswordForm,
  ResetPasswordForm
} from '@/features/auth/ui/password-recovery';

export {
  RegisterForm
} from '@/features/auth/ui/register';

export {
  AuthGuard,
  RequireAuth
} from '../../features/auth/components/protection';
