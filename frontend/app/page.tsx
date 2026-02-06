import PostCard from "./components/PostCard";

// Mock data for now
const mockPosts = [
  {
    id: "1",
    title: "Building a Full-Stack App with Next.js and Node.js",
    subtitle:
      "A comprehensive guide to building modern web applications with the latest technologies.",
    slug: "building-fullstack-app-nextjs",
    coverImage: "https://picsum.photos/seed/post1/400/300",
    readTime: 8,
    publishedAt: "2024-02-05T10:00:00Z",
    author: {
      username: "johndoe",
      name: "John Doe",
      avatar: "https://i.pravatar.cc/100?u=johndoe",
    },
    _count: { likes: 42, comments: 12 },
  },
  {
    id: "2",
    title: "Understanding TypeScript Generics",
    subtitle: "Master the power of generics to write reusable, type-safe code.",
    slug: "understanding-typescript-generics",
    readTime: 6,
    publishedAt: "2024-02-04T14:30:00Z",
    author: {
      username: "janedoe",
      name: "Jane Doe",
      avatar: "https://i.pravatar.cc/100?u=janedoe",
    },
    _count: { likes: 28, comments: 5 },
  },
  {
    id: "3",
    title: "10 Tips for Better React Performance",
    subtitle: "Optimize your React apps with these proven techniques.",
    slug: "react-performance-tips",
    coverImage: "https://picsum.photos/seed/post3/400/300",
    readTime: 5,
    publishedAt: "2024-02-03T09:00:00Z",
    author: {
      username: "devmaster",
      name: "Dev Master",
      avatar: "https://i.pravatar.cc/100?u=devmaster",
    },
    _count: { likes: 156, comments: 34 },
  },
  {
    id: "4",
    title: "Getting Started with Prisma ORM",
    subtitle:
      "Learn how to use Prisma for type-safe database access in Node.js.",
    slug: "getting-started-prisma",
    readTime: 10,
    publishedAt: "2024-02-02T16:00:00Z",
    author: {
      username: "johndoe",
      name: "John Doe",
      avatar: "https://i.pravatar.cc/100?u=johndoe",
    },
    _count: { likes: 89, comments: 21 },
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Discover Stories
          </h1>
          <p className="text-gray-600">
            Explore ideas, tutorials, and insights from developers around the
            world.
          </p>
        </div>

        {/* Tags/Topics (optional) */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            "All",
            "JavaScript",
            "React",
            "Node.js",
            "TypeScript",
            "Python",
            "DevOps",
          ].map((tag) => (
            <button
              key={tag}
              className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm whitespace-nowrap hover:bg-gray-200 transition"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Post Feed */}
        <div>
          {mockPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-8">
          <button className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
}
