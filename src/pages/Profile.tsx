import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUser, useUserActions } from '@/hooks/useUsers';
import { usePosts, usePostActions } from '@/hooks/usePosts';
import { useFollowStats, useFollowers, useFollowing } from '@/hooks/useFollows';
import { useColors } from '@/hooks/useColors';
import { useStorage } from '@/hooks/useStorage';
import type { PostResponse } from '@/services/types';
import { ImageCropModal } from '@/components/ImageCropModal';

import { Navbar } from '@/components/Navbar';
import { PostItGrid } from '@/components/PostItGrid';
import { CreatePostModal } from '@/components/PostCreateModal';
import { ViewPostModal } from '@/components/PostViewModal';
import { UserAvatar } from '@/components/UserAvatar';
import { useToast } from '@/contexts/ToastContext';

export function Profile() {
  const { loggedUserId, logout, isAuthenticated } = useAuth();

  const { addToast } = useToast();

  const { user, loading: isFetching, refetch: refetchUser } = useUser(loggedUserId || 0);
  const { updateMe, loading: isUpdating } = useUserActions();
  const { uploadImage, uploading: isUploadingImage } = useStorage();

  const { posts, setPosts, refetch: fetchPosts } = usePosts({ user_id: loggedUserId || undefined });
  const { deletePost, likePost } = usePostActions();
  const { colors } = useColors();

  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);

  const { stats, refetch: refetchStats } = useFollowStats(loggedUserId || 0);
  const { followers, loading: loadingFollowers, refetch: fetchFollowers } = useFollowers(loggedUserId || 0);
  const { following, loading: loadingFollowing, refetch: fetchFollowing } = useFollowing(loggedUserId || 0);

  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editForm, setEditForm] = useState({ name: '', bio: '', username: '' });
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [followModalType, setFollowModalType] = useState<'followers' | 'following' | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);

  const filteredPosts = posts.filter((post) => {
    if (selectedColorId !== null && post.color_id !== selectedColorId) {
      return false;
    }
    return true;
  });

  const handleLike = async (postId: number) => {
    const updatedPost = await likePost(postId);
    if (updatedPost) {
      setPosts((prev) => prev.map((p) => (p.id === postId ? updatedPost : p)));
      setSelectedPost((prev) => (prev?.id === postId ? updatedPost : prev));
    }
  };

  const handleDelete = async (postId: number) => {
    const success = await deletePost(postId);
    if (success) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      if (selectedPost?.id === postId) setSelectedPost(null);
    }
  };

  useEffect(() => {
    if (loggedUserId) {
      fetchPosts();
      refetchStats();
    }
  }, [loggedUserId]);

  const handleEditClick = () => {
    if (user) {
      setEditForm({
        name: user.name || '',
        bio: user.bio || '',
        username: user.username || '',
      });
      setSelectedAvatarId(user.avatar?.id || null);
      setAvatarPreview(user.avatar?.url || null);
      setIsEditing(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setTempImageSrc(objectUrl);
    e.target.value = '';
  };
  
  const handleCropComplete = async (croppedFile: File) => {
    setTempImageSrc(null); 

    const localUrl = URL.createObjectURL(croppedFile);
    setAvatarPreview(localUrl);

    const res = (await uploadImage(croppedFile)) as any;
    const mediaData = res?.data || res;

    if (mediaData && mediaData.id) {
      setSelectedAvatarId(mediaData.id);
      if (mediaData.url) setAvatarPreview(mediaData.url);
    } else {
      addToast('Erro ao enviar a imagem. Tente novamente.', 'error');
      setAvatarPreview(user?.avatar?.url || null);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const updated = await updateMe({
      name: editForm.name,
      bio: editForm.bio,
      username: editForm.username.trim() !== '' ? editForm.username : null,
      avatar_id: selectedAvatarId,
    });

    if (updated) {
      setIsEditing(false);
      refetchUser();
      addToast('Conta criada com sucesso! Faça login para continuar.', 'success');
    } else {
      addToast('Erro ao atualizar perfil. Tente novamente.', 'error');
    }
  };

  if (isFetching) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Carregando...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Usuário não encontrado.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={isAuthenticated} logout={logout} setIsModalOpen={setIsModalOpen} />

      <div className="max-w-6xl mx-auto py-10 px-8">
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-6">
              
              <UserAvatar 
                name={user.name} 
                avatar={user.avatar} 
                sizeClass="w-24 h-24" 
                textSizeClass="text-3xl" 
              />

              <div>
                <h1 className="text-3xl font-bold text-slate-800">{user.name}</h1>
                <p className="text-gray-500">@{user.username}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Membro desde {new Date(user.created_at).toLocaleDateString()}
                </p>

                <div className="flex gap-4 mt-3">
                  <button onClick={() => { setFollowModalType('followers'); fetchFollowers(); }} className="hover:underline text-sm cursor-pointer">
                    <span className="font-bold text-slate-800">{stats?.followers_count ?? 0}</span>{' '}
                    <span className="text-gray-500">Seguidores</span>
                  </button>
                  <button onClick={() => { setFollowModalType('following'); fetchFollowing(); }} className="hover:underline text-sm cursor-pointer">
                    <span className="font-bold text-slate-800">{stats?.following_count ?? 0}</span>{' '}
                    <span className="text-gray-500">Seguindo</span>
                  </button>
                </div>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="bg-gray-100 hover:bg-gray-200 text-slate-800 px-4 py-2 rounded-xl transition-colors font-medium cursor-pointer"
              >
                Editar Perfil
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="flex flex-col gap-5 border-t border-gray-100 pt-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto de Perfil</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs">Sem foto</span>
                    )}
                  </div>
                  
                  <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                    {isUploadingImage ? 'Enviando foto...' : 'Alterar Foto'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-indigo-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-indigo-500 resize-none h-24 text-sm"
                  placeholder="Fale um pouco sobre você..."
                />
              </div>

              <div className="flex gap-3 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUpdating || isUploadingImage}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-xl transition-colors disabled:opacity-50 cursor-pointer text-sm"
                >
                  {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          ) : (
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Sobre mim</h3>
              <p className="text-gray-600 whitespace-pre-wrap text-sm leading-relaxed">
                {user.bio || 'Nenhuma bio cadastrada ainda. Clique em editar para adicionar!'}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-10 px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-slate-800">Mural de {user.name}</h1>

          {colors.length > 0 && (
            <div className="flex items-center gap-2 bg-white px-3 py-2.5 rounded-2xl border border-gray-200 shadow-sm self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setSelectedColorId(null)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  selectedColorId === null
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Todos
              </button>
              <div className="h-4 w-px bg-gray-200 mx-1" />
              {colors.map((color) => {
                const isSelected = selectedColorId === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColorId(isSelected ? null : color.id)}
                    className={`w-6 h-6 rounded-full cursor-pointer transition-all duration-200 border-2 border-slate-900/30 ${
                      isSelected
                        ? 'scale-125 border-slate-900 ring-2 ring-indigo-500 ring-offset-1 shadow-sm'
                        : 'hover:scale-110 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color.hex_code }}
                    title={`Filtrar por ${color.name}`}
                  />
                );
              })}
            </div>
          )}
        </div>

        <PostItGrid
          posts={filteredPosts}
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
          handleLike={handleLike}
        />
      )}

      {followModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 max-h-[80vh] flex flex-col shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {followModalType === 'followers' ? 'Seguidores' : 'Seguindo'}
              </h2>
              <button
                onClick={() => setFollowModalType(null)}
                className="text-gray-400 hover:text-gray-700 font-bold text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-2">
              {(followModalType === 'followers' ? loadingFollowers : loadingFollowing) ? (
                <p className="text-center text-gray-500 py-6">Carregando...</p>
              ) : (followModalType === 'followers' ? followers : following).length === 0 ? (
                <p className="text-center text-gray-500 py-6">Nenhum usuário encontrado.</p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {(followModalType === 'followers' ? followers : following).map((item) => {
                    const listItemUser =
                      followModalType === 'followers'
                        ? (item as any).follower
                        : (item as any).following;

                    if (!listItemUser) return null;

                    return (
                      <li
                        key={item.id}
                        className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer"
                      >
                        {listItemUser.avatar?.url ? (
                          <img
                            src={listItemUser.avatar.url}
                            alt={listItemUser.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                            {listItemUser.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-800">{listItemUser.name}</p>
                          <p className="text-sm text-gray-500">
                            {listItemUser.username ? `@${listItemUser.username}` : ''}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {tempImageSrc && (
        <ImageCropModal
          imageSrc={tempImageSrc}
          onClose={() => setTempImageSrc(null)}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}