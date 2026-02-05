import prisma from "../libs/prisma";
import * as notificationService from "./notification.service";

// Get comments for a post (with replies)
export const getPostComments = async (
  postId: string,
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;

  // Get only top-level comments (parentId is null)
  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: {
        postId,
        parentId: null, // Only top-level comments
        isDeleted: false,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, username: true, name: true, avatar: true },
        },
        replies: {
          where: { isDeleted: false },
          include: {
            user: {
              select: { id: true, username: true, name: true, avatar: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    }),
    prisma.comment.count({
      where: {
        postId,
        parentId: null,
        isDeleted: false,
      },
    }),
  ]);

  return {
    data: comments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Create a comment on a post
export const createComment = async (
  postId: string,
  userId: string,
  content: string,
) => {
  const comment = await prisma.comment.create({
    data: { postId, userId, content },
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true } },
    },
  });
  // Get post and commenter for notification
  const [post, commenter] = await Promise.all([
    prisma.post.findUnique({ where: { id: postId } }),
    prisma.user.findUnique({ where: { id: userId } }),
  ]);
  if (post && commenter) {
    notificationService.notifyPostCommented(
      userId,
      post,
      commenter.name || commenter.username,
    );
  }
  return comment;
};
// Reply to a comment
export const replyToComment = async (
  parentId: string,
  userId: string,
  content: string,
) => {
  // Get parent comment to find postId
  const parent = await prisma.comment.findUnique({
    where: { id: parentId },
  });

  if (!parent) {
    throw new Error("Parent comment not found");
  }

  return prisma.comment.create({
    data: {
      postId: parent.postId,
      userId,
      content,
      parentId,
    },
    include: {
      user: {
        select: { id: true, username: true, name: true, avatar: true },
      },
    },
  });
};

// Update a comment
export const updateComment = async (id: string, content: string) => {
  return prisma.comment.update({
    where: { id },
    data: { content },
    include: {
      user: {
        select: { id: true, username: true, name: true, avatar: true },
      },
    },
  });
};

// Soft delete a comment
export const deleteComment = async (id: string) => {
  return prisma.comment.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
};

// Get comment by ID
export const findById = async (id: string) => {
  return prisma.comment.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, username: true, name: true, avatar: true },
      },
    },
  });
};
