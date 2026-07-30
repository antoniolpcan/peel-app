import type { PostResponse } from "../api/types"
import { UserBadge } from "./UserBadge";


interface PostItGrid {
    posts: PostResponse[];
    handleLike: (id: number) => Promise<void>;
    handleDelete: (id: number) => Promise<void>;
    setSelectedPost: (value: React.SetStateAction<PostResponse | null>) => void;
}

export function PostItGrid({posts, handleLike, handleDelete, setSelectedPost}: PostItGrid){

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <div 
                key={post.id} 
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col min-h-62.5 relative cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
                <UserBadge userId={post.user_id} />
                <h2 onClick={() => setSelectedPost(post)} 
                    className="text-xl font-bold mb-2">
                    {post.title}
                </h2>
                <p onClick={() => setSelectedPost(post)} 
                    className="text-gray-600 grow whitespace-pre-wrap line-clamp-6">
                    {post.body || "Post-it vazio..."}
                </p>

                <div className="flex justify-between items-center mt-4 text-xs text-gray-400 border-t pt-4">
                    <span>{new Date(post.created_at || '').toLocaleDateString()}</span>
                    <div className="flex gap-4">
                        <button onClick={() => handleLike(post.id)} className="flex items-center gap-1 hover:text-pink-500 transition-colors">
                        <span>📌</span> {post.likes}
                        </button>
                        <button onClick={() => handleDelete(post.id)} className="hover:text-red-500 transition-colors">
                        🗑️
                        </button>
                    </div>
                </div>
            </div>
          ))}
        </div>
    )

}