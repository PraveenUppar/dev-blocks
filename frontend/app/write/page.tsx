"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Editor from "./../components/Editor";
import Image from "next/image";

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSaveDraft = async () => {
    setSaving(true);
    // TODO: Call API to save draft
    console.log({ title, subtitle, content, coverImage, tags });
    setTimeout(() => {
      setSaving(false);
      alert("Draft saved!");
    }, 1000);
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      alert("Please add a title");
      return;
    }
    if (!content.trim()) {
      alert("Please add some content");
      return;
    }

    setSaving(true);
    // TODO: Call API to publish
    console.log({ title, subtitle, content, coverImage, tags, publish: true });
    setTimeout(() => {
      setSaving(false);
      alert("Published!");
      router.push("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Write a Story</h1>
          <div className="flex gap-3">
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>
            <button
              onClick={handlePublish}
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition disabled:opacity-50"
            >
              Publish
            </button>
          </div>
        </div>

        {/* Cover Image URL */}
        <div className="mb-6">
          <input
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="Cover image URL (optional)"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
          {coverImage && (
            <Image
              src={coverImage}
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
            placeholder="Title"
            className="w-full text-4xl font-bold placeholder-gray-300 border-0 focus:ring-0 focus:outline-none"
          />
        </div>

        {/* Subtitle */}
        <div className="mb-6">
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Subtitle (optional)"
            className="w-full text-xl text-gray-600 placeholder-gray-300 border-0 focus:ring-0 focus:outline-none"
          />
        </div>

        {/* Tags */}
        <div className="mb-6">
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated: React, JavaScript, Tutorial)"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Editor */}
        <Editor
          content={content}
          onChange={setContent}
          placeholder="Tell your story..."
        />

        {/* Word Count */}
        <div className="mt-4 text-sm text-gray-500">
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
