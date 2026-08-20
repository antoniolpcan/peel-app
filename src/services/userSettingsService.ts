import { apiFetch } from './apiClient';
import type { UserSettingResponse, UserSettingUpdate } from './types';

export const userSettingsService = {
  getMySettings: async (): Promise<UserSettingResponse> => {
    return apiFetch<UserSettingResponse>('/user_settings/', {});
  },

  updateMySettings: async (data: UserSettingUpdate): Promise<UserSettingResponse> => {
    return apiFetch<UserSettingResponse>('/user_settings/', {
      method: 'PATCH',
      body: data
    });
  },
};