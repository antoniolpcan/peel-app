import type { BasicUserResponse } from "./user";

export interface FollowCreate {
  following_id: string;
}

export interface FollowerResponse {
  id: string;
  follower_id: string;
  following_id: string;
  follower?: BasicUserResponse | null;
}

export interface FollowingResponse {
  id: string;
  follower_id: string;
  following_id: string;
  following?: BasicUserResponse | null;
}

export interface FollowStatsResponse {
  followers_count: number;
  following_count: number;
}

export type FollowStats = FollowStatsResponse;