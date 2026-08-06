import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
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
          <Input
            id="register-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Como quer ser chamado?"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            required
            autoFocus
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="register-username" className="text-xs font-semibold text-app-muted ml-1">
            Nome de Usuário
          </label>
          <Input
            id="register-username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="@seu_username"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="register-email" className="text-xs font-semibold text-app-muted ml-1">
            E-mail
          </label>
          <Input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="register-password" className="text-xs font-semibold text-app-muted ml-1">
            Senha
          </label>
          <div className="relative">
            <Input
              id="register-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Crie uma senha segura"
              value={formData.password}
              onChange={handleChange}
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
          loadingText="Criando conta..."
          className="mt-3"
        >
          Criar minha conta
        </Button>
      </form>
    </AuthLayout>
  );
}