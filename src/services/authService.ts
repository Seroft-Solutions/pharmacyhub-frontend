import { AuthUser } from '@/types/auth';
import { createAuthHeaders } from '@/lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface LoginResponse {
  token: string;
  user: AuthUser;
}

interface RefreshTokenResponse {
  token: string;
}

class AuthService {
  static async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // Important for cookies
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to login');
    }

    return response.json();
  }

  static async logout(): Promise<void> {
    await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  }

  static async refreshToken(): Promise<RefreshTokenResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    return response.json();
  }

  static async validateToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/validate`, {
        headers: createAuthHeaders(token),
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  static async registerUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  }): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to register');
    }
  }

  static async forgotPassword(email: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to process forgot password request');
    }
  }

  static async resetPassword(token: string, password: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reset password');
    }
  }

  static async changePassword(
    currentPassword: string,
    newPassword: string,
    token: string
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/change-password`, {
      method: 'POST',
      headers: createAuthHeaders(token),
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to change password');
    }
  }

  static async verifyEmail(token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify-email/${token}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to verify email');
    }
  }
}

export default AuthService;