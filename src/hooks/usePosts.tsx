import { useState, useCallback } from 'react';
import type { PostResponse, GetPostsParams } from '../api/types'; // Importe a interface
import { api } from '../api/client';

export function usePosts() {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [currentParams, setCurrentParams] = useState<GetPostsParams>({});

  const fetchPosts = useCallback(async (params?: GetPostsParams) => {
    setIsLoading(true);
    const paramsToUse = params !== undefined ? params : currentParams;
    if (params !== undefined) {
      setCurrentParams(prevParams => {
        if (JSON.stringify(prevParams) !== JSON.stringify(params)) {
          return params;
        }
        return prevParams; 
      });
    }
    try {
      const data = await api.getPosts(paramsToUse);
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentParams]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja deletar?')) return;
    try {
      await api.deletePost(id);
      fetchPosts();
    } catch (err) {
      alert('Erro ao deletar post. Ele é seu?');
    }
  };

  const handleLike = async (id: number) => {
    try {
      await api.likePost(id);
      fetchPosts();
    } catch (err) {
      alert('Erro ao curtir post. Você está logado?');
    }
  };

  const handleSubmit = async (
    title: string, 
    body: string,
    options?: { onSuccess?: () => void; onClose?: () => void }
  ) => {
    if (!title || !body) return alert('Preencha título e conteúdo!');
    setIsLoading(true);
    try {
      await api.createPost({ title, body });
      options?.onSuccess?.();
      options?.onClose?.();
    } catch (error) {
      console.error(error);
      alert('Erro ao criar post-it. Você está logado?');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    posts,
    isLoading,
    currentParams,
    fetchPosts,
    handleDelete,
    handleLike,
    handleSubmit,
  };
}