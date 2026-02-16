import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { HTTP_STATUS } from "../errors/httpStatus.js";
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
} from "../services/post.service.js";
import { sanitizeHtml } from "../utils/contentSanitization.js";

// ==================== PUBLIC CONTROLLERS ====================

// GET Published Posts for Homepage Controller
export async function getPublishedPostController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // Pagination validated and clamped by validatePaginationQuery middleware
    const { page, limit } = req.query as unknown as { page: number; limit: number };
    // // Optional: Add sorting and filtering
    // const sortBy = (req.query.sortBy as string) || "latest";
    // const tag = req.query.tag as string;
    const posts = await getPublishedPostService({ page, limit });
    return res.status(HTTP_STATUS.OK).json({ success: true, ...posts });
  } catch (error) {
    next(error);
  }
}

interface IdParams {
  id: string;
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
    if (!post) throw AppError.notFound("Post not found");
    return res.status(HTTP_STATUS.OK).json({ success: true, data: post });
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
    if (!post) throw AppError.notFound("Post not found");
    return res.status(HTTP_STATUS.OK).json({ success: true, data: post });
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
    if (!user) throw AppError.notFound("User not found");

    const { title, subtitle, content, coverImage, tags } = req.body;
    // For tags "React", "react ", and "React" are all treated as the same tag, preventing duplicate database entries - done during validation
    const sanitizedContent = sanitizeHtml(content);
    const post = await createPostService({
      authorId: user.id,
      title,
      content: sanitizedContent,
      subtitle,
      tags,
      coverImage,
    });

    return res.status(HTTP_STATUS.CREATED).json({ success: true, data: post });
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
    if (!user) throw AppError.unauthorized("User not found");
    const { id } = req.params;
    const post = await getDraftPostByIdService(id, user.id);
    if (!post) throw AppError.notFound("Post not found");

    return res.status(HTTP_STATUS.OK).json({ success: true, data: post });
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
    if (!user) throw AppError.notFound("User not found");

    const { id } = req.params;
    const findpost = await getDraftPostByIdService(id, user.id);
    if (!findpost) throw AppError.notFound("Post not found");

    const { title, subtitle, content, tags, coverImage } = req.body;
    const sanitizedContent = sanitizeHtml(content);
    const post = await updatePostService({
      userId: user.id,
      postId: id,
      title,
      tags,
      content: sanitizedContent,
      subtitle,
      coverImage,
    });
    if (!post) throw AppError.notFound("Post not found");

    return res.status(HTTP_STATUS.OK).json({ success: true, data: post });
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
    if (!user) throw AppError.notFound("User not found");

    const { id: postId } = req.params;
    const findpost = await getDraftPostByIdService(postId, user.id);
    if (!findpost) throw AppError.notFound("Post not found");

    await deletePostService(postId, user.id);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Post deleted",
    });
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
    if (!user) throw AppError.notFound("User not found");

    const { id: postId } = req.params;
    const post = await publishPostService(postId, user.id);

    return res.status(HTTP_STATUS.OK).json({ success: true, data: post });
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
    if (!user) throw AppError.notFound("User not found");

    const { id: postId } = req.params;
    const existing = await getPublishedPostByIdService(postId);
    if (!existing) throw AppError.notFound("Post not found");

    const result = await toggleLikePostService(user.id, postId);
    const likeCount = await getLikeCountService(postId);

    return res.status(HTTP_STATUS.OK).json({
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
    if (!user) throw AppError.notFound("User not found");

    const { id: postId } = req.params;
    const existing = await getPublishedPostByIdService(postId);
    if (!existing) throw AppError.notFound("Post not found");

    const result = await toggleBookmarkPostService(user.id, postId);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        bookmarked: result.bookmarked,
        message: result.bookmarked ? "Post bookmarked" : "Bookmark removed",
      },
    });
  } catch (error) {
    next(error);
  }
}
