import { authService } from '@/shared/auth/authService';
import { TOKEN_CONFIG } from '@/shared/auth/apiConfig';
import { TokenResponse, UserProfile } from '@/shared/auth/types';
import { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear();
    fetchMock.resetMocks();
  });

  describe('login', () => {
    it('should successfully log in and store tokens', async () => {
      const mockResponse: TokenResponse = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expires_in: 3600,
        token_type: 'Bearer'
      };

      const mockUserProfile: UserProfile = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        roles: ['USER'],
        permissions: ['read:profile']
      };

      // Mock successful login
      fetchMock
        .mockResponseOnce(JSON.stringify(mockResponse))  // Login call
        .mockResponseOnce(JSON.stringify(mockUserProfile));  // Profile fetch call

      const result = await authService.login('testuser', 'password123');

      expect(result).toEqual(mockUserProfile);
      expect(localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY)).toBe(mockResponse.access_token);
      expect(localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY)).toBe(mockResponse.refresh_token);
      expect(fetchMock.mock.calls[0][0]).toEqual('/api/auth/login');
    });

    it('should handle login failure', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });

      await expect(authService.login('testuser', 'wrongpassword')).rejects.toThrow();
      expect(localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY)).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when valid token exists', () => {
      const futureTime = Date.now() + 3600000; // 1 hour in the future
      localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, 'valid-token');
      localStorage.setItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY, futureTime.toString());

      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false when token is expired', () => {
      const pastTime = Date.now() - 3600000; // 1 hour in the past
      localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, 'expired-token');
      localStorage.setItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY, pastTime.toString());

      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should return false when no token exists', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('refreshToken', () => {
    it('should successfully refresh tokens', async () => {
      const mockResponse: TokenResponse = {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
        expires_in: 3600,
        token_type: 'Bearer'
      };

      localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, 'old-refresh-token');

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await authService.refreshToken();

      expect(result).toBe(true);
      expect(localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY)).toBe(mockResponse.access_token);
      expect(localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY)).toBe(mockResponse.refresh_token);
      expect(fetchMock.mock.calls[0][0]).toEqual('/api/auth/token/refresh');
    });

    it('should handle refresh failure', async () => {
      localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, 'invalid-refresh-token');

      fetchMock.mockResponseOnce(JSON.stringify({ message: 'Invalid refresh token' }), { status: 401 });

      const result = await authService.refreshToken();

      expect(result).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear tokens and storage on logout', async () => {
      // Setup initial state
      localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, 'test-token');
      localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, 'test-refresh');
      localStorage.setItem(TOKEN_CONFIG.USER_PROFILE_KEY, JSON.stringify({ id: '1' }));

      fetchMock.mockResponseOnce(JSON.stringify({}));  // Mock logout endpoint

      await authService.logout();

      expect(localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY)).toBeNull();
      expect(localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY)).toBeNull();
      expect(localStorage.getItem(TOKEN_CONFIG.USER_PROFILE_KEY)).toBeNull();
      expect(window.location.href).toBe('/login');
      expect(fetchMock.mock.calls[0][0]).toEqual('/api/auth/logout');
    });

    it('should still clear storage if logout request fails', async () => {
      localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, 'test-token');
      fetchMock.mockRejectOnce(new Error('Network error'));

      await authService.logout();

      expect(localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY)).toBeNull();
      expect(window.location.href).toBe('/login');
    });
  });
});
