import { Router } from "express";
import {
  requireAuthentication,
  getCurrentUser,
} from "../middleware/auth.middleware";
import {
  listPostsController,
  getPostByIdController,
  getPostBySlugController,
  createPostController,
  updatePostController,
  deletePostController,
  publishPostController,
  likePostController,
  unlikePostController,
  bookmarkPostController,
  unbookmarkPostController,
} from "../controllers/post.controller";

const postRouter = Router();

// ==================== PUBLIC ROUTES ====================

// List all published posts with pagination
postRouter.get("/", listPostsController);
// Get a single post by its database ID
postRouter.get("/:id", getPostByIdController);
// Get a single post by its URL-friendly slug
postRouter.get("/slug/:slug", getPostBySlugController);

// ==================== PROTECTED ROUTES ====================

// Create a new draft post
postRouter.post(
  "/",
  requireAuthentication,
  getCurrentUser,
  createPostController,
);
// Update an existing post
postRouter.put(
  "/:id",
  requireAuthentication,
  getCurrentUser,
  updatePostController,
);
// Soft delete a post
postRouter.delete(
  "/:id",
  requireAuthentication,
  getCurrentUser,
  deletePostController,
);
// Publish a draft post (changes status to PUBLISHED)
postRouter.patch(
  "/:id/publish",
  requireAuthentication,
  getCurrentUser,
  publishPostController,
);

// ==================== ENGAGEMENT ROUTES ====================
// Like a post
postRouter.post(
  "/:id/like",
  requireAuthentication,
  getCurrentUser,
  likePostController,
);
// Unlike a post
postRouter.delete(
  "/:id/like",
  requireAuthentication,
  getCurrentUser,
  unlikePostController,
);
// Bookmark a post
postRouter.post(
  "/:id/bookmark",
  requireAuthentication,
  getCurrentUser,
  bookmarkPostController,
);
// Remove bookmark
postRouter.delete(
  "/:id/bookmark",
  requireAuthentication,
  getCurrentUser,
  unbookmarkPostController,
);

export default postRouter;
