"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/axios";
import { setAuthTokenGetter } from "@/lib/axios";
import { FiBookmark } from "react-icons/fi";

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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4" style={{ fontFamily: "var(--font-mozilla-text)" }}>
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        <span className="text-gray-600 text-lg">Loading your saved bookmarks...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl min-h-screen border-l border-r border-gray-500 mx-auto px-4 py-8">
        {/* Header */}
        <div className=" border-gray-200 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gray-200 rounded-full">
              <FiBookmark className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-mozilla-text)" }}>
                Reading List
              </h1>
              <p className="text-gray-600 text-sm mt-1" style={{ fontFamily: "var(--font-montserrat)" }}>
                Manage your saved stories for later reading
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-medium uppercase tracking-wide" style={{ fontFamily: "var(--font-arimo)" }}>
              {pagination.total} {pagination.total === 1 ? "story" : "stories"} saved
            </span>
          </div>
        </div>

        {/* Empty State */}
        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-6">
              <FiBookmark className="w-12 h-12 text-gray-400" />
            </div>
            <h2 
              className="text-2xl font-bold text-gray-900 mb-2" 
              style={{ fontFamily: "var(--font-raleway)" }}
            >
              No bookmarks yet
            </h2>
            <p className="text-gray-500" style={{ fontFamily: "var(--font-raleway)" }}>
              Bookmark stories to read them later.
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
            style={{ fontFamily: "var(--font-arimo)" }}
          >
            {post.title}
          </h2>
          {post.subtitle && (
            <p
              className="text-lg text-gray-600 mb-3"
              style={{ fontFamily: "var(--font-armio)" }}
            >
              {post.subtitle}
            </p>
          )}
          <p
            className="text-gray-700 mb-4 line-clamp-2"
            style={{ fontFamily: "var(--font-armio)" }}
          >
            {getPreview(post.content)}
          </p>
          <div
            className="flex items-center gap-4 text-sm text-gray-500"
            style={{ fontFamily: "var(--font-raleway)" }}
          >
            <span>Published on {formatDate(post.createdAt)}</span>
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
          <div className="flex justify-center items-center gap-4 mt-8 sm:mt-12">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
              className="px-6 py-2 border border-gray-600 rounded-full cursor-pointer text-gray-900 text-sm hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ fontFamily: "var(--font-montserrat)" }}

                >
                  Previous
                </button>
                <span className="text-sm text-gray-900"
              style={{ fontFamily: "var(--font-montserrat)" }}
>
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
              className="px-6 py-2 border border-gray-300 rounded-full cursor-pointer text-gray-700 text-sm hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ fontFamily: "var(--font-montserrat)" }}

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
