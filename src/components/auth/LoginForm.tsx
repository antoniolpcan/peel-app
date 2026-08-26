import React, { useState, useCallback } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { useAuthApi } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import logoSvg from '@/assets/logo.svg';

interface LoginFormProps {
  isRegisterMode: boolean;
  onToggleMode: (mode: 'login' | 'register') => void;
  onOpenForgotModal: () => void;
}

export function LoginForm({ isRegisterMode, onToggleMode, onOpenForgotModal }: LoginFormProps) {
  const { login: saveSession } = useAuth();
  const { addToast } = useToast();
  const { executeLogin, loading, error } = useAuthApi();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const cleanEmail = email.trim();
      if (!cleanEmail || !password) return;

      const response = await executeLogin(cleanEmail, password);

      if (response?.access_token) {
        await saveSession();
        addToast('Bem-vindo de volta ao Peel!', 'success');
      }
    },
    [email, password, executeLogin, saveSession, addToast]
  );

  return (
    <div
      className={`w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center transition-all duration-500 ease-in-out ${
        isRegisterMode ? 'opacity-0 pointer-events-none hidden md:flex' : 'opacity-100'
      }`}
    >
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4 md:hidden">
          <img src={logoSvg} alt="Logo Peel" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold tracking-tight text-app-text">Peel</span>
        </div>

        <h1 className="text-2xl font-extrabold text-app-text tracking-tight mb-1">
          Que bom te ver de novo!
        </h1>
        <p className="text-xs text-app-muted">
          Entre com suas credenciais para acessar seus post-its.
        </p>
      </div>

      {error && <ErrorMessage message={error} className="mb-4" />}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="space-y-1">
          <label htmlFor="login-email" className="text-xs font-semibold text-app-muted ml-1">
            E-mail
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-app-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="login-email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between px-1">
            <label htmlFor="login-password" className="text-xs font-semibold text-app-muted">
              Senha
            </label>
            <button
              type="button"
              onClick={onOpenForgotModal}
              className="text-[11px] font-medium text-app-accent hover:underline cursor-pointer"
            >
              Esqueceu a senha?
            </button>
          </div>

          <div className="relative">
            <Lock className="w-4 h-4 text-app-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="pl-9 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-app-muted hover:text-app-text cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" isLoading={loading} loadingText="Entrando..." className="mt-2">
          Entrar no Peel
        </Button>
      </form>

      <div className="mt-6 text-center md:hidden">
        <p className="text-xs text-app-muted">
          Ainda não tem uma conta?{' '}
          <button
            type="button"
            onClick={() => onToggleMode('register')}
            className="font-bold text-app-accent hover:underline cursor-pointer ml-1"
          >
            Cadastre-se grátis
          </button>
        </p>
      </div>
    </div>
  );
}