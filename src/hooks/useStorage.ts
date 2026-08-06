import { useState, useCallback } from 'react';
import { storageService } from '@/services/storageService';
import type { UploadResponse } from '@/services/types';

export function useStorage() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(async (file: File): Promise<UploadResponse | null> => {
    let isMounted = true;

    try {
      setUploading(true);
      setError(null);
      const data = await storageService.uploadImage(file);
      return data;
    } catch (err: any) {
      if (isMounted) {
        setError(err.message || 'Erro ao fazer upload da imagem.');
      }
      return null;
    } finally {
      if (isMounted) {
        setUploading(false);
      }
    }
  }, []);

  return { uploadImage, uploading, error };
}