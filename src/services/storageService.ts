import { BASE_URL, apiFetch } from './apiClient';
import type { UploadResponse } from './types';

export const storageService = {
  uploadImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('@peel:token');
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    return apiFetch<UploadResponse>(`${BASE_URL}/storage/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
  },
};