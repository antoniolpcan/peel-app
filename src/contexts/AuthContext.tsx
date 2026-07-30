import { createContext, useContext, useState, type ReactNode } from 'react';
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

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('@peel:token');
    });

    const [loggedUserId, setLoggedUserId] = useState<number | null>(() => {
    return getUserIdFromToken(localStorage.getItem('@peel:token'));
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

    return (
    <AuthContext.Provider value={{ isAuthenticated, loggedUserId, login, logout }}>
        {children}
    </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);