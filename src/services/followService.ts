import { BASE_URL, getHeaders, apiFetch } from './apiClient';
import type { FollowCreate, FollowerResponse, FollowingResponse, FollowStatsResponse } from './types';

export const followService = {
  followUser: async (data: FollowCreate): Promise<FollowerResponse> => {
    return apiFetch<FollowerResponse>(`${BASE_URL}/follows/`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  unfollowUser: async (userId: number): Promise<boolean> => {
    return apiFetch<boolean>(`${BASE_URL}/follows/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
  },

  getFollowers: async (userId: number): Promise<FollowerResponse[]> => {
    return apiFetch<FollowerResponse[]>(`${BASE_URL}/follows/followers/${userId}`, {
      headers: getHeaders(false),
    });
  },

  getFollowing: async (userId: number): Promise<FollowingResponse[]> => {
    return apiFetch<FollowingResponse[]>(`${BASE_URL}/follows/following/${userId}`, {
      headers: getHeaders(false),
    });
  },

  getFollowStats: async (userId: number): Promise<FollowStatsResponse> => {
    return apiFetch<FollowStatsResponse>(`${BASE_URL}/follows/${userId}/stats`, {
      headers: getHeaders(false),
    });
  },
};