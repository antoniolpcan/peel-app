import { useCallback, useEffect, useState } from 'react';
import { postService } from '@/services/postService';
import type { CommentResponse, GetPostsParams, PostBase, PostResponse, PostUpdate } from '@/services/types';

const LIMIT = 12;

export function usePosts(params: GetPostsParams = {}) {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState(params.skip || 0);
  const [hasMore, setHasMore] = useState(true);

  const paramsKey = JSON.stringify(params);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSkip(0);

      const initialParams = { ...params, skip: 0, limit: LIMIT };
      const data = await postService.getPosts(initialParams);

      setPosts(data);
      setHasMore(data.length === LIMIT);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar posts');
    } finally {
      setLoading(false);
    }
  }, [paramsKey]);

  const fetchMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const nextSkip = skip + LIMIT;
      const nextParams = { ...params, skip: nextSkip, limit: LIMIT };
      
      const newPosts = await postService.getPosts(nextParams);

      if (newPosts.length > 0) {
        setPosts((prev) => [...prev, ...newPosts]);
        setSkip(nextSkip);
      }
      setHasMore(newPosts.length === LIMIT);
    } catch (err: any) {
      console.error('Erro ao carregar mais posts:', err);
    } finally {
      setLoading(false);
    }
  }, [paramsKey, loading, hasMore, skip]);

  const handleLike = useCallback(async (postId: number) => {
    try {
      const updatedPost = await postService.likePost(postId);
      if (updatedPost) {
        setPosts((prev) => prev.map((p) => (p.id === postId ? updatedPost : p)));
        setSelectedPost((prev) => (prev?.id === postId ? updatedPost : prev));
      }
      return updatedPost;
    } catch (err) {
      console.error('Erro ao curtir post:', err);
      return null;
    }
  }, []);

  const handleDelete = useCallback(async (postId: number) => {
    try {
      await postService.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setSelectedPost((prev) => (prev?.id === postId ? null : prev));
      return true;
    } catch (err) {
      console.error('Erro ao deletar post:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    setPosts,
    selectedPost,
    setSelectedPost,
    loading,
    error,
    hasMore,
    refetch: fetchPosts,
    fetchMorePosts,
    handleLike,
    handleDelete,
  };
}

export function usePostActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = async (data: PostBase) => {
    try {
      setLoading(true);
      setError(null);
      return await postService.createPost(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar post');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (postId: number, data: PostUpdate) => {
    try {
      setLoading(true);
      setError(null);
      return await postService.updatePost(postId, data);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar post');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: number) => {
    try {
      setLoading(true);
      setError(null);
      await postService.deletePost(postId);
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar post');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (postId: number) => {
    try {
      setError(null);
      return await postService.likePost(postId);
    } catch (err: any) {
      setError(err.message || 'Erro ao curtir post');
      return null;
    }
  };

  return { createPost, updatePost, deletePost, likePost, loading, error };
}

export function useComments(postId: number) {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await postService.getComments(postId);
      setComments(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar comentários');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const createComment = async (content: string) => {
    try {
      const newComment = await postService.createComment(postId, content);
      setComments((prev) => [...prev, newComment]);
      return newComment;
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar comentário');
      return null;
    }
  };

  return { comments, loading, error, createComment, refetch: fetchComments };
}