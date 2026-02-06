import Image from "next/image";
import Link from "next/link";

// Mock post data
const mockPost = {
  id: "1",
  title: "Building a Full-Stack App with Next.js and Node.js",
  subtitle:
    "A comprehensive guide to building modern web applications with the latest technologies.",
  slug: "building-fullstack-app-nextjs",
  content: `
    <h2>Introduction</h2>
    <p>In this tutorial, we'll build a complete full-stack application using Next.js for the frontend and Node.js with Express for the backend. This is the same stack used by many modern web applications.</p>
    
    <h2>Prerequisites</h2>
    <p>Before we begin, make sure you have:</p>
    <ul>
      <li>Node.js 18+ installed</li>
      <li>Basic knowledge of React and TypeScript</li>
      <li>A code editor (VS Code recommended)</li>
    </ul>
    
    <h2>Setting Up the Project</h2>
    <p>First, let's create our project structure. We'll have two directories: <code>frontend</code> and <code>backend</code>.</p>
    
    <pre><code>mkdir my-fullstack-app
cd my-fullstack-app
npx create-next-app@latest frontend
mkdir backend</code></pre>
    
    <h2>Building the Backend</h2>
    <p>Our backend will use Express.js with TypeScript. This gives us type safety and a familiar development experience.</p>
    
    <p>The key components of our backend include:</p>
    <ul>
      <li><strong>Routes</strong> - Define API endpoints</li>
      <li><strong>Controllers</strong> - Handle request logic</li>
      <li><strong>Services</strong> - Business logic layer</li>
      <li><strong>Models</strong> - Database schemas with Prisma</li>
    </ul>
    
    <h2>Conclusion</h2>
    <p>We've successfully built a full-stack application! The patterns we've learned here can be applied to any web application you build in the future.</p>
  `,
  coverImage: "https://picsum.photos/seed/post1/1200/600",
  readTime: 8,
  publishedAt: "2024-02-05T10:00:00Z",
  viewCount: 1234,
  author: {
    id: "user1",
    username: "johndoe",
    name: "John Doe",
    bio: "Full-stack developer passionate about React and Node.js",
    avatar: "https://i.pravatar.cc/100?u=johndoe",
  },
  tags: [
    { id: "1", name: "JavaScript", slug: "javascript" },
    { id: "2", name: "React", slug: "react" },
    { id: "3", name: "Node.js", slug: "nodejs" },
  ],
  _count: { likes: 42, comments: 12 },
};

export default function PostPage() {
  const post = mockPost; // Later: fetch by params.slug

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Tags */}
        <div className="flex gap-2 mb-4">
          {post.tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.slug}`}
              className="text-sm text-green-600 hover:text-green-800"
            >
              {tag.name}
            </Link>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Subtitle */}
        {post.subtitle && (
          <p className="text-xl text-gray-600 mb-6">{post.subtitle}</p>
        )}

        {/* Author & Meta */}
        <div className="flex items-center justify-between py-6 border-y border-gray-100">
          <div className="flex items-center gap-4">
            <Link href={`/users/${post.author.username}`}>
              {post.author.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300" />
              )}
            </Link>
            <div>
              <Link
                href={`/users/${post.author.username}`}
                className="font-medium text-gray-900 hover:underline"
              >
                {post.author.name}
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-500">
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
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition">
              <span>❤️</span>
              <span>{post._count.likes}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition">
              <span>💬</span>
              <span>{post._count.comments}</span>
            </button>
            <button className="text-gray-500 hover:text-gray-900 transition">
              🔖
            </button>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="max-w-5xl mx-auto px-4 mb-12">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={1200}
            height={600}
            className="rounded-lg w-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <article
          className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-green-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Author Card */}
        <div className="mt-16 p-6 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-4">
            <Link href={`/users/${post.author.username}`}>
              {post.author.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-300" />
              )}
            </Link>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Link
                  href={`/users/${post.author.username}`}
                  className="font-bold text-lg text-gray-900 hover:underline"
                >
                  {post.author.name}
                </Link>
                <button className="px-4 py-2 bg-green-600 text-white rounded-full text-sm hover:bg-green-700 transition">
                  Follow
                </button>
              </div>
              <p className="text-gray-600 mt-1">{post.author.bio}</p>
            </div>
          </div>
        </div>

        {/* Comments Section Placeholder */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-6">
            Comments ({post._count.comments})
          </h3>
          <div className="border border-gray-200 rounded-lg p-8 text-center text-gray-500">
            Comments section coming soon...
          </div>
        </div>
      </div>
    </div>
  );
}
