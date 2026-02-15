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
    router.push(`/posts/${post.id}/${post.slug}`);
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
      <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: "var(--font-montserrat)" }}>
        <span className="text-gray-500">Loading bookmarks...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl min-h-screen border-l border-r border-gray-500 mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
            Saved Bookmarks
          </h1>
          <p className="text-gray-600" style={{ fontFamily: "var(--font-montserrat)" }}>
            [{pagination.total} saved{" "}
            {pagination.total === 1 ? "story" : "stories"}]
          </p>
        </div>

        {/* Empty State */}
        {bookmarks.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
              No bookmarks yet
            </h2>
            <p className="text-gray-500" style={{ fontFamily: "var(--font-montserrat)" }}>
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
      className="border-t border-gray-400 p-6 cursor-pointer group"
    >
      <div className="flex gap-6">
        <div className="flex-1">
          <h2
            className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-500 transition"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {post.title}
          </h2>
          {post.subtitle && (
            <p
              className="text-lg text-gray-600 mb-3"
              style={{ fontFamily: "var(--font-arimo)" }}
            >
              {post.subtitle}
            </p>
          )}
          <p
            className="text-gray-700 mb-4 line-clamp-2"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {getPreview(post.content)}
          </p>
          <div
            className="flex items-center gap-4 text-sm text-gray-500"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            <span>Saved on {formatDate(post.createdAt)}</span>
          </div>
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
