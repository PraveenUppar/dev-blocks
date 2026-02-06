import Link from "next/link";
import Image from "next/image";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    subtitle?: string;
    slug: string;
    coverImage?: string;
    readTime: number;
    publishedAt: string;
    author: {
      username: string;
      name: string;
      avatar?: string;
    };
    _count?: {
      likes: number;
      comments: number;
    };
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="py-6 border-b border-gray-100">
      <div className="flex gap-6">
        {/* Content */}
        <div className="flex-1">
          {/* Author info */}
          <div className="flex items-center gap-2 mb-2">
            <Link href={`/users/${post.author.username}`}>
              <div className="flex items-center gap-2">
                {post.author.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-300" />
                )}
                <span className="text-sm text-gray-700 hover:underline">
                  {post.author.name}
                </span>
              </div>
            </Link>
          </div>

          {/* Title & Subtitle */}
          <Link href={`/posts/${post.slug}`}>
            <h2 className="text-xl font-bold text-gray-900 hover:text-gray-600 transition mb-1">
              {post.title}
            </h2>
            {post.subtitle && (
              <p className="text-gray-500 line-clamp-2 mb-2">{post.subtitle}</p>
            )}
          </Link>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
            <span>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            <span>{post.readTime} min read</span>
            {post._count && (
              <>
                <span>❤️ {post._count.likes}</span>
                <span>💬 {post._count.comments}</span>
              </>
            )}
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <Link href={`/posts/${post.slug}`} className="flex shrink-0">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={200}
              height={134}
              className="rounded object-cover"
            />
          </Link>
        )}
      </div>
    </article>
  );
}
