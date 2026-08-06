import React, { useState, useCallback, memo } from 'react';
import { MessageSquare } from 'lucide-react';
import type { PostResponse } from '@/services/types';
import { useAuth } from '@/contexts/AuthContext';
import { useComments } from '@/hooks/usePosts';
import { formatRelativeDate } from '@/utils/formatDate';

import { ModalLayout } from '@/components/layout/ModalLayout';
import { PostItNote } from '@/components/ui/PostItNote';
import { LikeButton } from '@/components/ui/LikeButton';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import { UserBadge } from '../profile/UserBadge';

interface ViewPostModalProps {
  post: PostResponse;
  onClose: () => void;
  handleLike: (id: number) => Promise<PostResponse | null>;
}

export const ViewPostModal = memo(function ViewPostModal({ 
  post, 
  onClose, 
  handleLike 
}: ViewPostModalProps) {
  const { isAuthenticated } = useAuth();
  const { comments, loading: isLoadingComments, createComment } = useComments(post.id);
  const [isLiking, setIsLiking] = useState(false);

  const handleLikeClick = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking) return;

    let isMounted = true;

    try {
      setIsLiking(true);
      await handleLike(post.id);
    } finally {
      if (isMounted) {
        setIsLiking(false);
      }
    }

    return () => { isMounted = false; };
  }, [isLiking, handleLike, post.id]);

  const handleSubmitComment = useCallback(async (text: string) => {
    const comment = await createComment(text);
    return Boolean(comment);
  }, [createComment]);

  return (
    <ModalLayout onClose={onClose} maxWidthClass="max-w-2xl">
      <div className="flex flex-col gap-6">
        
        <PostItNote hexCode={post.color?.hex_code} className="shadow-xs flex flex-col gap-3">
          <UserBadge userId={post.user_id} user={post.user} onNavigate={onClose} />

          <h2 className="text-2xl font-bold text-slate-800 mt-1">{post.title}</h2>
          <p className="text-slate-700 text-base whitespace-pre-wrap leading-relaxed">{post.body}</p>

          <div className="flex justify-between items-center text-xs text-slate-600/70 pt-3 border-t border-black/5 mt-2">
            <span>{post.created_at ? formatRelativeDate(post.created_at) : ''}</span>
            <LikeButton 
              likes={post.likes ?? 0} 
              isLiked={post.is_liked} 
              onClick={handleLikeClick} 
              disabled={isLiking} 
              variant="modal" 
            />
          </div>
        </PostItNote>

        <div className="px-2">
          <h3 className="font-bold text-app-text text-base mb-4 flex items-center gap-2 transition-colors">
            <MessageSquare className="w-4 h-4 text-app-accent" />
            <span>Comentários {!isLoadingComments && `(${comments.length})`}</span>
          </h3>
          <CommentList comments={comments} isLoading={isLoadingComments} onNavigate={onClose} />
        </div>

        <div className="pt-4 border-t border-app-border shrink-0 bg-app-card transition-colors sticky -bottom-6 -mx-6 px-6 pb-6 z-30">
          {isAuthenticated ? (
            <CommentForm onSubmitComment={handleSubmitComment} />
          ) : (
            <p className="text-sm text-center text-app-muted py-2">
              Faça login para deixar um comentário.
            </p>
          )}
        </div>

      </div>
    </ModalLayout>
  );
});