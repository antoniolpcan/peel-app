import { apiFetch } from './apiClient';
import type { ColorResponse } from './types';

export const colorService = {
  getColors: async (): Promise<ColorResponse[]> => {
    return apiFetch<ColorResponse[]>('/colors');
  },

  getColorById: async (colorId: number): Promise<ColorResponse> => {
    return apiFetch<ColorResponse>(`/colors/${colorId}`);
  },
};