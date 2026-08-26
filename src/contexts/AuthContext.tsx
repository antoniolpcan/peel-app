import { authService, userService } from '@/services';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextData {
  isAuthenticated: boolean;
  loggedUserId: string | null;
  isLoadingAuth: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedUserId, setLoggedUserId] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const navigate = useNavigate();

  const clearSession = useCallback(() => {
    setIsAuthenticated(false);
    setLoggedUserId(null);
  }, []);

  const loadCurrentUser = useCallback(async () => {
    try {
      const user = await userService.getMe();

      setIsAuthenticated(true);
      setLoggedUserId(user.id);

      return user;
    } catch {
      clearSession();
      return null;
    }
  }, [clearSession]);

  const login = useCallback(async () => {
    const user = await loadCurrentUser();

    if (!user) {
      return;
    }

    navigate('/', { replace: true });
  }, [loadCurrentUser, navigate]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erro ao realizar logout:', error);
    } finally {
      clearSession();
      navigate('/auth', { replace: true });
    }
  }, [clearSession, navigate]);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await loadCurrentUser();
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkAuthentication();
  }, [loadCurrentUser]);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearSession();
      navigate('/auth', { replace: true });
    };

    window.addEventListener(
      'unauthorized-event',
      handleUnauthorized
    );

    return () => {
      window.removeEventListener(
        'unauthorized-event',
        handleUnauthorized
      );
    };
  }, [clearSession, navigate]);

  const contextValue = useMemo<AuthContextData>(
    () => ({
      isAuthenticated,
      loggedUserId,
      isLoadingAuth,
      login,
      logout,
    }),
    [
      isAuthenticated,
      loggedUserId,
      isLoadingAuth,
      login,
      logout,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth deve ser utilizado dentro de um AuthProvider'
    );
  }

  return context;
}