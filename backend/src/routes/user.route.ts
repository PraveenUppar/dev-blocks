import { Router } from "express";
import { requireAuth } from "@clerk/express";
import {
  getUserProfileController,
  getUserPostsController,
  getUserFollowersController,
  getUserFollowingController,
  updateUserProfileController,
  followUserProfileController,
  unfollowUserProfileController,
  getUserBookmarksController,
  getUserDraftsController,
  getUserReadingHistoryController,
  getCurrentUserController,
} from "../controllers/user.controller.js";
import {
  validateUsernameParam,
  validateIdParam,
  validatePaginationQuery,
  validateUpdateUserProfile,
} from "../middleware/validation.js";

const userRoute = Router();

// ==================== PROTECTED ROUTES ==================

// GET USER profile - working and tested
userRoute.get("/profile", requireAuth(), getCurrentUserController);
// UPDATE USER profile - working and tested
userRoute.put(
  "/update",
  requireAuth(),
  validateUpdateUserProfile,
  updateUserProfileController,
);
// GET USER Drafts - working and tested
userRoute.get(
  "/drafts",
  requireAuth(),
  validatePaginationQuery,
  getUserDraftsController,
);
// GET USER Bookmark - working and tested
userRoute.get(
  "/bookmarks",
  requireAuth(),
  validatePaginationQuery,
  getUserBookmarksController,
);
// GET USER Reading History - LATER
userRoute.get(
  "/reading-history",
  requireAuth(),
  validatePaginationQuery,
  getUserReadingHistoryController,
);
// POST Follow USER - LATER
userRoute.post(
  "/:id/follow",
  requireAuth(),
  validateIdParam,
  followUserProfileController,
);
// POST Unfollow USER - LATER
userRoute.delete(
  "/:id/unfollow",
  requireAuth(),
  validateIdParam,
  unfollowUserProfileController,
);

// ==================== PUBLIC ROUTES ====================

// GET List of FOLLOWERS - working and tested
userRoute.get(
  "/:username/followers",
  validateUsernameParam,
  validatePaginationQuery,
  getUserFollowersController,
);
// GET List of FOLLOWING - working and tested
userRoute.get(
  "/:username/following",
  validateUsernameParam,
  validatePaginationQuery,
  getUserFollowingController,
);
// GET Published Posts of USER - working and tested
userRoute.get(
  "/:username/posts",
  validateUsernameParam,
  validatePaginationQuery,
  getUserPostsController,
);
// GET Public profile of USER - working and tested
userRoute.get("/:username", validateUsernameParam, getUserProfileController);

export default userRoute;
