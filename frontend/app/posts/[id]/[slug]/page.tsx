"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/axios";
import { setAuthTokenGetter } from "@/lib/axios";
import { Post } from "@/types";
import { FiBookmark, FiHeart, FiMessageCircle } from "react-icons/fi";
import { toast } from "react-toastify";


const HeartIcon = ({
  className,
}: {
  className?: string;
}) => (
  <FiHeart className={className} />
);
const CommentIcon = ({ className }: { className?: string }) => (
  <FiMessageCircle className={className} />
);
const BookmarkIcon = ({
  className,
}: {
  className?: string;
}) => (
  <FiBookmark className={className} />
);

export default function PostPage() {
  const params = useParams();
  const { getToken, isSignedIn } = useAuth();
  const id = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  useEffect(() => {
    setAuthTokenGetter(getToken);
  }, [getToken]);

  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0);
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/post/id/${id}`);
      const postData = response.data.data;
      setPost(postData);
      setLikeCount(postData._count?.likes ?? 0);
      setIsLiked(postData.isLiked ?? false);
      setIsBookmarked(postData.isBookmarked ?? false);
    } catch (error) {
      console.error("Error fetching post:", error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isSignedIn) {
      toast.info("Please sign in to like posts");
      return;
    }
    if (isLiking) return;
    setIsLiking(true);
    const previousLiked = isLiked;
    const previousCount = likeCount;
    // Optimistic update
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    try {
      const response = await api.post(`/post/like/${id}`);
      if (response.data.success) {
        // Update with server response
        setIsLiked(response.data.data.liked);
        if (response.data.data.likeCount !== undefined) {
          setLikeCount(response.data.data.likeCount);
        }
        if (response.data.data.liked) {
          toast.success("Post liked!");
        } else {
          toast.info("Post unliked");
        }
      }
    } catch (error: any) {
      console.error("Failed to like post:", error);
      // Revert on error
      setIsLiked(previousLiked);
      setLikeCount(previousCount);

      if (error.response?.status === 401) {
        toast.info("Please sign in to like posts");
      } else {
        toast.error("Failed to like post. Please try again.");
      }
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmark = async () => {
    if (!isSignedIn) {
      toast.info("Please sign in to bookmark posts");
      return;
    }
    if (isBookmarking) return;
    setIsBookmarking(true);
    const previousBookmarked = isBookmarked;
    // Optimistic update
    setIsBookmarked(!isBookmarked);
    try {
      const response = await api.post(`/post/bookmark/${id}`);
      if (response.data.success) {
        setIsBookmarked(response.data.data.bookmarked);
        if (response.data.data.bookmarked) {
          toast.success("Post bookmarked!");
        } else {
          toast.info("Removed from bookmarks");
        }
      }
    } catch (error: any) {
      console.error("Failed to bookmark post:", error);
      // Revert on error
      setIsBookmarked(previousBookmarked);
      if (error.response?.status === 401) {
        toast.info("Please sign in to bookmark posts");
      } else {
        toast.error("Failed to bookmark post. Please try again.");
      }
    } finally {
      setIsBookmarking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4" style={{ fontFamily: "var(--font-mozilla-text)" }}>
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        <span className="text-gray-600 text-lg">Loading post...</span>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Hero Section */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-l border-r border-gray-500">  
          {/* Title */}
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight "
             style={{ fontFamily: "var(--font-arimo)" }}
          >
            {post.title}
          </h1>

          {/* Subtitle */}
          {post.subtitle && (
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 leading-relaxed"  style={{ fontFamily: "var(--font-montserrat)" }}>
              {post.subtitle}
            </p>
          )}
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6  ">
            {(post.tags || []).map((postTag: any) => (
              <span
                key={postTag.slug}
                className="px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-md hover:bg-emerald-100 transition"            style={{ fontFamily: "var(--font-montserrat)" }}

              >
                {postTag.name}
              </span>
            ))}
          </div>
          {/* Author & Meta */}
          <div className="flex flex-col gap-4 py-6 px-3 border-l border-r border-t border-b border-gray-500">
            <div className="flex items-center justify-between">
              {/* Author Info */}
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="text-gray-800 text-xl">•{" "}  </span>
                    <span className="text-gray-800" style={{ fontFamily: "var(--font-montserrat)" }}>
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-gray-800 text-xl">•{" "}  </span>
                    <span className="text-gray-800" style={{ fontFamily: "var(--font-montserrat)" }}>
                      {post.readTime} min read
                    </span>
                  </div>
                   
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`flex items-center gap-1.5 px-3 cursor-pointer py-1.5 rounded-full transition text-sm disabled:opacity-50 ${
                    isLiked
                      ? "text-red-500 bg-red-50"
                      : "text-gray-600 hover:text-red-500 hover:bg-red-50"
                  }`}
                >
                  <HeartIcon
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                  <span className="hidden sm:inline">{likeCount}</span>
                </button>

                {/* Comment Button */}
                <button className="flex items-center gap-1.5 px-3 py-1.5 cursor-pointer  text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-full transition text-sm">
                  <CommentIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">
                    {post._count?.comments ?? 0}
                  </span>
                </button>

                {/* Bookmark Button */}
                <button
                  onClick={handleBookmark}
                  disabled={isBookmarking}
                  className={`flex items-center gap-1.5 px-3 py-1.5 cursor-pointer rounded-full transition disabled:opacity-50 ${
                    isBookmarked
                      ? "text-amber-600 bg-amber-50"
                      : "text-gray-600 hover:text-amber-600 hover:bg-amber-50"
                  }`}
                >
                  <BookmarkIcon
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                </button>
              </div>
            </div>
          </div>
          {/* Content */}
          <div
            className="bg-gray-50 border-l border-r border-gray-500"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-black py-12 sm:py-16">
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
                dangerouslySetInnerHTML={{ __html: post.content || "" }}
              />

              {/* Author Card */}
              <div className="mt-12 sm:mt-16 p-6 sm:p-8 bg-gray-200 rounded-xl border border-gray-100">
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
      </div>

      {/* Cover Image
      {post.coverImage && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={1200}
            height={600}
            className="rounded-xl w-full h-48 sm:h-64 md:h-80 lg:h-400px object-cover"
          />
        </div>
      )} */}
    </div>
  );
}
