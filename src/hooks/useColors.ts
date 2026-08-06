import { useEffect, useState, useCallback } from 'react';
import { colorService } from '@/services/colorService';
import type { ColorResponse } from '@/services/types';

export function useColors() {
  const [colors, setColors] = useState<ColorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchColors = useCallback(async () => {
    let isMounted = true;

    try {
      setLoading(true);
      setError(null);
      const data = await colorService.getColors();
      
      if (isMounted) {
        setColors(data);
      }
    } catch (err: any) {
      if (isMounted) {
        setError(err.message || 'Erro ao buscar cores.');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await colorService.getColors();
        if (isMounted) {
          setColors(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Erro ao buscar cores.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  return { colors, loading, error, refetch: fetchColors };
}