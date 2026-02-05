import prisma from "../libs/prisma";

// List all tags with post count
export const listTags = async () => {
  return prisma.tag.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: {
      posts: { _count: "desc" }, // Most used tags first
    },
  });
};

// Get tag by slug
export const findBySlug = async (slug: string) => {
  return prisma.tag.findUnique({
    where: { slug },
  });
};

// Get posts by tag slug
export const getPostsByTag = async (
  tagSlug: string,
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;

  const tag = await prisma.tag.findUnique({
    where: { slug: tagSlug },
  });

  if (!tag) return null;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        tags: { some: { tagId: tag.id } },
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
        tags: { some: { tagId: tag.id } },
        status: "PUBLISHED",
        deletedAt: null,
      },
    }),
  ]);

  return {
    tag,
    data: posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Create or find tag (for adding to posts)
export const findOrCreateTag = async (name: string) => {
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return prisma.tag.upsert({
    where: { slug },
    update: {},
    create: { name, slug },
  });
};

// Add tags to a post
export const addTagsToPost = async (postId: string, tagNames: string[]) => {
  const tags = await Promise.all(tagNames.map(findOrCreateTag));

  await prisma.postTag.createMany({
    data: tags.map((tag) => ({
      postId,
      tagId: tag.id,
    })),
    skipDuplicates: true,
  });

  return tags;
};
