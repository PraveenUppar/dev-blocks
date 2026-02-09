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
} from "../middleware/validation.js";

// ==================== PUBLIC ROUTES ====================

const postRoute = Router();

postRoute.use(apiLimiter);

// GET Published Posts for Homepage
postRoute.get("/", getPublishedPostController);
// GET Published Post by ID
postRoute.get("/id/:id", validateIdParam, getPublishedPostByIdController);
// GET Published Post by Slug
postRoute.get("/:slug", getPublishedPostBySlugController);

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
postRoute.get("/draft/:id", validateIdParam, getDraftPostByIdController);
// UPDATE a Post by ID
postRoute.put("/:id/update", updatePostController);
// DELETE a Post by ID
postRoute.delete("/:id/delete", validateIdParam, deletePostController);
// PUBLISH a Post by ID
postRoute.patch("/:id/publish", validateIdParam, publishPostController);

// LIKE and UNLIKE a Post by ID
postRoute.post(
  "/:id/like",
  interactionLimiter,
  validateIdParam,
  likePublishedPostController,
);
// BOOKMARK and UNBOOKMARK a Post by ID
postRoute.post(
  "/:id/bookmark",
  interactionLimiter,
  validateIdParam,
  bookmarkPublishedPostController,
);

export default postRoute;
