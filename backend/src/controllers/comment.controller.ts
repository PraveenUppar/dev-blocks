import { Request, Response } from "express";
import * as commentService from "../services/comment.service";

// GET /post/:postId - Get comments for a post
export async function getPostCommentsController(req: Request, res: Response) {
  const postId = req.params.postId as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await commentService.getPostComments(postId, page, limit);

  return res.json({ success: true, ...result });
}

// POST /post/:postId - Create a comment
export async function createCommentController(req: Request, res: Response) {
  const postId = req.params.postId as string;
  const { userId, content } = req.body;

  if (!content) {
    return res.status(400).json({
      success: false,
      error: { message: "content is required" },
    });
  }

  const comment = await commentService.createComment(postId, userId, content);

  return res.status(201).json({ success: true, data: comment });
}

// POST /:commentId/reply - Reply to a comment
export async function replyToCommentController(req: Request, res: Response) {
  const commentId = req.params.commentId as string;
  const { userId, content } = req.body;

  if (!content) {
    return res.status(400).json({
      success: false,
      error: { message: "content is required" },
    });
  }

  try {
    const reply = await commentService.replyToComment(
      commentId,
      userId,
      content,
    );
    return res.status(201).json({ success: true, data: reply });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      error: { message: error.message },
    });
  }
}

// PUT /:id - Update a comment
export async function updateCommentController(req: Request, res: Response) {
  const id = req.params.id as string;
  const { content } = req.body;

  // Check comment exists and user owns it
  const existing = await commentService.findById(id);
  if (!existing) {
    return res.status(404).json({
      success: false,
      error: { message: "Comment not found" },
    });
  }

  // TODO: Check ownership when auth works
  // if (existing.userId !== userId) { return 403 }

  const comment = await commentService.updateComment(id, content);

  return res.json({ success: true, data: comment });
}

// DELETE /:id - Delete a comment
export async function deleteCommentController(req: Request, res: Response) {
  const id = req.params.id as string;

  const existing = await commentService.findById(id);
  if (!existing) {
    return res.status(404).json({
      success: false,
      error: { message: "Comment not found" },
    });
  }

  // TODO: Check ownership when auth works

  await commentService.deleteComment(id);

  return res.json({ success: true, message: "Comment deleted" });
}
