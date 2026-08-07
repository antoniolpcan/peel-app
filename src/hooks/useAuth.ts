import { useState, useCallback } from 'react';
import { authService } from '@/services/authService';
import { parseApiError } from '@/utils/errorParser';
import type { Token } from '@/services/types';

export function useAuthApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const executeLogin = useCallback(async (username: string, password: string): Promise<Token | null> => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.login(username, password);
      return data;
    } catch (err: unknown) {
      const errorMessage = parseApiError(err);
      setError(errorMessage); 
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const executeForgotPassword = useCallback(async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await authService.forgotPassword(email);
      return true;
    } catch (err: unknown) {
      const errorMessage = parseApiError(err);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const executeResetPassword = useCallback(async (token: string, newPassword: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await authService.resetPassword(token, newPassword);
      return true;
    } catch (err: unknown) {
      const errorMessage = parseApiError(err);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    executeLogin,
    executeForgotPassword,
    executeResetPassword,
    loading,
    error,
    clearError,
  };
}