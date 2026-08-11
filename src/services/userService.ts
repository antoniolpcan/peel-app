import { apiFetch } from './apiClient';
import type { BasicUserResponse, UserCreate, UserResponse, UserUpdate } from './types';

export const userService = {
  createUser: async (data: UserCreate): Promise<UserResponse> => {
    return apiFetch<UserResponse>('/users', {
      method: 'POST',
      body: data,
    });
  },

  getUsers: async (skip = 0, limit = 50): Promise<BasicUserResponse[]> => {
    const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
    return apiFetch<BasicUserResponse[]>(`/users?${params.toString()}`);
  },

  getUserById: async (userId: number): Promise<BasicUserResponse> => {
    return apiFetch<BasicUserResponse>(`/users/${userId}`);
  },

  updateMe: async (data: UserUpdate): Promise<UserResponse> => {
    return apiFetch<UserResponse>('/users/me', {
      method: 'PATCH',
      body: data,
      auth: true,
    });
  },
};