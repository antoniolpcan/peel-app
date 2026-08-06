import React, { memo, Fragment } from 'react';
import { Loader2 } from 'lucide-react';
import { ChatMessageBubble } from './ChatMessageBubble';
import type { MessageResponse } from '@/services/types';

interface ChatMessageListProps {
  messages: MessageResponse[];
  loggedUserId: number | null;
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  formatDateDivider: (dateString: string) => string;
  firstUnreadMessageId?: number | null;
}

export const ChatMessageList = memo(function ChatMessageList({
  messages,
  loggedUserId,
  loading,
  messagesEndRef,
  formatDateDivider,
  firstUnreadMessageId,
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
        
        const isFirstUnread = msg.id === firstUnreadMessageId;

        return (
          <Fragment key={msg.id}>
            {isFirstUnread && (
              <div className="flex items-center gap-3 my-3">
                <div className="h-px bg-rose-500/30 flex-1" />
                <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs border border-rose-500/20 select-none">
                  Novas mensagens
                </span>
                <div className="h-px bg-rose-500/30 flex-1" />
              </div>
            )}

            <ChatMessageBubble
              content={msg.content}
              createdAt={msg.created_at}
              isMe={isMe}
              isRead={msg.is_read}
              showDateDivider={showDateDivider}
              formattedDateDivider={formatDateDivider(msg.created_at)}
            />
          </Fragment>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
});