import React, { useState, useCallback, useMemo } from 'react';
import { User, AtSign, Mail, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';

import { useUserActions } from '@/hooks/useUsers';
import { useToast } from '@/contexts/ToastContext';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import logoSvg from '@/assets/logo.svg';

interface RegisterFormProps {
  isRegisterMode: boolean;
  onToggleMode: (mode: 'login' | 'register') => void;
  onSuccessRegister: (createdEmail: string) => void;
  onSendMailVerification: (email: string) => Promise<boolean>;
}

export function RegisterForm({ 
  isRegisterMode, 
  onToggleMode, 
  onSuccessRegister,
  onSendMailVerification 
}: RegisterFormProps) {
  const { addToast } = useToast();
  const { createUser, loading, error } = useUserActions();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    verification_token: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = name === 'username' 
      ? value.replace(/^@/, '').replace(/\s+/g, '') 
      : value;

    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
  }, []);

  const passwordStrength = useMemo(() => {
    const pwd = formData.password;
    if (!pwd) return { score: 0, label: '', color: '', text: '' };

    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8 && /[0-9]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, label: 'Fraca', color: 'bg-rose-500', text: 'text-rose-500' };
    if (score === 2) return { score: 2, label: 'Média', color: 'bg-amber-500', text: 'text-amber-500' };
    return { score: 3, label: 'Forte', color: 'bg-emerald-500', text: 'text-emerald-500' };
  }, [formData.password]);

  const handleSendCode = useCallback(async () => {
    const cleanEmail = formData.email.trim();
    if (!cleanEmail) {
      addToast('Insira um e-mail válido primeiro.', 'error');
      return;
    }

    setIsSendingCode(true);
    try {
      const success = await onSendMailVerification(cleanEmail);
      if (success) {
        setCodeSent(true);
        addToast('Código enviado para seu e-mail!', 'success');
      }
    } finally {
      setIsSendingCode(false);
    }
  }, [formData.email, onSendMailVerification, addToast]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const cleanName = formData.name.trim();
      const cleanEmail = formData.email.trim();
      const formattedUsername = formData.username.trim();

      if (!cleanName || !cleanEmail || !formData.password || !formData.verification_token) return;

      const newUser = await createUser({
        name: cleanName,
        email: cleanEmail,
        password: formData.password,
        username: formattedUsername !== '' ? formattedUsername : null,
        verification_token: formData.verification_token,
      });

      if (newUser) {
        addToast('Conta criada com sucesso! Faça login para acessar.', 'success');
        onSuccessRegister(cleanEmail);
      }
    },
    [formData, createUser, addToast, onSuccessRegister]
  );

  return (
    <div
      className={`w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center transition-all duration-500 ease-in-out ${
        !isRegisterMode ? 'opacity-0 pointer-events-none hidden md:flex' : 'opacity-100'
      }`}
    >
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-4 md:hidden">
          <img src={logoSvg} alt="Logo Peel" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold tracking-tight text-app-text">Peel</span>
        </div>

        <h1 className="text-2xl font-extrabold text-app-text tracking-tight mb-1">
          Crie sua conta
        </h1>
        <p className="text-xs text-app-muted">
          Junte-se ao Peel e comece a colar suas ideias.
        </p>
      </div>

      {error && <ErrorMessage message={error} className="mb-3" />}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="space-y-1">
          <label htmlFor="reg-name" className="text-xs font-semibold text-app-muted ml-1">
            Seu Nome
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-app-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="reg-name"
              name="name"
              type="text"
              placeholder="Como quer ser chamado?"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="reg-username" className="text-xs font-semibold text-app-muted ml-1">
            Username
          </label>
          <div className="relative">
            <AtSign className="w-4 h-4 text-app-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="reg-username"
              name="username"
              type="text"
              placeholder="seu_username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="reg-email" className="text-xs font-semibold text-app-muted ml-1">
            E-mail
          </label>
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-app-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                id="reg-email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading || codeSent}
                className="pl-9"
                required
              />
            </div>
            <Button
              type="button"
              onClick={handleSendCode}
              isLoading={isSendingCode}
              disabled={loading || codeSent || !formData.email}
              className="text-xs whitespace-nowrap px-3"
            >
              {codeSent ? 'Enviado' : 'Enviar código'}
            </Button>
          </div>
        </div>

        {codeSent && (
          <div className="space-y-1 animate-in fade-in duration-300">
            <label htmlFor="reg-code" className="text-xs font-semibold text-app-muted ml-1">
              Código de Verificação
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-app-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                id="reg-code"
                name="verification_token"
                type="text"
                placeholder="Digite o código de 6 dígitos"
                value={formData.verification_token}
                onChange={handleChange}
                disabled={loading}
                className="pl-9"
                maxLength={6}
                required
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <div className="flex items-center justify-between px-1">
            <label htmlFor="reg-password" className="text-xs font-semibold text-app-muted">
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
              id="reg-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-app-muted hover:text-app-text cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
          disabled={!codeSent || !formData.verification_token}
          className="mt-1"
        >
          Criar minha conta
        </Button>
      </form>

      <div className="mt-4 text-center md:hidden">
        <p className="text-xs text-app-muted">
          Já possui uma conta?{' '}
          <button
            type="button"
            onClick={() => onToggleMode('login')}
            className="font-bold text-app-accent hover:underline cursor-pointer ml-1"
          >
            Fazer Login
          </button>
        </p>
      </div>
    </div>
  );
}