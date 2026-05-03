const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3535";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const headers = new Headers({
      "Content-Type": "application/json",
    });

    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return response.json();
  }

  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getProfile(): Promise<ApiResponse<any>> {
    return this.request("/api/profile", {
      method: "GET",
    });
  }
}

export const apiClient = new ApiClient(API_URL);
