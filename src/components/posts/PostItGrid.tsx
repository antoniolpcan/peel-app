import type { PostResponse } from '@/services/types';
import { PostItCard } from './PostItCard';

interface PostItGridProps {
  posts: PostResponse[];
  handleLike: (id: number) => Promise<PostResponse | null>;
  handleDelete: (id: number) => Promise<boolean>;
  setSelectedPost: (value: PostResponse | null) => void;
}

const randomRotate = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2', 'rotate-0'];

export function PostItGrid({ posts, handleLike, handleDelete, setSelectedPost }: PostItGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
      {posts.map((post, index) => (
        <PostItCard
          key={post.id}
          post={post}
          rotateClass={randomRotate[index % randomRotate.length]}
          onClick={() => setSelectedPost(post)}
          onLike={(e, id) => {
            e.stopPropagation();
            handleLike(id);
          }}
          onDelete={(e, id) => {
            e.stopPropagation();
            handleDelete(id);
          }}
        />
      ))}
    </div>
  );
}