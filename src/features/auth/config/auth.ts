// This file is deprecated.
// The content has been moved to src/features/auth/constants/config.ts
// Please update your imports to use the new location.

// Re-export from new location for backward compatibility
import { AUTH_CONFIG, PASSWORD_CONFIG } from '../constants/config';

export const ROUTES = {}; // Deprecated, use AUTH_ROUTES from constants/routes.ts
export { AUTH_CONFIG, PASSWORD_CONFIG };
export default { AUTH_CONFIG, PASSWORD_CONFIG };
