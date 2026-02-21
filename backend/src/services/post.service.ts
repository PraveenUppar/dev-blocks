import prisma from "../libs/prisma.js";
import { generateSlug, calculateReadingTime } from "../utils/helper.js";
import { nanoid } from "nanoid";

// CHECK USER BY USERNAME Service
export async function getUserNameService(username: string) {
  return prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
}
// GET USER BY CLERKID Service
export const getUserClerkIdService = async (clerkId: string) => {
  return prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });
};
// GET USER BY ID Service
export const getUserIdService = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true },
  });
};
interface GetPostsParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: "latest" | "oldest" | "popular";
}
export async function getPublishedPostService({
  page,
  limit,
  search,
  sortBy,
}: GetPostsParams) {
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {
    status: "PUBLISHED",
    deletedAt: null,
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { subtitle: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  // Build orderBy clause
  const orderByMap = {
    latest: { publishedAt: "desc" as const },
    oldest: { publishedAt: "asc" as const },
    popular: { viewCount: "desc" as const },
  };
  const orderBy = orderByMap[sortBy || "latest"];

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: {
        id: true,
        title: true,
        subtitle: true,
        slug: true,
        coverImage: true,
        readTime: true,
        viewCount: true,
        publishedAt: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: { name: true, slug: true },
            },
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
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
}
// GET PUBLISHED POST CONTENT BY ID Service
export async function getPublishedPostByIdService(id: string, userId?: string) {
  const post = await prisma.post.findUnique({
    where: {
      id,
      deletedAt: null,
    },
    select: {
      id: true,
      title: true,
      subtitle: true,
      content: true,
      slug: true,
      coverImage: true,
      readTime: true,
      viewCount: true,
      readCount: true,
      status: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
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
        select: {
          tag: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
      _count: {
        select: {
          comments: true,
          likes: true,
          bookmarks: true,
        },
      },
      // Conditionally fetch user interactions
      ...(userId && {
        likes: {
          where: { userId },
          select: { id: true },
          take: 1,
        },
        bookmarks: {
          where: { userId },
          select: { id: true },
          take: 1,
        },
      }),
    },
  });

  if (!post || post.status !== "PUBLISHED") {
    return null;
  }
  await prisma.post.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });
  const isLiked = userId && post.likes && post.likes.length > 0;
  const isBookmarked = userId && post.bookmarks && post.bookmarks.length > 0;

  // Check if current user follows the author
  let isFollowing = false;
  if (userId && post.author.id) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: post.author.id,
        },
      },
    });
    isFollowing = !!follow;
  }

  const flattenedTags = post.tags.map((t) => t.tag);
  const { likes, bookmarks, tags, ...postData } = post; // Remove the likes and bookmarks and tags arrays(not needed) for response
  return {
    ...postData,
    tags: flattenedTags,
    isLiked: !!isLiked,
    isBookmarked: !!isBookmarked,
    isFollowing,
  };
}
// GET POST BY SLUG Service
export async function getPublishedPostBySlugService(
  slug: string,
  userId?: string,
) {
  const post = await prisma.post.findUnique({
    where: {
      slug,
      deletedAt: null,
    },
    select: {
      id: true,
      title: true,
      subtitle: true,
      content: true,
      slug: true,
      coverImage: true,
      readTime: true,
      viewCount: true,
      readCount: true,
      status: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
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
        select: {
          tag: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
      _count: {
        select: {
          comments: true,
          likes: true,
          bookmarks: true,
        },
      },
      // Conditionally fetch user interactions
      ...(userId && {
        likes: {
          where: { userId },
          select: { id: true },
          take: 1,
        },
        bookmarks: {
          where: { userId },
          select: { id: true },
          take: 1,
        },
      }),
    },
  });

  if (!post || post.status !== "PUBLISHED") {
    return null;
  }
  await prisma.post.update({
    where: { slug },
    data: { viewCount: { increment: 1 } },
  });
  const isLiked = userId && post.likes && post.likes.length > 0;
  const isBookmarked = userId && post.bookmarks && post.bookmarks.length > 0;

  // Check if current user follows the author
  let isFollowing = false;
  if (userId && post.author.id) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: post.author.id,
        },
      },
    });
    isFollowing = !!follow;
  }

  const flattenedTags = post.tags.map((t) => t.tag);
  const { likes, bookmarks, tags, ...postData } = post; // Remove the likes and bookmarks and tags arrays(not needed) for response
  return {
    ...postData,
    tags: flattenedTags,
    isLiked: !!isLiked,
    isBookmarked: !!isBookmarked,
    isFollowing,
  };
}
// CREATE A NEW DRAFT POST Service
interface CreatePostData {
  authorId: string;
  title: string;
  subtitle: string;
  content: string;
  coverImage?: string;
  tags?: string[];
}
export async function createPostService(data: CreatePostData) {
  const { authorId, title, subtitle, content, coverImage, tags } = data;
  let slug = generateSlug(title);
  const existingPost = await prisma.post.findUnique({
    where: { id: authorId, slug },
    select: { id: true },
  });
  if (existingPost) {
    slug = `${slug}-${nanoid(5)}`;
  }
  const readTime = calculateReadingTime(content);
  const post = await prisma.post.create({
    data: {
      title,
      content,
      subtitle,
      slug,
      readTime,
      authorId: authorId,
      status: "DRAFT",
      ...(coverImage && { coverImage }),
      ...(tags &&
        tags.length > 0 && {
          tags: {
            create: tags.map((tagName) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tagName },
                  create: { name: tagName, slug: generateSlug(tagName) }, // It ensures the new tag has a URL-friendly name (e.g., name: "Web Development" becomes slug: "web-development").
                },
              },
            })),
          },
        }),
    },
    select: {
      id: true,
      title: true,
      subtitle: true,
      content: true,
      slug: true,
      coverImage: true,
      readTime: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true,
        },
      },
      tags: {
        select: {
          tag: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });
  const flattenedTags = post.tags.map((t) => t.tag);
  return {
    ...post,
    tags: flattenedTags, // Transforms [{tag: {name: 'Tech'}}] into ['Tech']
  };
}
// GET DRAFT POST BY ID Service
export async function getDraftPostByIdService(id: string, userId: string) {
  const post = await prisma.post.findUnique({
    where: {
      id,
      authorId: userId,
      deletedAt: null,
    },
    select: {
      id: true,
      title: true,
      subtitle: true,
      content: true,
      slug: true,
      coverImage: true,
      readTime: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true,
        },
      },
      tags: {
        select: {
          tag: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });
  if (!post || post.status !== "DRAFT") {
    return null;
  }
  if (post.author.id !== userId) {
    return null;
  }
  return {
    ...post,
    tags: post.tags.map((t) => t.tag),
  };
}
// UPDATE A POST BY ID Service
interface UpdatePostData {
  userId: string;
  postId: string;
  title?: string;
  subtitle?: string;
  content?: string;
  coverImage?: string;
  tags?: string[];
}
export async function updatePostService(data: UpdatePostData) {
  const { userId, postId, title, subtitle, content, coverImage, tags } = data;
  const updateData: any = {};
  if (content) {
    updateData.content = content;
    updateData.readTime = calculateReadingTime(content);
  }
  if (title) {
    updateData.title = title;

    let slug = generateSlug(title);
    const existingPost = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (existingPost) {
      slug = `${slug}-${nanoid(5)}`;
    }
    updateData.slug = slug;
  }
  if (subtitle) {
    updateData.subtitle = subtitle;
  }
  if (tags && tags.length > 0) {
    updateData.tags = {
      deleteMany: {},
      create: tags.map((tagName) => ({
        tag: {
          connectOrCreate: {
            where: { name: tagName },
            create: { name: tagName, slug: generateSlug(tagName) },
          },
        },
      })),
    };
  }
  if (coverImage) {
    updateData.coverImage = coverImage;
  }
  updateData.updatedAt = new Date();

  const updatedPost = await prisma.post.update({
    where: {
      id: postId,
      authorId: userId,
    },
    data: updateData,
    select: {
      id: true,
      title: true,
      subtitle: true,
      content: true,
      slug: true,
      coverImage: true,
      readTime: true,
      status: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true,
        },
      },
      tags: {
        select: {
          tag: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });
  return {
    ...updatedPost,
    tags: updatedPost.tags.map((t) => t.tag),
  };
}
// DELETE A POST BY ID Service
export async function deletePostService(postId: string, userId: string) {
  return prisma.post.update({
    where: {
      id: postId,
      authorId: userId,
      deletedAt: null,
    },
    select: {
      id: true,
      title: true,
      deletedAt: true,
    },
    data: { deletedAt: new Date() },
  });
}
// PUBLISH A POST BY ID Service
export async function publishPostService(postId: string, userId: string) {
  return prisma.post.update({
    where: { id: postId, authorId: userId, status: "DRAFT" },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });
}
// LIKE and UNLIKE A POST Service
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
// LIKE COUNT of a Post by ID service
export async function getLikeCountService(postId: string) {
  return prisma.like.count({
    where: {
      postId,
    },
  });
}
// BOOKMARK and UNBOOKMARK A POST Service
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
