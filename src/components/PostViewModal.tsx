import { useEffect, useState } from 'react';
import type { PostResponse } from '../api/types';
import { useAuth } from '../contexts/AuthContext';
import { CommentItem } from './CommentItem';
import { usePosts } from '../hooks/usePosts';
import { useComments } from '../hooks/useComments';
import { useUser } from '../hooks/useUser';

interface ViewPostModalProps {
  post: PostResponse;
  onClose: () => void;
}

export function ViewPostModal({ post, onClose }: ViewPostModalProps) {
  const { isAuthenticated } = useAuth();
  const { handleLike } = usePosts();
  const { user, fetchUser } =  useUser()

  const { 
    comments, 
    isLoading, 
    isSubmitting, 
    fetchComments, 
    addComment 
  } = useComments(post.id);

  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addComment(newComment, () => {
      setNewComment('');
    });
  };

  useEffect(() => {
    if (post.user_id) {
      fetchUser(post.user_id);
    }
  }, [post.user_id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-[#E2E4E9] rounded-3xl p-8 max-w-2xl w-full relative shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 transition-colors"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-6 shrink-0">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
            {user ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-slate-800">
              {user ? user.name : 'Carregando...'}
            </span>
            {user?.username && (
              <span className="text-xs text-gray-500">@{user.username}</span>
            )}
          </div>
        </div>

        <div className="overflow-y-auto pr-2 custom-scrollbar">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">{post.title}</h2>
          <p className="text-gray-700 text-lg whitespace-pre-wrap mb-6">
            {post.body}
          </p>
          
          <div className="flex justify-between items-center text-sm text-gray-500 mb-6 border-b border-gray-300/50 pb-4">
            <span>{new Date(post.created_at || '').toLocaleString()}</span>
            <button onClick={() => handleLike(post.id)} className="flex items-center gap-1 hover:text-pink-500 transition-colors">
                <span>📌</span> {post.likes}
            </button>
          </div>

          <div>
            <h3 className="font-bold text-slate-800 mb-4">
              Comentários {!isLoading && `(${comments.length})`}
            </h3>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-6">
                <p className="text-sm text-gray-500 italic animate-pulse">Carregando comentários...</p>
              </div>
            ) : comments.length === 0 ? (
              <p className="text-sm text-gray-500 italic mb-4">Ninguém comentou ainda. Seja a primeira!</p>
            ) : (
              <div className="mb-6 flex flex-col gap-3">
                {comments.map(comment => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-300/50 shrink-0">
          {isAuthenticated ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input 
                type="text" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Adicione um comentário..." 
                className="grow bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-indigo-400 text-sm"
              />
              <button 
                type="submit" 
                disabled={isSubmitting || !newComment.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50 transition-colors"
              >
                Enviar
              </button>
            </form>
          ) : (
            <p className="text-sm text-center text-gray-500">
              Faça login para deixar um comentário.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}