import { Router } from "express";
import { requireAuth } from "@clerk/express";
import {
  getPublishedPostController,
  getPublishedPostByIdController,
  getPublishedPostBySlugController,
  createPostController,
  editPostController,
  deletePostController,
  publishPostController,
  likePublishedPostController,
  bookmarkPublishedPostController,
  getDraftPostByIdController,
  //   readingPublishedPostController, -- later
} from "../controllers/post.controller.js";
const postRoute = Router();

// ==================== PUBLIC ROUTES ====================

// GET Published Posts for Homepage - working and connected
postRoute.get("/", getPublishedPostController);
// GET Single Published Post by ID - working
postRoute.get("/id/:id", getPublishedPostByIdController);

// GET Published Post by Slug - working
postRoute.get("/:slug", getPublishedPostBySlugController);

// GET Published Post by username -- defined in user route

// ==================== PROTECTED ROUTES ====================

postRoute.use(requireAuth());

// GET Single Draft Post by ID - working
postRoute.get("/draft/:id", getDraftPostByIdController);
// CREATE a new Post
postRoute.post("/create", createPostController);
// UPDATE a Post
postRoute.put("/:id/edit", editPostController);
// DELETE a Post
postRoute.delete("/:id/delete", deletePostController);
// PUBLISH a Post
postRoute.patch("/:id/publish", publishPostController);
// LIKE and UNLIKE a Post
postRoute.post("/:id/like", likePublishedPostController);
// BOOKMARK and UNBOOKMARK a Post
postRoute.post("/:id/bookmark", bookmarkPublishedPostController);
// RECORD a Reading History -- later
// postRoute.post("/:id/reading", readingPublishedPostController);

export default postRoute;
