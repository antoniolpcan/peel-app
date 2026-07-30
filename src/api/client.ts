import type { GetPostsParams, PostResponse, UserData } from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL 

function getHeaders(isAuthenticated = false) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (isAuthenticated) {
    const token = localStorage.getItem('@peel:token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {

  login: async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${BASE_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    if (!response.ok) throw new Error('Credenciais inválidas');
    return response.json();
  },

  createUser: async (data: any) => {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao criar usuário');
    return response.json();
  },

  getUser: async (userId: number) => {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      headers: getHeaders(true),
    });
    if (!response.ok) throw new Error('Erro ao buscar usuário');
    return response.json();
  },

  updateMe: async (data: Partial<UserData>) => {
    const response = await fetch(`${BASE_URL}/users/me`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao atualizar perfil');
    return response.json();
  },

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
    const response = await fetch(`${BASE_URL}/posts?${queryString}`);
    
    if (!response.ok) {
        throw new Error('Erro ao buscar posts');
    }
    return response.json();
  },

  createPost: async (data: { title: string; body: string; color_id?: number }) => {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao criar post');
    return response.json();
  },

  deletePost: async (postId: number) => {
    const response = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    if (!response.ok) throw new Error('Erro ao deletar post');
  },

  likePost: async (postId: number) => {
    const response = await fetch(`${BASE_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: getHeaders(true),
    });
    if (!response.ok) throw new Error('Erro ao curtir post');
    return response.json();
  },

  getComments: async (postId: number) => {
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`);
    if (!response.ok) throw new Error('Erro ao buscar comentários');
    return response.json();
  },

  createComment: async (postId: number, content: string) => {
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments?content=${encodeURIComponent(content)}`, {
      method: 'POST',
      headers: getHeaders(true),
    });
    if (!response.ok) throw new Error('Erro ao criar comentário');
    return response.json();
  }

};