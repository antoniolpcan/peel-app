import type { MediaFileBase } from '@/services/types';

interface UserAvatarProps {
  name?: string;
  avatar?: MediaFileBase | null;
  sizeClass?: string;
  textSizeClass?: string;
}

export function UserAvatar({
  name = '?',
  avatar,
  sizeClass = 'w-10 h-10',
  textSizeClass = 'text-base',
}: UserAvatarProps) {
  const initial = name.charAt(0).toUpperCase();

  if (avatar?.url) {
    return (
      <img
        src={avatar.url}
        alt={name}
        className={`${sizeClass} rounded-full object-cover border-2 border-indigo-100 shadow-xs shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} ${textSizeClass} bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold shadow-inner shrink-0 select-none`}
    >
      {initial}
    </div>
  );
}