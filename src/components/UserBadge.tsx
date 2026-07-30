import { useEffect, useState } from "react";
import { api } from "../api/client";

export function UserBadge({ userId }: { userId: number }) {
  const [user, setUser] = useState<{ name: string; username: string | null } | null>(null);
  useEffect(() => {
    api.getUser(userId)
       .then(setUser)
       .catch(() => console.error(`Erro ao buscar usuário ${userId}`));
  }, [userId]);

  if (!user) {
    return <span className="text-xs text-gray-400 mb-2 block">Carregando autor...</span>;
  }

  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-bold">
        {user.name.charAt(0).toUpperCase()}
      </div>
      <span className="text-sm font-medium text-slate-700">
        {user.name} <span className="text-gray-400 font-normal">{user.username ? `@${user.username}` : ''}</span>
      </span>
    </div>
  );
}