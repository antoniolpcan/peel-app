import React from 'react';

interface AvatarUploaderProps {
  avatarPreview: string | null;
  isUploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AvatarUploader({ avatarPreview, isUploading, onFileChange }: AvatarUploaderProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-app-text mb-2 transition-colors">
        Foto de Perfil
      </label>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-app-bg border border-app-border flex items-center justify-center text-app-muted shrink-0 transition-colors">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Preview do Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs">Sem foto</span>
          )}
        </div>

        <label className="cursor-pointer bg-app-bg hover:opacity-80 text-app-text px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-app-border">
          {isUploading ? 'Enviando foto...' : 'Alterar Foto'}
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}