import React, { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Loader2 } from 'lucide-react';
import { useChat } from '@/hooks/useChat';

interface StartChatButtonProps {
  targetUserId: number;
}

export const StartChatButton = memo(function StartChatButton({ targetUserId }: StartChatButtonProps) {
  const navigate = useNavigate();
  const { startDirectChat } = useChat();
  const [loading, setLoading] = useState(false);

  const handleStartChat = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    try {
      setLoading(true);
      const chat = await startDirectChat(targetUserId);
      navigate('/chat', { state: { selectedChatId: chat.id } });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [targetUserId, startDirectChat, navigate, loading]);

  return (
    <button
      type="button"
      onClick={handleStartChat}
      disabled={loading}
      className="inline-flex items-center gap-2 bg-app-bg text-app-text border border-app-border px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-app-card disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <MessageSquare className="w-3.5 h-3.5 text-app-accent" />
      )}
      <span>Mensagem</span>
    </button>
  );
});