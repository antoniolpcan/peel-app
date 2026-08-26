import { apiFetch } from './apiClient';
import type { Token } from './types';

export const authService = {
  login: async (username: string, password: string): Promise<Token> => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    return apiFetch<Token>('/auth', {
      method: 'POST',
      body: formData,
      skipUnauthorizedEvent: true,
    });
  },

  sendMailVerification: async (email: string): Promise<{ message: string }> => {
    return apiFetch<{ message: string }>('/auth/send-mail-verification', {
      method: 'POST',
      body: { email },
    });
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return apiFetch<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
  },

  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    return apiFetch<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: { 
        token, 
        new_password: newPassword
      },
    });
  },

  logout: async (): Promise<{ message: string }> => {
    return apiFetch<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  },
  
};