import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserActions } from '@/hooks/useUsers';
import { useToast } from '@/contexts/ToastContext';

export function Register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { createUser, loading, error } = useUserActions();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const newUser = await createUser({
      name,
      email,
      password,
      username: username.trim() !== '' ? username : null,
    });

    if (newUser) {
      addToast('Conta criada com sucesso! Faça login para continuar.', 'success');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2 text-center">🌿 Peel</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Crie sua conta</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-indigo-500 transition-colors"
            required
          />
          <input
            type="text"
            placeholder="Nome de usuário (opcional)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-indigo-500 transition-colors"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {loading ? 'Criando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Entre aqui
          </Link>
        </p>
      </div>
    </div>
  );
}