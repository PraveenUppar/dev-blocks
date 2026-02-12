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

// GET USER profile - working and tested
userRoute.get("/profile", requireAuth(), getCurrentUserController);
// UPDATE USER profile - working and tested
userRoute.put("/update", requireAuth(), updateUserProfileController);
// GET USER Drafts - working and tested
userRoute.get("/drafts", requireAuth(), getUserDraftsController);
// GET USER Bookmark - working and tested
userRoute.get("/bookmarks", requireAuth(), getUserBookmarksController);
// GET USER Reading History - LATER
userRoute.get(
  "/reading-history",
  requireAuth(),
  getUserReadingHistoryController,
);
// POST Follow USER - LATER
userRoute.post("/:id/follow", requireAuth(), followUserProfileController);
// POST Unfollow USER - LATER
userRoute.delete("/:id/unfollow", requireAuth(), unfollowUserProfileController);

// ==================== PUBLIC ROUTES ====================

// GET List of FOLLOWERS - working and tested
userRoute.get("/:username/followers", getUserFollowersController);
// GET List of FOLLOWING - working and tested
userRoute.get("/:username/following", getUserFollowingController);
// GET Published Posts of USER - working and tested
userRoute.get("/:username/posts", getUserPostsController);
// GET Public profile of USER - working and tested
userRoute.get("/:username", getUserProfileController);

export default userRoute;
