import { useState, useCallback, useEffect } from 'react';
import { userSettingsService } from '@/services/userSettingsService';
import type { UserSettingResponse, UserSettingUpdate } from '@/services/types';
import { parseApiError } from '@/utils/errorParser';

export const useUserSettings = (autoFetch = true) => {
  const [settings, setSettings] = useState<UserSettingResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userSettingsService.getMySettings();
      setSettings(data);
    } catch (err: unknown) {
      const msg = parseApiError(err) || 'Erro ao carregar configurações.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (data: UserSettingUpdate) => {
    let previousSettings: UserSettingResponse | null = null;

    setSettings((prev) => {
      previousSettings = prev;
      if (!prev) return prev;
      return { ...prev, ...data } as UserSettingResponse;
    });

    setUpdating(true);
    setError(null);

    try {
      const updated = await userSettingsService.updateMySettings(data);
      setSettings(updated);
      return updated;
    } catch (err: unknown) {
      setSettings(previousSettings);
      const msg = parseApiError(err) || 'Erro ao atualizar configurações.';
      setError(msg);
      throw err;
    } finally {
      setUpdating(false);
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
    updating,
    error,
    fetchSettings,
    updateSettings,
  };
};