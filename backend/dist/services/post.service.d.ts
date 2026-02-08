export declare function getPublishedPostService(page: number, limit: number): Promise<{
    data: ({
        _count: {
            comments: number;
            likes: number;
        };
        author: {
            id: string;
            username: string;
            name: string | null;
            avatar: string | null;
        };
    } & {
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
    })[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare function getPublishedPostByIdService(id: string): Promise<({
    _count: {
        comments: number;
        likes: number;
    };
    author: {
        id: string;
        username: string;
        name: string | null;
        bio: string | null;
        avatar: string | null;
    };
    tags: ({
        tag: {
            id: string;
            name: string;
            createdAt: Date;
            slug: string;
        };
    } & {
        id: string;
        createdAt: Date;
        postId: string;
        tagId: string;
    })[];
} & {
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
}) | null>;
export declare function getPublishedPostBySlugService(slug: string): Promise<({
    _count: {
        comments: number;
        likes: number;
    };
    author: {
        id: string;
        username: string;
        name: string | null;
        bio: string | null;
        avatar: string | null;
    };
    tags: ({
        tag: {
            id: string;
            name: string;
            createdAt: Date;
            slug: string;
        };
    } & {
        id: string;
        createdAt: Date;
        postId: string;
        tagId: string;
    })[];
} & {
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
}) | null>;
export declare function getUserNameService(username: string): Promise<{
    id: string;
    email: string;
    username: string;
    clerkId: string;
    name: string | null;
    bio: string | null;
    avatar: string | null;
    role: import("@prisma/client").$Enums.UserRole;
    website: string | null;
    twitter: string | null;
    github: string | null;
    linkedin: string | null;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare const getUserClerkIdService: (clerkId: string) => Promise<{
    id: string;
    email: string;
    username: string;
    clerkId: string;
    name: string | null;
    bio: string | null;
    avatar: string | null;
    role: import("@prisma/client").$Enums.UserRole;
    website: string | null;
    twitter: string | null;
    github: string | null;
    linkedin: string | null;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare const getUserIdService: (id: string) => Promise<{
    id: string;
    email: string;
    username: string;
    clerkId: string;
    name: string | null;
    bio: string | null;
    avatar: string | null;
    role: import("@prisma/client").$Enums.UserRole;
    website: string | null;
    twitter: string | null;
    github: string | null;
    linkedin: string | null;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare function createPostService(authorId: string, title: string, content: string, subtitle?: string, coverImage?: string): Promise<{
    author: {
        id: string;
        username: string;
        name: string | null;
        avatar: string | null;
    };
} & {
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
export declare function editPostService(id: string, title?: string, content?: string, subtitle?: string, coverImage?: string): Promise<{
    author: {
        id: string;
        username: string;
        name: string | null;
        avatar: string | null;
    };
} & {
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
export declare function deletePostService(id: string): Promise<{
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
export declare function publishPostService(id: string): Promise<{
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
export declare function toggleBookmarkPostService(userId: string, postId: string): Promise<{
    bookmarked: boolean;
}>;
//# sourceMappingURL=post.service.d.ts.map