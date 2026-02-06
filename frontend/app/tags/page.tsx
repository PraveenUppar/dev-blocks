import Link from "next/link";

// Mock tags
const mockTags = [
  { id: "1", name: "JavaScript", slug: "javascript", _count: { posts: 156 } },
  { id: "2", name: "React", slug: "react", _count: { posts: 124 } },
  { id: "3", name: "TypeScript", slug: "typescript", _count: { posts: 98 } },
  { id: "4", name: "Node.js", slug: "nodejs", _count: { posts: 87 } },
  { id: "5", name: "Next.js", slug: "nextjs", _count: { posts: 76 } },
  { id: "6", name: "Python", slug: "python", _count: { posts: 65 } },
  { id: "7", name: "DevOps", slug: "devops", _count: { posts: 54 } },
  { id: "8", name: "Docker", slug: "docker", _count: { posts: 43 } },
  { id: "9", name: "AWS", slug: "aws", _count: { posts: 38 } },
  { id: "10", name: "GraphQL", slug: "graphql", _count: { posts: 32 } },
  { id: "11", name: "CSS", slug: "css", _count: { posts: 28 } },
  { id: "12", name: "Testing", slug: "testing", _count: { posts: 24 } },
];

export default function TagsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Explore Topics
        </h1>
        <p className="text-gray-600 mb-8">
          Discover stories by topic that interest you.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockTags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.slug}`}
              className="p-6 border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition group"
            >
              <h2 className="font-semibold text-gray-900 group-hover:text-green-600 mb-1">
                {tag.name}
              </h2>
              <p className="text-sm text-gray-500">
                {tag._count.posts} stories
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
