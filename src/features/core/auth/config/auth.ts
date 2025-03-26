// Auth configuration and routes
import { AUTH_CONFIG, PASSWORD_CONFIG } from '../constants/config';

// Export ROUTES for backward compatibility
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  VERIFY_EMAIL: '/verify-email',
  HOME: '/'
};

export { AUTH_CONFIG, PASSWORD_CONFIG };
export default { AUTH_CONFIG, PASSWORD_CONFIG, ROUTES };
