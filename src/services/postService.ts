import { apiFetch } from './apiClient';
import type { CommentResponse, GetPostsParams, PostBase, PostResponse, PostUpdate } from './types';

export const postService = {
  getPosts: async (params: GetPostsParams = {}): Promise<PostResponse[]> => {
    const { skip = 0, limit = 100, ...restParams } = params;
    const allParams = { skip, limit, ...restParams };
    const filteredParams: Record<string, string> = {};

    Object.entries(allParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        filteredParams[key] = String(value);
      }
    });

    const queryString = new URLSearchParams(filteredParams).toString();
    return apiFetch<PostResponse[]>(`/posts?${queryString}`, {
      auth: true,
    });
  },

  getPostById: async (postId: number): Promise<PostResponse> => {
    return apiFetch<PostResponse>(`/posts/${postId}`, {
      auth: true,
    });
  },

  createPost: async (data: PostBase): Promise<PostResponse> => {
    return apiFetch<PostResponse>('/posts', {
      method: 'POST',
      body: data,
      auth: true,
    });
  },

  updatePost: async (postId: number, data: PostUpdate): Promise<PostResponse> => {
    return apiFetch<PostResponse>(`/posts/${postId}`, {
      method: 'PATCH',
      body: data,
      auth: true,
    });
  },

  deletePost: async (postId: number): Promise<boolean> => {
    return apiFetch<boolean>(`/posts/${postId}`, {
      method: 'DELETE',
      auth: true,
    });
  },

  likePost: async (postId: number): Promise<PostResponse> => {
    return apiFetch<PostResponse>(`/posts/${postId}/like`, {
      method: 'POST',
      auth: true,
    });
  },

  getComments: async (postId: number, skip = 0, limit = 50): Promise<CommentResponse[]> => {
    const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
    return apiFetch<CommentResponse[]>(`/posts/${postId}/comments?${params.toString()}`);
  },

  createComment: async (postId: number, content: string): Promise<CommentResponse> => {
  const params = new URLSearchParams({ content });
      return apiFetch<CommentResponse>(`/posts/${postId}/comments?${params.toString()}`, {
      method: 'POST',
      auth: true,
    });
  },
};