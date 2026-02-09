import prisma from "../libs/prisma.js";
import { generateSlug } from "../utils/slug.js";
import { calculateReadingTime } from "../utils/readingTime.js";

// GET ALL PUBLISHED POST - working
export async function getPublishedPostService(page: number, limit: number) {
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
}

// GET PUBLISHED POST BY ID - working
export async function getPublishedPostByIdService(id: string, userId?: string) {
  const post = await prisma.post.findFirst({
    where: {
      id,
      deletedAt: null,
      status: "PUBLISHED",
    },
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
        select: {
          comments: true,
          likes: true,
          bookmarks: true,
        },
      },
      // Only fetch user's like/bookmark if userId is provided
      ...(userId && {
        likes: {
          where: { userId },
          take: 1,
        },
        bookmarks: {
          where: { userId },
          take: 1,
        },
      }),
    },
  });

  if (!post) return null;

  // Check if user has liked/bookmarked
  const isLiked = userId && post.likes && post.likes.length > 0;
  const isBookmarked = userId && post.bookmarks && post.bookmarks.length > 0;

  // Remove the likes and bookmarks arrays from response
  const { likes, bookmarks, ...postData } = post;

  return {
    ...postData,
    isLiked: !!isLiked,
    isBookmarked: !!isBookmarked,
  };
}

// GET PUBLISHED POST BY ID - working
export async function getDraftPostByIdService(id: string) {
  return prisma.post.findFirst({
    where: {
      id,
      deletedAt: null,
      status: "DRAFT",
    },
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
}

// GET POST BY SLUG - working
export async function getPublishedPostBySlugService(slug: string) {
  return prisma.post.findFirst({
    where: {
      slug,
      deletedAt: null,
      status: "PUBLISHED",
    },
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

// CREATE A NEW POST
export async function createPostService(
  authorId: string,
  title: string,
  content: string,
  subtitle?: string,
  coverImage?: string,
) {
  let slug = generateSlug(title);
  let counter = 1;
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${generateSlug(title)}-${counter}`;
    counter++;
  }
  const readTime = calculateReadingTime(content);
  return prisma.post.create({
    data: {
      title: title,
      content: content,
      ...(subtitle && { subtitle }),
      ...(coverImage && { coverImage }),
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
}

// EDIT A POST
export async function editPostService(
  id: string,
  title?: string,
  content?: string,
  subtitle?: string,
  coverImage?: string,
) {
  const data = {
    ...(title !== undefined && { title }),
    ...(content !== undefined && { content }),
    ...(subtitle !== undefined && { subtitle }),
    ...(coverImage !== undefined && { coverImage }),
  };
  const updateData: any = { ...data };
  if (data.content) {
    updateData.readTime = calculateReadingTime(data.content);
  }
  if (data.title) {
    let slug = generateSlug(data.title);
    let counter = 1;
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
}

// DELETE A POST
export async function deletePostService(id: string) {
  return prisma.post.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

// PUBLISH A POST
export async function publishPostService(id: string) {
  return prisma.post.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });
}

// LIKE and UNLIKE A POST
export async function toggleLikePostService(userId: string, postId: string) {
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: { userId, postId },
    },
  });

  if (existingLike) {
    // Unlike
    await prisma.like.delete({
      where: {
        userId_postId: { userId, postId },
      },
    });
    return { liked: false };
  } else {
    // Like
    await prisma.like.create({
      data: { userId, postId },
    });
    return { liked: true };
  }
}
// BOOKMARK and UNBOOKMARK A POST
export async function toggleBookmarkPostService(
  userId: string,
  postId: string,
) {
  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_postId: { userId, postId },
    },
  });

  if (existingBookmark) {
    await prisma.bookmark.delete({
      where: {
        userId_postId: { userId, postId },
      },
    });
    return { bookmarked: false };
  } else {
    await prisma.bookmark.create({
      data: { userId, postId },
    });
    return { bookmarked: true };
  }
}

// RECORD READING HISTORY -- later
// export async function readingPublishedPostService() {}
