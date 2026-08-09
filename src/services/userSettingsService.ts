import { BASE_URL, getHeaders, apiFetch } from './apiClient';
import type { UserSettingResponse, UserSettingUpdate } from './types';

export const userSettingsService = {
  getMySettings: async (): Promise<UserSettingResponse> => {
    return apiFetch<UserSettingResponse>(`${BASE_URL}/user_settings/`, {
      headers: getHeaders(true),
    });
  },

  updateMySettings: async (data: UserSettingUpdate): Promise<UserSettingResponse> => {
    return apiFetch<UserSettingResponse>(`${BASE_URL}/user_settings/`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: {data},
    });
  },
};