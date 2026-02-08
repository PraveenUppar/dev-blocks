import { Router } from "express";
import { requireAuthentication } from "../middleware/auth.middleware.js";
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
} from "../controllers/user.controller.js";

const userRoute = Router();

// ==================== PROTECTED ROUTES ==================


// UPDATE USER profile -
userRoute.put("/update", requireAuthentication, updateUserProfileController);
// POST Follow USER -
userRoute.post("/:id/follow", requireAuthentication, followUserProfileController);
// POST Unfollow USER -
userRoute.delete("/:id/unfollow", requireAuthentication, unfollowUserProfileController);
// GET USER Bookmark -
userRoute.get("/bookmarks", requireAuthentication, getUserBookmarksController);
// GET USER Drafts -
userRoute.get("/drafts", requireAuthentication, getUserDraftsController);
// GET USER Reading History -
userRoute.get("/reading-history", requireAuthentication, getUserReadingHistoryController);

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
