/**
 * Token Management Module
 * 
 * Provides utilities for handling authentication tokens securely.
 * Manages token storage, retrieval, and validation.
 * 
 * @deprecated Use the modular token management system from './token' instead.
 * This file is maintained for backward compatibility.
 */
import { tokenManager, TOKEN_CONFIG } from './token';

// Re-export for backward compatibility
export { TOKEN_CONFIG };
export default tokenManager;
