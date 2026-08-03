import React from 'react';

interface AvatarUploaderProps {
  avatarPreview: string | null;
  isUploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AvatarUploader({ avatarPreview, isUploading, onFileChange }: AvatarUploaderProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Foto de Perfil</label>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Preview do Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs">Sem foto</span>
          )}
        </div>

        <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
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