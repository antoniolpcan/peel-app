import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { useAuthApi } from '@/hooks/useAuth';

import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { AuthSlidingOverlay } from '@/components/auth/AuthSlidingOverlay';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { clearError: clearLoginError } = useAuthApi();

  const [isRegisterMode, setIsRegisterMode] = useState(() => {
    return location.pathname.includes('register');
  });

  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleToggleMode = useCallback(
    (mode: 'login' | 'register') => {
      clearLoginError();
      setIsRegisterMode(mode === 'register');
    },
    [clearLoginError]
  );

  const handleSuccessRegister = useCallback((_createdEmail: string) => {
    setIsRegisterMode(false);
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-app-bg p-4 transition-colors relative overflow-hidden">
      <div className="absolute top-12 left-12 w-32 h-32 bg-amber-300/20 rounded-2xl rotate-12 blur-xl pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-40 h-40 bg-app-accent/20 rounded-2xl -rotate-12 blur-xl pointer-events-none" />
      <div className="w-full max-w-4xl bg-app-card border border-app-border rounded-3xl shadow-2xl overflow-hidden relative min-h-145 flex flex-col md:flex-row transition-colors">
        
        <LoginForm
          isRegisterMode={isRegisterMode}
          onToggleMode={handleToggleMode}
          onOpenForgotModal={() => setIsForgotModalOpen(true)}
        />

        <RegisterForm
          isRegisterMode={isRegisterMode}
          onToggleMode={handleToggleMode}
          onSuccessRegister={handleSuccessRegister}
        />

        <AuthSlidingOverlay
          isRegisterMode={isRegisterMode}
          onToggleMode={handleToggleMode}
        />
      </div>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        onBackToLogin={() => setIsForgotModalOpen(false)}
      />
    </div>
  );
}