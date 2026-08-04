import { BASE_URL, getHeaders, handleResponse } from './apiClient';
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
    const response = await fetch(`${BASE_URL}/posts?${queryString}`, {
      headers: getHeaders(true),
    });
    return handleResponse<PostResponse[]>(response);
  },

  getPostById: async (postId: number): Promise<PostResponse> => {
    const response = await fetch(`${BASE_URL}/posts/${postId}`, {
      headers: getHeaders(true),
    });
    return handleResponse<PostResponse>(response);
  },

  createPost: async (data: PostBase): Promise<PostResponse> => {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse<PostResponse>(response);
  },

  updatePost: async (postId: number, data: PostUpdate): Promise<PostResponse> => {
    const response = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse<PostResponse>(response);
  },

  deletePost: async (postId: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return handleResponse<void>(response);
  },

  likePost: async (postId: number): Promise<PostResponse> => {
    const response = await fetch(`${BASE_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: getHeaders(true),
    });
    return handleResponse<PostResponse>(response);
  },

  getComments: async (postId: number): Promise<CommentResponse[]> => {
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
      headers: getHeaders(false),
    });
    return handleResponse<CommentResponse[]>(response);
  },

  createComment: async (postId: number, content: string): Promise<CommentResponse> => {
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments?content=${encodeURIComponent(content)}`, {
      method: 'POST',
      headers: getHeaders(true),
    });
    return handleResponse<CommentResponse>(response);
  },
};