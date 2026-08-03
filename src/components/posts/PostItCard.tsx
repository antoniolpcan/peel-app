import { useState } from 'react';
import type { PostResponse } from '@/services/types';
import { formatRelativeDate } from '@/utils/formatDate';
import { LikeButton } from '@/components/ui/LikeButton';
import { DeleteButton } from '@/components/ui/DeleteButton';
import { UserBadge } from '../profile/UserBadge';

interface PostItCardProps {
  post: PostResponse;
  rotateClass?: string;
  onClick: () => void;
  onLike: (e: React.MouseEvent, id: number) => void;
  onDelete: (e: React.MouseEvent, id: number) => void;
}

export function PostItCard({ post, rotateClass = '', onClick, onLike, onDelete }: PostItCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);

    setTimeout(() => {
      onDelete(e, post.id);
    }, 400);
  };

  const backgroundColor = post.color?.hex_code || '#FEF08A';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-6 shadow-md border border-black/10 flex flex-col min-h-62.5 relative cursor-pointer 
        transition-all duration-300 hover:rotate-0 hover:scale-105 hover:shadow-2xl hover:z-20 ${rotateClass} ${
        isDeleting ? 'animate-peel pointer-events-none' : ''
      }`}
      style={{ 
        backgroundColor,
        filter: 'saturate(1.25) contrast(1.05)',
      }}
    >
      <UserBadge userId={post.user_id} />

      <h2 className="text-xl font-bold mb-2 text-slate-900 leading-snug">
        {post.title}
      </h2>

      <p className="text-slate-800/90 grow whitespace-pre-wrap line-clamp-6 text-sm leading-relaxed">
        {post.body || 'Post-it vazio...'}
      </p>

      <div className="flex justify-between items-center mt-4 text-xs text-slate-700/80 border-t border-black/10 pt-4">
        <span>{formatRelativeDate(post.created_at)}</span>

        <div className="flex gap-4">
          <LikeButton likes={post.likes ?? 0} onClick={(e) => onLike(e, post.id)} />
          <DeleteButton onClick={handleDeleteClick} />
        </div>
      </div>
    </div>
  );
}