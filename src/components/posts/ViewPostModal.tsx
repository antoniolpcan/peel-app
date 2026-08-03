import { useState } from 'react';
import type { PostResponse } from '@/services/types';
import { useAuth } from '@/contexts/AuthContext';
import { useComments } from '@/hooks/usePosts';

import { ModalLayout } from '@/components/ui/ModalLayout';
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

export function ViewPostModal({ post, onClose, handleLike }: ViewPostModalProps) {
  const { isAuthenticated } = useAuth();
  const { comments, loading: isLoadingComments, createComment } = useComments(post.id);
  const [isLiking, setIsLiking] = useState(false);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking) return;
    try {
      setIsLiking(true);
      await handleLike(post.id);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <ModalLayout onClose={onClose} maxWidthClass="max-w-2xl">
      <div className="overflow-y-visible flex flex-col gap-6">
        <PostItNote hexCode={post.color?.hex_code} className="shadow-xs flex flex-col gap-3">
          <UserBadge userId={post.user_id} onNavigate={onClose} />

          <h2 className="text-2xl font-bold text-slate-800 mt-1">{post.title}</h2>
          <p className="text-slate-700 text-base whitespace-pre-wrap leading-relaxed">{post.body}</p>

          <div className="flex justify-between items-center text-xs text-slate-600/70 pt-3 border-t border-black/5 mt-2">
            <span>{new Date(post.created_at || '').toLocaleDateString()}</span>
            <LikeButton likes={post.likes ?? 0} onClick={handleLikeClick} disabled={isLiking} variant="modal" />
          </div>
        </PostItNote>

        <div className="px-2 overflow-visible">
          <h3 className="font-bold text-app-text text-base mb-4 flex items-center gap-2 transition-colors">
            <span>💬</span> Comentários {!isLoadingComments && `(${comments.length})`}
          </h3>
          <CommentList comments={comments} isLoading={isLoadingComments} onNavigate={onClose} />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-app-border shrink-0 transition-colors">
        {isAuthenticated ? (
          <CommentForm onSubmitComment={async (text) => Boolean(await createComment(text))} />
        ) : (
          <p className="text-sm text-center text-app-muted">
            Faça login para deixar um comentário.
          </p>
        )}
      </div>
    </ModalLayout>
  );
}