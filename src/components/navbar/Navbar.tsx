import { useState, useCallback, memo } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { useChat } from '@/hooks/useChat';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useTheme, type Theme } from '@/contexts/ThemeContext';
import { ThemePreviewModal } from '@/components/ui/ThemePreviewModal';
import { NavBrand } from './NavBrand';
import { NavLinks } from './NavLinks';
import { UserActions } from './UserActions';

interface NavbarProps {
  isAuthenticated: boolean;
  logout: () => void;
  setIsModalOpen: (value: boolean) => void;
}

export const Navbar = memo(function Navbar({
  isAuthenticated,
  logout,
  setIsModalOpen,
}: NavbarProps) {
  const { unreadCount: unreadNotificationsCount } = useNotifications(isAuthenticated);
  const { unreadCount: unreadMessagesCount } = useChat(isAuthenticated);

  const { updateSettings } = useUserSettings();
  const { setTheme } = useTheme();

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, [setIsModalOpen]);

  const handleOpenThemeModal = useCallback(() => {
    setIsThemeModalOpen(true);
  }, []);

  const handleSaveTheme = async (newTheme: Theme) => {
    setTheme(newTheme);
    if (isAuthenticated) {
      try {
        await updateSettings({ theme: newTheme });
      } catch {
      }
    }
  };

  return (
    <>
      <header className="bg-app-card/80 backdrop-blur-md border-b border-app-border 
        px-3 sm:px-6 py-2.5 sm:py-3 sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2 min-w-0">
          <NavBrand />
          
          <NavLinks 
            unreadNotificationsCount={unreadNotificationsCount}
            unreadMessagesCount={unreadMessagesCount}
          />

          <UserActions 
            isAuthenticated={isAuthenticated} 
            logout={logout} 
            onOpenModal={handleOpenModal}
            onOpenThemeModal={handleOpenThemeModal}
          />
        </div>
      </header>

      <ThemePreviewModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        onSaveTheme={handleSaveTheme}
      />
    </>
  );
});