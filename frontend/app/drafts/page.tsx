"use client";

import { useState, useEffect } from "react";
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
  updatedAt: string;
}

interface DraftsResponse {
  success: boolean;
  data: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function DraftsPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [drafts, setDrafts] = useState<Post[]>([]);
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
    fetchDrafts(currentPage);
  }, [currentPage]);

  const fetchDrafts = async (page: number) => {
    setLoading(true);
    try {
      const response = await api.get<DraftsResponse>("/user/drafts", {
        params: { page, limit: 10 },
      });

      if (response.data.success) {
        setDrafts(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch drafts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDraftClick = (draftId: string) => {
    // Navigate to edit page with draft ID
    router.push(`/write?draftId=${draftId}`);
  };

  const getContentPreview = (content: string) => {
    // Strip HTML tags and get first 150 characters
    const text = content.replace(/<[^>]*>/g, "");
    return text.length > 150 ? text.substring(0, 150) + "..." : text;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading drafts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Drafts</h1>
          <p className="text-gray-600">
            {pagination.total} {pagination.total === 1 ? "draft" : "drafts"}
          </p>
        </div>

        {/* Empty State */}
        {drafts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-24 w-24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No drafts yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start writing to create your first draft
            </p>
            <button
              onClick={() => router.push("/write")}
              className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
            >
              Start Writing
            </button>
          </div>
        ) : (
          <>
            {/* Drafts Grid */}
            <div className="grid gap-6 mb-8">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  onClick={() => handleDraftClick(draft.id)}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="flex gap-6">
                    {/* Content */}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition">
                        {draft.title}
                      </h2>
                      {draft.subtitle && (
                        <p className="text-lg text-gray-600 mb-3">
                          {draft.subtitle}
                        </p>
                      )}
                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {getContentPreview(draft.content)}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Last edited {formatDate(draft.updatedAt)}</span>
                        <span>•</span>
                        <span>
                          {
                            draft.content
                              .replace(/<[^>]*>/g, "")
                              .split(/\s+/)
                              .filter(Boolean).length
                          }{" "}
                          words
                        </span>
                      </div>
                    </div>

                    {/* Cover Image */}
                    {draft.coverImage && (
                      <div className="shrink-0">
                        <Image
                          src={draft.coverImage}
                          width={160}
                          height={120}
                          alt={draft.title}
                          className="w-40 h-30 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(pagination.totalPages, prev + 1),
                    )
                  }
                  disabled={currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
