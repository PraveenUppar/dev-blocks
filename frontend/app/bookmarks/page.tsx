import PostCard from "../components/PostCard";

// Mock bookmarked posts
const mockBookmarks = [
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
];

export default function BookmarksPage() {
  const bookmarks = mockBookmarks; // Later: fetch from API

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Bookmarks
          </h1>
          <p className="text-gray-600">Articles saved for later reading.</p>
        </div>

        {/* Bookmarks List */}
        {bookmarks.length > 0 ? (
          <div>
            {bookmarks.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔖</div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              No bookmarks yet
            </h2>
            <p className="text-gray-500">Save articles to read them later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
