import { useState } from 'react';
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

  const startEditing = () => {
    if (user) {
      setEditForm({ name: user.name || '', bio: user.bio || '', username: user.username || '' });
      setSelectedAvatarId(user.avatar?.id || null);
      setAvatarPreview(user.avatar?.url || null);
      setIsEditing(true);
    }
  };

  const cancelEditing = () => setIsEditing(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTempImageSrc(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleCropComplete = async (croppedFile: File) => {
    setTempImageSrc(null);
    setAvatarPreview(URL.createObjectURL(croppedFile));

    const res = (await uploadImage(croppedFile)) as any;
    const mediaData = res?.data || res;

    if (mediaData?.id) {
      setSelectedAvatarId(mediaData.id);
      if (mediaData.url) setAvatarPreview(mediaData.url);
    } else {
      addToast('Erro ao enviar a imagem. Tente novamente.', 'error');
      setAvatarPreview(user?.avatar?.url || null);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
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
  };

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