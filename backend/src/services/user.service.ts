import prisma from "../libs/prisma.js";

// CHECK USER BY USERNAME GET USER PROFILE DETAILS - working
export async function getUserProfileService(
  username: string,
  currentUserId?: string,
) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      email: true,
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

  if (!user) return null;

  let isFollowing = false;
  if (currentUserId) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: user.id,
        },
      },
    });
    isFollowing = !!follow;
  }

  return { ...user, isFollowing };
}

// CHECK USER BY USERNAME - working
export async function getUserNameService(username: string) {
  return prisma.user.findUnique({
    where: { username },
  });
}

// GET USER BY CLERKID - working
export const getUserClerkIdService = async (clerkId: string) => {
  return prisma.user.findUnique({
    where: { clerkId },
  });
};

// GET USER BY ID - working
export const getUserIdService = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

// GET USER POSTS - working
export async function getUserPostsService(
  username: string,
  page: number = 1,
  limit: number = 10,
  includeUnpublished: boolean = false,
) {
  const skip = (page - 1) * limit;
  const where = {
    author: {
      username: username,
    },
    deletedAt: null,
    ...(includeUnpublished ? {} : { status: "PUBLISHED" as const }),
  };
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            username: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: { comments: true, likes: true },
        },
      },
    }),
    prisma.post.count({ where }),
  ]);
  return {
    data: posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// GET USER FOLLOWERS - working
export async function getUserFollowerService(
  username: string,
  page: number = 1,
  limit: number = 10,
) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  if (!user)
    return { data: [], pagination: { page, limit, total: 0, totalPages: 0 } };

  const skip = (page - 1) * limit;
  const [followers, total] = await Promise.all([
    prisma.follow.findMany({
      where: { followingId: user.id }, // people who follow this user
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
      where: { followingId: user.id },
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
}
// GET USER FOLLOWING - working
export async function getUserFollowingService(
  username: string,
  page: number = 1,
  limit: number = 10,
) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  if (!user)
    return { data: [], pagination: { page, limit, total: 0, totalPages: 0 } };

  const skip = (page - 1) * limit;
  const [following, total] = await Promise.all([
    prisma.follow.findMany({
      where: { followerId: user.id }, // people this user follows
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
      where: { followerId: user.id },
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
}

// UPDATE USER PROFILE
export async function updateUserProfileService(
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
) {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
}

// TOGGLE FOLLOW/UNFOLLOW USER
export async function toggleFollowService(
  followerId: string,
  followingId: string,
) {
  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: { followerId, followingId },
    },
  });

  if (existingFollow) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });
    return { followed: false };
  } else {
    await prisma.follow.create({
      data: { followerId, followingId },
    });
    return { followed: true };
  }
}

// GET USER BOOKMARKS
export async function getUserBookmarksService(
  userId: string,
  page: number = 1,
  limit: number = 10,
) {
  const skip = (page - 1) * limit;
  const [bookmarks, total] = await Promise.all([
    prisma.bookmark.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        post: {
          include: {
            author: {
              select: { id: true, username: true, name: true, avatar: true },
            },
          },
        },
      },
    }),
    prisma.bookmark.count({ where: { userId } }),
  ]);

  return {
    data: bookmarks.map((b) => b.post),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// GET USER DRAFTS
export async function getUserDraftsService(
  authorId: string,
  page: number = 1,
  limit: number = 10,
) {
  const skip = (page - 1) * limit;
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        authorId,
        status: "DRAFT",
        deletedAt: null,
      },
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.post.count({
      where: {
        authorId,
        status: "DRAFT",
        deletedAt: null,
      },
    }),
  ]);

  return {
    data: posts,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}
