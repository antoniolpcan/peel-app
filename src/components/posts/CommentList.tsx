import type { CommentResponse } from '@/services/types';
import { CommentItem } from './CommentItem';

interface CommentListProps {
  comments: CommentResponse[];
  isLoading: boolean;
  onNavigate?: () => void;
}

export function CommentList({ comments, isLoading, onNavigate }: CommentListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-6">
        <p className="text-sm text-slate-400 italic animate-pulse">
          Carregando comentários...
        </p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <p className="text-sm text-slate-400 italic py-2">
        Ninguém comentou ainda. Seja o primeiro a colar uma nota aqui!
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} onNavigate={onNavigate} />
      ))}
    </div>
  );
}