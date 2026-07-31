import type { BasicUserResponse } from "./user";

export interface FollowCreate {
  following_id: number;
}

export interface FollowerResponse {
  id: number;
  follower_id: number;
  following_id: number;
  follower?: BasicUserResponse | null;
}

export interface FollowingResponse {
  id: number;
  follower_id: number;
  following_id: number;
  following?: BasicUserResponse | null;
}

export interface FollowStatsResponse {
  followers_count: number;
  following_count: number;
}

export type FollowStats = FollowStatsResponse;