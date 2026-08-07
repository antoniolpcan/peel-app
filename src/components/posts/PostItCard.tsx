import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import type { PostResponse } from '@/services/types';
import { useAuth } from '@/contexts/AuthContext';
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
  showTape?: boolean;
}

export const PostItCard = memo(function PostItCard({
  post,
  rotateClass = '',
  onClick,
  onLike,
  onDelete,
  showTape = true,
}: PostItCardProps) {
  const { loggedUserId } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const isOwner = loggedUserId === post.user_id;
  const backgroundColor = post.color?.hex_code || '#FEF08A';

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);

    timeoutRef.current = setTimeout(() => {
      onDelete(e, post.id);
    }, 400);
  }, [post.id, onDelete]);

  const handleLikeClick = useCallback((e: React.MouseEvent) => {
    onLike(e, post.id);
  }, [post.id, onLike]);

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
      {showTape && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/40 shadow-xs -rotate-1 backdrop-blur-xs rounded-xs pointer-events-none border border-white/20 z-10" />
      )}

      <UserBadge userId={post.user_id} user={post.user} />

      <h2 className="text-xl font-bold mb-2 text-slate-900 leading-snug">
        {post.title}
      </h2>

      <p className="text-slate-800/90 grow whitespace-pre-wrap line-clamp-6 text-sm leading-relaxed">
        {post.body || 'Post-it vazio...'}
      </p>

      <div className="flex justify-between items-center mt-4 text-xs text-slate-700/80 border-t border-black/10 pt-4">
        <span>{formatRelativeDate(post.created_at)}</span>

        <div className="flex gap-2 items-center">
          <LikeButton 
            likes={post.likes ?? 0} 
            isLiked={post.is_liked} 
            onClick={handleLikeClick} 
          />
          {isOwner && (
            <DeleteButton onClick={handleDeleteClick} />
          )}
        </div>
      </div>
    </div>
  );
});