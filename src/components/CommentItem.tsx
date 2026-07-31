import type { CommentResponse } from '@/services/types';
import { UserAvatar } from './UserAvatar';

export function CommentItem({ comment }: { comment: CommentResponse }) {
  const user = comment.user;

  return (
    <div className="bg-white/50 p-3 rounded-xl mb-3 border border-gray-200">
      <div className="flex items-center gap-2 mb-1">
        <UserAvatar
          name={user?.name}
          avatar={user?.avatar}
          sizeClass="w-7 h-7"
          textSizeClass="text-xs"
        />
        <span className="text-xs font-bold text-slate-700">
          {user?.name || 'Usuário Peel'}
        </span>
        <span className="text-[10px] text-gray-400">
          {new Date(comment.created_at).toLocaleDateString()}
        </span>
      </div>
      <p className="text-sm text-gray-700 pl-7">{comment.content}</p>
    </div>
  );
}