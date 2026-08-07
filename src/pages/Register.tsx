import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, AtSign, Mail, Lock } from 'lucide-react';
import { useUserActions } from '@/hooks/useUsers';
import { useToast } from '@/contexts/ToastContext';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const { createUser, loading, error } = useUserActions();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    const sanitizedValue = name === 'username' ? value.replace(/^@/, '') : value;

    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
  }, []);

  const passwordStrength = useMemo(() => {
    const pwd = formData.password;
    if (!pwd) return { score: 0, label: '', color: '' };

    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8 && /[0-9]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, label: 'Fraca', color: 'bg-rose-500', text: 'text-rose-500' };
    if (score === 2) return { score: 2, label: 'Média', color: 'bg-amber-500', text: 'text-amber-500' };
    return { score: 3, label: 'Forte', color: 'bg-emerald-500', text: 'text-emerald-500' };
  }, [formData.password]);

  const handleRegister = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.name.trim() || !formData.email.trim() || !formData.password) return;

      const formattedUsername = formData.username.trim();

      const newUser = await createUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        username: formattedUsername !== '' ? formattedUsername : null,
      });

      if (newUser) {
        addToast('Conta criada com sucesso! Faça login para continuar. ✨', 'success');
        navigate('/login');
      }
    },
    [formData, createUser, addToast, navigate]
  );

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Junte-se ao Peel e comece a colar suas ideias"
      footerText="Já possui uma conta?"
      footerLinkText="Fazer Login"
      footerLinkTo="/login"
    >
      {error && <ErrorMessage message={error} className="mb-2" />}

      <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
        <div className="space-y-1">
          <label htmlFor="register-name" className="text-xs font-semibold text-app-muted ml-1">
            Seu Nome
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-app-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Como quer ser chamado?"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="pl-9"
              required
              autoFocus
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="register-username" className="text-xs font-semibold text-app-muted ml-1">
            Nome de Usuário
          </label>
          <div className="relative">
            <AtSign className="w-4 h-4 text-app-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="register-username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="seu_username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="register-email" className="text-xs font-semibold text-app-muted ml-1">
            E-mail
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-app-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between px-1">
            <label htmlFor="register-password" className="text-xs font-semibold text-app-muted">
              Senha
            </label>
            {passwordStrength.score > 0 && (
              <span className={`text-[10px] font-bold ${passwordStrength.text}`}>
                {passwordStrength.label}
              </span>
            )}
          </div>

          <div className="relative">
            <Lock className="w-4 h-4 text-app-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="register-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Crie uma senha segura"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className="pl-9 pr-10"
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
          {formData.password.length > 0 && (
            <div className="flex gap-1 pt-1 px-1">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    step <= passwordStrength.score ? passwordStrength.color : 'bg-app-border/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <Button 
          type="submit" 
          isLoading={loading} 
          loadingText="Criando conta..."
          className="mt-2"
        >
          Criar minha conta
        </Button>
      </form>
    </AuthLayout>
  );
}