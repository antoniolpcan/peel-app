import { memo } from 'react';
import { CreatePostModal } from '@/components/posts/CreatePostModal';
import { ViewPostModal } from '@/components/posts/ViewPostModal';
import type { PostResponse } from '@/services/types';

interface PostModalsManagerProps {
  isCreateOpen: boolean;
  onCloseCreate: () => void;
  onSuccessCreate: () => void;
  selectedPost: PostResponse | null;
  onCloseView: () => void;
  onLikePost: (postId: string) => Promise<PostResponse | null>;
}

export const PostModalsManager = memo(function PostModalsManager({
  isCreateOpen,
  onCloseCreate,
  onSuccessCreate,
  selectedPost,
  onCloseView,
  onLikePost,
}: PostModalsManagerProps) {
  return (
    <>
      {isCreateOpen && (
        <CreatePostModal 
          onClose={onCloseCreate} 
          onSuccess={onSuccessCreate} 
        />
      )}

      {selectedPost && (
        <ViewPostModal
          key={selectedPost.id}
          post={selectedPost}
          onClose={onCloseView}
          handleLike={onLikePost}
        />
      )}
    </>
  );
});