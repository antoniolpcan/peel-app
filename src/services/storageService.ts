import { apiFetch } from './apiClient';
import type { UploadResponse } from './types';

export const storageService = {
  uploadImage: async (file: File): Promise<UploadResponse> => {
    const MAX_SIZE_MB = 5;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      throw new Error(`A imagem excede o tamanho máximo permitido de ${MAX_SIZE_MB}MB.`);
    }

    const formData = new FormData();
    formData.append('file', file);

    return apiFetch<UploadResponse>('/storage/upload', {
      method: 'POST',
      body: formData
    });
  },
};