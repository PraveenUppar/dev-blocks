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

const userRoute = Router();

// ==================== PROTECTED ROUTES ==================

userRoute.get("/profile", requireAuth(), getCurrentUserController);
// UPDATE USER profile -
userRoute.put("/update", requireAuth(), updateUserProfileController);
// GET USER Drafts -
userRoute.get("/drafts", requireAuth(), getUserDraftsController);
// GET USER Bookmark -
userRoute.get("/bookmarks", requireAuth(), getUserBookmarksController);
// GET USER Reading History -
userRoute.get(
  "/reading-history",
  requireAuth(),
  getUserReadingHistoryController,
);
// POST Follow USER -
userRoute.post("/:id/follow", requireAuth(), followUserProfileController);
// POST Unfollow USER -
userRoute.delete("/:id/unfollow", requireAuth(), unfollowUserProfileController);

// ==================== PUBLIC ROUTES ====================

// GET List of FOLLOWERS - working
userRoute.get("/:username/followers", getUserFollowersController);
// GET List of FOLLOWING - working
userRoute.get("/:username/following", getUserFollowingController);
// GET Published Posts of USER - working and connected
userRoute.get("/:username/posts", getUserPostsController);
// GET Public profile of USER - working and connected
userRoute.get("/:username", getUserProfileController);

export default userRoute;
