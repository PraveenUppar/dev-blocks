export declare function getUserNameService(username: string): Promise<{
    id: string;
} | null>;
export declare const getUserClerkIdService: (clerkId: string) => Promise<{
    id: string;
} | null>;
export declare const getUserIdService: (id: string) => Promise<{
    id: string;
} | null>;
interface GetPostsParams {
    page: number;
    limit: number;
}
export declare function getPublishedPostService({ page, limit }: GetPostsParams): Promise<{
    data: {
        id: string;
        createdAt: Date;
        _count: {
            comments: number;
            likes: number;
        };
        title: string;
        subtitle: string | null;
        slug: string;
        coverImage: string | null;
        readTime: number | null;
        viewCount: number;
        publishedAt: Date | null;
        author: {
            id: string;
            username: string;
            name: string | null;
            avatar: string | null;
        };
        tags: {
            tag: {
                name: string;
                slug: string;
            };
        }[];
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}>;
export declare function getPublishedPostByIdService(id: string, userId?: string): Promise<{
    tags: {
        name: string;
        slug: string;
    }[];
    isLiked: boolean;
    isBookmarked: boolean;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    _count: {
        comments: number;
        bookmarks: number;
        likes: number;
    };
    status: import("@prisma/client").$Enums.PostStatus;
    title: string;
    subtitle: string | null;
    content: string;
    slug: string;
    coverImage: string | null;
    readTime: number | null;
    viewCount: number;
    readCount: number;
    publishedAt: Date | null;
    author: {
        id: string;
        username: string;
        name: string | null;
        bio: string | null;
        avatar: string | null;
    };
} | null>;
export declare function getPublishedPostBySlugService(slug: string, userId?: string): Promise<{
    tags: {
        name: string;
        slug: string;
    }[];
    isLiked: boolean;
    isBookmarked: boolean;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    _count: {
        comments: number;
        bookmarks: number;
        likes: number;
    };
    status: import("@prisma/client").$Enums.PostStatus;
    title: string;
    subtitle: string | null;
    content: string;
    slug: string;
    coverImage: string | null;
    readTime: number | null;
    viewCount: number;
    readCount: number;
    publishedAt: Date | null;
    author: {
        id: string;
        username: string;
        name: string | null;
        bio: string | null;
        avatar: string | null;
    };
} | null>;
interface CreatePostData {
    authorId: string;
    title: string;
    subtitle: string;
    content: string;
    coverImage?: string;
    tags?: string[];
}
export declare function createPostService(data: CreatePostData): Promise<{
    tags: {
        name: string;
        slug: string;
    }[];
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("@prisma/client").$Enums.PostStatus;
    title: string;
    subtitle: string | null;
    content: string;
    slug: string;
    coverImage: string | null;
    readTime: number | null;
    author: {
        id: string;
        username: string;
        name: string | null;
        avatar: string | null;
    };
}>;
export declare function getDraftPostByIdService(id: string, userId: string): Promise<{
    tags: {
        name: string;
        slug: string;
    }[];
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("@prisma/client").$Enums.PostStatus;
    title: string;
    subtitle: string | null;
    content: string;
    slug: string;
    coverImage: string | null;
    readTime: number | null;
    author: {
        id: string;
        username: string;
        name: string | null;
        avatar: string | null;
    };
} | null>;
interface UpdatePostData {
    userId: string;
    postId: string;
    title?: string;
    subtitle?: string;
    content?: string;
    coverImage?: string;
    tags?: string[];
}
export declare function updatePostService(data: UpdatePostData): Promise<{
    tags: {
        name: string;
        slug: string;
    }[];
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("@prisma/client").$Enums.PostStatus;
    title: string;
    subtitle: string | null;
    content: string;
    slug: string;
    coverImage: string | null;
    readTime: number | null;
    publishedAt: Date | null;
    author: {
        id: string;
        username: string;
        name: string | null;
        avatar: string | null;
    };
}>;
export declare function deletePostService(postId: string, userId: string): Promise<{
    id: string;
    title: string;
    deletedAt: Date | null;
}>;
export declare function publishPostService(postId: string, userId: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("@prisma/client").$Enums.PostStatus;
    title: string;
    subtitle: string | null;
    content: string;
    slug: string;
    coverImage: string | null;
    readTime: number | null;
    viewCount: number;
    readCount: number;
    publishedAt: Date | null;
    deletedAt: Date | null;
    metaTitle: string | null;
    metaDescription: string | null;
    canonicalUrl: string | null;
    authorId: string;
}>;
export declare function toggleLikePostService(userId: string, postId: string): Promise<{
    liked: boolean;
}>;
export declare function getLikeCountService(postId: string): Promise<number>;
export declare function toggleBookmarkPostService(userId: string, postId: string): Promise<{
    bookmarked: boolean;
}>;
export {};
//# sourceMappingURL=post.service.d.ts.map