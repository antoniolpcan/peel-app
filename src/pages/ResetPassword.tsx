import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Check, X, AlertTriangle, KeyRound } from 'lucide-react';
import { useAuthApi } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { executeResetPassword, loading, error, clearError } = useAuthApi();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validations = useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }, [password]);

  const isValidPassword = Object.values(validations).every(Boolean);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      clearError();

      if (!token) {
        addToast('Token de redefinição inválido ou ausente.', 'error');
        return;
      }

      if (!isValidPassword) {
        addToast('Sua senha não atende a todos os requisitos de segurança.', 'error');
        return;
      }

      if (!passwordsMatch) {
        addToast('As senhas não coincidem.', 'error');
        return;
      }

      const success = await executeResetPassword(token, password);

      if (success) {
        addToast('Senha alterada com sucesso! Faça login com sua nova senha.', 'success');
        navigate('/auth');
      } else if (error) {
        addToast(error, 'error');
      }
    },
    [token, isValidPassword, passwordsMatch, password, executeResetPassword, error, clearError, addToast, navigate]
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-app-bg p-4 transition-colors relative overflow-hidden">
      <div className="absolute top-12 left-12 w-32 h-32 bg-amber-300/20 rounded-2xl rotate-12 blur-xl pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-40 h-40 bg-app-accent/20 rounded-2xl -rotate-12 blur-xl pointer-events-none" />

      <div className="w-full max-w-md bg-app-card border border-app-border rounded-3xl p-6 sm:p-8 shadow-2xl relative transition-colors">
        
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/40 shadow-xs -rotate-1 backdrop-blur-xs rounded-xs pointer-events-none border border-white/20 z-30" />

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-app-accent/10 text-app-accent rounded-2xl mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-app-text tracking-tight">
            Criar Nova Senha
          </h1>
          <p className="text-xs text-app-muted mt-1">
            Digite e confirme sua nova senha de acesso
          </p>
        </div>

        {!token ? (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs text-center flex flex-col items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="font-medium">
              Token de redefinição não encontrado na URL. Verifique o link recebido no e-mail.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <ErrorMessage message={error} className="mb-1" />}

            <div className="space-y-1">
              <label htmlFor="reset-password" className="text-xs font-semibold text-app-muted ml-1">
                Nova Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-app-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
                <Input
                  id="reset-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="pl-9 pr-10"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={loading}
                  aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-app-muted hover:text-app-text transition-colors cursor-pointer disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 shrink-0" /> : <Eye className="w-4 h-4 shrink-0" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="reset-confirm-password" className="text-xs font-semibold text-app-muted ml-1">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-app-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
                <Input
                  id="reset-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="pl-9 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  disabled={loading}
                  aria-label={showConfirmPassword ? 'Ocultar senha' : 'Exibir senha'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-app-muted hover:text-app-text transition-colors cursor-pointer disabled:opacity-50"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4 shrink-0" /> : <Eye className="w-4 h-4 shrink-0" />}
                </button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="text-[11px] font-medium text-rose-500 mt-1 ml-1">
                  As senhas não coincidem.
                </p>
              )}
            </div>

            <div className="p-3.5 bg-app-card/60 border border-app-border/80 rounded-2xl flex flex-col gap-2 text-[11px] transition-colors">
              <p className="font-bold text-app-text">Requisitos da senha:</p>
              <div className="flex flex-col gap-1.5">
                <RequirementItem met={validations.minLength} label="Mínimo de 8 caracteres" />
                <RequirementItem met={validations.hasUpper} label="Pelo menos uma letra maiúscula (A-Z)" />
                <RequirementItem met={validations.hasLower} label="Pelo menos uma letra minúscula (a-z)" />
                <RequirementItem met={validations.hasNumber} label="Pelo menos um número (0-9)" />
                <RequirementItem met={validations.hasSpecial} label="Pelo menos um caractere especial (!@#$%...)" />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              loadingText="Redefinindo..."
              disabled={loading || !isValidPassword || !passwordsMatch}
              className="mt-2"
            >
              Redefinir Senha
            </Button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-app-border/40 text-center text-xs text-app-muted">
          Lembrou da sua senha?{' '}
          <Link
            to="/auth"
            className="font-bold text-app-accent hover:underline transition-all"
          >
            Fazer Login
          </Link>
        </div>
      </div>
    </div>
  );
}

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 font-medium transition-colors ${met ? 'text-emerald-500' : 'text-app-muted'}`}>
      {met ? (
        <Check className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
      ) : (
        <X className="w-3.5 h-3.5 shrink-0 opacity-40" />
      )}
      <span>{label}</span>
    </div>
  );
}