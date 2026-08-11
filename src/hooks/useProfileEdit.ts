import { useState, useCallback, useEffect } from 'react';
import { useUserActions } from '@/hooks/useUsers';
import { useStorage } from '@/hooks/useStorage';
import { useToast } from '@/contexts/ToastContext';
import type { BasicUserResponse } from '@/services/types';

export function useProfileEdit(user: BasicUserResponse | null, onUpdateSuccess: () => void) {
  const { updateMe, loading: isUpdating } = useUserActions();
  const { uploadImage, uploading: isUploadingImage } = useStorage();
  const { addToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', bio: '', username: '' });
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const revokeBlobUrl = (url: string | null) => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  };

  const startEditing = useCallback(() => {
    if (user) {
      setEditForm({ 
        name: user.name || '', 
        bio: user.bio || '', 
        username: user.username || '' 
      });
      setSelectedAvatarId(user.avatar?.id || null);
      setAvatarPreview(user.avatar?.url || null);
      setIsEditing(true);
    }
  }, [user]);

  const cancelEditing = useCallback(() => {
    revokeBlobUrl(tempImageSrc);
    if (avatarPreview && avatarPreview !== user?.avatar?.url) {
      revokeBlobUrl(avatarPreview);
    }

    setTempImageSrc(null);
    setAvatarPreview(user?.avatar?.url || null);
    setIsEditing(false);
  }, [tempImageSrc, avatarPreview, user]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTempImageSrc((prev) => {
      revokeBlobUrl(prev);
      return URL.createObjectURL(file);
    });

    e.target.value = '';
  }, []);

  const handleCropComplete = useCallback(async (croppedFile: File) => {
    setTempImageSrc((prev) => {
      revokeBlobUrl(prev);
      return null;
    });

    const localPreviewUrl = URL.createObjectURL(croppedFile);
    setAvatarPreview((prev) => {
      if (prev !== user?.avatar?.url) revokeBlobUrl(prev);
      return localPreviewUrl;
    });

    try {
      const res = await uploadImage(croppedFile);
      const mediaData = res?.data;

      if (mediaData?.id) {
        setSelectedAvatarId(mediaData.id);
        if (mediaData.url) {
          revokeBlobUrl(localPreviewUrl);
          setAvatarPreview(mediaData.url);
        }
      } else {
        throw new Error('Upload sem dados válidos.');
      }
    } catch {
      addToast('Erro ao enviar a imagem. Tente novamente.', 'error');
      revokeBlobUrl(localPreviewUrl);
      setAvatarPreview(user?.avatar?.url || null);
    }
  }, [uploadImage, addToast, user]);

  const handleUpdate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await updateMe({
      name: editForm.name,
      bio: editForm.bio,
      username: editForm.username.trim() !== '' ? editForm.username : null,
      avatar_id: selectedAvatarId,
    });

    if (updated) {
      setIsEditing(false);
      onUpdateSuccess();
      addToast('Perfil atualizado com sucesso!', 'success');
    } else {
      addToast('Erro ao atualizar perfil. Tente novamente.', 'error');
    }
  }, [editForm, selectedAvatarId, updateMe, onUpdateSuccess, addToast]);

  useEffect(() => {
    return () => {
      revokeBlobUrl(tempImageSrc);
      if (avatarPreview && avatarPreview !== user?.avatar?.url) {
        revokeBlobUrl(avatarPreview);
      }
    };
  }, [tempImageSrc, avatarPreview, user]);

  return {
    isEditing,
    startEditing,
    cancelEditing,
    editForm,
    setEditForm,
    tempImageSrc,
    setTempImageSrc,
    avatarPreview,
    isUpdating,
    isUploadingImage,
    handleFileChange,
    handleCropComplete,
    handleUpdate,
  };
}