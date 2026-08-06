import React, { useCallback, memo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '../navbar/Navbar';

interface PageLayoutProps {
  children: React.ReactNode;
  onOpenCreateModal?: () => void;
}

const NOOP = () => {};

export const PageLayout = memo(function PageLayout({ 
  children, 
  onOpenCreateModal 
}: PageLayoutProps) {
  const { logout, isAuthenticated } = useAuth();

  const handleOpenModal = useCallback(() => {
    if (onOpenCreateModal) {
      onOpenCreateModal();
    }
  }, [onOpenCreateModal]);

  return (
    <div className="min-h-screen bg-app-bg text-app-text transition-colors duration-200">
      <Navbar
        isAuthenticated={isAuthenticated}
        logout={logout}
        setIsModalOpen={onOpenCreateModal ? handleOpenModal : NOOP}
      />
      <main className="max-w-6xl mx-auto py-10 px-8 flex flex-col gap-10">
        {children}
      </main>
    </div>
  );
});