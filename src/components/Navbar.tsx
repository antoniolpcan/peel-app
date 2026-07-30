import { Link } from 'react-router-dom';

interface NavbarProps {
    isAuthenticated: boolean;
    logout: () => void;
    setIsModalOpen: (value: React.SetStateAction<boolean>) => void
}

export function Navbar({isAuthenticated, logout, setIsModalOpen}: NavbarProps){
    return (
        <div>
            <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-indigo-600">🌿 Peel</span>
                </div>
                <nav className="flex items-center gap-6 font-medium text-gray-600">
                    <Link to="/" className="hover:text-indigo-600 border-indigo-600 pb-1">Mural</Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/perfil" className="border-indigo-600 hover:text-indigo-600 pb-1">Meu Perfil</Link>
                            <button onClick={logout} className="border-indigo-600 hover:text-indigo-600 pb-1">Logout</button>
                            <button onClick={() => setIsModalOpen(true)}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded-full transition-colors">
                                + Novo Post-it
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="bg-gray-200 hover:bg-gray-300 text-slate-800 px-4 py-1 rounded-full transition-colors">
                            Fazer Login
                        </Link>
                    )}
                </nav>
            </header>
        </div>   
    )
}