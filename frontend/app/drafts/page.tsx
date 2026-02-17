"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/axios";
import { MdDrafts } from 'react-icons/md';
import { setAuthTokenGetter } from "@/lib/axios";

// Define how post object should look like
interface Post {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

// Define how response object should look like
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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4" style={{ fontFamily: "var(--font-mozilla-text)" }}>
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        <span className="text-gray-600 text-lg">Loading your saved drafts...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 border-l border-r border-gray-500">
        {/* Header */}
        <div className=" border-gray-200 pb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gray-200 rounded-full">
                      <MdDrafts className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-mozilla-text)" }}>
                        Saved Drafts
                      </h1>
                      <p className="text-gray-600 text-sm mt-1" style={{ fontFamily: "var(--font-montserrat)" }}>
                        Manage your saved drafts for later edits.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-medium uppercase tracking-wide" style={{ fontFamily: "var(--font-arimo)" }}>
                      {pagination.total} {pagination.total === 1 ? "draft" : "drafts"} saved
                    </span>
                  </div>
                </div>

        {/* Empty State */}
        {drafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="bg-gray-100 p-6 rounded-full mb-6">
                        <MdDrafts className="w-12 h-12 text-gray-400" />
                      </div>
                      <h2 
                        className="text-2xl font-bold text-gray-900 mb-2" 
                        style={{ fontFamily: "var(--font-raleway)" }}
                      >
                        No drafts saved yet
                      </h2>
                      <p className="text-gray-500" style={{ fontFamily: "var(--font-raleway)" }}>
                        Start writing to create your first draft.
                      </p>
                      <button
                        onClick={() => router.push("/write")}
                        className="px-6 py-2 mt-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition cursor-pointer"                style={{ fontFamily: "var(--font-montserrat)" }}
          
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
                  className="border-t  border-gray-400  p-6  cursor-pointer group"
                >
                  <div className="flex gap-6">
                    {/* Content */}
                    <div className="flex-1">
                      <h2
                        className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-500 transition"
                        style={{ fontFamily: "var(--font-arimo)" }}
                      >
                        {draft.title}
                      </h2>
                      {draft.subtitle && (
                        <p
                          className="text-lg text-gray-600 mb-3"
            style={{ fontFamily: "var(--font-arimo)" }}
                        >
                          {draft.subtitle}
                        </p>
                      )}
                      <p
                        className="text-gray-700 mb-4 line-clamp-2"
            style={{ fontFamily: "var(--font-arimo)" }}
                      >
                        {getContentPreview(draft.content)}
                      </p>
                      <div
                        className="flex items-center gap-4 text-sm text-gray-500"
            style={{ fontFamily: "var(--font-arimo)" }}
                      >
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
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8 sm:mt-12">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-6 py-2 border border-gray-600 rounded-full cursor-pointer text-gray-900 text-sm hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Previous
                </button>
                <span  className="text-sm text-gray-900"
              style={{ fontFamily: "var(--font-montserrat)" }}>
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(pagination.totalPages, prev + 1),
                    )
                  }
                  disabled={currentPage === pagination.totalPages}
              className="px-6 py-2 border border-gray-600 rounded-full cursor-pointer text-gray-900 text-sm hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
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
