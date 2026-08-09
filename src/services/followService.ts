import { BASE_URL, apiFetch } from './apiClient';
import type { FollowCreate, FollowerResponse, FollowingResponse, FollowStatsResponse } from './types';

export const followService = {
  followUser: async (data: FollowCreate): Promise<FollowerResponse> => {
    return apiFetch<FollowerResponse>(`${BASE_URL}/follows/`, {
      method: 'POST',
      body: data,
      auth: true,
    });
  },

  unfollowUser: async (userId: number): Promise<boolean> => {
    return apiFetch<boolean>(`${BASE_URL}/follows/${userId}`, {
      method: 'DELETE',
      auth: true,
    });
  },

  getFollowers: async (userId: number): Promise<FollowerResponse[]> => {
    return apiFetch<FollowerResponse[]>(`${BASE_URL}/follows/followers/${userId}`);
  },

  getFollowing: async (userId: number): Promise<FollowingResponse[]> => {
    return apiFetch<FollowingResponse[]>(`${BASE_URL}/follows/following/${userId}`);
  },

  getFollowStats: async (userId: number): Promise<FollowStatsResponse> => {
    return apiFetch<FollowStatsResponse>(`${BASE_URL}/follows/${userId}/stats`);
  },
};