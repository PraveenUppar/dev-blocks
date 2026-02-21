export interface Author {
  id?: string;
  username: string;
  name: string;
  avatar?: string;
  bio?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug?: string;
}

export interface PostTag {
  tag: Tag;
}

export interface Post {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  content: string;
  coverImage?: string;
  readTime: number;
  publishedAt: string;
  author: Author;
  tags?: PostTag[];
  viewCount?: number;
  _count?: {
    likes: number;
    comments: number;
  };
  isLiked?: boolean;
  isBookmarked?: boolean;
  isFollowing?: boolean;
  // Backend specific fields that might be useful later
  likes?: string[];
  comments?: Comment[];
  updatedAt?: string;
  published?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  bio?: string;
  avatar?: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  createdAt: string;
  isFollowing?: boolean;
  _count: {
    followers: number;
    following: number;
    posts: number;
  };
}

// API Response Types
export interface UserResponse {
  success: boolean;
  data: User;
}

export interface PostsResponse {
  success?: boolean;
  data: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PostResponse {
  success: boolean;
  data: Post;
}
