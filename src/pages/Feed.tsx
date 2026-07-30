import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { PostResponse } from '../api/types';
import { CreatePostModal } from '../components/PostCreateModal';
import { ViewPostModal } from '../components/PostViewModal';
import { Navbar } from '../components/Navbar';
import { PostItGrid } from '../components/PostItGrid';
import { usePosts } from '../hooks/usePosts';

export function Feed() {
  const { posts, fetchPosts, handleDelete, handleLike } = usePosts();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null);
  const { logout, isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');

  const filteredPosts = posts.filter(post => {
    const searchLower = search.toLowerCase();
    const titleMatch = post.title?.toLowerCase().includes(searchLower) || false;
    const bodyMatch = post.body?.toLowerCase().includes(searchLower) || false;
    
    return titleMatch || bodyMatch;
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar isAuthenticated={isAuthenticated} logout={logout} setIsModalOpen={setIsModalOpen}/>
      <main className="max-w-6xl mx-auto py-10 px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Mural Público</h1>
            <p className="text-gray-500 mt-1">Veja o que as pessoas andam colando por aí.</p>
          </div>
          
          <div className="w-full md:w-80 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text"
              placeholder="Pesquisar post-its..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm text-slate-700"
            />
          </div>
        </div>
        <PostItGrid 
              posts={filteredPosts} 
              handleLike={handleLike}
              handleDelete={handleDelete}
              setSelectedPost={setSelectedPost}
        />
      </main>
      {isModalOpen && (
        <CreatePostModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchPosts} 
        />
      )}
      {selectedPost && (
        <ViewPostModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)} 
        />
      )}
    </div>
  );
}