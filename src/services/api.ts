const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token?: string;
}

export interface MeResponse {
  id: string;
  name: string;
  email: string;
  role?: string;
  laundry_id?: number | null;
}

export interface Customer {
  id: number;
  laundry_id: number;
  title: string;
  first_name: string;
  last_name?: string | null;
  other_names?: string | null;
  email?: string | null;
  phone_code?: string | null;
  phone: string;
  other_phone?: string | null;
  birthday?: string | null;
  address?: string | null;
  state_id?: number | null;
  country_id?: number | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface CreateCustomerDto {
  title: string;
  first_name: string;
  last_name?: string;
  other_names?: string;
  email?: string;
  phone_code?: string;
  phone: string;
  other_phone?: string;
  birthday?: string;
  address?: string;
  state_id?: number;
  country_id?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Handle Laravel validation errors
        if (errorData.errors) {
          const firstError = Object.values(errorData.errors)[0];
          const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
          throw new Error(errorMessage || 'Validation failed');
        }
        throw new Error(errorData.message || 'Request failed');
      }

      const data = await response.json();
      // Laravel might return redirect response, extract user if available
      if (data.user) {
        return data;
      }
      // If no user in response, Laravel may redirect, so check auth status
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    return this.request<void>('/logout', {
      method: 'POST',
    });
  }

  async me(): Promise<MeResponse> {
    return this.request<MeResponse>('/user', {
      method: 'GET',
    });
  }

  // Customer endpoints
  async getCustomers(): Promise<PaginatedResponse<Customer>> {
    return this.request<PaginatedResponse<Customer>>('/customers', {
      method: 'GET',
    });
  }

  async getCustomer(id: number): Promise<Customer> {
    return this.request<Customer>(`/customers/${id}`, {
      method: 'GET',
    });
  }

  async createCustomer(data: CreateCustomerDto): Promise<Customer> {
    return this.request<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCustomer(id: number, data: Partial<CreateCustomerDto>): Promise<Customer> {
    return this.request<Customer>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCustomer(id: number): Promise<void> {
    return this.request<void>(`/customers/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();

