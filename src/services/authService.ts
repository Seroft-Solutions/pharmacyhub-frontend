import { apiClient } from '@/lib/api/apiClient';
import { useAuthStore } from '@/store/authStore';
import { cookieUtils } from '@/lib/utils/cookies';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  role?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  token: string;
}

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      this.handleAuthSuccess(response);
      return response;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  public async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      this.handleAuthSuccess(response);
      return response;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      this.clearAuth();
    }
  }

  public async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/refresh-token');
      this.handleAuthSuccess(response);
      return response;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  private handleAuthSuccess(response: AuthResponse): void {
    cookieUtils.setAuthToken(response.token);
    cookieUtils.setUser(response.user);
    useAuthStore.getState().setUser(response.user);
    useAuthStore.getState().setIsAuthenticated(true);
  }

  private handleAuthError(error: any): void {
    this.clearAuth();
    throw error;
  }

  private clearAuth(): void {
    cookieUtils.clearAuth();
    useAuthStore.getState().reset();
  }
}

export const authService = AuthService.getInstance(); 