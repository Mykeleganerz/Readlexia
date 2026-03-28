import apiClient from './api.service';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
}

export const usersService = {
  async getAll(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  },

  async getById(id: number): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  async update(id: number, updates: { name?: string; email?: string; role?: string; isSuspended?: boolean }): Promise<User> {
    const response = await apiClient.put<User>(`/users/${id}`, updates);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};
