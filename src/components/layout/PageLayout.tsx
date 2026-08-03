import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';

interface PageLayoutProps {
  children: React.ReactNode;
  onOpenCreateModal?: () => void;
}

export function PageLayout({ children, onOpenCreateModal }: PageLayoutProps) {
  const { logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Navbar
        isAuthenticated={isAuthenticated}
        logout={logout}
        setIsModalOpen={onOpenCreateModal || (() => {})}
      />
      <main className="max-w-6xl mx-auto py-10 px-8 flex flex-col gap-10">
        {children}
      </main>
    </div>
  );
}