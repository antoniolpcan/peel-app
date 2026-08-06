import { memo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { NotificationFilter } from './NotificationHeader';

interface NotificationEmptyProps {
  filter: NotificationFilter;
}

export const NotificationEmpty = memo(function NotificationEmpty({
  filter,
}: NotificationEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-app-muted gap-2 text-center bg-app-card/20 rounded-3xl border border-app-border/50">
      <CheckCircle2 className="w-10 h-10 opacity-30 text-app-accent" />
      <p className="text-xs font-medium">
        {filter === 'unread'
          ? 'Você não tem notificações não lidas.'
          : 'Nenhuma notificação por aqui.'}
      </p>
    </div>
  );
});