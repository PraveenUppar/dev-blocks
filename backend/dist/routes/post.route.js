import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { getPublishedPostController, getPublishedPostByIdController, getPublishedPostBySlugController, createPostController, updatePostController, deletePostController, publishPostController, likePublishedPostController, bookmarkPublishedPostController, getDraftPostByIdController, } from "../controllers/post.controller.js";
import { apiLimiter, createLimiter, interactionLimiter, } from "../middleware/rateLimiter.js";
import { validateCreatePost, validateIdParam, validateSlugParam, validateUpdatePost, } from "../middleware/validation.js";
// ==================== PUBLIC ROUTES ====================
const postRoute = Router();
// postRoute.use(apiLimiter);
// GET Published Posts for Homepage - Fetches only the metadata of posts -- working and tested
postRoute.get("/", getPublishedPostController);
// GET Published Post by ID - Fetches full content of the post --  working and tested
postRoute.get("/id/:id", validateIdParam, getPublishedPostByIdController);
// GET Published Post by Slug - SEO friendly and Fetches full content of the post
postRoute.get("/slug/:slug", validateSlugParam, getPublishedPostBySlugController);
// ==================== PROTECTED ROUTES ====================
postRoute.use(requireAuth());
// CREATE a new Draft Post - working and tested
postRoute.post("/create", 
// createLimiter,
// validateCreatePost,
createPostController);
// GET Draft Post by ID - working and tested
postRoute.get("/draft/:id", validateIdParam, getDraftPostByIdController);
// UPDATE a Post by ID - working and tested
postRoute.put("/update/:id", validateIdParam, validateUpdatePost, updatePostController);
// DELETE a Post by ID - working and tested
postRoute.delete("/delete/:id", validateIdParam, deletePostController);
// PUBLISH a Post by ID - working and tested
postRoute.patch("/publish/:id", validateIdParam, publishPostController);
// LIKE and UNLIKE a Post by ID
postRoute.post("/like/:id", interactionLimiter, validateIdParam, likePublishedPostController);
// BOOKMARK and UNBOOKMARK a Post by ID
postRoute.post("/bookmark/:id", interactionLimiter, validateIdParam, bookmarkPublishedPostController);
export default postRoute;
//# sourceMappingURL=post.route.js.map