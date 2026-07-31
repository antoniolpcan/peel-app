import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthApi } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">🌿 Peel</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Entre na sua conta</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome de usuário ou E-mail"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-indigo-500 transition-colors"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-indigo-500 transition-colors"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 mt-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Ainda não tem conta?{' '}
          <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}