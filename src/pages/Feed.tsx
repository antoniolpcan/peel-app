import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts, usePostActions } from '@/hooks/usePosts';
import { useColors } from '@/hooks/useColors';
import type { PostResponse } from '@/services/types';

import { Navbar } from '@/components/Navbar';
import { PostItGrid } from '@/components/PostItGrid';
import { CreatePostModal } from '@/components/PostCreateModal';
import { ViewPostModal } from '@/components/PostViewModal';

export function Feed() {
  const { logout, isAuthenticated } = useAuth();

  const {
    posts,
    setPosts,
    loading,
    error,
    hasMore,
    refetch: fetchPosts,
    fetchMorePosts,
  } = usePosts();

  const { deletePost, likePost } = usePostActions();
  const { colors } = useColors();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null);
  const [search, setSearch] = useState('');
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 200
      ) {
        fetchMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchMorePosts]);

  const filteredPosts = posts.filter((post) => {
    if (selectedColorId !== null && post.color_id !== selectedColorId) {
      return false;
    }

    const searchLower = search.toLowerCase().trim();
    if (!searchLower) return true;

    const titleMatch = post.title?.toLowerCase().includes(searchLower) || false;
    const bodyMatch = post.body?.toLowerCase().includes(searchLower) || false;
    const authorNameMatch = (post as any).user?.name?.toLowerCase().includes(searchLower) || false;
    const authorUsernameMatch = (post as any).user?.username?.toLowerCase().includes(searchLower) || false;

    return titleMatch || bodyMatch || authorNameMatch || authorUsernameMatch;
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

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Navbar isAuthenticated={isAuthenticated} logout={logout} setIsModalOpen={setIsModalOpen} />

      <main className="max-w-6xl mx-auto py-10 px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Mural Público</h1>
            <p className="text-gray-500 mt-1">Veja o que as pessoas andam colando por aí.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {colors.length > 0 && (
              <div className="flex items-center gap-2 bg-white px-3 py-2.5 rounded-2xl border border-gray-200 shadow-sm w-full sm:w-auto justify-center">
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

            <div className="w-full sm:w-72 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Pesquisar por post, @username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm text-slate-700 text-sm"
              />
            </div>
          </div>
        </div>

        {posts.length === 0 && loading ? (
          <div className="text-center py-20 text-gray-500 animate-pulse">Carregando mural...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200/80 shadow-sm">
            <p className="text-gray-500 text-lg">Nenhum post-it encontrado.</p>
          </div>
        ) : (
          <>
            <PostItGrid
              posts={filteredPosts}
              handleLike={handleLike}
              handleDelete={handleDelete}
              setSelectedPost={setSelectedPost}
            />

            {loading && posts.length > 0 && (
              <div className="flex justify-center items-center py-8">
                <p className="text-sm font-medium text-slate-400 animate-pulse flex items-center gap-2">
                  <span>📌</span> Buscando mais post-its...
                </p>
              </div>
            )}

            {!hasMore && posts.length > 0 && (
              <div className="text-center py-10 text-xs text-gray-400">
                🎉 Você chegou ao fim do mural!
              </div>
            )}
          </>
        )}
      </main>

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
    </div>
  );
}