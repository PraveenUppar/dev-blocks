"use client";

import { useState, useEffect, Suspense } from "react";
import Editor from "./../components/Editor";
import api from "@/lib/axios";
import { useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuthTokenGetter } from "@/lib/axios";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/errorHandler";

export default function WritePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
      <WritePageContent />
    </Suspense>
  );
}

function WritePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draftId");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(getToken);
  }, [getToken]);

  // Fetch draft if draftId exists
  useEffect(() => {
    if (draftId) {
      fetchDraft(draftId);
    }
  }, [draftId]);

  const fetchDraft = async (id: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/post/draft/${id}`);
      if (response.data.success) {
        const draft = response.data.data;
        setTitle(draft.title || "");
        setSubtitle(draft.subtitle || "");
        setContent(draft.content || "");
        setCoverImage(draft.coverImage || "");
        setTags(
          Array.isArray(draft.tags)
            ? draft.tags.map((t: any) => t.tag?.name || t.name || t).join(", ")
            : draft.tags || ""
        );
      }
    } catch (error) {
      console.error("Failed to fetch draft:", error);
      toast.error("Failed to load draft");
      router.push("/write");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!title.trim() || !content.trim()) {
      toast.warning("Please add a title and content");
      return;
    }

    setSaving(true);
    try {
      if (draftId) {
        // Update existing draft using PUT /:id/edit
        const response = await api.put(`/post/update/${draftId}`, {
          title,
          subtitle: subtitle || undefined,
          content,
          coverImage: coverImage || undefined,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean)
        });

        if (response.data.success) {
          toast.success("Draft updated successfully!");
        }
      } else {
        // Create new draft using POST /create
        const response = await api.post("/post/create", {
          title,
          subtitle: subtitle || undefined,
          content,
          coverImage: coverImage || undefined,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean)
        });

        if (response.data.success) {
          toast.success("Draft saved!");
          const newDraftId = response.data.data.id;
          router.push(`/write?draftId=${newDraftId}`);
        }
      }
    } catch (error: unknown) {
      handleApiError(error, "Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast.warning("Please add a title and content");
      return;
    }

    setSaving(true);
    try {
      if (draftId) {
        // First update the draft, then publish using PATCH /:id/publish
        await api.put(`/post/update/${draftId}`, {
          title,
          subtitle: subtitle || undefined,
          content,
          coverImage: coverImage || undefined,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean)
        });

        const response = await api.patch(`/post/publish/${draftId}`);

        if (response.data.success) {
          toast.success("Post published successfully!");
          router.push("/");
        }
      } else {
        // Create new draft first, then publish
        const createResponse = await api.post("/post/create", {
          title,
          subtitle: subtitle || undefined,
          content,
          coverImage: coverImage || undefined,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean)
        });

        if (createResponse.data.success) {
          const newPostId = createResponse.data.data.id;

          // Now publish it
          const publishResponse = await api.patch(`/post/publish/${newPostId}`);

          if (publishResponse.data.success) {
            toast.success("Post published successfully!");
            router.push("/");
          }
        }
      }
    } catch (error: unknown) {
      handleApiError(error, "Failed to publish");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!draftId) return;

    setSaving(true);
    try {
      // Using DELETE /:id
      const response = await api.delete(`/post/delete/${draftId}`);

      if (response.data.success) {
        toast.success("Draft deleted successfully!");
        router.push("/drafts");
      }
    } catch (error) {
      console.error("Failed to delete draft:", error);
      toast.error("Failed to delete draft. Please try again.");
    } finally {
      setSaving(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500" style={{ fontFamily: "var(--font-montserrat)" }}>Loading draft...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white ">
      <div className="max-w-7xl min-h-screen mx-auto px-4 py-8 border-l border-r  border-gray-500">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 cursor-pointer">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 text-gray-700 border cursor-pointer border-gray-300 rounded-full hover:bg-gray-50 transition"
          >
            
            {draftId ? "Back to Drafts" : "Cancel"}
          </button>

          <div className="flex gap-3">
            {draftId && (
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={saving}
                className="px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer  rounded-full transition disabled:opacity-50"
              >
                Delete
              </button>
            )}
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="px-6 py-2 text-gray-700 border cursor-pointer border-gray-300 rounded-full hover:bg-gray-50 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : draftId ? "Update Draft" : "Save Draft"}
            </button>
            <button
              onClick={handlePublish}
              disabled={saving}
              className="px-6 py-2 bg-green-600 cursor-pointer  text-white rounded-full hover:bg-green-700 transition disabled:opacity-50"
            >
              {saving ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add Title"
            className="w-full text-4xl font-bold text-black placeholder-gray-300 border-0 focus:ring-0 focus:outline-none"
          />
          <div className={`text-sm text-right mt-1 ${title.length > 100 ? 'text-red-500' : 'text-gray-400'}`}>
            {title.length}/100
          </div>
        </div>

        {/* Subtitle */}
        <div className="mb-6">
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Add Subtitle"
            className="w-full text-xl text-black placeholder-gray-300 border-0 focus:ring-0 focus:outline-none"
          />
          <div className={`text-sm text-right mt-1 ${subtitle.length > 200 ? 'text-red-500' : 'text-gray-400'}`}>
            {subtitle.length}/200
          </div>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated: React, JavaScript, Tutorial)"
            className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
          <div className="flex justify-between mt-1 text-sm text-gray-400">
            <div>
              {tags.split(",").filter(t => t.trim().length > 0).length}/5 tags
            </div>
            <div>
              Recommended: max 10 chars per tag
            </div>
          </div>
        </div>

        {/* Editor */}
        <Editor
          content={content}
          onChange={setContent}
          placeholder="Tell your story..."
        />

        {/* Word and Character Count */}
        <div className="mt-4 flex justify-between text-sm text-gray-500">
          <div>
            {
              content
                .replace(/<[^>]*>/g, "")
                .split(/\s+/)
                .filter(Boolean).length
            }{" "}
            words
          </div>
           <div className={`${content.length > 20000 ? 'text-red-500' : ''}`}>
            {content.length}/20000 characters
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold cursor-pointer mb-4 text-gray-900">
              Delete Draft?
            </h2>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. Are you sure you want to delete this
              draft?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700  cursor-pointer  hover:bg-gray-300 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {saving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
