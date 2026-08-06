import { memo } from 'react';
import { Check, CheckCheck } from 'lucide-react';

interface ChatMessageBubbleProps {
  content: string;
  createdAt: string;
  isMe: boolean;
  isRead?: boolean;
  showDateDivider?: boolean;
  formattedDateDivider?: string;
}

export const ChatMessageBubble = memo(function ChatMessageBubble({
  content,
  createdAt,
  isMe,
  isRead = false,
  showDateDivider,
  formattedDateDivider,
}: ChatMessageBubbleProps) {
  return (
    <div className="flex flex-col w-full">
      {showDateDivider && formattedDateDivider && (
        <div className="flex items-center justify-center my-3">
          <div className="h-px bg-app-border/50 flex-1" />
          <span className="px-3 py-0.5 bg-app-card border border-app-border/60 text-app-muted text-[10px] font-medium rounded-full shadow-2xs mx-3 select-none">
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
          className={`px-3 py-2 rounded-2xl text-xs leading-relaxed transition-all ${
            isMe
              ? 'bg-app-accent text-app-accent-text rounded-tr-xs'
              : !isRead
              ? 'bg-app-card border border-app-accent/40 text-app-text rounded-tl-xs shadow-xs ring-1 ring-app-accent/15'
              : 'bg-app-card border border-app-border/70 text-app-text rounded-tl-xs shadow-2xs'
          }`}
        >
          <p className="whitespace-pre-wrap wrap-break-word">{content}</p>
        </div>

        <div className="flex items-center gap-1 mt-0.5 px-1 opacity-70">
          <span className="text-[9px] text-app-muted">
            {new Date(createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>

          {isMe && (
            <span title={isRead ? 'Mensagem lida' : 'Mensagem enviada'} className="flex items-center">
              {isRead ? (
                <CheckCheck className="w-3 h-3 text-sky-400 shrink-0" />
              ) : (
                <Check className="w-3 h-3 text-app-muted shrink-0" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});