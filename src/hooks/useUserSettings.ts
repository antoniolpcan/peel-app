import { userSettingsService, type UserSettingResponse, type UserSettingUpdate } from '@/services';
import { useState, useCallback, useEffect } from 'react';

export const useUserSettings = (autoFetch = true) => {
  const [settings, setSettings] = useState<UserSettingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    
    try {
      const data = await userSettingsService.getMySettings();
      if (isMounted) {
        setSettings(data);
      }
    } catch (err: any) {
      if (isMounted) {
        setError(err.message || 'Erro ao carregar configurações.');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }

    return () => { isMounted = false; };
  }, []);

  const updateSettings = useCallback(async (data: UserSettingUpdate) => {
    let previousSettings: UserSettingResponse | null = null;

    setSettings((prev) => {
      previousSettings = prev;
      if (!prev) return prev;
      return { ...prev, ...data } as UserSettingResponse;
    });

    setLoading(true);
    setError(null);

    try {
      const updated = await userSettingsService.updateMySettings(data);
      setSettings(updated);
      return updated;
    } catch (err: any) {
      setSettings(previousSettings);
      setError(err.message || 'Erro ao atualizar configurações.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchSettings();
    }
  }, [autoFetch, fetchSettings]);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
  };
};