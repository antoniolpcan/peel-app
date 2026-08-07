import { useCallback, useEffect, useState, useRef } from 'react';
import { postService } from '@/services/postService';
import type { CommentResponse, GetPostsParams, PostBase, PostResponse, PostUpdate } from '@/services/types';

const LIMIT = 12;

export interface UsePostsParams extends GetPostsParams {
  feedType?: 'public' | 'following';
  followingOnly?: boolean;
}

export function usePosts(params: UsePostsParams = {}) {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const skipRef = useRef(0);
  const activeRequestRef = useRef(0);
  const paramsKey = JSON.stringify(params);

  const fetchFromService = useCallback(async (queryParams: GetPostsParams): Promise<PostResponse[]> => {
    const isFollowing = params.feedType === 'following' || params.followingOnly;

    if (isFollowing && 'getFollowingPosts' in postService && typeof (postService as any).getFollowingPosts === 'function') {
      return await (postService as any).getFollowingPosts(queryParams);
    }

    return await postService.getPosts(queryParams);
  }, [paramsKey]);

  const fetchPosts = useCallback(async () => {
    const currentRequestId = ++activeRequestRef.current;

    try {
      setLoading(true);
      setError(null);
      skipRef.current = 0;

      const initialParams = { ...params, skip: 0, limit: LIMIT };
      const data = await fetchFromService(initialParams);

      if (currentRequestId === activeRequestRef.current) {
        setPosts(data);
        setHasMore(data.length === LIMIT);
      }
    } catch (err: any) {
      if (currentRequestId === activeRequestRef.current) {
        setError(err.message || 'Erro ao carregar posts');
      }
    } finally {
      if (currentRequestId === activeRequestRef.current) {
        setLoading(false);
      }
    }
  }, [paramsKey, fetchFromService]);

  const fetchMorePosts = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextSkip = skipRef.current + LIMIT;
      const nextParams = { ...params, skip: nextSkip, limit: LIMIT };

      const newPosts = await fetchFromService(nextParams);

      if (newPosts.length > 0) {
        setPosts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const filtered = newPosts.filter((p) => !existingIds.has(p.id));
          return [...prev, ...filtered];
        });
        skipRef.current = nextSkip;
      }

      setHasMore(newPosts.length === LIMIT);
    } catch (err: any) {
    } finally {
      setLoadingMore(false);
    }
  }, [paramsKey, loading, loadingMore, hasMore, fetchFromService]);

  const handleLike = useCallback(async (postId: number) => {
    let previousPosts: PostResponse[] = [];

    setPosts((prev) => {
      previousPosts = prev;
      return prev.map((post) => {
        if (post.id === postId) {
          const isLiked = post.is_liked ?? false;
          const currentLikes = post.likes ?? 0;
          return {
            ...post,
            is_liked: !isLiked,
            likes: isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1,
          };
        }
        return post;
      });
    });

    try {
      const updatedPost = await postService.likePost(postId);
      if (updatedPost) {
        setPosts((prev) => prev.map((p) => (p.id === postId ? updatedPost : p)));
        setSelectedPost((prev) => (prev?.id === postId ? updatedPost : prev));
      }
      return updatedPost;
    } catch (err) {
      setPosts(previousPosts);
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
    loadingMore,
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

  const createPost = useCallback(async (data: PostBase) => {
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
  }, []);

  const updatePost = useCallback(async (postId: number, data: PostUpdate) => {
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
  }, []);

  const deletePost = useCallback(async (postId: number) => {
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
  }, []);

  const likePost = useCallback(async (postId: number) => {
    try {
      setError(null);
      return await postService.likePost(postId);
    } catch (err: any) {
      setError(err.message || 'Erro ao curtir post');
      return null;
    }
  }, []);

  return { createPost, updatePost, deletePost, likePost, loading, error };
}

export function useComments(postId: number) {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState(Boolean(postId));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!postId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    try {
      setLoading(true);
      setError(null);
      const data = await postService.getComments(postId);
      if (isMounted) setComments(data);
    } catch (err: any) {
      if (isMounted) setError(err.message || 'Erro ao carregar comentários');
    } finally {
      if (isMounted) setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const createComment = useCallback(async (content: string) => {
    if (!content.trim() || submitting) return null;

    try {
      setSubmitting(true);
      const newComment = await postService.createComment(postId, content);
      setComments((prev) => [...prev, newComment]);
      return newComment;
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar comentário');
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [postId, submitting]);

  return { comments, loading, submitting, error, createComment, refetch: fetchComments };
}