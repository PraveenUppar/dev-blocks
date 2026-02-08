import { Router } from "express";
import { requireAuthentication } from "../middleware/auth.middleware.js";
import { getUserProfileController, getUserPostsController, getUserFollowersController, getUserFollowingController, updateUserProfileController, followUserProfileController, unfollowUserProfileController, getUserBookmarksController, getUserDraftsController, getUserReadingHistoryController, } from "../controllers/user.controller.js";
const userRoute = Router();
// ==================== PUBLIC ROUTES ====================
// GET Public profile of USER - working and connected
userRoute.get("/:username", getUserProfileController);
// GET Published Posts of USER - working and connected
userRoute.get("/:username/posts", getUserPostsController);
// GET List of FOLLOWERS - working
userRoute.get("/:username/followers", getUserFollowersController);
// GET List of FOLLOWING - working
userRoute.get("/:username/following", getUserFollowingController);
// ==================== PROTECTED ROUTES ==================
// Apply auth middleware to all routes below
userRoute.use(requireAuthentication);
// UPDATE USER profile -
userRoute.put("/me/update", updateUserProfileController);
// POST Follow USER -
userRoute.post("/:id/follow", followUserProfileController);
// POST Unfollow USER -
userRoute.delete("/:id/unfollow", unfollowUserProfileController);
// GET USER Bookmark -
userRoute.get("/me/bookmarks", getUserBookmarksController);
// GET USER Drafts -
userRoute.get("/me/drafts", getUserDraftsController);
// GET USER Reading History -
userRoute.get("/me/reading-history", getUserReadingHistoryController);
export default userRoute;
//# sourceMappingURL=user.route.js.map