import { BASE_URL, getHeaders, apiFetch } from './apiClient';
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
    return apiFetch<PostResponse[]>(`${BASE_URL}/posts?${queryString}`, {
      headers: getHeaders(true),
    });
  },

  getPostById: async (postId: number): Promise<PostResponse> => {
    return apiFetch<PostResponse>(`${BASE_URL}/posts/${postId}`, {
      headers: getHeaders(true),
    });
  },

  createPost: async (data: PostBase): Promise<PostResponse> => {
    return apiFetch<PostResponse>(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  updatePost: async (postId: number, data: PostUpdate): Promise<PostResponse> => {
    return apiFetch<PostResponse>(`${BASE_URL}/posts/${postId}`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  deletePost: async (postId: number): Promise<void> => {
    return apiFetch<void>(`${BASE_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
  },

  likePost: async (postId: number): Promise<PostResponse> => {
    return apiFetch<PostResponse>(`${BASE_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: getHeaders(true),
    });
  },

  getComments: async (postId: number): Promise<CommentResponse[]> => {
    return apiFetch<CommentResponse[]>(`${BASE_URL}/posts/${postId}/comments`, {
      headers: getHeaders(false),
    });
  },

  createComment: async (postId: number, content: string): Promise<CommentResponse> => {
    return apiFetch<CommentResponse>(`${BASE_URL}/posts/${postId}/comments?content=${encodeURIComponent(content)}`, {
      method: 'POST',
      headers: getHeaders(true),
    });
  },
};