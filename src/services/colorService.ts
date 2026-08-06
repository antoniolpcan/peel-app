import { BASE_URL, getHeaders, apiFetch } from './apiClient';
import type { ColorResponse } from './types';

export const colorService = {
  getColors: async (): Promise<ColorResponse[]> => {
    return apiFetch<ColorResponse[]>(`${BASE_URL}/colors`, {
      headers: getHeaders(false),
    });
  },

  getColorById: async (colorId: number): Promise<ColorResponse> => {
    return apiFetch<ColorResponse>(`${BASE_URL}/colors/${colorId}`, {
      headers: getHeaders(false),
    });
  },
};