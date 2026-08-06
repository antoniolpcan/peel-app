import { BASE_URL, apiFetch } from './apiClient';
import type { Token } from './types';

export const authService = {
  login: async (username: string, password: string): Promise<Token> => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    return apiFetch<Token>(`${BASE_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
  },
};