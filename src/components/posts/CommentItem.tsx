import { memo } from 'react';
import type { CommentResponse } from '@/services/types';
import { UserBadge } from '@/components/profile/UserBadge';
import { formatRelativeDate } from '@/utils/formatDate';

interface CommentItemProps {
  comment: CommentResponse;
  onNavigate?: () => void;
  postColorHex?: string;
  index?: number;
}

export const CommentItem = memo(function CommentItem({ 
  comment, 
  onNavigate,
  postColorHex,
  index = 0 
}: CommentItemProps) {
  const formattedContent = comment.content?.trim();
  const hasCustomColor = Boolean(postColorHex);

  const isEven = index % 2 === 0;
  const rotationClass = isEven ? '-rotate-1' : 'rotate-[1deg]';

  return (
    <div 
      style={hasCustomColor ? { backgroundColor: postColorHex } : undefined}
      className={`
        flex flex-col gap-1.5 p-4 relative 
        transition-all duration-300 ease-out origin-center
        ${hasCustomColor 
          ? `border border-black/5 shadow-md ${rotationClass} rounded-sm rounded-br-2xl hover:rotate-0 hover:scale-[1.02] hover:shadow-lg hover:z-10` 
          : 'bg-app-card border border-app-border rounded-2xl'
        }
      `}
    >
      
      {hasCustomColor && (
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-white/30 shadow-sm rotate-1 backdrop-blur-sm" />
      )}

      <div className="flex justify-between items-start">
        <UserBadge 
          userId={comment.user_id} 
          user={comment.user} 
          onNavigate={onNavigate} 
        />
        {comment.created_at && (
          <span className={`text-[11px] shrink-0 ml-2 font-medium ${
            hasCustomColor ? 'text-slate-700/80' : 'text-app-muted'
          }`}>
            {formatRelativeDate(comment.created_at)}
          </span>
        )}
      </div>
      <p className={`text-sm whitespace-pre-wrap leading-relaxed wrap-break-word px-0.5 mt-1 transition-colors font-medium ${
        hasCustomColor ? 'text-slate-800' : 'text-app-text'
      }`}>
        {formattedContent}
      </p>
    </div>
  );
});