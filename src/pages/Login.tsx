import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthApi } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { login: saveSession } = useAuth();
  const { executeLogin, loading, error } = useAuthApi();
  const { addToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await executeLogin(username, password);

    if (response?.access_token) {
      addToast('Login realizado com sucesso!', 'success');
      saveSession(response.access_token);
    } else {
      addToast(error || 'Falha no login. Verifique suas credenciais.', 'error');
    }
  };

  return (
    <AuthLayout
      title="Entre na sua conta"
      footerText="Ainda não tem conta?"
      footerLinkText="Cadastre-se"
      footerLinkTo="/register"
    >
      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder="Nome de usuário ou E-mail"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" isLoading={loading} loadingText="Entrando...">
          Entrar
        </Button>
      </form>
    </AuthLayout>
  );
}