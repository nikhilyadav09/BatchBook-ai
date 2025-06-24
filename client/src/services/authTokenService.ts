// client/src/services/authTokenService.ts
interface TokenData {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  }
  
  class AuthTokenService {
    private readonly ACCESS_TOKEN_KEY = 'batchbook_access_token';
    private readonly REFRESH_TOKEN_KEY = 'batchbook_refresh_token';
    private readonly EXPIRES_AT_KEY = 'batchbook_expires_at';
  
    // Store tokens securely
    storeTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
      const expiresAt = Date.now() + (expiresIn * 1000);
      
      try {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
        localStorage.setItem(this.EXPIRES_AT_KEY, expiresAt.toString());
      } catch (error) {
        console.error('Failed to store tokens:', error);
      }
    }
  
    // Get access token
    getAccessToken(): string | null {
      try {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
      } catch (error) {
        console.error('Failed to get access token:', error);
        return null;
      }
    }
  
    // Get refresh token
    getRefreshToken(): string | null {
      try {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
      } catch (error) {
        console.error('Failed to get refresh token:', error);
        return null;
      }
    }
  
    // Check if token is expired
    isTokenExpired(): boolean {
      try {
        const expiresAt = localStorage.getItem(this.EXPIRES_AT_KEY);
        if (!expiresAt) return true;
        
        const expirationTime = parseInt(expiresAt, 10);
        const currentTime = Date.now();
        
        // Consider token expired 5 minutes before actual expiration
        return currentTime >= (expirationTime - 5 * 60 * 1000);
      } catch (error) {
        console.error('Failed to check token expiration:', error);
        return true;
      }
    }
  
    // Get all token data
    getTokenData(): TokenData | null {
      const accessToken = this.getAccessToken();
      const refreshToken = this.getRefreshToken();
      const expiresAtStr = localStorage.getItem(this.EXPIRES_AT_KEY);
  
      if (!accessToken || !refreshToken || !expiresAtStr) {
        return null;
      }
  
      return {
        accessToken,
        refreshToken,
        expiresAt: parseInt(expiresAtStr, 10),
      };
    }
  
    // Clear all tokens
    clearTokens(): void {
      try {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.EXPIRES_AT_KEY);
      } catch (error) {
        console.error('Failed to clear tokens:', error);
      }
    }
  
    // Check if user has valid tokens
    hasValidTokens(): boolean {
      const tokenData = this.getTokenData();
      return tokenData !== null && !this.isTokenExpired();
    }
  
    // Update access token (after refresh)
    updateAccessToken(accessToken: string, expiresIn: number): void {
      const expiresAt = Date.now() + (expiresIn * 1000);
      
      try {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(this.EXPIRES_AT_KEY, expiresAt.toString());
      } catch (error) {
        console.error('Failed to update access token:', error);
      }
    }
  
    // Get authorization header
    getAuthHeader(): { Authorization: string } | Record<string, never> {
      const accessToken = this.getAccessToken();
      return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    }
  }
  
  export const authTokenService = new AuthTokenService();