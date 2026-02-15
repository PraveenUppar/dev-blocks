import prisma from "../libs/prisma.js";
// CHECK USER BY USERNAME GET USER PROFILE DETAILS - working
export async function getUserProfileService(username) {
    return prisma.user.findUnique({
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
}
// CHECK USER BY USERNAME - working
export async function getUserNameService(username) {
    return prisma.user.findUnique({
        where: { username },
    });
}
// GET USER BY CLERKID - working
export const getUserClerkIdService = async (clerkId) => {
    return prisma.user.findUnique({
        where: { clerkId },
    });
};
// GET USER BY ID - working
export const getUserIdService = async (id) => {
    return prisma.user.findUnique({
        where: { id },
    });
};
// GET USER POSTS - working
export async function getUserPostsService(username, page = 1, limit = 10, includeUnpublished = false) {
    const skip = (page - 1) * limit;
    const where = {
        author: {
            username: username,
        },
        deletedAt: null,
        ...(includeUnpublished ? {} : { status: "PUBLISHED" }),
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
export async function getUserFollowerService(username, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [followers, total] = await Promise.all([
        prisma.follow.findMany({
            where: { followingId: username }, // people who follow this username
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
            where: { followingId: username },
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
export async function getUserFollowingService(username, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [following, total] = await Promise.all([
        prisma.follow.findMany({
            where: { followerId: username }, // people this user follows
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
            where: { followingId: username },
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
export async function updateUserProfileService(userId, data) {
    return prisma.user.update({
        where: { id: userId },
        data,
    });
}
// FOLLOW USER LOGIC
export async function followUserProfileService(followerId, followingId) {
    const follow = await prisma.follow.create({
        data: { followerId, followingId },
    });
    return follow;
}
// UNFOLLOW USER LOGIC
export async function unfollowUserProfileService(followerId, followingId) {
    return prisma.follow.delete({
        where: {
            followerId_followingId: {
                followerId,
                followingId,
            },
        },
    });
}
// GET USER BOOKMARKS
export async function getUserBookmarksService(userId, page = 1, limit = 10) {
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
export async function getUserDraftsService(authorId, page = 1, limit = 10) {
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
// GET USER READING HISTORY
export async function getUserReadingHistoryService(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [history, total] = await Promise.all([
        prisma.readingHistory.findMany({
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
        prisma.readingHistory.count({ where: { userId } }),
    ]);
    return {
        data: history.map((h) => ({
            ...h.post,
            readingProgress: { timeSpent: h.timeSpent, scrollDepth: h.scrollDepth },
        })),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
}
//# sourceMappingURL=user.service.js.map