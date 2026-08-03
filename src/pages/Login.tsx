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
      addToast('Bem-vindo de volta! 🌿', 'success');
      saveSession(response.access_token);
    } else {
      addToast(error || 'Falha no login. Verifique suas credenciais.', 'error');
    }
  };

  return (
    <AuthLayout
      title="Que bom te ver de novo!"
      subtitle="Entre com suas credenciais para acessar seus post-its"
      footerText="Ainda não tem uma conta?"
      footerLinkText="Cadastre-se grátis"
      footerLinkTo="/register"
    >
      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-app-muted ml-1">
            Usuário ou E-mail
          </label>
          <Input
            type="text"
            placeholder="Ex: example ou example@email.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-app-muted ml-1">
            Senha
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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