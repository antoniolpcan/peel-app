import { BASE_URL, getHeaders, apiFetch } from './apiClient';
import type { BasicUserResponse, UserCreate, UserResponse, UserUpdate } from './types';

export const userService = {
  createUser: async (data: UserCreate): Promise<UserResponse> => {
    return apiFetch<UserResponse>(`${BASE_URL}/users`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(data),
    });
  },

  getUsers: async (skip = 0, limit = 100): Promise<BasicUserResponse[]> => {
    const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
    return apiFetch<BasicUserResponse[]>(`${BASE_URL}/users?${params.toString()}`, {
      headers: getHeaders(false),
    });
  },

  getUserById: async (userId: number): Promise<BasicUserResponse> => {
    return apiFetch<BasicUserResponse>(`${BASE_URL}/users/${userId}`, {
      headers: getHeaders(false),
    });
  },

  updateMe: async (data: UserUpdate): Promise<UserResponse> => {
    return apiFetch<UserResponse>(`${BASE_URL}/users/me`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },
};