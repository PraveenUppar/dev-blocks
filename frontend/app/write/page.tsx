"use client";

import { useState, useEffect } from "react";
import Editor from "./../components/Editor";
import Image from "next/image";
import api from "@/lib/axios";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { setAuthTokenGetter } from "@/lib/axios";

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(getToken);
  }, [getToken]);

  const handleSaveDraft = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please add a title and content");
      return;
    }

    setSaving(true);
    try {
      const response = await api.post("/post/create", {
        title,
        subtitle: subtitle || undefined,
        content,
        coverImage: coverImage || undefined,
      });

      if (response.data.success) {
        alert("Draft saved!");
      }
      router.push("/");
    } catch (error: unknown) {
      console.error("Failed to save draft:", error);
      const errorMessage = "Failed to save draft. Please try again.";
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900"></h1>
          <div className="flex gap-3">
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>
          </div>
        </div>

        {/* Cover Image URL */}
        <div className="mb-6">
          <input
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="Cover image URL (upload feature will be comming soon)"
            className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
          {coverImage && (
            <Image
              src={coverImage}
              width={64}
              height={64}
              alt="Cover preview"
              className="mt-4 w-full h-64 object-cover rounded-lg"
            />
          )}
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
        </div>

        {/* Subtitle */}
        <div className="mb-6">
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Add Subtitle"
            className="w-full text-xl text-black  placeholder-gray-300 border-0 focus:ring-0 focus:outline-none"
          />
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
        </div>

        {/* Editor */}
        <Editor
          content={content}
          onChange={setContent}
          placeholder="Tell your story..."
        />

        {/* Word Count */}
        <div className="mt-4 text-sm  text-gray-500">
          {
            content
              .replace(/<[^>]*>/g, "")
              .split(/\s+/)
              .filter(Boolean).length
          }{" "}
          words
        </div>
      </div>
    </div>
  );
}
