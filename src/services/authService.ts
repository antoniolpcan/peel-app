import { BASE_URL, apiFetch } from './apiClient';
import type { Token } from './types';

export const authService = {

  login: async (username: string, password: string): Promise<Token> => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    return apiFetch(`${BASE_URL}/auth`, {
      method: 'POST',
      body: formData,
    });
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return apiFetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      body: { email },
    });
  },

  resetPassword: async (token: string, new_password: string): Promise<{ message: string }> => {
    return apiFetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      body: { token, new_password },
    });
  },
  
};