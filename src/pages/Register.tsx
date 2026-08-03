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
      addToast('Conta criada com sucesso! Faça login para continuar.', 'success');
      navigate('/login');
    }
  };

  return (
    <AuthLayout
      title="Crie sua conta"
      footerText="Já tem uma conta?"
      footerLinkText="Entre aqui"
      footerLinkTo="/login"
    >
      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <Input
          name="name"
          type="text"
          placeholder="Seu nome"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          name="username"
          type="text"
          placeholder="Nome de usuário (opcional)"
          value={formData.username}
          onChange={handleChange}
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Button type="submit" isLoading={loading} loadingText="Criando...">
          Cadastrar
        </Button>
      </form>
    </AuthLayout>
  );
}