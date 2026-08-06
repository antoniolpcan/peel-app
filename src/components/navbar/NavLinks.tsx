import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, MessageSquare, Bell } from 'lucide-react';

interface NavLinksProps {
  unreadNotificationsCount?: number;
  unreadMessagesCount?: number;
}

export const NavLinks = memo(function NavLinks({
  unreadNotificationsCount = 0,
  unreadMessagesCount = 0,
}: NavLinksProps) {
  const location = useLocation();

  const navItems = [
    { 
      label: 'Mural', 
      path: '/', 
      icon: LayoutGrid 
    },
    { 
      label: 'Mensagens', 
      path: '/chat', 
      icon: MessageSquare, 
      badge: unreadMessagesCount 
    },
    { 
      label: 'Notificações', 
      path: '/notifications', 
      icon: Bell, 
      badge: unreadNotificationsCount 
    },
  ];

  return (
    <nav className="flex items-center gap-1 sm:gap-2 font-medium text-sm">
      {navItems.map((item) => {
        const active =
          item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);

        const hasBadge = Boolean(item.badge && item.badge > 0);

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`px-3 py-2 rounded-xl flex items-center gap-2 relative transition-all ${
              active
                ? 'bg-app-accent/10 text-app-accent font-semibold'
                : 'text-app-muted hover:text-app-text hover:bg-app-bg/50'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <item.icon className="w-4 h-4" />
              {hasBadge && (
                <span className="absolute -top-2 -right-2.5 bg-rose-500 text-white text-[9px] font-extrabold min-w-4 h-4 px-1 rounded-full flex items-center justify-center leading-none border border-app-card shadow-2xs animate-pulse">
                  {item.badge! > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className="hidden md:inline">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
});