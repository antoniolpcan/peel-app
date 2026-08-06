import { useEffect, useCallback } from 'react';
import { Loader2, SearchX, CheckCircle2, StickyNote } from 'lucide-react';
import type { PostResponse } from '@/services/types';
import { PostItGrid } from './PostItGrid';
import { PostItSkeleton } from './PostItSkeleton';

interface PostPinboardProps {
  posts: PostResponse[];
  loading: boolean;
  hasMore: boolean;
  onFetchMore: () => void;
  onLike: (id: number) => Promise<PostResponse | null>;
  onDelete: (id: number) => Promise<boolean>;
  onSelectPost: (value: PostResponse | null) => void;
  hasActiveFilters?: boolean;
  emptyMessage?: string;
  endOfListMessage?: string;
}

export function PostPinboard({
  posts,
  loading,
  hasMore,
  onFetchMore,
  onLike,
  onDelete,
  onSelectPost,
  hasActiveFilters = false,
  emptyMessage = 'Ainda não há nenhum post-it por aqui.',
  endOfListMessage = 'Você chegou ao fim do mural!',
}: PostPinboardProps) {

  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const scrollThreshold = 300;
    const isNearBottom = 
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - scrollThreshold;

    if (isNearBottom) {
      onFetchMore();
    }
  }, [loading, hasMore, onFetchMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (posts.length === 0 && loading) {
    return <PostItSkeleton count={6} />;
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-app-card rounded-3xl border border-app-border shadow-xs transition-colors gap-3">
        {hasActiveFilters ? (
          <>
            <SearchX className="w-10 h-10 text-app-muted/60" />
            <p className="text-app-muted text-base font-medium">
              Nenhum post-it encontrado para esse filtro ou busca.
            </p>
          </>
        ) : (
          <>
            <StickyNote className="w-10 h-10 text-app-muted/60" />
            <p className="text-app-muted text-base font-medium">{emptyMessage}</p>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <PostItGrid
        posts={posts}
        handleLike={onLike}
        handleDelete={onDelete}
        setSelectedPost={onSelectPost}
      />

      {loading && (
        <div className="flex justify-center items-center py-8">
          <p className="text-sm font-medium text-app-muted flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-app-accent" />
            <span>Buscando mais post-its...</span>
          </p>
        </div>
      )}

      {!hasMore && (
        <div className="flex items-center justify-center gap-2 py-10 text-xs font-semibold text-app-muted">
          <CheckCircle2 className="w-4 h-4 text-app-accent" />
          <span>{endOfListMessage}</span>
        </div>
      )}
    </>
  );
}