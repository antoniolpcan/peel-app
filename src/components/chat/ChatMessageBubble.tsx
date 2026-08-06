import { memo } from 'react';

interface ChatMessageBubbleProps {
  content: string;
  createdAt: string;
  isMe: boolean;
  showDateDivider?: boolean;
  formattedDateDivider?: string;
}

export const ChatMessageBubble = memo(function ChatMessageBubble({
  content,
  createdAt,
  isMe,
  showDateDivider,
  formattedDateDivider,
}: ChatMessageBubbleProps) {
  return (
    <div className="flex flex-col w-full">
      {showDateDivider && formattedDateDivider && (
        <div className="flex items-center justify-center my-3">
          <div className="h-px bg-app-border/50 flex-1" />
          <span className="px-3 py-0.5 bg-app-card border border-app-border/60 text-app-muted text-[10px] font-medium rounded-full shadow-2xs mx-3">
            {formattedDateDivider}
          </span>
          <div className="h-px bg-app-border/50 flex-1" />
        </div>
      )}

      <div
        className={`flex flex-col max-w-[75%] sm:max-w-[65%] my-0.5 ${
          isMe ? 'self-end items-end' : 'self-start items-start'
        }`}
      >
        <div
          className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${
            isMe
              ? 'bg-app-accent text-app-accent-text rounded-tr-xs'
              : 'bg-app-card border border-app-border/70 text-app-text rounded-tl-xs shadow-2xs'
          }`}
        >
          <p className="whitespace-pre-wrap wrap-break-word">{content}</p>
        </div>
        <span className="text-[9px] text-app-muted mt-0.5 px-1 opacity-70">
          {new Date(createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
});