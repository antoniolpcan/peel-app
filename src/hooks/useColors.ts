import { useEffect, useState } from 'react';
import { colorService } from '@/services/colorService';
import type { ColorResponse } from '@/services/types';

export function useColors() {
  const [colors, setColors] = useState<ColorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchColors() {
      try {
        setLoading(true);
        setError(null);
        const data = await colorService.getColors();
        setColors(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar cores');
      } finally {
        setLoading(false);
      }
    }

    fetchColors();
  }, []);

  return { colors, loading, error };
}