import { useState } from 'react';
import { storageService } from '@/services/storageService';

export function useStorage() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      setError(null);
      return await storageService.uploadImage(file);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload da imagem');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error };
}