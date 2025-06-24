// client/src/types/auth.ts
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    dateOfBirth?: string;
    createdAt: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
      user: User;
      token: string;
    };
    errors?: Array<{
      field: string;
      message: string;
    }>;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
  }
  
  export interface OTPRequest {
    email: string;
  }
  
  export interface OTPVerification {
    email: string;
    otp: string;
  }