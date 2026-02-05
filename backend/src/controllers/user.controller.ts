import { Request, Response } from "express";
import {
  findByClerkIdService,
  findByIdService,
  findByUsernameService,
  followUserService,
  getFollowersService,
  getFollowingService,
  unfollowUserService,
  updateProfileService,
} from "../services/user.service";
import { getUserBookmarks } from "../services/post.service";

// Define params type
interface UsernameParams {
  username: string;
}
export interface IdParams {
  id: string;
}

// ==================== PUBLIC CONTROLLERS ====================
// GET /:username - Get user's public profile
export async function getProfileController(
  req: Request<UsernameParams>,
  res: Response,
) {
  const { username } = req.params;
  const user = await findByUsernameService(username);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: "User not found" },
    });
  }
  return res.json({ success: true, data: user });
}

// GET /:username/posts - Get all published posts by user
export async function getUserPostsController(
  req: Request<UsernameParams>,
  res: Response,
) {
  const { username } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  // First find the user
  const user = await findByUsernameService(username);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: "User not found" },
    });
  }
  // TODO: We'll implement this in post.service.ts later
  // For now, return empty array
  return res.json({
    success: true,
    data: [],
    pagination: { page, limit, total: 0, totalPages: 0 },
  });
}

// GET /:id/followers - Get list of followers
export async function getFollowersController(
  req: Request<IdParams>,
  res: Response,
) {
  const { id } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await getFollowersService(id, page, limit);
  return res.json({ success: true, ...result });
}
// GET /:id/following - Get list of users this user follows
export async function getFollowingController(
  req: Request<IdParams>,
  res: Response,
) {
  const { id } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await getFollowingService(id, page, limit);
  return res.json({ success: true, ...result });
}

// ==================== PROTECTED CONTROLLERS ====================

// PUT /me - Update logged-in user's profile
export async function updateMyProfileController(req: Request, res: Response) {
  const clerkId = (req as any).clerkUserId;
  // Get user from database using Clerk ID
  const user = await findByClerkIdService(clerkId!);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: "User not found" },
    });
  }
  // Update profile with data from request body
  const updated = await updateProfileService(user.id, req.body);
  return res.json({ success: true, data: updated });
}

// POST /:id/follow - Follow a user
export async function followUserController(req: Request, res: Response) {
  const { id: followingId } = req.params; // user to follow
  const clerkId = (req as any).clerkUserId;
  // Get logged-in user
  const follower = await findByClerkIdService(clerkId!);
  if (!follower) {
    return res.status(404).json({
      success: false,
      error: { message: "User not found" },
    });
  }
  // Prevent following yourself
  if (follower.id === followingId) {
    return res.status(400).json({
      success: false,
      error: { message: "Cannot follow yourself" },
    });
  }
  // Check if target user exists
  const targetUser = await findByIdService(followingId as string);
  if (!targetUser) {
    return res.status(404).json({
      success: false,
      error: { message: "User to follow not found" },
    });
  }
  try {
    await followUserService(follower.id, followingId as string);
    return res.status(201).json({
      success: true,
      message: "Successfully followed user",
    });
  } catch (error: any) {
    // Handle duplicate follow (already following)
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: { message: "Already following this user" },
      });
    }
    throw error;
  }
}

// DELETE /:id/follow - Unfollow a user
export async function unfollowUserController(req: Request, res: Response) {
  const { id: followingId } = req.params; // user to unfollow
  const clerkId = (req as any).clerkUserId;
  // Get logged-in user
  const follower = await findByClerkIdService(clerkId!);
  if (!follower) {
    return res.status(404).json({
      success: false,
      error: { message: "User not found" },
    });
  }
  try {
    await unfollowUserService(follower.id, followingId as string);
    return res.json({
      success: true,
      message: "Successfully unfollowed user",
    });
  } catch (error: any) {
    // Handle not following (record not found)
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: { message: "Not following this user" },
      });
    }
    throw error;
  }
}

export async function getMyBookmarksController(req: Request, res: Response) {
  const { userId } = req.query; // For testing; later from auth
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await getUserBookmarks(userId as string, page, limit);
  return res.json({ success: true, ...result });
}
