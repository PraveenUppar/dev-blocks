import { Request, Response } from "express";
import * as postService from "../services/post.service";

// GET / - List published posts
export async function listPostsController(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await postService.listPosts(page, limit);

  return res.json({ success: true, ...result });
}

// GET /:id - Get post by ID
export async function getPostByIdController(req: Request, res: Response) {
  const id = req.params.id as string;

  const post = await postService.findById(id);

  if (!post) {
    return res.status(404).json({
      success: false,
      error: { message: "Post not found" },
    });
  }

  return res.json({ success: true, data: post });
}

// GET /slug/:slug - Get post by slug
export async function getPostBySlugController(req: Request, res: Response) {
  const slug = req.params.slug as string;

  const post = await postService.findBySlug(slug);

  if (!post) {
    return res.status(404).json({
      success: false,
      error: { message: "Post not found" },
    });
  }

  return res.json({ success: true, data: post });
}

// POST / - Create draft post
export async function createPostController(req: Request, res: Response) {
  const { title, content, subtitle, coverImage, authorId } = req.body;

  // For now, authorId comes from body (later from auth)
  // When auth works: const user = await userService.findByClerkId((req as any).clerkUserId);

  if (!authorId) {
    return res.status(400).json({
      success: false,
      error: { message: "authorId is required" },
    });
  }

  if (!title || !content) {
    return res.status(400).json({
      success: false,
      error: { message: "title and content are required" },
    });
  }

  const post = await postService.createPost(authorId, {
    title,
    content,
    subtitle,
    coverImage,
  });

  return res.status(201).json({ success: true, data: post });
}

// PUT /:id - Update post
export async function updatePostController(req: Request, res: Response) {
  const id = req.params.id as string;
  const { title, content, subtitle, coverImage } = req.body;

  // Check post exists
  const existing = await postService.findById(id);
  if (!existing) {
    return res.status(404).json({
      success: false,
      error: { message: "Post not found" },
    });
  }

  // TODO: Check if user owns this post (when auth works)

  const post = await postService.updatePost(id, {
    title,
    content,
    subtitle,
    coverImage,
  });

  return res.json({ success: true, data: post });
}

// DELETE /:id - Soft delete post
export async function deletePostController(req: Request, res: Response) {
  const id = req.params.id as string;

  // Check post exists
  const existing = await postService.findById(id);
  if (!existing) {
    return res.status(404).json({
      success: false,
      error: { message: "Post not found" },
    });
  }

  // TODO: Check if user owns this post (when auth works)

  await postService.deletePost(id);

  return res.json({ success: true, message: "Post deleted" });
}

// PATCH /:id/publish - Publish draft
export async function publishPostController(req: Request, res: Response) {
  const id = req.params.id as string;

  // Check post exists
  const existing = await postService.findById(id);
  if (!existing) {
    return res.status(404).json({
      success: false,
      error: { message: "Post not found" },
    });
  }

  // TODO: Check if user owns this post (when auth works)

  if (existing.status === "PUBLISHED") {
    return res.status(400).json({
      success: false,
      error: { message: "Post is already published" },
    });
  }

  const post = await postService.publishPost(id);

  return res.json({ success: true, data: post });
}
