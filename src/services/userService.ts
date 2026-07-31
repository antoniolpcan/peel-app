import { BASE_URL, getHeaders, handleResponse } from './apiClient';
import type { BasicUserResponse, UserCreate, UserResponse, UserUpdate } from './types';

export const userService = {
  createUser: async (data: UserCreate): Promise<UserResponse> => {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(data),
    });
    return handleResponse<UserResponse>(response);
  },

  getUsers: async (skip = 0, limit = 100): Promise<BasicUserResponse[]> => {
    const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
    const response = await fetch(`${BASE_URL}/users?${params.toString()}`, {
      headers: getHeaders(false),
    });
    return handleResponse<BasicUserResponse[]>(response);
  },

  getUserById: async (userId: number): Promise<BasicUserResponse> => {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      headers: getHeaders(false),
    });
    return handleResponse<BasicUserResponse>(response);
  },

  updateMe: async (data: UserUpdate): Promise<UserResponse> => {
    const response = await fetch(`${BASE_URL}/users/me`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse<UserResponse>(response);
  },
};