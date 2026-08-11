import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, User, Settings, LogOut, Palette } from 'lucide-react';

interface UserActionsProps {
  isAuthenticated: boolean;
  logout: () => void;
  onOpenModal?: () => void;
  onOpenThemeModal: () => void;
}

export const UserActions = memo(function UserActions({
  isAuthenticated,
  logout,
  onOpenModal,
  onOpenThemeModal,
}: UserActionsProps) {
  const location = useLocation();
  const isPathActive = (path: string) => location.pathname.startsWith(path);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenThemeModal}
          title="Aparência e Tema"
          className="p-2 rounded-xl text-app-muted hover:text-app-text hover:bg-app-bg/50 transition-colors cursor-pointer shrink-0"
        >
          <Palette className="w-4 h-4 text-app-accent" />
        </button>

        <Link
          to="/auth"
          className="bg-app-bg border border-app-border hover:border-app-accent/40 text-app-text px-3 py-2 sm:px-4 rounded-xl transition-all text-xs font-semibold whitespace-nowrap shrink-0"
        >
          Fazer Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 sm:gap-3 shrink-0">
      {onOpenModal && (
        <button
          type="button"
          onClick={onOpenModal}
          title="Novo Post-it"
          className="bg-app-accent text-app-accent-text hover:opacity-90 p-2 sm:px-4 sm:py-2 rounded-xl transition-all cursor-pointer font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Novo Post-it</span>
        </button>
      )}

      <div className="h-4 w-px bg-app-border mx-0.5 hidden sm:block" />

      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
        <Link
          to="/perfil"
          title="Meu Perfil"
          className={`p-1.5 sm:p-2 rounded-xl transition-colors ${
            isPathActive('/perfil') ? 'bg-app-accent/10 text-app-accent' : 'text-app-muted hover:text-app-text hover:bg-app-bg/50'
          }`}
        >
          <User className="w-4 h-4" />
        </Link>

        <button
          type="button"
          onClick={onOpenThemeModal}
          title="Personalizar Tema"
          className="p-1.5 sm:p-2 text-app-muted hover:text-app-text hover:bg-app-bg/50 rounded-xl cursor-pointer transition-colors"
        >
          <Palette className="w-4 h-4 text-app-accent" />
        </button>

        <Link
          to="/settings"
          title="Configurações"
          className={`p-1.5 sm:p-2 rounded-xl transition-colors ${
            isPathActive('/settings') ? 'bg-app-accent/10 text-app-accent' : 'text-app-muted hover:text-app-text hover:bg-app-bg/50'
          }`}
        >
          <Settings className="w-4 h-4" />
        </Link>

        <button 
          type="button"
          onClick={logout} 
          title="Sair"
          className="p-1.5 sm:p-2 text-app-muted hover:text-red-400 hover:bg-red-500/10 rounded-xl cursor-pointer transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});