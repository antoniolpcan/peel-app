import React, { memo } from 'react';
import { Camera, Loader2, User } from 'lucide-react';

interface AvatarUploaderProps {
  avatarPreview: string | null;
  isUploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AvatarUploader = memo(function AvatarUploader({
  avatarPreview,
  isUploading,
  onFileChange,
}: AvatarUploaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-medium text-app-text transition-colors">
        Foto de Perfil
      </label>

      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-app-bg border border-app-border flex items-center justify-center text-app-muted shrink-0 transition-colors shadow-xs">
          {avatarPreview ? (
            <img 
              src={avatarPreview} 
              alt="Preview do Avatar" 
              className="w-full h-full object-cover" 
            />
          ) : (
            <User className="w-7 h-7 text-app-muted/70" />
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            </div>
          )}
        </div>

        <label 
          className={`inline-flex items-center gap-2 bg-app-bg hover:bg-app-card text-app-text px-4 py-2.5 rounded-xl text-sm font-medium transition-all border border-app-border cursor-pointer active:scale-95 shadow-xs focus-within:ring-2 focus-within:ring-app-accent/50 ${
            isUploading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-app-accent" />
              <span>Enviando foto...</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 text-app-accent" />
              <span>Alterar Foto</span>
            </>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            disabled={isUploading}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
});