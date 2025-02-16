import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { useAuthStore } from '@/store/authStore';
import { cookieUtils } from '@/lib/utils/cookies';

class ApiClient {
  private static instance: ApiClient;
  private api: AxiosInstance;

  private constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Important for cookie handling
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = cookieUtils.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle token expiration
          cookieUtils.clearAuth();
          useAuthStore.getState().reset();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic request methods
  public async get<T>(url: string, config = {}): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data = {}, config = {}): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data = {}, config = {}): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config = {}): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = ApiClient.getInstance(); 