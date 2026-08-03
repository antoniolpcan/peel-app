import { BASE_URL, getHeaders, handleResponse } from './apiClient';
import type { FollowCreate, FollowerResponse, FollowingResponse, FollowStatsResponse } from './types';

export const followService = {
  followUser: async (data: FollowCreate): Promise<FollowerResponse> => {
    const response = await fetch(`${BASE_URL}/follows/`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse<FollowerResponse>(response);
  },

  unfollowUser: async (userId: number): Promise<boolean> => {
    const response = await fetch(`${BASE_URL}/follows/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    if (response.ok) {
      return true;
    }
    return handleResponse<boolean>(response);
  },

  getFollowers: async (userId: number): Promise<FollowerResponse[]> => {
    const response = await fetch(`${BASE_URL}/follows/followers/${userId}`, {
      headers: getHeaders(false),
    });
    return handleResponse<FollowerResponse[]>(response);
  },

  getFollowing: async (userId: number): Promise<FollowingResponse[]> => {
    const response = await fetch(`${BASE_URL}/follows/following/${userId}`, {
      headers: getHeaders(false),
    });
    return handleResponse<FollowingResponse[]>(response);
  },

  getFollowStats: async (userId: number): Promise<FollowStatsResponse> => {
    const response = await fetch(`${BASE_URL}/follows/${userId}/stats`, {
      headers: getHeaders(false),
    });
    return handleResponse<FollowStatsResponse>(response);
  },
};