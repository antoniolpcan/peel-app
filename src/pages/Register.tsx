import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await api.createUser({ name, email, password });
      alert('Conta criada com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (error) {
      alert('Erro ao criar conta. Verifique os dados e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2 text-center">🌿 Peel</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Crie sua conta</h2>
        
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Seu nome" 
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-indigo-500"
            required
          />
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
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Criando...' : 'Cadastrar'}
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