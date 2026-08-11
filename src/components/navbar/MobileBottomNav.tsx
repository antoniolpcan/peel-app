import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, MessageSquare, Bell, Plus, User } from 'lucide-react';

interface MobileBottomNavProps {
  isAuthenticated: boolean;
  unreadNotificationsCount?: number;
  unreadMessagesCount?: number;
  onOpenModal?: () => void;
}

export const MobileBottomNav = memo(function MobileBottomNav({
  isAuthenticated,
  unreadNotificationsCount = 0,
  unreadMessagesCount = 0,
  onOpenModal,
}: MobileBottomNavProps) {
  const location = useLocation();
  const isActive = (path: string) => 
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-app-card/95 backdrop-blur-lg border-t border-app-border/80 z-50 px-2 py-1.5 flex items-center justify-around shadow-lg transition-colors">
      
      <Link
        to="/"
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
          isActive('/') ? 'text-app-accent font-bold' : 'text-app-muted hover:text-app-text'
        }`}
      >
        <LayoutGrid className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Mural</span>
      </Link>

      <Link
        to="/chat"
        className={`flex flex-col items-center justify-center p-2 rounded-xl relative transition-all ${
          isActive('/chat') ? 'text-app-accent font-bold' : 'text-app-muted hover:text-app-text'
        }`}
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5" />
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1 -right-1.5 bg-rose-500 text-white text-[8px] font-black min-w-3.5 h-3.5 px-0.5 rounded-full flex items-center justify-center border border-app-card animate-pulse">
              {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5">Directs</span>
      </Link>

      {isAuthenticated && onOpenModal && (
        <button
          type="button"
          onClick={onOpenModal}
          className="bg-app-accent text-app-accent-text p-3 rounded-2xl shadow-lg shadow-app-accent/30 active:scale-90 transition-all -mt-4 cursor-pointer"
          title="Novo Post-it"
        >
          <Plus className="w-6 h-6 stroke-3" />
        </button>
      )}

      <Link
        to="/notifications"
        className={`flex flex-col items-center justify-center p-2 rounded-xl relative transition-all ${
          isActive('/notifications') ? 'text-app-accent font-bold' : 'text-app-muted hover:text-app-text'
        }`}
      >
        <div className="relative">
          <Bell className="w-5 h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1.5 bg-rose-500 text-white text-[8px] font-black min-w-3.5 h-3.5 px-0.5 rounded-full flex items-center justify-center border border-app-card animate-pulse">
              {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5">Avisos</span>
      </Link>

      {isAuthenticated && (
        <Link
          to="/perfil"
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            isActive('/perfil') ? 'text-app-accent font-bold' : 'text-app-muted hover:text-app-text'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Perfil</span>
        </Link>
      )}
    </nav>
  );
});