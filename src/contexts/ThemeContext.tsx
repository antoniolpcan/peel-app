import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 
  | 'light' 
  | 'dark' 
  | 'midnight' 
  | 'dracula' 
  | 'nord' 
  | 'emerald' 
  | 'sakura' 
  | 'sepia';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('@peel:theme') as Theme) || 'light';
  });

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

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  return context;
}