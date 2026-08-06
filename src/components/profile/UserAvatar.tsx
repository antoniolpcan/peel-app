import { useState, memo } from 'react';
import type { MediaFileBase } from '@/services/types';

interface UserAvatarProps {
  name?: string;
  avatar?: MediaFileBase | string | null;
  sizeClass?: string;
  textSizeClass?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  xs: { box: 'w-7 h-7', text: 'text-[10px]' },
  sm: { box: 'w-9 h-9', text: 'text-xs' },
  md: { box: 'w-11 h-11', text: 'text-sm' },
  lg: { box: 'w-16 h-16', text: 'text-xl' },
  xl: { box: 'w-24 h-24', text: 'text-3xl' },
};

export const UserAvatar = memo(function UserAvatar({
  name = '?',
  avatar,
  sizeClass,
  textSizeClass,
  size = 'md',
}: UserAvatarProps) {
  const [hasError, setHasError] = useState(false);

  const avatarUrl = typeof avatar === 'string' ? avatar : avatar?.url;

  const initial = (name.trim().charAt(0) || '?').toUpperCase();
  const finalSizeClass = sizeClass || sizeMap[size]?.box || sizeMap.md.box;
  const finalTextSizeClass = textSizeClass || sizeMap[size]?.text || sizeMap.md.text;

  if (avatarUrl && !hasError) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        onError={() => setHasError(true)}
        className={`${finalSizeClass} rounded-full object-cover border border-black/10 shadow-xs shrink-0 transition-all`}
      />
    );
  }

  return (
    <div
      className={`${finalSizeClass} ${finalTextSizeClass} bg-app-accent text-app-accent-text rounded-full flex items-center justify-center font-bold shadow-xs shrink-0 select-none transition-colors`}
    >
      {initial}
    </div>
  );
});