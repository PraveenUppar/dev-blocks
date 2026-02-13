import Link from "next/link";
import Image from "next/image";
import { FiHeart, FiMessageCircle } from "react-icons/fi";

import { Post } from "@/types";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="py-8 border-b border-gray-500 bg-gray-50">
      <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-6">
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title & Subtitle */}
          <Link href={`/posts/${post.id}/${post.slug}`}>
            <h2
              className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900  hover:text-gray-600 transition mb-1 leading-tight"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {post.title}
            </h2>
            {post.subtitle && (
              <p
                className="text-gray-500 text-sm md:text-base line-clamp-2 mb-2"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {post.subtitle}
              </p>
            )}
          </Link>
          {/* Author info */}
          <div className="flex items-center gap-2 mb-2">
            <Link href={`/users/${post.author.username}`}>
              <div className="flex items-center gap-2">
                {post.author.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={34}
                    height={34}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-300" />
                )}
                <span
                  className="text-md text-gray-700 hover:underline uppercase"
                  style={{ fontFamily: "var(--font-google-sans-code)" }}
                >
                  BY {post.author.name}
                </span>
              </div>
            </Link>
          </div>

          {/* Meta info */}
          <div
            className="flex flex-wrap items-center gap-x-4 gap-y-1 uppercase text-xs md:text-sm text-gray-500 mt-3"
            style={{ fontFamily: "var(--font-arimo)" }}
          >
            <span>
              •{" "}
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>• {post.readTime} MIN READ</span>
            {post._count && (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <FiHeart className="h-4 w-4 text-red-500" />{" "}
                  {post._count.likes}
                </span>
                <span className="flex items-center gap-1">
                  <FiMessageCircle className="h-4 w-4 text-blue-500" />{" "}
                  {post._count.comments}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Cover Image */}
        {/* {post.coverImage && (
          <Link
            href={`/posts/${post.id}/${post.slug}`}
            className="block shrink-0"
          >
            <Image
              src={post.coverImage}
              alt={post.title}
              width={400}
              height={400}
              className="rounded object-cover w-full h-40 md:w-200px md:h-134px lg:w-240px lg:h-160px"
            />
          </Link>
        )} */}
      </div>
    </article>
  );
}
