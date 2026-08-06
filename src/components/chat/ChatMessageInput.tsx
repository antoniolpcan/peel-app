import React, { memo } from 'react';
import { Send } from 'lucide-react';

interface ChatMessageInputProps {
  messageText: string;
  onChangeText: (text: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
}

export const ChatMessageInput = memo(function ChatMessageInput({
  messageText,
  onChangeText,
  onSendMessage,
}: ChatMessageInputProps) {
  return (
    <form
      onSubmit={onSendMessage}
      className="p-3 border-t border-app-border bg-app-card flex gap-2 shrink-0"
    >
      <input
        type="text"
        value={messageText}
        onChange={(e) => onChangeText(e.target.value)}
        placeholder="Digite sua mensagem..."
        className="flex-1 bg-app-bg text-app-text border border-app-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-app-accent transition-all"
      />
      <button
        type="submit"
        disabled={!messageText.trim()}
        className="bg-app-accent text-app-accent-text px-4 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-90 disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 active:scale-95"
      >
        <Send className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Enviar</span>
      </button>
    </form>
  );
});