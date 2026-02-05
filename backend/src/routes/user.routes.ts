import { Router } from "express";
import {
  requireAuthentication,
  getCurrentUser,
} from "../middleware/auth.middleware";

import {
  getProfileController,
  getFollowersController,
  getFollowingController,
  getUserPostsController,
  updateMyProfileController,
  followUserController,
  unfollowUserController,
  getMyBookmarksController,
} from "../controllers/user.controller";

const userRouter = Router();

// ==================== PUBLIC ROUTES ====================

// Get user's public profile by username
userRouter.get("/:username", getProfileController);
// Get all published posts by a user
userRouter.get("/:username/posts", getUserPostsController);
// Get list of users who follow this user
userRouter.get("/:id/followers", getFollowersController);
// Get list of users this user follows
userRouter.get("/:id/following", getFollowingController);

// ==================== PROTECTED ROUTES ====================

// Update the logged-in user's own profile
userRouter.put(
  "/update",
  requireAuthentication,
  getCurrentUser,
  updateMyProfileController,
);
// Follow a user (creates follow relationship)
userRouter.post(
  "/:id/follow",
  requireAuthentication,
  getCurrentUser,
  followUserController,
);
// Unfollow a user (removes follow relationship)
userRouter.delete(
  "/:id/follow",
  requireAuthentication,
  getCurrentUser,
  unfollowUserController,
);
// Get logged-in user's bookmarks
userRouter.get(
  "/me/bookmarks",
  requireAuthentication,
  getCurrentUser,
  getMyBookmarksController,
);

export default userRouter;
