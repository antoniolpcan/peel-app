import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthApi } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { executeResetPassword, loading, error, clearError } = useAuthApi();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!token) {
      addToast?.('Token de redefinição inválido ou ausente.', 'error');
      return;
    }

    if (!isValidPassword) {
      addToast?.('Sua senha não atende a todos os requisitos de segurança.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      addToast?.('As senhas não coincidem.', 'error');
      return;
    }

    const success = await executeResetPassword(token, password);

    if (success) {
      addToast?.('Senha alterada com sucesso! Faça login com sua nova senha.', 'success');
      navigate('/login');
    } else if (error) {
      addToast?.(error, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg p-4">
      <div className="w-full max-w-md bg-app-card border border-app-border rounded-3xl p-6 sm:p-8 shadow-2xl">
        <h1 className="text-2xl font-extrabold text-app-text mb-2">Criar Nova Senha</h1>
        <p className="text-xs text-app-muted mb-6">
          Digite e confirme sua nova senha de acesso.
        </p>

        {!token ? (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs text-center">
            Token de redefinição não encontrado na URL. Verifique o link recebido no e-mail.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-app-text mb-1.5">Nova Senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-app-bg border border-app-border rounded-xl text-sm text-app-text placeholder:text-app-muted focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-app-text mb-1.5">Confirmar Nova Senha</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-app-bg border border-app-border rounded-xl text-sm text-app-text placeholder:text-app-muted focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-[11px] text-red-400 mt-1">As senhas não coincidem.</p>
              )}
            </div>
            
            <div className="p-3 bg-app-bg/50 border border-app-border/60 rounded-xl flex flex-col gap-1.5 text-[11px]">
              <p className="font-semibold text-app-muted mb-0.5">Requisitos da senha:</p>
              <RequirementItem met={validations.minLength} label="Mínimo de 8 caracteres" />
              <RequirementItem met={validations.hasUpper} label="Pelo menos uma letra maiúscula (A-Z)" />
              <RequirementItem met={validations.hasLower} label="Pelo menos uma letra minúscula (a-z)" />
              <RequirementItem met={validations.hasNumber} label="Pelo menos um número (0-9)" />
              <RequirementItem met={validations.hasSpecial} label="Pelo menos um caractere especial (!@#$%...)" />
            </div>

            <button
              type="submit"
              disabled={loading || !isValidPassword || password !== confirmPassword}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50 mt-2"
            >
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 ${met ? 'text-emerald-400' : 'text-app-muted'}`}>
      <span>{met ? '✓' : '○'}</span>
      <span>{label}</span>
    </div>
  );
}