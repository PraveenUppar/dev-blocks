import prisma from "../libs/prisma";
import { generateSlug } from "../utils/slug";
import { calculateReadingTime } from "../utils/readingTime";

// Create a new draft post
export const createPost = async (
  authorId: string,
  data: {
    title: string;
    content: string;
    subtitle?: string;
    coverImage?: string;
  },
) => {
  // Generate unique slug from title
  let slug = generateSlug(data.title);
  let counter = 1;
  // Keep checking until we find a unique slug
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${generateSlug(data.title)}-${counter}`;
    counter++;
  }
  // Calculate reading time
  const readTime = calculateReadingTime(data.content);
  return prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      subtitle: data.subtitle,
      coverImage: data.coverImage,
      slug,
      readTime,
      authorId,
      status: "DRAFT",
    },
    include: {
      author: {
        select: { id: true, username: true, name: true, avatar: true },
      },
    },
  });
};

// Get post by ID
export const findById = async (id: string) => {
  return prisma.post.findUnique({
    where: { id, deletedAt: null },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true,
          bio: true,
        },
      },
      tags: {
        include: { tag: true },
      },
      _count: {
        select: { comments: true, likes: true },
      },
    },
  });
};

// Get post by slug
export const findBySlug = async (slug: string) => {
  return prisma.post.findUnique({
    where: { slug, deletedAt: null },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true,
          bio: true,
        },
      },
      tags: {
        include: { tag: true },
      },
      _count: {
        select: { comments: true, likes: true },
      },
    },
  });
};

// Update post
export const updatePost = async (
  id: string,
  data: {
    title?: string;
    content?: string;
    subtitle?: string;
    coverImage?: string;
  },
) => {
  const updateData: any = { ...data };
  // Recalculate reading time if content changed
  if (data.content) {
    updateData.readTime = calculateReadingTime(data.content);
  }
  // Regenerate slug if title changed
  if (data.title) {
    let slug = generateSlug(data.title);
    let counter = 1;
    // Check for existing slug (excluding current post)
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing && existing.id !== id) {
      while (await prisma.post.findUnique({ where: { slug } })) {
        slug = `${generateSlug(data.title)}-${counter}`;
        counter++;
      }
    }
    updateData.slug = slug;
  }
  return prisma.post.update({
    where: { id },
    data: updateData,
    include: {
      author: {
        select: { id: true, username: true, name: true, avatar: true },
      },
    },
  });
};

// Soft delete post
export const deletePost = async (id: string) => {
  return prisma.post.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

// Publish post
export const publishPost = async (id: string) => {
  return prisma.post.update({
    where: { id },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });
};

// List published posts with pagination
export const listPosts = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
      },
      skip,
      take: limit,
      orderBy: { publishedAt: "desc" },
      include: {
        author: {
          select: { id: true, username: true, name: true, avatar: true },
        },
        _count: {
          select: { comments: true, likes: true },
        },
      },
    }),
    prisma.post.count({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
      },
    }),
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
};

// Get posts by author
export const getPostsByAuthor = async (
  authorId: string,
  page: number = 1,
  limit: number = 10,
  includeUnpublished: boolean = false,
) => {
  const skip = (page - 1) * limit;
  const where = {
    authorId,
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
};

// Like a post
export const likePost = async (userId: string, postId: string) => {
  return prisma.like.create({
    data: { userId, postId },
  });
};

// Unlike a post
export const unlikePost = async (userId: string, postId: string) => {
  return prisma.like.delete({
    where: {
      userId_postId: { userId, postId },
    },
  });
};

// Bookmark a post
export const bookmarkPost = async (userId: string, postId: string) => {
  return prisma.bookmark.create({
    data: { userId, postId },
  });
};

// Remove bookmark
export const unbookmarkPost = async (userId: string, postId: string) => {
  return prisma.bookmark.delete({
    where: {
      userId_postId: { userId, postId },
    },
  });
};

// Get user's bookmarks
export const getUserBookmarks = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
) => {
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
};

// Check if user liked/bookmarked a post
export const getPostEngagement = async (userId: string, postId: string) => {
  const [like, bookmark] = await Promise.all([
    prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    }),
    prisma.bookmark.findUnique({
      where: { userId_postId: { userId, postId } },
    }),
  ]);

  return {
    liked: !!like,
    bookmarked: !!bookmark,
  };
};

// Increment view count
export const incrementViewCount = async (id: string) => {
  return prisma.post.update({
    where: { id },
    data: {
      viewCount: { increment: 1 },
    },
  });
};

// Get user's drafts
export const getUserDrafts = async (
  authorId: string,
  page: number = 1,
  limit: number = 10,
) => {
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
};

// Record reading history
export const recordReadingHistory = async (
  userId: string,
  postId: string,
  timeSpent: number,
  scrollDepth: number,
) => {
  return prisma.readingHistory.upsert({
    where: {
      userId_postId: { userId, postId },
    },
    update: {
      timeSpent,
      scrollDepth,
    },
    create: {
      userId,
      postId,
      timeSpent,
      scrollDepth,
    },
  });
};

// Get user's reading history
export const getUserReadingHistory = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
) => {
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
};
