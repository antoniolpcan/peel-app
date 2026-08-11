import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

export type Theme = 
  | 'light' 
  | 'dark' 
  | 'midnight' 
  | 'dracula' 
  | 'nord' 
  | 'emerald' 
  | 'sakura' 
  | 'sepia';

const VALID_THEMES: Theme[] = [
  'light', 'dark', 'midnight', 'dracula', 'nord', 'emerald', 'sakura', 'sepia'
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem('@peel:theme') as Theme;
  
  if (savedTheme && VALID_THEMES.includes(savedTheme)) {
    return savedTheme;
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove('dark');
    root.removeAttribute('data-theme');

    if (theme === 'dark') {
      root.classList.add('dark');
    }
    root.setAttribute('data-theme', theme);

    localStorage.setItem('@peel:theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === '@peel:theme' && e.newValue) {
        const newTheme = e.newValue as Theme;
        if (VALID_THEMES.includes(newTheme)) {
          setThemeState(newTheme);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const contextValue = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  return context;
}