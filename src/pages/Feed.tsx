import { useState, useMemo, useCallback } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/contexts/AuthContext';
import { Shuffle } from 'lucide-react';

import { PageLayout } from '@/components/layout/PageLayout';
import { PostPinboard } from '@/components/posts/PostPinboard';
import { PostModalsManager } from '@/components/posts/PostModalsManager';
import { ColorFilter } from '@/components/ui/ColorFilter';
import { SearchInput } from '@/components/ui/SearchInput';

export type FeedTab = 'public' | 'following';

const shuffleArray = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export function Feed() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<FeedTab>('public');

  const {
    posts,
    selectedPost,
    setSelectedPost,
    loading,
    error,
    hasMore,
    refetch: fetchPosts,
    fetchMorePosts,
    handleLike,
    handleDelete,
  } = usePosts({ feedType: activeTab });

  const { colors } = useColors();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const handleOpenCreateModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseCreateModal = useCallback(() => setIsModalOpen(false), []);
  const handleCloseViewModal = useCallback(() => setSelectedPost(null), [setSelectedPost]);
  const handleSuccessCreate = useCallback(() => fetchPosts(), [fetchPosts]);

  const handleShuffle = useCallback(() => {
    setShuffleSeed((prev) => prev + 1);
  }, []);

  const filteredPosts = useMemo(() => {
    const searchLower = search.toLowerCase().trim();

    let result = posts.filter((post) => {
      if (selectedColorId !== null && post.color_id !== selectedColorId) {
        return false;
      }

      if (!searchLower) return true;

      const author = post.user;
      const titleMatch = post.title?.toLowerCase().includes(searchLower) ?? false;
      const bodyMatch = post.body?.toLowerCase().includes(searchLower) ?? false;
      const authorNameMatch = author?.name?.toLowerCase().includes(searchLower) ?? false;
      const authorUsernameMatch = author?.username?.toLowerCase().includes(searchLower) ?? false;

      return titleMatch || bodyMatch || authorNameMatch || authorUsernameMatch;
    });

    if (activeTab === 'public' && shuffleSeed > 0) {
      result = shuffleArray(result);
    }

    return result;
  }, [posts, selectedColorId, search, activeTab, shuffleSeed]);

  const hasActiveFilters = useMemo(
    () => Boolean(search.trim()) || selectedColorId !== null,
    [search, selectedColorId]
  );

  return (
    <PageLayout onOpenCreateModal={handleOpenCreateModal}>
      <div className="flex flex-col gap-6 mb-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-app-text tracking-tight">
              {activeTab === 'public' ? 'Mural Público' : 'Mural de Seguindo'}
            </h1>
            <p className="text-sm text-app-muted mt-1">
              {activeTab === 'public'
                ? 'Veja o que as pessoas andam colando por aí.'
                : 'Post-its recentes das pessoas que você segue.'}
            </p>
          </div>

          <div 
            role="tablist"
            aria-label="Opções do Mural"
            className="flex items-center gap-1.5 p-1 bg-app-card rounded-2xl border border-app-border shrink-0 self-start md:self-auto shadow-xs"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'public'}
              onClick={() => {
                setActiveTab('public');
                setShuffleSeed(0);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'public'
                  ? 'bg-app-bg text-app-text shadow-xs border border-app-border/40'
                  : 'text-app-muted hover:text-app-text'
              }`}
            >
              Mural Público
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'following'}
              onClick={() => {
                setActiveTab('following');
                setShuffleSeed(0);
              }}
              disabled={!isAuthenticated}
              title={!isAuthenticated ? 'Faça login para ver quem você segue' : ''}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'following'
                  ? 'bg-app-bg text-app-text shadow-xs border border-app-border/40'
                  : 'text-app-muted hover:text-app-text'
              } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              Seguindo
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2.5 bg-app-card/60 rounded-2xl border border-app-border/80 backdrop-blur-xs">
          
          <div className="flex items-center gap-2 w-full sm:w-auto grow">
            <div className="grow sm:max-w-80">
              <SearchInput 
                value={search} 
                onChange={setSearch} 
                placeholder="Pesquisar por post, @username..." 
              />
            </div>

            {activeTab === 'public' && (
              <button
                type="button"
                onClick={handleShuffle}
                title="Embaralhar post-its"
                className="flex items-center justify-center gap-2 p-2.5 sm:px-3.5 
                sm:py-2 text-xs font-semibold bg-app-card hover:bg-app-bg text-app-text/90 
                hover:text-app-text border border-app-border/80 hover:border-app-border 
                rounded-xl transition-all duration-150 active:scale-95 cursor-pointer 
                shrink-0 shadow-xs group"
              >
                <Shuffle className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-app-muted group-hover:text-app-text transition-colors shrink-0" />
                <span className="hidden sm:inline">Embaralhar</span>
              </button>
            )}
          </div>

          <div className="w-full sm:w-auto flex justify-start sm:justify-end overflow-hidden">
            <ColorFilter 
              colors={colors} 
              selectedColorId={selectedColorId} 
              onSelectColor={setSelectedColorId} 
            />
          </div>
        </div>

      </div>

      {error ? (
        <div role="alert" className="text-center py-20 text-red-500 font-medium bg-app-card/50 rounded-3xl border border-app-border my-6">
          {error}
        </div>
      ) : (
        <PostPinboard
          posts={filteredPosts}
          loading={loading}
          hasMore={hasMore}
          hasActiveFilters={hasActiveFilters}
          emptyMessage={
            activeTab === 'following'
              ? 'Nenhum post-it encontrado. Comece a seguir pessoas para ver os recados delas aqui!'
              : 'Ainda não há nenhum post-it no mural.'
          }
          endOfListMessage="Você chegou ao fim do mural!"
          onFetchMore={fetchMorePosts}
          onLike={handleLike}
          onDelete={handleDelete}
          onSelectPost={setSelectedPost}
        />
      )}

      <PostModalsManager
        isCreateOpen={isModalOpen}
        onCloseCreate={handleCloseCreateModal}
        onSuccessCreate={handleSuccessCreate}
        selectedPost={selectedPost}
        onCloseView={handleCloseViewModal}
        onLikePost={handleLike}
      />
    </PageLayout>
  );
}