import Link from "next/link";
import PostCard from "../../components/PostCard";

// Mock tag data
const mockTag = {
  id: "1",
  name: "JavaScript",
  slug: "javascript",
  _count: { posts: 156 },
};

// Mock posts for tag
const mockPosts = [
  {
    id: "1",
    title: "Understanding JavaScript Closures",
    subtitle: "A deep dive into one of JavaScript's most powerful features.",
    slug: "understanding-javascript-closures",
    coverImage: "https://picsum.photos/seed/js1/400/300",
    readTime: 7,
    publishedAt: "2024-02-05T10:00:00Z",
    author: {
      username: "johndoe",
      name: "John Doe",
      avatar: "https://i.pravatar.cc/100?u=johndoe",
    },
    _count: { likes: 89, comments: 23 },
  },
  {
    id: "2",
    title: "ES2024: What's New in JavaScript",
    subtitle: "Exploring the latest features coming to JavaScript.",
    slug: "es2024-whats-new",
    readTime: 5,
    publishedAt: "2024-02-04T14:30:00Z",
    author: {
      username: "janedoe",
      name: "Jane Doe",
      avatar: "https://i.pravatar.cc/100?u=janedoe",
    },
    _count: { likes: 156, comments: 34 },
  },
  {
    id: "3",
    title: "JavaScript Performance Tips",
    subtitle: "Make your JavaScript code run faster.",
    slug: "javascript-performance-tips",
    coverImage: "https://picsum.photos/seed/js3/400/300",
    readTime: 10,
    publishedAt: "2024-02-03T09:00:00Z",
    author: {
      username: "devmaster",
      name: "Dev Master",
      avatar: "https://i.pravatar.cc/100?u=devmaster",
    },
    _count: { likes: 234, comments: 45 },
  },
];

export default function TagPage({ params }: { params: { slug: string } }) {
  const tag = mockTag; // Later: fetch by params.slug
  const posts = mockPosts;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Link
            href="/tags"
            className="text-green-600 hover:text-green-700 text-sm mb-4 inline-block"
          >
            ← All Topics
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{tag.name}</h1>
          <p className="text-gray-600">{tag._count.posts} stories published</p>
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
            <p>No stories yet for this topic.</p>
          </div>
        )}

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
