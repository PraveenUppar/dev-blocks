import type { NextFunction, Request, Response } from "express";
import {
  getPublishedPostService,
  getPublishedPostByIdService,
  getPublishedPostBySlugService,
  getUserClerkIdService,
  createPostService,
  updatePostService,
  deletePostService,
  publishPostService,
  toggleLikePostService,
  toggleBookmarkPostService,
  getDraftPostByIdService,
  getLikeCountService,
  //   readingPublishedPostService, -- later
} from "../services/post.service.js";

interface IdParams {
  id: string;
}

// ==================== PUBLIC CONTROLLERS ====================

// GET Published Posts for Homepage Controller
export async function getPublishedPostController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // User sends: ?limit=999999999
    // Your DB tries to fetch 999 million records → Server crashes
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit as string) || 10),
    );
    // // Optional: Add sorting and filtering
    // const sortBy = (req.query.sortBy as string) || "latest";
    // const tag = req.query.tag as string;
    const posts = await getPublishedPostService({ page, limit });
    return res.status(200).json({ success: true, ...posts });
  } catch (error) {
    next(error);
  }
}
// GET Published Post Metadata by ID Controller
// If user is signed in - return his likes on post and bookmark of post he did - so auth needed
export async function getPublishedPostByIdController(
  req: Request<IdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const userId = req.auth().userId;
    const post = await getPublishedPostByIdService(id, userId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: { message: "Post not found" },
      });
    }
    return res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
}
// GET Published Post by Slug Controller
export async function getPublishedPostBySlugController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const slug = req.params.slug as string;
    const userId = req.auth().userId;
    const post = await getPublishedPostBySlugService(slug, userId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: { message: "Post not found" },
      });
    }
    return res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
}

// ==================== PROTECTED CONTROLLERS ====================

// CREATE a new Draft Post Controller
export async function createPostController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = req.auth().userId;
    const user = await getUserClerkIdService(clerkId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: "User not found" },
      });
    }
    const { title, subtitle, content, coverImage, tags } = req.body;
    if (!title || !content || !subtitle) {
      return res.status(400).json({
        success: false,
        error: { message: "title, subtitle and content are required" },
      });
    }
    // const cleanTags = [
    //   ...new Set((tags as string[]).map((t) => t.trim().toLowerCase())),
    // ]; // This ensures that "React", "react ", and "React" are all treated as the same tag, preventing duplicate database entries
    const post = await createPostService(
      user.id,
      title,
      content,
      subtitle,
      tags,
      coverImage,
    );
    return res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
}
// GET Draft Post by ID Controller
export async function getDraftPostByIdController(
  req: Request<IdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = req.auth().userId;
    const user = await getUserClerkIdService(clerkId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: "User not found" },
      });
    }
    const { id } = req.params;
    const post = await getDraftPostByIdService(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: { message: "Post not found" },
      });
    }
    return res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
}
// UPDATE a Draft Post by ID Controller
export async function updatePostController(
  req: Request<IdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = req.auth().userId;
    const user = await getUserClerkIdService(clerkId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: "User not found" },
      });
    }
    const { id: postId } = req.params;
    const existing = await getDraftPostByIdService(postId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { message: "Post not found" },
      });
    }
    if (existing.authorId !== user.id) {
      return res.status(403).json({
        success: false,
        error: {
          message: "Forbidden: You don't have permission to edit this post",
        },
      });
    }
    const { title, subtitle, content, tags, coverImage } = req.body;
    const post = await updatePostService(
      postId,
      title,
      tags,
      content,
      subtitle,
      coverImage,
    );
    return res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
}
// DELETE a Post by ID Controller
export async function deletePostController(
  req: Request<IdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = req.auth().userId;
    const user = await getUserClerkIdService(clerkId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: "User not found" },
      });
    }
    const { id: postId } = req.params;
    const existing = await getDraftPostByIdService(postId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { message: "Post not found" },
      });
    }
    if (existing.authorId !== user.id) {
      return res.status(403).json({
        success: false,
        error: {
          message: "Forbidden: You don't have permission to delete this post",
        },
      });
    }
    await deletePostService(postId);
    return res.json({ success: true, message: "Post deleted" });
  } catch (error) {
    next(error);
  }
}
// PUBLISH a Post by ID Controller
export async function publishPostController(
  req: Request<IdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = req.auth().userId;
    const user = await getUserClerkIdService(clerkId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: "User not found" },
      });
    }
    const { id: postId } = req.params;
    const existing = await getDraftPostByIdService(postId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { message: "Post not found" },
      });
    }
    if (existing.authorId !== user.id) {
      return res.status(403).json({
        success: false,
        error: {
          message: "Forbidden: You don't have permission to delete this post",
        },
      });
    }
    if (existing.status === "PUBLISHED") {
      return res.status(400).json({
        success: false,
        error: { message: "Post is already published" },
      });
    }
    const post = await publishPostService(postId);
    return res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
}
// LIKE and UNLIKE a Post by ID Controller
export async function likePublishedPostController(
  req: Request<IdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = req.auth().userId;
    const user = await getUserClerkIdService(clerkId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: "User not found" },
      });
    }
    const { id: postId } = req.params;
    const existing = await getPublishedPostByIdService(postId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { message: "Post not found" },
      });
    }
    const result = await toggleLikePostService(user.id, postId);
    const likeCount = await getLikeCountService(postId);
    return res.json({
      success: true,
      data: {
        liked: result.liked,
        likeCount,
        message: result.liked ? "Post liked" : "Like removed",
      },
    });
  } catch (error) {
    next(error);
  }
}
// BOOKMARK and UNBOOKMARK a Post by ID Controller
export async function bookmarkPublishedPostController(
  req: Request<IdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = req.auth().userId;
    const user = await getUserClerkIdService(clerkId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: "User not found" },
      });
    }
    const { id: postId } = req.params;
    const existing = await getPublishedPostByIdService(postId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { message: "Post not found" },
      });
    }
    const result = await toggleBookmarkPostService(user.id, postId);
    return res.json({
      success: true,
      data: {
        bookmarked: result.bookmarked,
        message: result.bookmarked ? "Post bookmarked" : "Bookmarked removed",
      },
    });
  } catch (error) {
    next(error);
  }
}
// RECORD a Reading History -- later
// export async function readingPublishedPostController(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//   } catch (error) {
//     next(error);
//   }
// }
