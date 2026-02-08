import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const HeartIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className || "w-5 h-5"}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
    />
  </svg>
);

const CommentIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className || "w-5 h-5"}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
    />
  </svg>
);

const BookmarkIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className || "w-5 h-5"}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
    />
  </svg>
);

import { Post, PostResponse } from "@/types";
import api from "@/lib/axios";

// Fetch post by ID
async function getPost(id: string): Promise<Post | null> {
  try {
    const response = await api.get<PostResponse>(`/post/id/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// Page props - includes both id and slug from URL
interface PageProps {
  params: Promise<{ id: string; slug: string }>;
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPost(id);

  // Show 404 if post not found
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {(post.tags || []).map((postTag) => (
                <Link
                  key={postTag.tag.id}
                  href={`/tags/${postTag.tag.slug}`}
                  className="px-3 py-1.5 text-xs sm:text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full hover:bg-emerald-100 transition"
                >
                  {postTag.tag.name}
                </Link>
              ))}
            </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Subtitle */}
          {post.subtitle && (
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
              {post.subtitle}
            </p>
          )}

          {/* Author & Meta */}
          <div className="flex flex-col gap-4 py-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              {/* Author Info */}
              <div className="flex items-center gap-3">
                <Link
                  href={`/users/${post.author.username}`}
                  className="shrink-0"
                >
                  {post.author.avatar ? (
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={48}
                      height={48}
                      className="rounded-full w-10 h-10 sm:w-12 sm:h-12 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300" />
                  )}
                </Link>
                <div>
                  <Link
                    href={`/users/${post.author.username}`}
                    className="block font-semibold text-gray-900 hover:text-emerald-600 transition text-sm sm:text-base"
                  >
                    {post.author.name}
                  </Link>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <span>{post.readTime} min read</span>
                    <span>·</span>
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:gap-4">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-full transition text-sm">
                  <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{post._count?.likes ?? 0}</span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-full transition text-sm">
                  <CommentIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">
                    {post._count?.comments ?? 0}
                  </span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-full transition">
                  <BookmarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={1200}
            height={600}
            className="rounded-xl w-full h-48 sm:h-64 md:h-80 lg:h-400px object-cover "
          />
        </div>
      )}

      {/* Content */}
      <div className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-black py-12 sm:py-16">
          <article
            className="prose prose-sm sm:prose-base md:prose-lg max-w-none 
              prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mt-8 prose-headings:mb-4
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
              prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-gray-800 prose-code:text-sm
              prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg
              prose-li:text-gray-700 prose-li:marker:text-gray-400
              prose-strong:text-gray-900
              prose-ul:my-4 prose-ol:my-4"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />

          {/* Author Card */}
          <div className="mt-12 sm:mt-16 p-6 sm:p-8 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Avatar */}
              <Link
                href={`/users/${post.author.username}`}
                className="shrink-0"
              >
                {post.author.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={72}
                    height={72}
                    className="rounded-full w-16 h-16 sm:w-72px sm:h-72px object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-72px sm:h-72px rounded-full bg-gray-300" />
                )}
              </Link>

              {/* Author Details */}
              <div className="flex-1">
                <div className="flex flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Written by
                    </p>
                    <Link
                      href={`/users/${post.author.username}`}
                      className="font-bold text-lg sm:text-xl text-gray-900 hover:text-emerald-600 transition"
                    >
                      {post.author.name}
                    </Link>
                  </div>
                  <button className="px-5 py-2 bg-emerald-600 text-white rounded-full text-sm font-medium hover:bg-emerald-700 transition shrink-0">
                    Follow
                  </button>
                </div>
                <p className="text-gray-600 mt-3 text-sm sm:text-base leading-relaxed">
                  {post.author.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Comments Section Placeholder */}
          <div className="mt-12 sm:mt-16">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Comments ({post._count?.comments ?? 0})
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 sm:p-12 text-center">
              <CommentIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm sm:text-base">
                Comments section coming soon...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
