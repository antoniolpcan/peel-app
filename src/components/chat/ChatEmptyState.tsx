import { memo } from 'react';
import { MessageSquare } from 'lucide-react';

export const ChatEmptyState = memo(function ChatEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-app-muted text-xs gap-2 p-6 text-center">
      <MessageSquare className="w-8 h-8 opacity-20" />
      <p>Selecione uma conversa ao lado para começar a interagir.</p>
    </div>
  );
});