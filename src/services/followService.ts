import { apiFetch } from './apiClient';
import type { FollowCreate, FollowerResponse, FollowingResponse, FollowStatsResponse } from './types';

export const followService = {
  followUser: async (data: FollowCreate): Promise<FollowerResponse> => {
    return apiFetch<FollowerResponse>('/follows/', {
      method: 'POST',
      body: data,
    });
  },

  unfollowUser: async (userId: string): Promise<boolean> => {
    return apiFetch<boolean>(`/follows/${userId}`, {
      method: 'DELETE',
    });
  },

  getFollowers: async (userId: string, skip = 0, limit = 50): Promise<FollowerResponse[]> => {
    const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
    return apiFetch<FollowerResponse[]>(`/follows/followers/${userId}?${params.toString()}`);
  },

  getFollowing: async (userId: string, skip = 0, limit = 50): Promise<FollowingResponse[]> => {
    const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
    return apiFetch<FollowingResponse[]>(`/follows/following/${userId}?${params.toString()}`);
  },

  getFollowStats: async (userId: string): Promise<FollowStatsResponse> => {
    return apiFetch<FollowStatsResponse>(`/follows/${userId}/stats`);
  },
};