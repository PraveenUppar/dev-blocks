import type { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";

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

interface usernameParams {
  username: string;
}
// interface IdParams {
//   id: string;
// }

// ==================== PUBLIC CONTROLLERS ====================

export async function getCurrentUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = getAuth(req).userId;
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

    return res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

// Tested and Working
export async function getUserProfileController(
  req: Request<usernameParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { username } = req.params;
    const user = await getUserProfileService(username);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: "User not found" },
      });
    }
    return res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}
// Tested and Working
export async function getUserPostsController(
  req: Request<usernameParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { username } = req.params;
    const user = await getUserNameService(username);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: "User not found" },
      });
    }
    const posts = await getUserPostsService(username, page, limit);
    return res.json({ success: true, ...posts });
  } catch (error) {
    next(error);
  }
}
// Tested and Working
export async function getUserFollowersController(
  req: Request<usernameParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { username } = req.params;
    const user = await getUserNameService(username);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: "User not found" },
      });
    }
    const followers = await getUserFollowerService(username, page, limit);
    return res.json({ success: true, ...followers });
  } catch (error) {
    next(error);
  }
}
// Tested and Working
export async function getUserFollowingController(
  req: Request<usernameParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { username } = req.params;
    const user = await getUserNameService(username);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: "User not found" },
      });
    }
    const following = await getUserFollowingService(username, page, limit);
    return res.json({ success: true, ...following });
  } catch (error) {
    next(error);
  }
}

// ==================== PROTECTED CONTROLLERS ====================

//
export async function updateUserProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = req.auth().userId;
    if (!clerkId) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized User" },
      });
    }
    const user = await getUserClerkIdService(clerkId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: "User not found" },
      });
    }
    // choose the parts to update and sanitize the content
    const updated = await updateUserProfileService(user.id, req.body);
    return res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}
//
export async function followUserProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const followingId = req.params.id;
    const clerkId = req.auth().userId;
    if (!clerkId) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized Unauthorized From Space" },
      });
    }
    const user = await getUserClerkIdService(clerkId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: "User not found" },
      });
    }
    // Prevent following yourself
    if (user.id === followingId) {
      return res.status(400).json({
        success: false,
        error: { message: "Cannot follow yourself" },
      });
    }
    const targetUser = await getUserIdService(followingId as string);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        error: { message: "User to follow not found" },
      });
    }
    await followUserProfileService(user.id, followingId as string);
    return res.status(201).json({
      success: true,
      message: "Successfully followed user",
    });
  } catch (error) {
    next(error);
  }
}
//
export async function unfollowUserProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const followingId = req.params.id;
    const clerkId = req.auth().userId;
    if (!clerkId) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized Unauthorized From Space" },
      });
    }
    const user = await getUserClerkIdService(clerkId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: "User not found" },
      });
    }
    await unfollowUserProfileService(user.id, followingId as string);
    return res.json({
      success: true,
      message: "Successfully unfollowed user",
    });
  } catch (error) {
    next(error);
  }
}
//
export async function getUserBookmarksController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized From Space" },
      });
    }
    const user = await getUserClerkIdService(clerkId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: "User not found" },
      });
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const bookmarks = await getUserBookmarksService(user.id, page, limit);
    return res.json({ success: true, ...bookmarks });
  } catch (error) {
    next(error);
  }
}
//
export async function getUserDraftsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized Unauthorized " },
      });
    }
    const user = await getUserClerkIdService(clerkId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: "User not found" },
      });
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const drafts = await getUserDraftsService(user.id, page, limit);
    return res.json({ success: true, ...drafts });
  } catch (error) {
    next(error);
  }
}
//
export async function getUserReadingHistoryController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized Unauthorized" },
      });
    }
    const user = await getUserClerkIdService(clerkId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: "User not found" },
      });
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const readinghistory = await getUserReadingHistoryService(
      user.id,
      page,
      limit,
    );
    return res.json({ success: true, ...readinghistory });
  } catch (error) {
    next(error);
  }
}
