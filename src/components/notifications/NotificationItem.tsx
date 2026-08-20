import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus, Bell, ArrowRight } from 'lucide-react';
import { UserAvatar } from '@/components/profile/UserAvatar';
import type { NotificationResponse } from '@/services/types';

function formatNotificationDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Agora';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;

  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

interface NotificationItemProps {
  notification: NotificationResponse;
  onItemClick: (id: string, isRead: boolean) => void;
}

export const NotificationItem = memo(function NotificationItem({
  notification,
  onItemClick,
}: NotificationItemProps) {
  const isUnread = !notification.is_read;

  const renderIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />;
      case 'comment':
        return <MessageCircle className="w-3.5 h-3.5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-app-accent" />;
    }
  };

  const renderText = (type: string) => {
    switch (type) {
      case 'like':
        return 'curtiu o seu post-it.';
      case 'comment':
        return 'comentou na sua publicação.';
      case 'follow':
        return 'começou a seguir você.';
      default:
        return 'interagiu com você.';
    }
  };

  const actorName = notification.actor?.name || notification.actor?.username || 'Alguém';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onItemClick(notification.id, notification.is_read)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onItemClick(notification.id, notification.is_read);
        }
      }}
      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer gap-3 
          sm:gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent ${
        isUnread
          ? 'bg-app-card border-app-accent/40 shadow-xs ring-1 ring-app-accent/10'
          : 'bg-app-card/40 border-app-border/60 hover:bg-app-card'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 grow">
        <div className="relative shrink-0">
          <UserAvatar
            name={actorName}
            avatar={notification.actor?.avatar}
            size="sm"
          />
          <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-app-card border border-app-border shadow-2xs">
            {renderIcon(notification.type)}
          </div>
        </div>

        <div className="text-xs text-app-text leading-relaxed min-w-0 line-clamp-2 wrap-break-word">
          <span className="font-bold">{actorName}</span>{' '}
          <span className="text-app-text/90">{renderText(notification.type)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <span className="text-[11px] text-app-muted font-medium whitespace-nowrap">
          {formatNotificationDate(notification.created_at)}
        </span>

        {notification.actor?.id && (
          <Link
            to={`/perfil/${notification.actor.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-[11px] font-semibold bg-app-bg hover:bg-app-accent/10 hover:text-app-accent text-app-text 
              border border-app-border px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 active:scale-95 
              whitespace-nowrap"
          >
            <span className="hidden sm:inline">Ver perfil</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}

        {isUnread && (
          <span
            title="Não lida"
            className="w-2.5 h-2.5 rounded-full bg-app-accent shrink-0 animate-pulse"
          />
        )}
      </div>
    </div>
  );
});