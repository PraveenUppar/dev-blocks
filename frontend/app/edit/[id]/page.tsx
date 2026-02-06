"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Editor from "../../components/Editor";
import Image from "next/image";

// Mock function to get post by ID
const getPostById = (id: string) => {
  return {
    id,
    title: "My Upcoming Article About Docker",
    subtitle: "A beginner's guide to containerization",
    content: `
      <h2>Introduction</h2>
      <p>Docker is a platform for developing, shipping, and running applications in containers.</p>
    `,
    coverImage: "https://picsum.photos/seed/docker/1200/600",
    tags: "Docker, DevOps, Tutorial",
    status: "DRAFT",
  };
};

export default function EditPage() {
  // Use useParams hook instead
  const params = useParams();
  const id = params.id as string;

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    const post = getPostById(id);
    if (post) {
      setTitle(post.title);
      setSubtitle(post.subtitle);
      setContent(post.content);
      setCoverImage(post.coverImage);
      setTags(post.tags);
      setStatus(post.status);
    }
    setLoading(false);
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    console.log({ id, title, subtitle, content, coverImage, tags });
    setTimeout(() => {
      setSaving(false);
      alert("Changes saved!");
    }, 1000);
  };

  const handlePublish = async () => {
    if (!title.trim()) return alert("Please add a title");
    if (!content.trim()) return alert("Please add some content");

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Published!");
      router.push("/");
    }, 1000);
  };

  const handleUnpublish = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setStatus("DRAFT");
      alert("Moved to drafts");
    }, 1000);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;
    setSaving(true);
    setTimeout(() => {
      router.push("/drafts");
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Story</h1>
            <span
              className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
            >
              {status === "PUBLISHED" ? "Published" : "Draft"}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={saving}
              className="px-4 py-2 text-red-600 border border-red-300 rounded-full hover:bg-red-50 disabled:opacity-50"
            >
              Delete
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            {status === "PUBLISHED" ? (
              <button
                onClick={handleUnpublish}
                disabled={saving}
                className="px-6 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 disabled:opacity-50"
              >
                Unpublish
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50"
              >
                Publish
              </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="Cover image URL"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
          {coverImage && (
            <Image
              src={coverImage}
              alt="Cover"
              width={30}
              height={30}
              className="mt-4 w-full h-64 object-cover rounded-lg"
            />
          )}
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full text-4xl font-bold placeholder-gray-300 border-0 focus:outline-none mb-4"
        />
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Subtitle"
          className="w-full text-xl text-gray-600 placeholder-gray-300 border-0 focus:outline-none mb-6"
        />
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none mb-6"
        />

        <Editor
          content={content}
          onChange={setContent}
          placeholder="Tell your story..."
        />

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
