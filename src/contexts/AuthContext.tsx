import { authService } from '@/services';
import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextData {
  isAuthenticated: boolean;
  loggedUserId: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

function parseJwtPayload(token: string): Record<string, any> | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function getUserIdFromToken(token: string | null): string | null {
  if (!token) return null;
  const decoded = parseJwtPayload(token);
  if (!decoded) return null;

  const rawId = decoded.sub;
  
  return rawId;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('@peel:isAuthenticated') === 'true';
  });

  const [loggedUserId, setLoggedUserId] = useState<string | null>(() => {
    const id = localStorage.getItem('@peel:userId');
    return id ? String(id) : null;
  });

  const navigate = useNavigate();

  const login = useCallback((token: string) => {
    const userId = getUserIdFromToken(token);
    
    if (userId) {
      localStorage.setItem('@peel:isAuthenticated', 'true');
      localStorage.setItem('@peel:userId', String(userId));
      setIsAuthenticated(true);
      setLoggedUserId(String(userId));
      navigate('/');
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {} finally {
      localStorage.removeItem('@peel:isAuthenticated');
      localStorage.removeItem('@peel:userId');
      setIsAuthenticated(false);
      setLoggedUserId(null);
      navigate('/auth');
    }
  }, [navigate]);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('unauthorized-event', handleUnauthorized);
    return () => window.removeEventListener('unauthorized-event', handleUnauthorized);
  }, [logout]);

  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      loggedUserId,
      login,
      logout,
    }),
    [isAuthenticated, loggedUserId, login, logout]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};