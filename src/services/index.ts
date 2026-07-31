import { authService } from './authService';
import { userService } from './userService';
import { postService } from './postService';
import { followService } from './followService';
import { colorService } from './colorService';
import { storageService } from './storageService';

export const api = {
  auth: authService,
  users: userService,
  posts: postService,
  follows: followService,
  colors: colorService,
  storage: storageService,
};

export { authService } from './authService';
export { userService } from './userService';
export { postService } from './postService';
export { followService } from './followService';
export { colorService } from './colorService';
export { storageService } from './storageService';

export * from './types';