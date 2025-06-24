// client/src/services/authService.ts
import { 
    LoginCredentials, 
    RegisterCredentials, 
    OTPRequest, 
    OTPVerification, 
    AuthResponse,
    User 
  } from '../types/auth';
  
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  class AuthService {
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
      const url = `${API_BASE_URL}${endpoint}`;
      
      // Get token from the correct localStorage key
      const token = localStorage.getItem('batchbook_access_token');
  
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };
  
      try {
        const response = await fetch(url, config);
        
        // Handle empty responses (like 204 No Content)
        let data;
        try {
          data = await response.json();
        } catch {
          data = {};
        }
  
        if (!response.ok) {
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
  
        return data;
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Network error occurred');
      }
    }
  
    async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
      const response = await this.request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
  
      if (!response.data) {
        throw new Error('Invalid response from server');
      }
  
      // Store tokens in localStorage
      this.storeTokens(response.data.token, response.data.refreshToken);
  
      return response.data;
    }
  
    async register(credentials: RegisterCredentials): Promise<{ user: User; token: string }> {
      const response = await this.request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
  
      if (!response.data) {
        throw new Error('Invalid response from server');
      }
  
      // Store tokens in localStorage
      this.storeTokens(response.data.token, response.data.refreshToken);
  
      return response.data;
    }
  
    async requestOTP(request: OTPRequest): Promise<{ message: string }> {
      return await this.request('/auth/request-otp', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    }
  
    async verifyOTP(verification: OTPVerification): Promise<{ user: User; accessToken: string; refreshToken: string }> {
      const response = await this.request<{
        success: boolean;
        data: {
          user: User;
          accessToken: string;
          refreshToken: string;
        };
        message: string;
      }>('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify(verification),
      });
  
      if (!response.data) {
        throw new Error('Invalid response from server');
      }
  
      // Store tokens in localStorage with proper keys
      this.storeTokens(response.data.accessToken, response.data.refreshToken);
  
      return response.data;
    }
  
    async getCurrentUser(): Promise<User> {
      const response = await this.request<{ 
        success: boolean; 
        data: { user: User } 
      }>('/auth/me');
      
      if (!response.data) {
        throw new Error('Invalid response from server');
      }
      
      return response.data.user;
    }
  
    async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
      const refreshToken = localStorage.getItem('batchbook_refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
  
      const response = await this.request<{
        success: boolean;
        data: {
          accessToken: string;
          refreshToken: string;
        };
      }>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
  
      if (!response.data) {
        throw new Error('Invalid response from server');
      }
  
      // Store new tokens
      this.storeTokens(response.data.accessToken, response.data.refreshToken);
  
      return response.data;
    }
  
    async logout(): Promise<void> {
      try {
        await this.request('/auth/logout', {
          method: 'POST',
        });
      } catch (error) {
        // Even if logout fails on server, clear local tokens
        console.warn('Logout request failed:', error);
      } finally {
        // Always clear tokens on logout
        this.clearTokens();
      }
    }
  
    // Token management methods
    private storeTokens(accessToken: string, refreshToken?: string): void {
      localStorage.setItem('batchbook_access_token', accessToken);
      
      if (refreshToken) {
        localStorage.setItem('batchbook_refresh_token', refreshToken);
      }
      
      // Store expiry time (assuming 1 hour for access token)
      const expiryTime = Date.now() + (60 * 60 * 1000); // 1 hour
      localStorage.setItem('batchbook_token_expiry', expiryTime.toString());
    }
  
    private clearTokens(): void {
      localStorage.removeItem('batchbook_access_token');
      localStorage.removeItem('batchbook_refresh_token');
      localStorage.removeItem('batchbook_token_expiry');
    }
  
    // Check if user is authenticated
    isAuthenticated(): boolean {
      const token = localStorage.getItem('batchbook_access_token');
      const expiry = localStorage.getItem('batchbook_token_expiry');
      
      if (!token || !expiry) {
        return false;
      }
      
      // Check if token is expired
      if (Date.now() >= parseInt(expiry)) {
        this.clearTokens();
        return false;
      }
      
      return true;
    }
  
    // Get stored tokens
    getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
      return {
        accessToken: localStorage.getItem('batchbook_access_token'),
        refreshToken: localStorage.getItem('batchbook_refresh_token'),
      };
    }
  }
  
  export const authService = new AuthService();