import { useState, useCallback } from 'react';
import { authService } from '@/services/authService';
import { parseApiError } from '@/utils/errorParser';
import type { Token } from '@/services/types';

export function useAuthApi() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const executeLogin = useCallback(
    async (username: string, password: string): Promise<Token | null> => {
      try {
        setLoading(true);
        setError(null);
        return await authService.login(username, password);
      } catch (err: unknown) {
        const errorMessage = parseApiError(err);
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const executeSendMailVerification = useCallback(
    async (email: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        await authService.sendMailVerification(email);
        return true;
      } catch (err: unknown) {
        const errorMessage = parseApiError(err);
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const executeForgotPassword = useCallback(
    async (email: string): Promise<boolean> => {
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
    },
    []
  );

  const executeResetPassword = useCallback(
    async (token: string, newPassword: string): Promise<boolean> => {
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
    },
    []
  );

  return {
    executeLogin,
    executeSendMailVerification,
    executeForgotPassword,
    executeResetPassword,
    loading,
    error,
    clearError,
  };
}