import { BASE_URL, getHeaders, handleResponse } from './apiClient';
import type { ColorResponse } from './types';;

export const colorService = {
  getColors: async (): Promise<ColorResponse[]> => {
    const response = await fetch(`${BASE_URL}/colors`, {
      headers: getHeaders(false),
    });
    return handleResponse<ColorResponse[]>(response);
  },

  getColorById: async (colorId: number): Promise<ColorResponse> => {
    const response = await fetch(`${BASE_URL}/colors/${colorId}`, {
      headers: getHeaders(false),
    });
    return handleResponse<ColorResponse>(response);
  },
};