import { 
  LoginCredentials, 
  LoginResponse, 
  RegistrationData, 
  RegisterResponse,
  VerificationResponse,
  ResetPasswordData
} from '../model/types';

// This would typically extend a base ApiService class from shared/api
class AuthServiceImpl {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/auth') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(error.message || `Request failed with status ${response.status}`);
    }

    return response.json();
  }

  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-storage') : null;
    if (!token) return {};

    try {
      const parsedState = JSON.parse(token);
      const authToken = parsedState?.state?.token;
      return authToken ? { Authorization: `Bearer ${authToken}` } : {};
    } catch (e) {
      return {};
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async registerUser(userData: RegistrationData): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async requestPasswordReset(email: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async validateResetToken(token: string): Promise<{ valid: boolean }> {
    return this.request<{ valid: boolean }>(`/reset-password/validate/${token}`);
  }

  async completePasswordReset(token: string, newPassword: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  async verifyEmail(token: string): Promise<VerificationResponse> {
    return this.request<VerificationResponse>('/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async resendVerificationEmail(email: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }
}

export const AuthService = new AuthServiceImpl();