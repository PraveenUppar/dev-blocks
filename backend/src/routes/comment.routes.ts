import { Router } from "express";
import {
  getPostCommentsController,
  createCommentController,
  replyToCommentController,
  updateCommentController,
  deleteCommentController,
} from "../controllers/comment.controller";
import {
  requireAuthentication,
  getCurrentUser,
} from "../middleware/auth.middleware";

const commentRouter = Router();

// Get comments for a post
commentRouter.get(
  "/post/:postId",
  requireAuthentication,
  getCurrentUser,
  getPostCommentsController,
);
// Create a comment on a post
commentRouter.post(
  "/post/:postId",
  requireAuthentication,
  getCurrentUser,
  createCommentController,
);
// Reply to a comment
commentRouter.post(
  "/:commentId/reply",
  requireAuthentication,
  getCurrentUser,
  replyToCommentController,
);
// Update a comment
commentRouter.put(
  "/:id",
  requireAuthentication,
  getCurrentUser,
  updateCommentController,
);
// Delete a comment (soft delete)
commentRouter.delete(
  "/:id",
  requireAuthentication,
  getCurrentUser,
  deleteCommentController,
);

export default commentRouter;
