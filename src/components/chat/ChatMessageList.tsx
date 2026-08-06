import React, { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { ChatMessageBubble } from './ChatMessageBubble';
import type { MessageResponse } from '@/services/types';

interface ChatMessageListProps {
  messages: MessageResponse[];
  loggedUserId: number | null;
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  formatDateDivider: (dateString: string) => string;
}

export const ChatMessageList = memo(function ChatMessageList({
  messages,
  loggedUserId,
  loading,
  messagesEndRef,
  formatDateDivider,
}: ChatMessageListProps) {
  if (loading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-app-muted gap-2 text-xs">
        <Loader2 className="w-4 h-4 animate-spin text-app-accent" />
        Carregando mensagens...
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-1.5">
      {messages.map((msg, index) => {
        const isMe = msg.sender_id === loggedUserId;
        const currentDate = new Date(msg.created_at).toDateString();
        const prevDate =
          index > 0 ? new Date(messages[index - 1].created_at).toDateString() : null;
        const showDateDivider = currentDate !== prevDate;

        return (
          <ChatMessageBubble
            key={msg.id}
            content={msg.content}
            createdAt={msg.created_at}
            isMe={isMe}
            showDateDivider={showDateDivider}
            formattedDateDivider={formatDateDivider(msg.created_at)}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
});