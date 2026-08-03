import { Link } from 'react-router-dom';
import { ThemeSelector } from '@/components/ui/ThemeSelector';

interface NavbarProps {
  isAuthenticated: boolean;
  logout: () => void;
  setIsModalOpen: (value: React.SetStateAction<boolean>) => void;
}

export function Navbar({ isAuthenticated, logout, setIsModalOpen }: NavbarProps) {
  return (
    <div>
      <header className="bg-app-card border-b border-app-border px-8 py-4 flex justify-between items-center transition-colors">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-2xl font-bold text-app-accent">
            🌿 Peel
          </Link>
        </div>
        <nav className="flex items-center gap-6 font-medium text-app-muted">
          
          <ThemeSelector />

          <Link 
            to="/" 
            className="hover:text-app-text pb-1 transition-colors"
          >
            Mural
          </Link>

          {isAuthenticated ? (
            <>
              <Link 
                to="/perfil" 
                className="hover:text-app-text pb-1 transition-colors"
              >
                Meu Perfil
              </Link>
              <button 
                onClick={logout} 
                className="hover:text-app-text pb-1 cursor-pointer transition-colors"
              >
                Logout
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="bg-app-accent text-app-accent-text hover:opacity-90 px-4 py-1.5 rounded-full transition-all cursor-pointer font-medium text-sm shadow-2xs"
              >
                + Novo Post-it
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-app-bg border border-app-border hover:opacity-80 text-app-text px-4 py-1.5 rounded-full transition-colors text-sm"
            >
              Fazer Login
            </Link>
          )}
        </nav>
      </header>
    </div>
  );
}