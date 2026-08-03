import React from 'react';
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

export function ProfileEditForm({
  editForm,
  setEditForm,
  avatarPreview,
  isUploadingImage,
  isUpdating,
  onFileChange,
  onSubmit,
  onCancel,
}: ProfileEditFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 border-t border-app-border pt-6 transition-colors">
      <AvatarUploader
        avatarPreview={avatarPreview}
        isUploading={isUploadingImage}
        onFileChange={onFileChange}
      />

      <div>
        <label className="block text-sm font-medium text-app-text mb-1 transition-colors">Nome</label>
        <Input
          type="text"
          value={editForm.name}
          onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-app-text mb-1 transition-colors">Username</label>
        <Input
          type="text"
          value={editForm.username}
          onChange={(e) => setEditForm((prev) => ({ ...prev, username: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-app-text mb-1 transition-colors">Bio</label>
        <TextArea
          value={editForm.bio}
          onChange={(e) => setEditForm((prev) => ({ ...prev, bio: e.target.value }))}
          className="h-24"
          placeholder="Fale um pouco sobre você..."
        />
      </div>

      <div className="flex gap-3 justify-end mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 rounded-xl font-medium text-app-muted hover:text-app-text transition-colors cursor-pointer text-sm"
        >
          Cancelar
        </button>
        <Button
          type="submit"
          isLoading={isUpdating || isUploadingImage}
          loadingText="Salvando..."
          className="px-6 py-2 text-sm mt-0 shadow-none"
        >
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
}