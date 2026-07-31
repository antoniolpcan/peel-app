import { useState } from 'react';
import type { PostResponse } from '@/services/types';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/hooks/useUsers';
import { useComments } from '@/hooks/usePosts';
import { CommentItem } from './CommentItem';
import { UserAvatar } from './UserAvatar';

interface ViewPostModalProps {
  post: PostResponse;
  onClose: () => void;
  handleLike: (id: number) => Promise<void>;
}

export function ViewPostModal({ post, onClose, handleLike }: ViewPostModalProps) {
  const { isAuthenticated } = useAuth();
  const { user } = useUser(post.user_id);
  const { comments, loading: isLoadingComments, createComment } = useComments(post.id);

  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLikeClick = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      await handleLike(post.id);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    const added = await createComment(newComment);
    if (added) {
      setNewComment('');
    }
    setIsSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-6 max-w-2xl w-full relative shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
        >
          ✕
        </button>

        <div className="overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-6">
          <div
            className="rounded-2xl p-6 shadow-sm border border-black/5 flex flex-col gap-3 transition-colors"
            style={{
              backgroundColor: post.color ? post.color.hex_code : '#FEF9C3',
            }}
          >
            <div className="flex items-center gap-3">
              <UserAvatar
                name={user?.name}
                avatar={user?.avatar}
                sizeClass="w-12 h-12"
                textSizeClass="text-xs"
              />
              <div className="flex flex-col">
                <span className="font-bold text-sm text-slate-800 leading-tight">
                  {user?.name || 'Carregando...'}
                </span>
                {user?.username && (
                  <span className="text-xs text-slate-600/80">@{user.username}</span>
                )}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mt-1">{post.title}</h2>
            <p className="text-slate-700 text-base whitespace-pre-wrap leading-relaxed">
              {post.body}
            </p>

            <div className="flex justify-between items-center text-xs text-slate-600/70 pt-3 border-t border-black/5 mt-2">
              <span>{new Date(post.created_at || '').toLocaleDateString()}</span>
              
              <button
                onClick={handleLikeClick}
                disabled={isLiking}
                className="flex items-center gap-1.5 hover:scale-110 active:scale-95 transition-transform cursor-pointer bg-white/60 px-3 py-1 rounded-full border border-black/5 shadow-2xs text-slate-800 font-medium disabled:opacity-50"
              >
                <span>📌</span> {post.likes ?? 0}
              </button>
            </div>
          </div>

          <div className="px-2">
            <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <span>💬</span> Comentários {!isLoadingComments && `(${comments.length})`}
            </h3>

            {isLoadingComments ? (
              <div className="flex justify-center items-center py-6">
                <p className="text-sm text-slate-400 italic animate-pulse">
                  Carregando comentários...
                </p>
              </div>
            ) : comments.length === 0 ? (
              <p className="text-sm text-slate-400 italic py-2">
                Ninguém comentou ainda. Seja o primeiro a colar uma nota aqui!
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 shrink-0">
          {isAuthenticated ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Adicione um comentário..."
                className="grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-sm transition-all"
              />
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 transition-all cursor-pointer shadow-xs shadow-indigo-100"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          ) : (
            <p className="text-sm text-center text-slate-400">
              Faça login para deixar um comentário.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}