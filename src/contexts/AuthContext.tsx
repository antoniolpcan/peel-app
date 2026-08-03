import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextData {
  isAuthenticated: boolean;
  loggedUserId: number | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function getUserIdFromToken(token: string | null): number | null {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return Number(decoded.sub || decoded.id); 
  } catch {
    return null;
  }
}

function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));

    if (decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
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

    const login = (token: string) => {
      localStorage.setItem('@peel:token', token);
      setIsAuthenticated(true);
      setLoggedUserId(getUserIdFromToken(token));
      navigate('/');
    };

    const logout = () => {
      localStorage.removeItem('@peel:token');
      setIsAuthenticated(false);
      setLoggedUserId(null);
      navigate('/login');
    };

    useEffect(() => {
      const handleUnauthorized = () => {
        logout();
      };

      window.addEventListener('unauthorized-event', handleUnauthorized);
      return () => window.removeEventListener('unauthorized-event', handleUnauthorized);
    }, []);

    return (
      <AuthContext.Provider value={{ isAuthenticated, loggedUserId, login, logout }}>
          {children}
      </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);