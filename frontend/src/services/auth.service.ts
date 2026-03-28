import apiClient from './api.service';

export interface AuthResponse {
  message: string;
  user: {
    id: number;
    email: string;
    name: string;
    role?: string;
  };
  accessToken: string;
}

export interface ProfileResponse {
  id: number;
  email: string;
  name: string;
  role?: string;
  createdAt: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', { name, email, password });
    return response.data;
  },

  async getProfile(): Promise<ProfileResponse> {
    const response = await apiClient.get<ProfileResponse>('/auth/profile');
    return response.data;
  },

  async requestPasswordReset(email: string): Promise<{ message: string; resetToken?: string }> {
    const response = await apiClient.post('/auth/password/request-reset', { email });
    return response.data;
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/password/reset', { token, newPassword });
    return response.data;
  },

  saveToken(token: string) {
    localStorage.setItem('accessToken', token);
  },

  removeToken() {
    localStorage.removeItem('accessToken');
  },

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  },
};
