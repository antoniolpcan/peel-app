import { useState } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { useColors } from '@/hooks/useColors';

import { PageLayout } from '@/components/layout/PageLayout';
import { PostPinboard } from '@/components/posts/PostPinboard';
import { PostModalsManager } from '@/components/posts/PostModalsManager';
import { ColorFilter } from '@/components/ui/ColorFilter';
import { SearchInput } from '@/components/ui/SearchInput';
import { PinboardHeader } from '@/components/posts/PinboardHeader';

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

  const hasActiveFilters = Boolean(search.trim()) || selectedColorId !== null;

  return (
    <PageLayout onOpenCreateModal={() => setIsModalOpen(true)}>
      <PinboardHeader title="Mural Público" subtitle="Veja o que as pessoas andam colando por aí.">
        <ColorFilter colors={colors} selectedColorId={selectedColorId} onSelectColor={setSelectedColorId} />
        <SearchInput value={search} onChange={setSearch} placeholder="Pesquisar por post, @username..." />
      </PinboardHeader>

      {error ? (
        <div className="text-center py-20 text-red-500 font-medium">{error}</div>
      ) : (
        <PostPinboard
          posts={filteredPosts}
          loading={loading}
          hasMore={hasMore}
          hasActiveFilters={hasActiveFilters}
          emptyMessage="Ainda não há nenhum post-it no mural."
          endOfListMessage="Você chegou ao fim do mural!"
          onFetchMore={fetchMorePosts}
          onLike={handleLike}
          onDelete={handleDelete}
          onSelectPost={setSelectedPost}
        />
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