import { Request, Response } from "express";
import * as postService from "../services/post.service";
import * as tagService from "../services/tag.service";

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

// POST /:id/tags - Add tags to post
export async function addTagsToPostController(req: Request, res: Response) {
  const id = req.params.id as string;
  const { tags } = req.body; // Array of tag names: ["JavaScript", "React"]
  if (!tags || !Array.isArray(tags)) {
    return res.status(400).json({
      success: false,
      error: { message: "tags array is required" },
    });
  }
  const createdTags = await tagService.addTagsToPost(id, tags);
  return res.json({ success: true, data: createdTags });
}

// POST /:id/like - Like a post
export async function likePostController(req: Request, res: Response) {
  const postId = req.params.id as string;
  const { userId } = req.body; // For testing; later from auth
  try {
    await postService.likePost(userId, postId);
    return res.status(201).json({ success: true, message: "Post liked" });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: { message: "Already liked" },
      });
    }
    throw error;
  }
}
// DELETE /:id/like - Unlike a post
export async function unlikePostController(req: Request, res: Response) {
  const postId = req.params.id as string;
  const { userId } = req.body;
  try {
    await postService.unlikePost(userId, postId);
    return res.json({ success: true, message: "Like removed" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: { message: "Not liked" },
      });
    }
    throw error;
  }
}
// POST /:id/bookmark - Bookmark a post
export async function bookmarkPostController(req: Request, res: Response) {
  const postId = req.params.id as string;
  const { userId } = req.body;
  try {
    await postService.bookmarkPost(userId, postId);
    return res.status(201).json({ success: true, message: "Post bookmarked" });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: { message: "Already bookmarked" },
      });
    }
    throw error;
  }
}
// DELETE /:id/bookmark - Remove bookmark
export async function unbookmarkPostController(req: Request, res: Response) {
  const postId = req.params.id as string;
  const { userId } = req.body;
  try {
    await postService.unbookmarkPost(userId, postId);
    return res.json({ success: true, message: "Bookmark removed" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: { message: "Not bookmarked" },
      });
    }
    throw error;
  }
}
