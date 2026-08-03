import { useEffect, useState } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { useColors } from '@/hooks/useColors';

import { PageLayout } from '@/components/layout/PageLayout';
import { PostItGrid } from '@/components/posts/PostItGrid';
import { PostModalsManager } from '@/components/posts/PostModalsManager';
import { ColorFilter } from '@/components/ui/ColorFilter';
import { SearchInput } from '@/components/ui/SearchInput';
import { PinboardHeader } from '@/components/posts/PinBoardHeader';

export function Feed() {
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
  } = usePosts();

  const { colors } = useColors();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200) {
        fetchMorePosts();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchMorePosts]);

  const filteredPosts = posts.filter((post) => {
    if (selectedColorId !== null && post.color_id !== selectedColorId) return false;

    const searchLower = search.toLowerCase().trim();
    if (!searchLower) return true;

    const titleMatch = post.title?.toLowerCase().includes(searchLower) || false;
    const bodyMatch = post.body?.toLowerCase().includes(searchLower) || false;
    const authorNameMatch = (post as any).user?.name?.toLowerCase().includes(searchLower) || false;
    const authorUsernameMatch = (post as any).user?.username?.toLowerCase().includes(searchLower) || false;

    return titleMatch || bodyMatch || authorNameMatch || authorUsernameMatch;
  });

  return (
    <PageLayout onOpenCreateModal={() => setIsModalOpen(true)}>
      <PinboardHeader title="Mural Público" subtitle="Veja o que as pessoas andam colando por aí.">
        <ColorFilter colors={colors} selectedColorId={selectedColorId} onSelectColor={setSelectedColorId} />
        <SearchInput value={search} onChange={setSearch} placeholder="Pesquisar por post, @username..." />
      </PinboardHeader>

      {posts.length === 0 && loading ? (
        <div className="text-center py-20 text-app-muted animate-pulse">
          Carregando mural...
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20 bg-app-card rounded-3xl border border-app-border shadow-xs transition-colors">
          <p className="text-app-muted text-lg">Nenhum post-it encontrado.</p>
        </div>
      ) : (
        <>
          <PostItGrid posts={filteredPosts} handleLike={handleLike} handleDelete={handleDelete} setSelectedPost={setSelectedPost} />

          {loading && (
            <div className="flex justify-center items-center py-8">
              <p className="text-sm font-medium text-app-muted animate-pulse flex items-center gap-2">
                <span>📌</span> Buscando mais post-its...
              </p>
            </div>
          )}

          {!hasMore && (
            <div className="text-center py-10 text-xs text-app-muted">
              🎉 Você chegou ao fim do mural!
            </div>
          )}
        </>
      )}

      <PostModalsManager
        isCreateOpen={isModalOpen}
        onCloseCreate={() => setIsModalOpen(false)}
        onSuccessCreate={fetchPosts}
        selectedPost={selectedPost}
        onCloseView={() => setSelectedPost(null)}
        onLikePost={handleLike}
      />
    </PageLayout>
  );
}