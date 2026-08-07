import { memo } from 'react';
import type { CommentResponse } from '@/services/types';
import { CommentItem } from './CommentItem';

interface CommentListProps {
  comments: CommentResponse[];
  isLoading: boolean;
  onNavigate?: () => void;
  postColorHex?: string;
}

export const CommentList = memo(function CommentList({ 
  comments, 
  isLoading, 
  onNavigate,
  postColorHex
}: CommentListProps) {

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className="p-3.5 bg-app-bg/50 rounded-2xl border border-app-border/50 animate-pulse flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-app-border shrink-0" />
              <div className="w-20 h-3 bg-app-border rounded" />
            </div>
            <div className="w-3/4 h-3 bg-app-border/60 rounded mt-1" />
          </div>
        ))}
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-sm text-app-muted italic">
          Ninguém comentou ainda. Seja o primeiro a colar uma nota aqui!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-2 items-start">
      {comments.map((comment, index) => (
        <CommentItem 
          key={comment.id || `comment-${index}`} 
          comment={comment} 
          index={index} 
          onNavigate={onNavigate} 
          postColorHex={postColorHex}
        />
      ))}
    </div>
  );
});