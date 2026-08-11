import { memo } from 'react';
import { CheckCircle2, Inbox } from 'lucide-react';
import type { NotificationFilter } from './NotificationHeader';

interface NotificationEmptyProps {
  filter: NotificationFilter;
}

export const NotificationEmpty = memo(function NotificationEmpty({
  filter,
}: NotificationEmptyProps) {
  const isUnreadFilter = filter === 'unread';

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-20 text-app-muted gap-3 text-center bg-app-card/20 
        rounded-3xl border border-app-border/50 transition-colors"
    >
      {isUnreadFilter ? (
        <CheckCircle2 className="w-10 h-10 opacity-40 text-app-accent animate-in zoom-in-75 duration-200" />
      ) : (
        <Inbox className="w-10 h-10 opacity-30 text-app-muted animate-in zoom-in-75 duration-200" />
      )}

      <div className="space-y-1">
        <p className="text-sm font-semibold text-app-text">
          {isUnreadFilter ? 'Tudo em dia por aqui!' : 'Sua caixa está vazia'}
        </p>
        <p className="text-xs text-app-muted max-w-xs leading-relaxed">
          {isUnreadFilter
            ? 'Você não tem nenhuma notificação pendente para ler.'
            : 'Quando alguém interagir com seus post-its, os avisos aparecerão aqui.'}
        </p>
      </div>
    </div>
  );
});