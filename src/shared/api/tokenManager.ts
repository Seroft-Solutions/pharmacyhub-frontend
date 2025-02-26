import { TokenManager } from './types';

const TOKEN_KEY = 'auth_token';

/**
 * Default implementation of TokenManager that uses localStorage
 * with secure token handling and SSR compatibility
 */
class DefaultTokenManager implements TokenManager {
  private readonly storageKey: string;

  constructor(storageKey: string = TOKEN_KEY) {
    this.storageKey = storageKey;
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem(this.storageKey);
    if (!token) return null;

    // Ensure token is properly formatted
    return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }

  setToken(token: string): void {
    if (typeof window === 'undefined') return;

    // Strip 'Bearer ' prefix if present
    const cleanToken = token.replace('Bearer ', '');
    localStorage.setItem(this.storageKey, cleanToken);
  }

  removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.storageKey);
  }

  async refreshToken(): Promise<string | null> {
    try {
      // Implement your token refresh logic here
      // This is just a placeholder
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      if (data.token) {
        this.setToken(data.token);
        return data.token;
      }

      return null;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  }

  hasToken(): boolean {
    return !!this.getToken();
  }
}

// Create a singleton instance with default configuration
export const tokenManager = new DefaultTokenManager();

// Factory function for creating custom token managers
export const createTokenManager = (config?: {
  storageKey?: string;
  customImplementation?: Partial<TokenManager>;
}): TokenManager => {
  if (config?.customImplementation) {
    const baseManager = new DefaultTokenManager(config.storageKey);
    return {
      getToken: config.customImplementation.getToken ?? baseManager.getToken.bind(baseManager),
      setToken: config.customImplementation.setToken ?? baseManager.setToken.bind(baseManager),
      removeToken: config.customImplementation.removeToken ?? baseManager.removeToken.bind(baseManager),
      refreshToken: config.customImplementation.refreshToken ?? baseManager.refreshToken.bind(baseManager)
    };
  }
  return new DefaultTokenManager(config?.storageKey);
};

export default tokenManager;