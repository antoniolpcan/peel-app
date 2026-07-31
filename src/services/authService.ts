
import { BASE_URL, handleResponse } from './apiClient';
import type { Token } from './types';;

export const authService = {
  login: async (username: string, password: string): Promise<Token> => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${BASE_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });

    return handleResponse<Token>(response);
  },
};