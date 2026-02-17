"use client";

import { useState, useEffect, useCallback } from "react";
import PostCard from "./components/PostCard";
import { Post } from "@/types";
import api from "@/lib/axios";
import { FiSearch } from "react-icons/fi";

type SortBy = "latest" | "oldest" | "popular";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("latest");
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 10, sortBy };
      if (search.trim()) params.search = search.trim();
      const response = await api.get("/post/", { params });
      if (response.data.success) {
        setPosts(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search, sortBy]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchPosts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, sortBy]);

  // Fetch on page change (but not on search/sort — handled above)
  useEffect(() => {
    fetchPosts();
  }, [page]);

  const sortTabs: { label: string; value: SortBy }[] = [
    { label: "Latest", value: "latest" },
    { label: "Popular", value: "popular" },
    { label: "Oldest", value: "oldest" },
  ];

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
Welcome to the Dev Blocks Community, a collaborative space for developers, engineers, and tech enthusiasts to read, write, and deepen their understanding of technology.             </p>
          </div>
        </div>
      </div>

      {/* Search and Sort Section */}
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-12 pr-4 py-3 border border-gray-400 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                style={{ fontFamily: "var(--font-arimo)" }}
              />
            </div>

            {/* Sort Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-full p-1">
              {sortTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSortBy(tab.value)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                    sortBy === tab.value
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  style={{ fontFamily: "var(--font-arimo)" }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mx-auto max-w-7xl -mt-7 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-l border-r border-gray-500">
        {/* Post Feed */}
        <div className="space-y-0">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              <p style={{ fontFamily: "var(--font-montserrat)" }}>Loading posts...</p>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p style={{ fontFamily: "var(--font-montserrat)" }}>
                {search ? `No posts found for "${search}"` : "No posts yet. Be the first to write one!"}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8 sm:mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.hasPrevPage}
              className="px-6 py-2 border border-gray-600 rounded-full cursor-pointer text-gray-900 text-sm hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Previous
            </button>
            <span
              className="text-sm text-gray-900"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!pagination.hasNextPage}
              className="px-6 py-2 border border-gray-600 rounded-full cursor-pointer text-gray-900 text-sm hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
