import type { MediaFileBase } from "./base";
import type { BasicUserResponse } from "./user";

export type NotificationType = 'like' | 'comment' | 'follow';

export type UserActor = Pick<BasicUserResponse, 'id' | 'name' | 'username'> & {
  avatar?: MediaFileBase | null;
};

export interface NotificationCreate {
  type: NotificationType;
  user_id: string;
  entity_id: string | null;
}

export interface NotificationResponse {
  id: string;
  type: NotificationType;
  user_id: string;
  actor_id: string;
  is_read: boolean;
  created_at: string;
  entity_id: string | null;
  actor: UserActor;
}