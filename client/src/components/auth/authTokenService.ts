// client/src/services/authTokenService.ts
class AuthTokenService {
    private readonly ACCESS_TOKEN_KEY = 'batchbook_access_token';
    private readonly REFRESH_TOKEN_KEY = 'batchbook_refresh_token';
    private readonly TOKEN_EXPIRY_KEY = 'batchbook_token_expiry';
  
    // Store tokens after successful login
    storeTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
      const expiryTime = Date.now() + (expiresIn * 1000);
      
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
    }
  
    // Update access token after refresh
    updateAccessToken(accessToken: string, expiresIn: number): void {
      const expiryTime = Date.now() + (expiresIn * 1000);
      
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
    }
  
    // Get access token
    getAccessToken(): string | null {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
  
    // Get refresh token
    getRefreshToken(): string | null {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
  
    // Check if access token is expired
    isTokenExpired(): boolean {
      const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
      if (!expiryTime) return true;
      
      return Date.now() >= parseInt(expiryTime);
    }
  
    // Check if user is authenticated
    isAuthenticated(): boolean {
      const accessToken = this.getAccessToken();
      const refreshToken = this.getRefreshToken();
      
      return !!(accessToken && refreshToken && !this.isTokenExpired());
    }
  
    // Get authorization header for API requests
    getAuthHeader(): { Authorization?: string } {
      const token = this.getAccessToken();
      return token ? { Authorization: `Bearer ${token}` } : {};
    }
  
    // Clear all tokens (logout)
    clearTokens(): void {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    }
  
    // Get token expiry time in milliseconds
    getTokenExpiryTime(): number | null {
      const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
      return expiryTime ? parseInt(expiryTime) : null;
    }
  
    // Get time until token expires (in seconds)
    getTimeUntilExpiry(): number {
      const expiryTime = this.getTokenExpiryTime();
      if (!expiryTime) return 0;
      
      return Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
    }
  }
  
  export const authTokenService = new AuthTokenService();