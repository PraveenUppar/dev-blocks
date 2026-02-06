import Link from "next/link";

// Mock drafts
const mockDrafts = [
  {
    id: "draft1",
    title: "My Upcoming Article About Docker",
    subtitle: "A beginner's guide to containerization",
    updatedAt: "2024-02-05T18:30:00Z",
    content: "<p>Docker is a platform for developing...</p>",
    wordCount: 245,
  },
  {
    id: "draft2",
    title: "Untitled Draft",
    subtitle: "",
    updatedAt: "2024-02-04T10:15:00Z",
    content: "<p>Just some notes...</p>",
    wordCount: 50,
  },
  {
    id: "draft3",
    title: "Why I Switched from Redux to Zustand",
    subtitle: "A comparison of state management libraries",
    updatedAt: "2024-02-01T14:00:00Z",
    content: "<p>State management in React has always been...</p>",
    wordCount: 478,
  },
];

export default function DraftsPage() {
  const drafts = mockDrafts; // Later: fetch from API

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Drafts
            </h1>
            <p className="text-gray-600">
              Unpublished articles you are working on.
            </p>
          </div>
          <Link
            href="/write"
            className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
          >
            New Story
          </Link>
        </div>

        {/* Drafts List */}
        {drafts.length > 0 ? (
          <div className="space-y-4">
            {drafts.map((draft) => (
              <DraftCard key={draft.id} draft={draft} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              No drafts yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start writing your first story.
            </p>
            <Link
              href="/write"
              className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
            >
              Write a Story
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function DraftCard({
  draft,
}: {
  draft: {
    id: string;
    title: string;
    subtitle: string;
    updatedAt: string;
    wordCount: number;
  };
}) {
  return (
    <div className="p-6 border border-gray-200 rounded-lg hover:border-gray-300 transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link href={`/edit/${draft.id}`}>
            <h2 className="text-xl font-bold text-gray-900 hover:text-gray-600 transition mb-1">
              {draft.title || "Untitled"}
            </h2>
          </Link>
          {draft.subtitle && (
            <p className="text-gray-500 mb-2">{draft.subtitle}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>
              Last edited{" "}
              {new Date(draft.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            <span>{draft.wordCount} words</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/edit/${draft.id}`}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition"
          >
            Edit
          </Link>
          <button className="p-2 text-gray-400 hover:text-red-500 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
