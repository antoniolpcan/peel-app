import type { CommentResponse } from '@/services/types';
import { UserBadge } from '@/components/profile/UserBadge';
import { formatRelativeDate } from '@/utils/formatDate';

interface CommentItemProps {
  comment: CommentResponse;
  onNavigate?: () => void;
}

export function CommentItem({ comment, onNavigate }: CommentItemProps) {
  return (
    <div className="flex flex-col gap-1 p-3.5 bg-app-bg rounded-2xl border 
      border-app-border relative transition-colors">
      <div className="flex justify-between items-start">
        <UserBadge userId={comment.user_id} onNavigate={onNavigate} />
        {comment.created_at && (
          <span className="text-[11px] text-app-muted shrink-0">
            {formatRelativeDate(comment.created_at)}
          </span>
        )}
      </div>
      <p className="text-sm text-app-text whitespace-pre-wrap leading-relaxed wrap-break-word px-0.5 transition-colors">
        {comment.content}
      </p>
    </div>
  );
}