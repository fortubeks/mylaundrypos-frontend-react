// Common types used across the application

export interface User {
  id: string;
  name: string;
  email: string;
  is_owner?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

