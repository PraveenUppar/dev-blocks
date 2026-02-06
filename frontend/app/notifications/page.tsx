"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Mock notifications
const mockNotifications = [
  {
    id: "1",
    type: "NEW_FOLLOWER",
    content: "started following you",
    read: false,
    createdAt: "2024-02-05T18:30:00Z",
    actor: {
      username: "janedoe",
      name: "Jane Doe",
      avatar: "https://i.pravatar.cc/100?u=janedoe",
    },
  },
  {
    id: "2",
    type: "POST_LIKED",
    content: "liked your post",
    read: false,
    createdAt: "2024-02-05T16:00:00Z",
    actor: {
      username: "devmaster",
      name: "Dev Master",
      avatar: "https://i.pravatar.cc/100?u=devmaster",
    },
    post: {
      id: "post1",
      slug: "building-fullstack-app",
      title: "Building a Full-Stack App with Next.js",
    },
  },
  {
    id: "3",
    type: "POST_COMMENTED",
    content: "commented on your post",
    read: true,
    createdAt: "2024-02-04T12:00:00Z",
    actor: {
      username: "codemaster",
      name: "Code Master",
      avatar: "https://i.pravatar.cc/100?u=codemaster",
    },
    post: {
      id: "post2",
      slug: "typescript-generics",
      title: "Understanding TypeScript Generics",
    },
  },
  {
    id: "4",
    type: "COMMENT_REPLIED",
    content: "replied to your comment",
    read: true,
    createdAt: "2024-02-03T09:00:00Z",
    actor: {
      username: "janedoe",
      name: "Jane Doe",
      avatar: "https://i.pravatar.cc/100?u=janedoe",
    },
    post: {
      id: "post1",
      slug: "building-fullstack-app",
      title: "Building a Full-Stack App with Next.js",
    },
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    // TODO: Call API
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    // TODO: Call API
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "NEW_FOLLOWER":
        return "👤";
      case "POST_LIKED":
        return "❤️";
      case "POST_COMMENTED":
        return "💬";
      case "COMMENT_REPLIED":
        return "↩️";
      default:
        return "🔔";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-gray-500">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="space-y-1">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`p-4 rounded-lg cursor-pointer transition ${
                  notification.read
                    ? "bg-white hover:bg-gray-50"
                    : "bg-green-50 hover:bg-green-100"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Actor Avatar */}
                  <Link href={`/users/${notification.actor.username}`}>
                    <div className="relative">
                      {notification.actor.avatar ? (
                        <Image
                          src={notification.actor.avatar}
                          alt={notification.actor.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-300" />
                      )}
                      <span className="absolute -bottom-1 -right-1 text-lg">
                        {getIcon(notification.type)}
                      </span>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900">
                      <Link
                        href={`/users/${notification.actor.username}`}
                        className="font-semibold hover:underline"
                      >
                        {notification.actor.name}
                      </Link>{" "}
                      {notification.content}
                    </p>

                    {notification.post && (
                      <Link
                        href={`/posts/${notification.post.slug}`}
                        className="text-gray-500 hover:text-gray-700 text-sm line-clamp-1"
                      >
                        {notification.post.title}
                      </Link>
                    )}

                    <p className="text-gray-400 text-sm mt-1">
                      {getTimeAgo(notification.createdAt)}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔔</div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              No notifications yet
            </h2>
            <p className="text-gray-500">
              When someone interacts with your content, you will see it here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
