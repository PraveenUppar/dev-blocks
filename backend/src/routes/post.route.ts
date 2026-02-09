import { Router } from "express";
import { requireAuth } from "@clerk/express";
import {
  getPublishedPostController,
  getPublishedPostByIdController,
  getPublishedPostBySlugController,
  createPostController,
  updatePostController,
  deletePostController,
  publishPostController,
  likePublishedPostController,
  bookmarkPublishedPostController,
  getDraftPostByIdController,
} from "../controllers/post.controller.js";
import {
  apiLimiter,
  createLimiter,
  interactionLimiter,
} from "../middleware/rateLimiter.js";
import {
  validateCreatePost,
  validateIdParam,
  validateSlugParam,
} from "../middleware/validation.js";
import { verifyPostOwnership } from "../middleware/ownership.js";

// ==================== PUBLIC ROUTES ====================

const postRoute = Router();

postRoute.use(apiLimiter);

// GET Published Posts for Homepage - Fetches only the metadata of posts
postRoute.get("/", getPublishedPostController);
// GET Published Post by ID - Fetches full content of the post
postRoute.get<{ id: string }>(
  "/id/:id",
  validateIdParam,
  getPublishedPostByIdController,
);
// GET Published Post by Slug - SEO friendly and Fetches full content of the post
postRoute.get(
  "/slug/:slug",
  validateSlugParam,
  getPublishedPostBySlugController,
);

// ==================== PROTECTED ROUTES ====================

postRoute.use(requireAuth());

// CREATE a new Draft Post
postRoute.post(
  "/create",
  createLimiter,
  validateCreatePost,
  createPostController,
);
// GET Draft Post by ID
postRoute.get<{ id: string }>(
  "/draft/:id",
  validateIdParam,
  verifyPostOwnership,
  getDraftPostByIdController,
);
// UPDATE a Post by ID
postRoute.put("/update/:id", verifyPostOwnership, updatePostController);
// DELETE a Post by ID
postRoute.delete<{ id: string }>(
  "/delete/:id",
  validateIdParam,
  verifyPostOwnership,
  deletePostController,
);
// PUBLISH a Post by ID
postRoute.patch<{ id: string }>(
  "/publish/:id",
  validateIdParam,
  publishPostController,
);

// LIKE and UNLIKE a Post by ID
postRoute.post<{ id: string }>(
  "/like/:id",
  interactionLimiter,
  validateIdParam,
  likePublishedPostController,
);
// BOOKMARK and UNBOOKMARK a Post by ID
postRoute.post<{ id: string }>(
  "/bookmark/:id",
  interactionLimiter,
  validateIdParam,
  bookmarkPublishedPostController,
);

export default postRoute;
