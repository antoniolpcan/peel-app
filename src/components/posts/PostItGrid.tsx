import React, { useCallback } from 'react';
import type { PostResponse } from '@/services/types';
import { PostItCard } from './PostItCard';

interface PostItGridProps {
  posts: PostResponse[];
  handleLike: (id: string) => Promise<PostResponse | null>;
  handleDelete: (id: string) => Promise<boolean>;
  setSelectedPost: (value: PostResponse | null) => void;
}

const ROTATIONS = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2', 'rotate-0'];

export function PostItGrid({ 
  posts, 
  handleLike, 
  handleDelete, 
  setSelectedPost 
}: PostItGridProps) {

  const handleLikeClick = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    handleLike(id);
  }, [handleLike]);

  const handleDeleteClick = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    handleDelete(id);
  }, [handleDelete]);

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-app-border/60 rounded-3xl p-8">
        <span className="text-4xl mb-3">📌</span>
        <h3 className="text-lg font-semibold text-app-text">Nenhum Post-it encontrado</h3>
        <p className="text-sm text-app-muted mt-1 max-w-sm">
          Seja o primeiro a colar uma nova ideia ou recado neste mural!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
      {posts.map((post, index) => (
        <PostItCard
          key={post.id}
          post={post}
          rotateClass={ROTATIONS[index % ROTATIONS.length]}
          onSelect={setSelectedPost}
          onLike={handleLikeClick}
          onDelete={handleDeleteClick}
        />
      ))}
    </div>
  );
}