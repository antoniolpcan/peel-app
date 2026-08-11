import { useState, useCallback } from 'react';
import { storageService } from '@/services/storageService';
import type { UploadResponse } from '@/services/types';
import { parseApiError } from '@/utils/errorParser';

export function useStorage() {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const uploadImage = useCallback(async (file: File): Promise<UploadResponse | null> => {
    try {
      setUploading(true);
      setError(null);
      return await storageService.uploadImage(file);
    } catch (err: unknown) {
      const message = parseApiError(err) || 'Erro ao fazer upload da imagem.';
      setError(message);
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  return { 
    uploadImage, 
    uploading, 
    error, 
    clearError 
  };
}