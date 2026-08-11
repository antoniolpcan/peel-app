import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextData {
  isAuthenticated: boolean;
  loggedUserId: number | null;
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

function getUserIdFromToken(token: string | null): number | null {
  if (!token) return null;
  const decoded = parseJwtPayload(token);
  if (!decoded) return null;

  const rawId = decoded.sub ?? decoded.id;
  const parsedId = Number(rawId);

  return isNaN(parsedId) ? null : parsedId;
}

function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  const decoded = parseJwtPayload(token);
  if (!decoded) return false;

  if (decoded.exp) {
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime;
  }

  return true;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem('@peel:token');
    if (token && !isTokenValid(token)) {
      localStorage.removeItem('@peel:token');
      return false;
    }
    return !!token;
  });

  const [loggedUserId, setLoggedUserId] = useState<number | null>(() => {
    const token = localStorage.getItem('@peel:token');
    return isTokenValid(token) ? getUserIdFromToken(token) : null;
  });

  const navigate = useNavigate();

  const login = useCallback((token: string) => {
    localStorage.setItem('@peel:token', token);
    setIsAuthenticated(true);
    setLoggedUserId(getUserIdFromToken(token));
    navigate('/');
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('@peel:token');
    setIsAuthenticated(false);
    setLoggedUserId(null);
    navigate('/auth');
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