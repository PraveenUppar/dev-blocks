import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { HTTP_STATUS } from "../errors/httpStatus.js";

import {
  getUserProfileService,
  getUserNameService,
  getUserIdService,
  getUserClerkIdService,
  getUserPostsService,
  getUserFollowerService,
  getUserFollowingService,
  updateUserProfileService,
  followUserProfileService,
  unfollowUserProfileService,
  getUserDraftsService,
  getUserBookmarksService,
  getUserReadingHistoryService,
} from "../services/user.service.js";

// ==================== PUBLIC CONTROLLERS ====================

export async function getCurrentUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = req.auth().userId;
    if (!clerkId) throw AppError.unauthorized();

    const user = await getUserClerkIdService(clerkId);
    if (!user) throw AppError.notFound("User not found");

    return res.status(HTTP_STATUS.OK).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

// Tested and Working
export async function getUserProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const username = req.params.username as string;
    const user = await getUserProfileService(username);
    if (!user) throw AppError.notFound("User not found");
    return res.status(HTTP_STATUS.OK).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

// Tested and Working
export async function getUserPostsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const username = req.params.username as string;
    const user = await getUserNameService(username);
    if (!user) throw AppError.notFound("User not found");

    const { page, limit } = req.query as unknown as { page: number; limit: number };
    const posts = await getUserPostsService(username, page, limit);

    return res.status(HTTP_STATUS.OK).json({ success: true, ...posts });
  } catch (error) {
    next(error);
  }
}

// Tested and Working
export async function getUserFollowersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const username = req.params.username as string;
    const user = await getUserNameService(username);
    if (!user) throw AppError.notFound("User not found");

    const { page, limit } = req.query as unknown as { page: number; limit: number };
    const followers = await getUserFollowerService(username, page, limit);

    return res.status(HTTP_STATUS.OK).json({ success: true, ...followers });
  } catch (error) {
    next(error);
  }
}

// Tested and Working
export async function getUserFollowingController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const username = req.params.username as string;
    const user = await getUserNameService(username);
    if (!user) throw AppError.notFound("User not found");

    const { page, limit } = req.query as unknown as { page: number; limit: number };
    const following = await getUserFollowingService(username, page, limit);

    return res.status(HTTP_STATUS.OK).json({ success: true, ...following });
  } catch (error) {
    next(error);
  }
}

// ==================== PROTECTED CONTROLLERS ====================

export async function updateUserProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = req.auth().userId;
    if (!clerkId) throw AppError.unauthorized();

    const user = await getUserClerkIdService(clerkId);
    if (!user) throw AppError.notFound("User not found");

    const updated = await updateUserProfileService(user.id, req.body);
    return res.status(HTTP_STATUS.OK).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

export async function followUserProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const followingId = req.params.id;
    const clerkId = req.auth().userId;
    if (!clerkId) throw AppError.unauthorized();
    const user = await getUserClerkIdService(clerkId);
    if (!user) throw AppError.notFound("User not found");
    if (user.id === followingId) {
      throw AppError.badRequest("Cannot follow yourself");
    }
    const targetUser = await getUserIdService(followingId as string);
    if (!targetUser) throw AppError.notFound("User to follow not found");
    await followUserProfileService(user.id, followingId as string);
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Successfully followed user",
    });
  } catch (error) {
    next(error);
  }
}



export async function unfollowUserProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const followingId = req.params.id;
    const clerkId = req.auth().userId;
    if (!clerkId) throw AppError.unauthorized();

    const user = await getUserClerkIdService(clerkId);
    if (!user) throw AppError.notFound("User not found");

    await unfollowUserProfileService(user.id, followingId as string);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Successfully unfollowed user",
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserBookmarksController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = req.auth().userId;
    if (!clerkId) throw AppError.unauthorized();

    const user = await getUserClerkIdService(clerkId);
    if (!user) throw AppError.notFound("User not found");

    const { page, limit } = req.query as unknown as { page: number; limit: number };
    const bookmarks = await getUserBookmarksService(user.id, page, limit);

    return res.status(HTTP_STATUS.OK).json({ success: true, ...bookmarks });
  } catch (error) {
    next(error);
  }
}

export async function getUserDraftsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = req.auth().userId;
    if (!clerkId) throw AppError.unauthorized();

    const user = await getUserClerkIdService(clerkId);
    if (!user) throw AppError.notFound("User not found");

    const { page, limit } = req.query as unknown as { page: number; limit: number };
    const drafts = await getUserDraftsService(user.id, page, limit);

    return res.status(HTTP_STATUS.OK).json({ success: true, ...drafts });
  } catch (error) {
    next(error);
  }
}

export async function getUserReadingHistoryController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = req.auth().userId;
    if (!clerkId) throw AppError.unauthorized();

    const user = await getUserClerkIdService(clerkId);
    if (!user) throw AppError.notFound("User not found");

    const { page, limit } = req.query as unknown as { page: number; limit: number };
    const readinghistory = await getUserReadingHistoryService(
      user.id,
      page,
      limit,
    );

    return res.status(HTTP_STATUS.OK).json({ success: true, ...readinghistory });
  } catch (error) {
    next(error);
  }
}
