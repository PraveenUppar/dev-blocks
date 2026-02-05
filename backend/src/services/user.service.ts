import prisma from "../libs/prisma";
import * as notificationService from "./notification.service";

// ==================== FIND FUNCTIONS ====================

// Get user by username with follower/following/post counts
export async function findByUsernameService(username: string) {
  return prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      name: true,
      bio: true,
      avatar: true,
      website: true,
      twitter: true,
      github: true,
      linkedin: true,
      createdAt: true,
      _count: {
        select: {
          followers: true, // how many people follow this user
          following: true, // how many people this user follows
          posts: true, // how many posts this user has
        },
      },
    },
  });
}

// Get user by database ID
export const findByIdService = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

// Get user by Clerk ID (used after auth middleware)
export const findByClerkIdService = async (clerkId: string) => {
  return prisma.user.findUnique({
    where: { clerkId },
  });
};

// ==================== UPDATE FUNCTIONS ====================

// Update user profile
export const updateProfileService = async (
  userId: string,
  data: {
    name?: string;
    bio?: string;
    avatar?: string;
    website?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
  },
) => {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
};

// ==================== FOLLOW FUNCTIONS ====================

// Follow a user
export const followUser = async (followerId: string, followingId: string) => {
  if (followerId === followingId) {
    throw new Error("Cannot follow yourself");
  }
  const follow = await prisma.follow.create({
    data: { followerId, followingId },
  });
  // Get follower name for notification
  const follower = await prisma.user.findUnique({ where: { id: followerId } });
  if (follower) {
    notificationService.notifyNewFollower(
      followerId,
      followingId,
      follower.name || follower.username,
    );
  }
  return follow;
};

// Unfollow a user
export const unfollowUserService = async (
  followerId: string,
  followingId: string,
) => {
  return prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });
};

// ==================== GET FOLLOWERS/FOLLOWING ====================

// Get paginated list of followers
export const getFollowersService = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;

  const [followers, total] = await Promise.all([
    prisma.follow.findMany({
      where: { followingId: userId }, // people who follow this user
      skip,
      take: limit,
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            bio: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.follow.count({
      where: { followingId: userId },
    }),
  ]);

  return {
    data: followers.map((f) => f.follower),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get paginated list of users this user follows
export const getFollowingService = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;

  const [following, total] = await Promise.all([
    prisma.follow.findMany({
      where: { followerId: userId }, // people this user follows
      skip,
      take: limit,
      include: {
        following: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            bio: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.follow.count({
      where: { followerId: userId },
    }),
  ]);

  return {
    data: following.map((f) => f.following),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
