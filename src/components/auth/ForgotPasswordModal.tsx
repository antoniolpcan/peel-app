import React, { useState } from 'react';
import { useAuthApi } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '../ui/Button';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose, onBackToLogin }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  
  const { executeForgotPassword, loading, error, clearError } = useAuthApi();
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    clearError();
    const success = await executeForgotPassword(email.trim());

    if (success) {
      setIsSent(true);
      addToast?.('Instruções enviadas para o seu e-mail!', 'success');
    } else if (error) {
      addToast?.(error, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-app-card border border-app-border rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-app-muted hover:text-app-text p-2 rounded-full cursor-pointer transition-colors"
        >
          ✕
        </button>

        <h2 className="text-2xl font-extrabold text-app-text mb-1">Recuperar Senha</h2>

        {isSent ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">📩</div>
            <p className="text-sm font-semibold text-app-text mb-2">Verifique sua caixa de entrada</p>
            <p className="text-xs text-app-muted mb-6 leading-relaxed">
              Se o e-mail <strong className="text-app-text">{email}</strong> estiver cadastrado, enviamos as instruções para você redefinir sua senha.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsSent(false);
                onBackToLogin();
              }}
              className="w-full py-2.5 bg-app-bg hover:bg-app-card border border-app-border text-app-text text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Voltar para o Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <p className="text-xs text-app-muted leading-relaxed">
              Digite seu e-mail abaixo. Enviaremos um link temporário para você cadastrar uma nova senha.
            </p>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-app-text mb-1.5">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full px-4 py-2.5 bg-app-bg border border-app-border rounded-xl text-sm text-app-text placeholder:text-app-muted focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
            </Button>

            <button
              type="button"
              onClick={onBackToLogin}
              className="text-xs text-app-muted hover:text-app-text text-center mt-1 transition-colors cursor-pointer"
            >
              Voltar ao login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}