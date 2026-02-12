
import PostCard from "./components/PostCard";
import { PostsResponse } from "@/types";
import api from "@/lib/axios";

// Fetch posts from the API
async function getPosts(): Promise<PostsResponse | null> {
  try {
    const response = await api.get("/post/");
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return null;
  }
}

export default async function Home() {
  const postsData = await getPosts();
  const posts = postsData?.data ?? [];
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl lg:max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Discover Stories
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Explore ideas, tutorials, and insights from developers around the
            world.
          </p>
        </div>

        {/* Tags/Topics (optional) */}
        <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {[
            "All",
            "JavaScript",
            "React",
            "Node.js",
            "TypeScript",
            "Python",
            "DevOps",
            "AWS",
            // "Docker",
            // "Kubernetes",
            // "AI/ML",
            // "Blockchain",
          ].map((tag) => (
            <button
              key={tag}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gray-100 text-gray-700 text-xs sm:text-sm whitespace-nowrap hover:bg-gray-200 transition"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Post Feed */}
        <div className="space-y-0">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No posts yet. Be the first to write one!</p>
            </div>
          )}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <button className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 text-sm sm:text-base hover:bg-gray-50 transition">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
}
