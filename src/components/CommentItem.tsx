import { useEffect, useState } from "react";
import type { CommentResponse } from "../api/types";
import { api } from "../api/client";

export function CommentItem({ comment }: { comment: CommentResponse }) {
  const [user, setUser] = useState<{ name: string; username: string | null } | null>(null);

  useEffect(() => {
    api.getUser(comment.user_id).then(setUser).catch(console.error);
  }, [comment.user_id]);

  return (
    <div className="bg-white/50 p-3 rounded-xl mb-3 border border-gray-200">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-[10px] font-bold">
          {user ? user.name.charAt(0).toUpperCase() : '?'}
        </div>
        <span className="text-xs font-bold text-slate-700">
          {user ? user.name : 'Carregando...'}
        </span>
        <span className="text-[10px] text-gray-400">
          {new Date(comment.created_at).toLocaleDateString()}
        </span>
      </div>
      <p className="text-sm text-gray-700 pl-7">{comment.content}</p>
    </div>
  );
}