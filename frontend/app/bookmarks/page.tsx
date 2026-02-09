"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/axios";
import { setAuthTokenGetter } from "@/lib/axios";

interface Post {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  coverImage?: string;
  createdAt: string;
  slug?: string;
}

interface BookmarksResponse {
  success: boolean;
  data: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function BookmarksPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [bookmarks, setBookmarks] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    setAuthTokenGetter(getToken);
  }, [getToken]);

  useEffect(() => {
    fetchBookmarks(currentPage);
  }, [currentPage]);

  const fetchBookmarks = async (page: number) => {
    setLoading(true);
    try {
      const response = await api.get<BookmarksResponse>("/user/bookmarks", {
        params: { page, limit: 10 },
      });

      if (response.data.success) {
        setBookmarks(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error("Failed to fetch bookmarks:", err);
    } finally {
      setLoading(false);
    }
  };

  const openPost = (post: Post) => {
    router.push(post.slug ? `/post/${post.slug}` : `/post/${post.id}`);
  };

  const getPreview = (content: string) =>
    content.replace(/<[^>]*>/g, "").slice(0, 150) + "...";

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <span className="text-gray-500">Loading bookmarks...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Bookmarks
          </h1>
          <p className="text-gray-600">
            {pagination.total} saved{" "}
            {pagination.total === 1 ? "story" : "stories"}
          </p>
        </div>

        {/* Empty State */}
        {bookmarks.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No bookmarks yet
            </h2>
            <p className="text-gray-500">
              Save stories to read them later
            </p>
          </div>
        ) : (
          <>
            {/* Bookmarks List */}
            <div className="grid gap-6 mb-8">
              {bookmarks.map((post) => (
                <div
                  key={post.id}
                  onClick={() => openPost(post)}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {post.title}
                      </h2>
                      {post.subtitle && (
                        <p className="text-gray-600 mb-3">
                          {post.subtitle}
                        </p>
                      )}
                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {getPreview(post.content)}
                      </p>
                      <span className="text-sm text-gray-500">
                        Saved on {formatDate(post.createdAt)}
                      </span>
                    </div>

                    {post.coverImage && (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        width={160}
                        height={120}
                        className="rounded-lg object-cover"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
