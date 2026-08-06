import React, { useState, useCallback } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthApi } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login: saveSession } = useAuth();
  const { executeLogin, loading, error } = useAuthApi();
  const { addToast } = useToast();

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email.trim() || !password) return;

      const response = await executeLogin(email, password);

      if (response?.access_token) {
        addToast('Bem-vindo de volta! 🌿', 'success');
        saveSession(response.access_token);
      }
    },
    [email, password, executeLogin, saveSession, addToast]
  );

  return (
    <AuthLayout
      title="Que bom te ver de novo!"
      subtitle="Entre com suas credenciais para acessar seus post-its"
      footerText="Ainda não tem uma conta?"
      footerLinkText="Cadastre-se grátis"
      footerLinkTo="/register"
    >
      {error && <ErrorMessage message={error} className="mb-2" />}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        
        <div className="space-y-1">
          <label htmlFor="login-email" className="text-xs font-semibold text-app-muted ml-1">
            E-mail
          </label>
          <Input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            autoFocus
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="login-password" className="text-xs font-semibold text-app-muted ml-1">
            Senha
          </label>
          <div className="relative">
            <Input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={loading}
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-app-muted hover:text-app-text transition-colors cursor-pointer disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 shrink-0" />
              ) : (
                <Eye className="w-4 h-4 shrink-0" />
              )}
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          isLoading={loading} 
          loadingText="Entrando..."
          className="mt-2"
        >
          Entrar no Peel
        </Button>
      </form>
    </AuthLayout>
  );
}