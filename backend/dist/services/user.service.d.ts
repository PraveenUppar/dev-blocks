export declare function getUserProfileService(username: string): Promise<{
    id: string;
    email: string;
    username: string;
    name: string | null;
    bio: string | null;
    avatar: string | null;
    website: string | null;
    twitter: string | null;
    github: string | null;
    linkedin: string | null;
    createdAt: Date;
    _count: {
        followers: number;
        following: number;
        posts: number;
    };
} | null>;
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
export declare function getUserPostsService(username: string, page?: number, limit?: number, includeUnpublished?: boolean): Promise<{
    data: ({
        _count: {
            comments: number;
            likes: number;
        };
        author: {
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
export declare function getUserFollowerService(username: string, page?: number, limit?: number): Promise<{
    data: {
        id: string;
        username: string;
        name: string | null;
        bio: string | null;
        avatar: string | null;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare function getUserFollowingService(username: string, page?: number, limit?: number): Promise<{
    data: {
        id: string;
        username: string;
        name: string | null;
        bio: string | null;
        avatar: string | null;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare function updateUserProfileService(userId: string, data: {
    name?: string;
    bio?: string;
    avatar?: string;
    website?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
}): Promise<{
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
}>;
export declare function followUserProfileService(followerId: string, followingId: string): Promise<{
    id: string;
    createdAt: Date;
    followerId: string;
    followingId: string;
}>;
export declare function unfollowUserProfileService(followerId: string, followingId: string): Promise<{
    id: string;
    createdAt: Date;
    followerId: string;
    followingId: string;
}>;
export declare function getUserBookmarksService(userId: string, page?: number, limit?: number): Promise<{
    data: ({
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
export declare function getUserDraftsService(authorId: string, page?: number, limit?: number): Promise<{
    data: {
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
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare function getUserReadingHistoryService(userId: string, page?: number, limit?: number): Promise<{
    data: {
        readingProgress: {
            timeSpent: number;
            scrollDepth: number;
        };
        author: {
            id: string;
            username: string;
            name: string | null;
            avatar: string | null;
        };
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
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
//# sourceMappingURL=user.service.d.ts.map