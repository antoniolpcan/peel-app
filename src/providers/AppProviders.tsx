import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserProfileProvider } from '@/contexts/UserProfileContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ScrollToTop } from '@/components/ui/ScrollToTop';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <UserProfileProvider>
          <ThemeProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ThemeProvider>
        </UserProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}