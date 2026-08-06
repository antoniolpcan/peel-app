import { useState, useMemo, useCallback } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { useColors } from '@/hooks/useColors';

import { PageLayout } from '@/components/layout/PageLayout';
import { PostPinboard } from '@/components/posts/PostPinboard';
import { PostModalsManager } from '@/components/posts/PostModalsManager';
import { ColorFilter } from '@/components/ui/ColorFilter';
import { SearchInput } from '@/components/ui/SearchInput';
import { PinboardHeader } from '@/components/posts/PinboardHeader';
import type { BasicUserResponse } from '@/services/types';

type PostWithUser = {
  user?: BasicUserResponse | null;
  author?: BasicUserResponse | null;
};

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

  const handleOpenCreateModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCloseViewModal = useCallback(() => {
    setSelectedPost(null);
  }, [setSelectedPost]);

  const handleSuccessCreate = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = useMemo(() => {
    const searchLower = search.toLowerCase().trim();

    return posts.filter((post) => {
      if (selectedColorId !== null && post.color_id !== selectedColorId) {
        return false;
      }

      if (!searchLower) return true;

      const postWithUser = post as typeof post & PostWithUser;
      const author = postWithUser.user || postWithUser.author;

      const titleMatch = post.title?.toLowerCase().includes(searchLower) ?? false;
      const bodyMatch = post.body?.toLowerCase().includes(searchLower) ?? false;
      const authorNameMatch = author?.name?.toLowerCase().includes(searchLower) ?? false;
      const authorUsernameMatch = author?.username?.toLowerCase().includes(searchLower) ?? false;

      return titleMatch || bodyMatch || authorNameMatch || authorUsernameMatch;
    });
  }, [posts, selectedColorId, search]);

  const hasActiveFilters = useMemo(
    () => Boolean(search.trim()) || selectedColorId !== null,
    [search, selectedColorId]
  );

  return (
    <PageLayout onOpenCreateModal={handleOpenCreateModal}>
      <PinboardHeader 
        title="Mural Público" 
        subtitle="Veja o que as pessoas andam colando por aí."
      >
        <ColorFilter 
          colors={colors} 
          selectedColorId={selectedColorId} 
          onSelectColor={setSelectedColorId} 
        />
        <SearchInput 
          value={search} 
          onChange={setSearch} 
          placeholder="Pesquisar por post, @username..." 
        />
      </PinboardHeader>

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
        onCloseCreate={handleCloseCreateModal}
        onSuccessCreate={handleSuccessCreate}
        selectedPost={selectedPost}
        onCloseView={handleCloseViewModal}
        onLikePost={handleLike}
      />
    </PageLayout>
  );
}