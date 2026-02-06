import Image from "next/image";
import PostCard from "../../components/PostCard";

// Mock user data
const mockUser = {
  id: "user1",
  username: "johndoe",
  name: "John Doe",
  bio: "Full-stack developer passionate about React, Node.js, and building great user experiences. Writing about web development and software engineering.",
  avatar: "https://i.pravatar.cc/200?u=johndoe",
  createdAt: "2023-01-15T00:00:00Z",
  _count: {
    followers: 1234,
    following: 567,
    posts: 42,
  },
};

// Mock user's posts
const mockPosts = [
  {
    id: "1",
    title: "Building a Full-Stack App with Next.js and Node.js",
    subtitle: "A comprehensive guide to building modern web applications.",
    slug: "building-fullstack-app-nextjs",
    coverImage: "https://picsum.photos/seed/post1/400/300",
    readTime: 8,
    publishedAt: "2024-02-05T10:00:00Z",
    author: mockUser,
    _count: { likes: 42, comments: 12 },
  },
  {
    id: "2",
    title: "Getting Started with Prisma ORM",
    subtitle: "Learn how to use Prisma for type-safe database access.",
    slug: "getting-started-prisma",
    readTime: 10,
    publishedAt: "2024-02-02T16:00:00Z",
    author: mockUser,
    _count: { likes: 89, comments: 21 },
  },
  {
    id: "3",
    title: "Understanding TypeScript Decorators",
    subtitle: "A deep dive into TypeScript decorators and metadata.",
    slug: "typescript-decorators",
    coverImage: "https://picsum.photos/seed/post5/400/300",
    readTime: 12,
    publishedAt: "2024-01-28T08:00:00Z",
    author: mockUser,
    _count: { likes: 156, comments: 34 },
  },
];

export default function UserProfilePage() {
  const user = mockUser; // Later: fetch by params.username
  const posts = mockPosts;

  return (
    <div className="min-h-screen bg-white">
      {/* Profile Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={128}
                height={128}
                className="rounded-full"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-300" />
            )}

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.name}
                </h1>
                <button className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition">
                  Follow
                </button>
              </div>

              <p className="text-gray-500 mb-4">@{user.username}</p>

              {user.bio && (
                <p className="text-gray-700 mb-4 max-w-xl">{user.bio}</p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="font-bold text-gray-900">
                    {user._count.followers.toLocaleString()}
                  </span>{" "}
                  <span className="text-gray-500">Followers</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900">
                    {user._count.following.toLocaleString()}
                  </span>{" "}
                  <span className="text-gray-500">Following</span>
                </div>
              </div>

              {/* Member since */}
              <p className="text-sm text-gray-400 mt-4">
                Member since{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex gap-8">
            <button className="py-4 border-b-2 border-gray-900 font-medium text-gray-900">
              Posts ({user._count.posts})
            </button>
            <button className="py-4 border-b-2 border-transparent text-gray-500 hover:text-gray-900 transition">
              About
            </button>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {posts.length > 0 ? (
          <div>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <p>No posts yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
