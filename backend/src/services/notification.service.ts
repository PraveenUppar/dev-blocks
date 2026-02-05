import prisma from "../libs/prisma";
import { NotificationType } from "../generated/prisma";

// Create a notification
export const createNotification = async (
  userId: string, // Who receives it
  type: NotificationType,
  content: string,
  actorId?: string, // Who triggered it
  postId?: string,
  commentId?: string,
) => {
  // Don't notify yourself
  if (actorId === userId) return null;

  return prisma.notification.create({
    data: {
      userId,
      type,
      content,
      actorId,
      postId,
      commentId,
    },
  });
};

// Get user's notifications
export const getUserNotifications = async (
  userId: string,
  page: number = 1,
  limit: number = 20,
) => {
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.notification.count({ where: { userId } }),
  ]);

  return {
    data: notifications,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

// Mark as read
export const markAsRead = async (id: string) => {
  return prisma.notification.update({
    where: { id },
    data: { read: true },
  });
};

// Mark all as read
export const markAllAsRead = async (userId: string) => {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
};

// Get unread count
export const getUnreadCount = async (userId: string) => {
  return prisma.notification.count({
    where: { userId, read: false },
  });
};

// ==================== HELPER FUNCTIONS ====================
// Call these from other services when actions happen

export const notifyNewFollower = async (
  followerId: string,
  followingId: string,
  followerName: string,
) => {
  return createNotification(
    followingId, // The person being followed gets notified
    "NEW_FOLLOWER",
    `${followerName} started following you`,
    followerId,
  );
};

export const notifyPostLiked = async (
  likerId: string,
  post: { id: string; authorId: string },
  likerName: string,
) => {
  return createNotification(
    post.authorId,
    "POST_LIKED",
    `${likerName} liked your post`,
    likerId,
    post.id,
  );
};

export const notifyPostCommented = async (
  commenterId: string,
  post: { id: string; authorId: string },
  commenterName: string,
) => {
  return createNotification(
    post.authorId,
    "POST_COMMENTED",
    `${commenterName} commented on your post`,
    commenterId,
    post.id,
  );
};

export const notifyCommentReplied = async (
  replierId: string,
  parentComment: { id: string; userId: string },
  postId: string,
  replierName: string,
) => {
  return createNotification(
    parentComment.userId,
    "COMMENT_REPLIED",
    `${replierName} replied to your comment`,
    replierId,
    postId,
    parentComment.id,
  );
};
