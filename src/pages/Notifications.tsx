import { useState, useMemo, useCallback } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { PageLayout } from '@/components/layout/PageLayout';

import { NotificationHeader, type NotificationFilter } from '@/components/notifications/NotificationHeader';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { NotificationSkeleton } from '@/components/notifications/NotificationSkeleton';
import { NotificationEmpty } from '@/components/notifications/NotificationEmpty';

export function NotificationsPage() {
  const { notifications, loading, error, markAsRead } = useNotifications();
  const [filter, setFilter] = useState<NotificationFilter>('all');

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (filter === 'unread') return !n.is_read;
      return true;
    });
  }, [notifications, filter]);

  const handleItemClick = useCallback(
    (id: number, isRead: boolean) => {
      if (!isRead) {
        markAsRead(id);
      }
    },
    [markAsRead]
  );

  return (
    <PageLayout>
      <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
        <NotificationHeader filter={filter} onFilterChange={setFilter} />
        {error && (
          <div
            role="alert"
            className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium text-center"
          >
            {error}
          </div>
        )}
        {loading ? (
          <NotificationSkeleton />
        ) : filteredNotifications.length === 0 ? (
          <NotificationEmpty filter={filter} />
        ) : (
          <div className="flex flex-col gap-2.5">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onItemClick={handleItemClick}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}