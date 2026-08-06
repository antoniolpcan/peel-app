import { authService } from './authService';
import { userService } from './userService';
import { postService } from './postService';
import { followService } from './followService';
import { colorService } from './colorService';
import { storageService } from './storageService';
import { chatService } from './chatService';
import { userSettingsService } from './userSettingsService';
import { notificationService } from './notificationService';

export const api = {
  auth: authService,
  users: userService,
  posts: postService,
  follows: followService,
  colors: colorService,
  storage: storageService,
  chat: chatService,
  notification: notificationService,
  userSettings: userSettingsService
};

export { authService } from './authService';
export { userService } from './userService';
export { postService } from './postService';
export { followService } from './followService';
export { colorService } from './colorService';
export { storageService } from './storageService';
export { chatService } from './chatService';
export { notificationService } from './notificationService';
export { userSettingsService } from './userSettingsService';

export * from './types';