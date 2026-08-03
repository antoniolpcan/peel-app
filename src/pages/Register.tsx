import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const { createUser, loading, error } = useUserActions();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const newUser = await createUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      username: formData.username.trim() !== '' ? formData.username : null,
    });

    if (newUser) {
      addToast('Conta criada com sucesso! Faça login para continuar. ✨', 'success');
      navigate('/login');
    }
  };

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Junte-se ao Peel e comece a colar suas ideias"
      footerText="Já possui uma conta?"
      footerLinkText="Fazer Login"
      footerLinkTo="/login"
    >
      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-app-muted ml-1">
            Seu Nome
          </label>
          <Input
            name="name"
            type="text"
            placeholder="Como quer ser chamado?"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-app-muted ml-1">
            Nome de Usuário <span className="font-normal opacity-70">(opcional)</span>
          </label>
          <Input
            name="username"
            type="text"
            placeholder="@seu_username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-app-muted ml-1">
            E-mail
          </label>
          <Input
            name="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-app-muted ml-1">
            Senha
          </label>
          <Input
            name="password"
            type="password"
            placeholder="Crie uma senha segura"
            value={formData.password}
            onChange={handleChange}
            required
          />
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