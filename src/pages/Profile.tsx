import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import { useUser } from '../hooks/useUser';
import { usePosts } from '../hooks/usePosts';
import type { PostResponse } from '../api/types';
import { CreatePostModal } from '../components/PostCreateModal';
import { ViewPostModal } from '../components/PostViewModal';
import { PostItGrid } from '../components/PostItGrid';

export function Profile() {
  const { loggedUserId, logout, isAuthenticated } = useAuth();
  const { user, isFetching, isUpdating, fetchUser, updateUser } = useUser();
  const { posts, fetchPosts, handleDelete, handleLike } = usePosts();
  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', username: '' });

  useEffect(() => {
    if (loggedUserId) {
      fetchPosts({ user_id: loggedUserId });
    }
  }, [loggedUserId]);
    
  useEffect(() => {
    if (loggedUserId) {
      fetchUser(loggedUserId);
    }
  }, [loggedUserId]);

  const handleEditClick = () => {
    if (user) {
      setEditForm({
        name: user.name || '',
        bio: user.bio || '',
        username: user.username || ''
      });
      setIsEditing(true);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser(editForm, {
      onSuccess: () => {
        setIsEditing(false);
        alert('Perfil atualizado com sucesso!');
      },
      onError: () => {
        alert('Erro ao atualizar perfil.');
      }
    });
  };

  if (isFetching) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Usuário não encontrado.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={isAuthenticated} logout={logout} setIsModalOpen={setIsModalOpen}/>

      <div className="max-w-6xl mx-auto py-10 px-8">
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">{user.name}</h1>
                <p className="text-gray-500">{user.username ? `@${user.username}` : user.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Membro desde {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {!isEditing && (
              <button 
                onClick={() => handleEditClick()}
                className="bg-gray-100 hover:bg-gray-200 text-slate-800 px-4 py-2 rounded-xl transition-colors font-medium"
              >
                Editar Perfil
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="flex flex-col gap-4 border-t border-gray-100 pt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input 
                  type="text" 
                  value={editForm.name}
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input 
                  type="text" 
                  value={editForm.username}
                  onChange={e => setEditForm({...editForm, username: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea 
                  value={editForm.bio}
                  onChange={e => setEditForm({...editForm, bio: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-indigo-500 resize-none h-24"
                  placeholder="Fale um pouco sobre você..."
                />
              </div>
              
              <div className="flex gap-3 justify-end mt-4">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          ) : (
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Sobre mim</h3>
              <p className="text-gray-600 whitespace-pre-wrap">
                {user.bio || "Nenhuma bio cadastrada ainda. Clique em editar para adicionar!"}
              </p>
            </div>
          )}
        </div>
        
      </div>
      <div className="max-w-6xl mx-auto py-10 px-8">
        <h1 className="text-3xl font-bold text-slate-800">Mural de {user.name}</h1>
        <p className="text-gray-500 mb-8"></p>
        <PostItGrid 
              posts={posts} 
              handleLike={handleLike}
              handleDelete={handleDelete}
              setSelectedPost={setSelectedPost}
        />
      </div>

      {isModalOpen && (
        <CreatePostModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchPosts} 
        />
      )}
      
      {selectedPost && (
        <ViewPostModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)} 
        />
      )}
      
    </div>
  );
}