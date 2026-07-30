import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await api.login(email, password);
      login(data.access_token);
    } catch (error) {
      alert('Falha no login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">🌿 Peel</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Entre na sua conta</h2>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-indigo-500"
            required
          />
          <input 
            type="password" 
            placeholder="Senha" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-indigo-500"
            required
          />
          <button 
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors"
          >
            Entrar
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