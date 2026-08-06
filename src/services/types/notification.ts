import type { MediaFileBase } from "./base";

export type NotificationType = 'like' | 'comment' | 'follow';

export interface UserActor {
  id: number;
  name: string;
  username: string;
  avatar: MediaFileBase
}

export interface NotificationCreate {
  type: NotificationType;
  user_id: number;
  entity_id?: number | null;
}

export interface NotificationResponse {
  id: number;
  type: NotificationType;
  user_id: number;
  actor_id: number;
  is_read: boolean;
  created_at: string;
  entity_id?: number | null;
  actor: UserActor;
}