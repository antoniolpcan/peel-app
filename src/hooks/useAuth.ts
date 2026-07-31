import { useState } from 'react';
import { authService } from '@/services/authService';

export function useAuthApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeLogin = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.login(username, password);
      return data;
    } catch (err: any) {
      let message = err.message || 'Erro ao realizar login';

      if (message === 'Failed to fetch' || err.name === 'TypeError') {
        message = 'Não foi possível conectar ao servidor. Verifique sua conexão ou se o servidor está online.';
      }

      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { executeLogin, loading, error };
}