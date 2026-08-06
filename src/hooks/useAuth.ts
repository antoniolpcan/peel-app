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

  return { executeLogin, loading, error, clearError };
}