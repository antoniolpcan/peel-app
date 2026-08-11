import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '../navbar/Navbar';

interface PageLayoutProps {
  children: React.ReactNode;
  onOpenCreateModal?: () => void;
}

export function PageLayout({ children, onOpenCreateModal }: PageLayoutProps) {
  const { logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-app-bg text-app-text transition-colors duration-200">
      <Navbar
        isAuthenticated={isAuthenticated}
        logout={logout}
        onOpenCreateModal={onOpenCreateModal}
      />
      <main className="max-w-6xl mx-auto px-4 py-6 sm:px-8 sm:py-10 pb-24 md:pb-10 flex flex-col gap-6 sm:gap-10">
        {children}
      </main>
    </div>
  );
}