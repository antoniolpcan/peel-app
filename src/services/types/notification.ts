import type { MediaFileBase } from "./base";
import type { BasicUserResponse } from "./user";

export type NotificationType = 'like' | 'comment' | 'follow';

export type UserActor = Pick<BasicUserResponse, 'id' | 'name' | 'username'> & {
  avatar?: MediaFileBase | null;
};

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