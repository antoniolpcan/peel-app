import type { MediaFileBase } from "./base";

export interface BasicUserResponse {
  id: number;
  name: string;
  username: string;
  bio?: string | null;
  avatar?: MediaFileBase | null;
  created_at: string;
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
  username?: string | null;
  phone?: string | null;
  bio?: string | null;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  created_at: string;
  username?: string | null;
  phone?: string | null;
  bio?: string | null;
  avatar?: MediaFileBase | null;
}

export interface UserUpdate {
  name?: string | null;
  username?: string | null;
  phone?: string | null;
  email?: string | null;
  bio?: string | null;
  avatar_id?: number | null;
}

export type UserData = UserResponse;