"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "../../../lib/axios";
import { User, Post } from "../../../types/index";
import PostCard from "../../components/PostCard";

type TabType = "posts" | "followers" | "following";

interface FollowUser {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  bio?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  // optional pagination might be inside data for non-paginated endpoints
}

export default function UserPage() {
  const params = useParams();
  const username = params?.username as string;

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("posts");

  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [followersPagination, setFollowersPagination] = useState({
    page: 1,
    totalPages: 1,
  });
  const [followingPagination, setFollowingPagination] = useState({
    page: 1,
    totalPages: 1,
  });

  // Fetch user profile
  useEffect(() => {
    if (!username) return;

    let cancelled = false;
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await api.get<ApiResponse<User>>(`/user/${username}`);
        if (cancelled) return;
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          setError("User not found");
        }
      } catch (err: any) {
        console.error("Error fetching user:", err);
        setError(err?.response?.data?.error?.message || "Failed to fetch user");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUser();
    return () => {
      cancelled = true;
    };
  }, [username]);

  // Fetch helpers — useCallbacks to avoid stale closures
  const fetchPosts = useCallback(async () => {
    if (!username) return;
    try {
      setPostsLoading(true);
      const response = await api.get<ApiResponse<Post[]>>(
        `/user/${username}/posts`,
      );
      if (response.data.success) {
        setPosts(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching user posts:", err);
    } finally {
      setPostsLoading(false);
    }
  }, [username]);

  const fetchFollowers = useCallback(
    async (page: number = 1) => {
      if (!username) return;
      try {
        setFollowersLoading(true);
        const response = await api.get<
          ApiResponse<PaginatedResponse<FollowUser>>
        >(`/user/${username}/followers`, { params: { page, limit: 10 } });
        if (response.data.success) {
          const paged = response.data.data;
          setFollowers(paged.data || []);
          setFollowersPagination({
            page: paged.pagination.page,
            totalPages: paged.pagination.totalPages,
          });
        }
      } catch (err) {
        console.error("Error fetching followers:", err);
      } finally {
        setFollowersLoading(false);
      }
    },
    [username],
  );

  const fetchFollowing = useCallback(
    async (page: number = 1) => {
      if (!username) return;
      try {
        setFollowingLoading(true);
        const response = await api.get<
          ApiResponse<PaginatedResponse<FollowUser>>
        >(`/user/${username}/following`, { params: { page, limit: 10 } });
        if (response.data.success) {
          const paged = response.data.data;
          setFollowing(paged.data || []);
          setFollowingPagination({
            page: paged.pagination.page,
            totalPages: paged.pagination.totalPages,
          });
        }
      } catch (err) {
        console.error("Error fetching following:", err);
      } finally {
        setFollowingLoading(false);
      }
    },
    [username],
  );

  // When tab changes, load data if empty
  useEffect(() => {
    if (activeTab === "posts" && posts.length === 0) {
      fetchPosts();
    } else if (activeTab === "followers" && followers.length === 0) {
      fetchFollowers(1);
    } else if (activeTab === "following" && following.length === 0) {
      fetchFollowing(1);
    }
  }, [
    activeTab,
    posts.length,
    followers.length,
    following.length,
    fetchPosts,
    fetchFollowers,
    fetchFollowing,
  ]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-2xl font-bold mb-2">User not found</h1>
        <p className="text-gray-600">
          {error || "The user you are looking for does not exist."}
        </p>
      </div>
    );
  }

  // safe count fallbacks
  const followersCount = user?._count?.followers ?? 0;
  const followingCount = user?._count?.following ?? 0;
  const postsCount = user?._count?.posts ?? 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start text-black md:items-center gap-6 mb-8">
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-gray-200">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-600">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
            <p className="text-lg text-gray-600 mb-4">@{user.username}</p>

            {user.bio && <p className="text-base mb-4 max-w-2xl">{user.bio}</p>}

            <div className="flex flex-wrap gap-6 text-sm">
              <button
                onClick={() => setActiveTab("followers")}
                className="flex items-center gap-1 hover:text-green-600 transition"
              >
                <span className="font-bold">{followersCount}</span>
                <span className="text-gray-600">Followers</span>
              </button>
              <button
                onClick={() => setActiveTab("following")}
                className="flex items-center gap-1 hover:text-green-600 transition"
              >
                <span className="font-bold">{followingCount}</span>
                <span className="text-gray-600">Following</span>
              </button>
              <div className="flex items-center gap-1">
                <span className="font-bold">{postsCount}</span>
                <span className="text-gray-600">Posts</span>
              </div>
            </div>

            {/* Social Links */}
            {(user.website || user.twitter || user.github || user.linkedin) && (
              <div className="flex gap-4 mt-4">
                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline text-sm"
                  >
                    Website
                  </a>
                )}
                {user.twitter && (
                  <a
                    href={`https://twitter.com/${user.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline text-sm"
                  >
                    Twitter
                  </a>
                )}
                {user.github && (
                  <a
                    href={`https://github.com/${user.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline text-sm"
                  >
                    GitHub
                  </a>
                )}
                {user.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${user.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline text-sm"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 text-black mb-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-4 py-2 border-b-2 font-medium transition-colors ${activeTab === "posts" ? "border-green-600 text-green-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab("followers")}
              className={`px-4 py-2 border-b-2 font-medium transition-colors ${activeTab === "followers" ? "border-green-600 text-green-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}
            >
              Followers ({followersCount})
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`px-4 py-2 border-b-2 font-medium transition-colors ${activeTab === "following" ? "border-green-600 text-green-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}
            >
              Following ({followingCount})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Posts Tab */}
          {activeTab === "posts" && (
            <>
              {postsLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => <PostCard key={post.id} post={post} />)
              ) : (
                <div className="p-8 text-center border border-dashed border-gray-300 rounded-lg text-gray-600">
                  No posts yet.
                </div>
              )}
            </>
          )}

          {/* Followers Tab */}
          {activeTab === "followers" && (
            <>
              {followersLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
                </div>
              ) : followers.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {followers.map((follower) => (
                      <Link
                        key={follower.id}
                        href={`/users/${follower.username}`}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                      >
                        {follower.avatar ? (
                          <Image
                            src={follower.avatar}
                            alt={follower.name}
                            width={48}
                            height={48}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
                            {follower.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {follower.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            @{follower.username}
                          </p>
                          {follower.bio && (
                            <p className="text-sm text-gray-700 mt-1 line-clamp-1">
                              {follower.bio}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {followersPagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-6">
                      <button
                        onClick={() =>
                          fetchFollowers(
                            Math.max(1, followersPagination.page - 1),
                          )
                        }
                        disabled={followersPagination.page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Previous
                      </button>
                      <span className="text-gray-600">
                        Page {followersPagination.page} of{" "}
                        {followersPagination.totalPages}
                      </span>
                      <button
                        onClick={() =>
                          fetchFollowers(
                            Math.min(
                              followersPagination.totalPages,
                              followersPagination.page + 1,
                            ),
                          )
                        }
                        disabled={
                          followersPagination.page ===
                          followersPagination.totalPages
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center border border-dashed border-gray-300 rounded-lg text-gray-600">
                  No followers yet.
                </div>
              )}
            </>
          )}

          {/* Following Tab */}
          {activeTab === "following" && (
            <>
              {followingLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
                </div>
              ) : following.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {following.map((u) => (
                      <Link
                        key={u.id}
                        href={`/users/${u.username}`}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                      >
                        {u.avatar ? (
                          <Image
                            src={u.avatar}
                            alt={u.name}
                            width={48}
                            height={48}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {u.name}
                          </h3>
                          <p className="text-sm text-gray-600">@{u.username}</p>
                          {u.bio && (
                            <p className="text-sm text-gray-700 mt-1 line-clamp-1">
                              {u.bio}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {followingPagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-6">
                      <button
                        onClick={() =>
                          fetchFollowing(
                            Math.max(1, followingPagination.page - 1),
                          )
                        }
                        disabled={followingPagination.page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Previous
                      </button>
                      <span className="text-gray-600">
                        Page {followingPagination.page} of{" "}
                        {followingPagination.totalPages}
                      </span>
                      <button
                        onClick={() =>
                          fetchFollowing(
                            Math.min(
                              followingPagination.totalPages,
                              followingPagination.page + 1,
                            ),
                          )
                        }
                        disabled={
                          followingPagination.page ===
                          followingPagination.totalPages
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center border border-dashed border-gray-300 rounded-lg text-gray-600">
                  Not following anyone yet.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
