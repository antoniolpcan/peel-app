import React, { useCallback, memo } from 'react';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import { AvatarUploader } from './AvatarUploader';

interface ProfileEditFormProps {
  editForm: { name: string; username: string; bio: string };
  setEditForm: React.Dispatch<React.SetStateAction<{ name: string; username: string; bio: string }>>;
  avatarPreview: string | null;
  isUploadingImage: boolean;
  isUpdating: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const ProfileEditForm = memo(function ProfileEditForm({
  editForm,
  setEditForm,
  avatarPreview,
  isUploadingImage,
  isUpdating,
  onFileChange,
  onSubmit,
  onCancel,
}: ProfileEditFormProps) {
  const isSubmitting = isUpdating || isUploadingImage;

  const handleInputChange = useCallback(
    (field: keyof typeof editForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEditForm((prev) => ({ ...prev, [field]: e.target.value }));
    },
    [setEditForm]
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 border-t border-app-border pt-6 transition-colors">
      <AvatarUploader
        avatarPreview={avatarPreview}
        isUploading={isUploadingImage}
        onFileChange={onFileChange}
      />

      <div>
        <label htmlFor="edit-name" className="block text-sm font-medium text-app-text mb-1 transition-colors">
          Nome
        </label>
        <Input
          id="edit-name"
          type="text"
          value={editForm.name}
          onChange={handleInputChange('name')}
          disabled={isSubmitting}
          required
        />
      </div>

      <div>
        <label htmlFor="edit-username" className="block text-sm font-medium text-app-text mb-1 transition-colors">
          Username
        </label>
        <Input
          id="edit-username"
          type="text"
          value={editForm.username}
          onChange={handleInputChange('username')}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="edit-bio" className="block text-sm font-medium text-app-text mb-1 transition-colors">
          Bio
        </label>
        <TextArea
          id="edit-bio"
          value={editForm.bio}
          onChange={handleInputChange('bio')}
          disabled={isSubmitting}
          className="h-24 resize-none"
          placeholder="Fale um pouco sobre você..."
        />
      </div>

      <div className="flex gap-3 justify-end mt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-2 rounded-xl font-medium text-app-muted hover:text-app-text transition-colors cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          loadingText="Salvando..."
          disabled={isSubmitting}
          className="px-6 py-2 text-sm mt-0 shadow-none"
        >
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
});