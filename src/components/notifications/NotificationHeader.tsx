import { memo } from 'react';

export type NotificationFilter = 'all' | 'unread';

interface NotificationHeaderProps {
  filter: NotificationFilter;
  onFilterChange: (filter: NotificationFilter) => void;
}

export const NotificationHeader = memo(function NotificationHeader({
  filter,
  onFilterChange,
}: NotificationHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-app-border pb-4">
      <div>
        <h1 className="text-2xl font-bold text-app-text tracking-tight">Notificações</h1>
        <p className="text-xs text-app-muted">Fique por dentro das últimas interações.</p>
      </div>

      <div
        role="tablist"
        aria-label="Filtro de notificações"
        className="flex gap-1 bg-app-card border border-app-border p-1 rounded-xl shadow-2xs"
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
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/50 ${
            filter === 'unread'
              ? 'bg-app-accent text-app-accent-text font-semibold shadow-2xs'
              : 'text-app-muted hover:text-app-text'
          }`}
        >
          Não lidas
        </button>
      </div>
    </header>
  );
});