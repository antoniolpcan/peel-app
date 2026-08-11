import { memo } from 'react';
import { CheckCheck } from 'lucide-react';

export type NotificationFilter = 'all' | 'unread';

interface NotificationHeaderProps {
  filter: NotificationFilter;
  onFilterChange: (filter: NotificationFilter) => void;
  unreadCount?: number;
  onMarkAllAsRead?: () => void;
}

export const NotificationHeader = memo(function NotificationHeader({
  filter,
  onFilterChange,
  unreadCount = 0,
  onMarkAllAsRead,
}: NotificationHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-app-border pb-4 transition-colors">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-app-text tracking-tight">Notificações</h1>
          {unreadCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse shadow-2xs">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        <p className="text-xs text-app-muted mt-0.5">Fique por dentro das últimas interações.</p>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
        {unreadCount > 0 && onMarkAllAsRead && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            title="Marcar todas como lidas"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-app-accent bg-app-accent/10 hover:bg-app-accent/20 transition-all cursor-pointer active:scale-95 border border-app-accent/20 shrink-0"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ler todas</span>
          </button>
        )}

        <div
          role="tablist"
          aria-label="Filtro de notificações"
          className="flex gap-1 bg-app-card border border-app-border p-1 rounded-xl shadow-2xs shrink-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'all'}
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/50 ${
              filter === 'all'
                ? 'bg-app-accent text-app-accent-text font-semibold shadow-2xs'
                : 'text-app-muted hover:text-app-text'
            }`}
          >
            Todas
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'unread'}
            onClick={() => onFilterChange('unread')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/50 flex items-center gap-1.5 ${
              filter === 'unread'
                ? 'bg-app-accent text-app-accent-text font-semibold shadow-2xs'
                : 'text-app-muted hover:text-app-text'
            }`}
          >
            <span>Não lidas</span>
            {unreadCount > 0 && filter !== 'unread' && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
});