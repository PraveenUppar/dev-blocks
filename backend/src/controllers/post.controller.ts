import type { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";
import prisma from "../libs/prisma.js";
import {
  getPublishedPostService,
  getPublishedPostByIdService,
  getPublishedPostBySlugService,
  getUserClerkIdService,
  createPostService,
  editPostService,
  deletePostService,
  publishPostService,
  toggleLikePostService,
  toggleBookmarkPostService,
  getDraftPostByIdService,
  //   readingPublishedPostService, -- later
} from "../services/post.service.js";

interface IdParams {
  id: string;
}

// interface createPostBody {
//   title: string;
//   content: string;
//   subtitle?: string;
//   coverImage?: string;
// }

// ==================== PUBLIC CONTROLLERS ====================

// Tested and working
export async function getPublishedPostController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const posts = await getPublishedPostService(page, limit);
    return res.json({ success: true, ...posts });
  } catch (error) {
    next(error);
  }
}
// Tested and working
export async function getPublishedPostByIdController(
  req: Request<IdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    // Try to get authenticated user (optional for public route)
    let userId: string | undefined;

    try {
      const clerkId = req.auth().userId;
      if (clerkId) {
        const user = await getUserClerkIdService(clerkId);
        userId = user?.id;
      }
    } catch (error) {
      // User not authenticated - that's okay for public routes
      userId = undefined;
    }

    const post = await getPublishedPostByIdService(id, userId);

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
//
export async function getDraftPostByIdController(
  req: Request<IdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized" },
      });
    }
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
// Tested and working
export async function getPublishedPostBySlugController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const slug = req.params.slug as string;
    const post = await getPublishedPostBySlugService(slug);
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

// ==================== PROTECTED CONTROLLERS ====================

export async function createPostController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = req.auth().userId;
    if (!clerkId) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized" },
      });
    }
    const user = await getUserClerkIdService(clerkId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: "User not found" },
      });
    }
    const { title, subtitle, content, coverImage } = req.body;
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: { message: "title and content are required" },
      });
    }
    const post = await createPostService(
      user.id,
      title,
      content,
      subtitle,
      coverImage,
    );
    return res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
}

export async function editPostController(
  req: Request<IdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized" },
      });
    }
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
    const { title, subtitle, content, coverImage } = req.body;
    const post = await editPostService(
      postId,
      title,
      content,
      subtitle,
      coverImage,
    );
    return res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
}

export async function deletePostController(
  req: Request<IdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = req.auth().userId;
    if (!clerkId) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized" },
      });
    }
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
export async function publishPostController(
  req: Request<IdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized" },
      });
    }
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
export async function likePublishedPostController(
  req: Request<IdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized" },
      });
    }

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

    // Get updated like count
    const likeCount = await prisma.like.count({
      where: { postId },
    });

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
export async function bookmarkPublishedPostController(
  req: Request<IdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized" },
      });
    }
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
