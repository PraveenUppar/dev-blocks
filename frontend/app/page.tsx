import PostCard from "./components/PostCard";
import { PostsResponse } from "@/types";
import api from "@/lib/axios";
import { FiSearch } from "react-icons/fi";

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gray-100 border-b border-gray-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-l border-r border-gray-500">
          <div className="text-center mb-8 ">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              THE DEV BLOCKS
            </h1>
            <p
              className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: "var(--font-arimo)" }}
            >
              A place to read, write, and deepen your understanding about tech. Welcome to dev blocks community.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white border-b border-gray-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 border-l border-r border-gray-500">
          <div className="flex gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-12 pr-20 py-3 border border-gray-400 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                style={{ fontFamily: "var(--font-arimo)" }}
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <kbd className="px-2 py-1 text-xs text-gray-500 bg-gray-100 border border-gray-300 rounded">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Filter Button */}
            <button
              className="px-8 py-3 bg-gray-900 text-white rounded font-medium hover:bg-gray-800 transition flex items-center gap-2"
              style={{ fontFamily: "var(--font-arimo)" }}
            >
              Filter
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mx-auto max-w-7xl -mt-7 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-l border-r border-gray-500">
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
        <div className="flex justify-center mt-8 sm:mt-12">
          <button
            className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 text-sm sm:text-base hover:bg-gray-50 transition"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Load More
          </button>
        </div>
      </div>
    </div>
  );
}
