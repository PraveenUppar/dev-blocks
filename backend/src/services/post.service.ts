import prisma from "../libs/prisma.js";
import { generateSlug } from "../utils/slug.js";
import { calculateReadingTime } from "../utils/readingTime.js";
import { nanoid } from "nanoid";

interface GetPostsParams {
  page: number;
  limit: number;
}
// GET ALL PUBLISHED POST Service
export async function getPublishedPostService({ page, limit }: GetPostsParams) {
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

  const flattenedTags = post.tags.map((t) => t.tag);
  const { likes, bookmarks, tags, ...postData } = post; // Remove the likes and bookmarks and tags arrays(not needed) for response
  return {
    ...postData,
    tags: flattenedTags,
    isLiked: !!isLiked,
    isBookmarked: !!isBookmarked,
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

  const flattenedTags = post.tags.map((t) => t.tag);
  const { likes, bookmarks, tags, ...postData } = post; // Remove the likes and bookmarks and tags arrays(not needed) for response
  return {
    ...postData,
    tags: flattenedTags,
    isLiked: !!isLiked,
    isBookmarked: !!isBookmarked,
  };
}
// CHECK USER BY USERNAME Service
export async function getUserNameService(username: string) {
  return prisma.user.findUnique({
    where: { username },
  });
}
// GET USER BY CLERKID Service
export const getUserClerkIdService = async (clerkId: string) => {
  return prisma.user.findUnique({
    where: { clerkId },
  });
};
// GET USER BY ID Service
export const getUserIdService = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
  });
};
// CREATE A NEW DRAFT POST Service
export async function createPostService(
  authorId: string,
  title: string,
  content: string,
  subtitle: string,
  tags?: string[],
  coverImage?: string,
) {
  let slug = generateSlug(title);
  const existingPost = await prisma.post.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (existingPost) {
    slug = `${slug}-${nanoid(5)}`; // If it exists, append a random 5-char string immediately.
  }
  const readTime = calculateReadingTime(content);
  const post = await prisma.post.create({
    data: {
      title: title,
      content: content,
      subtitle: subtitle,
      ...(coverImage && { coverImage }),
      slug,
      readTime,
      authorId,
      status: "DRAFT",
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
    include: {
      author: {
        select: { id: true, username: true, name: true, avatar: true },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
  const flattenedTags = post.tags.map((t) => t.tag.name);
  return {
    ...post,
    tags: flattenedTags, // Transforms [{tag: {name: 'Tech'}}] into ['Tech']
  };
}
// GET DRAFT POST BY ID Service
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
// UPDATE A POST BY ID Service
export async function updatePostService(
  id: string,
  title?: string,
  content?: string,
  tags?: string,
  subtitle?: string,
  coverImage?: string,
) {
  const data = {
    ...(title !== undefined && { title }),
    ...(content !== undefined && { content }),
    ...(subtitle !== undefined && { subtitle }),
    ...(coverImage !== undefined && { coverImage }),
    ...(tags !== undefined && { tags }),
  };
  const updateData: any = { ...data };
  if (data.content) {
    updateData.readTime = calculateReadingTime(data.content);
  }
  if (data.title) {
    let slug = generateSlug(data.title);
    const existingPost = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (existingPost) {
      slug = `${slug}-${nanoid(5)}`;
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
// DELETE A POST BY ID Service
export async function deletePostService(id: string) {
  return prisma.post.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
// PUBLISH A POST BY ID Service
export async function publishPostService(id: string) {
  return prisma.post.update({
    where: { id },
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
