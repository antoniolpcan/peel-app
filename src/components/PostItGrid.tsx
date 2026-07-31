import type { PostResponse } from '@/services/types';
import { UserBadge } from './UserBadge';
import { formatRelativeDate } from '@/utils/formatDate';

interface PostItGridProps {
  posts: PostResponse[];
  handleLike: (id: number) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  setSelectedPost: (value: PostResponse | null) => void;
}

const randomRotate = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2', 'rotate-0'];

export function PostItGrid({ posts, handleLike, handleDelete, setSelectedPost }: PostItGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
      {posts.map((post, index) => {
        const rotateClass = randomRotate[index % randomRotate.length];

        return (
          <div
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className={`bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col min-h-62.5 relative cursor-pointer hover:shadow-xl hover:scale-105 hover:rotate-0 hover:z-10 transition-all duration-300 ${rotateClass}`}
            style={
              post.color
                ? { backgroundColor: post.color.hex_code }
                : { backgroundColor: '#FEF9C3' }
            }
          >
            <UserBadge userId={post.user_id} />

            <h2 className="text-xl font-bold mb-2 text-slate-800 leading-snug">
              {post.title}
            </h2>

            <p className="text-slate-700/90 grow whitespace-pre-wrap line-clamp-6 text-sm leading-relaxed">
              {post.body || 'Post-it vazio...'}
            </p>

            <div className="flex justify-between items-center mt-4 text-xs text-slate-600/70 border-t border-black/5 pt-4">
              <span>{formatRelativeDate(post.created_at)}</span>
              
              <div className="flex gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(post.id);
                  }}
                  className="flex items-center gap-1 hover:scale-125 transition-transform cursor-pointer"
                  title="Fixar/Curtir"
                >
                  <span>📌</span> <span className="font-semibold">{post.likes ?? 0}</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(post.id);
                  }}
                  className="hover:scale-125 hover:text-red-600 transition-all cursor-pointer"
                  title="Deletar"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}