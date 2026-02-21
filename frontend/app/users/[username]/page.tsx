"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import api from "../../../lib/axios";
import { User, Post } from "../../../types/index";
import PostCard from "../../components/PostCard";
import FollowButton from "../../components/FollowButton";
import { FiGlobe, FiGithub, FiLinkedin } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { FaUserPlus } from "react-icons/fa";
import { FaBeer } from "react-icons/fa";

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
}

export default function UserPage() {
  const params = useParams();
  const username = params?.username as string;
  const { user: clerkUser } = useUser();
  const isOwnProfile = clerkUser?.username === username;

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
    window.scrollTo(0, 0);
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
          const paged =
            response.data as unknown as PaginatedResponse<FollowUser> & {
              success: boolean;
            };
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
          const paged =
            response.data as unknown as PaginatedResponse<FollowUser> & {
              success: boolean;
            };
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
      <div
        className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4"
        style={{ fontFamily: "var(--font-mozilla-text)" }}
      >
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        <span className="text-gray-600 text-lg">Loading User...</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-gray-100 p-6 rounded-full mb-6">
          <FaUserPlus className="w-12 h-12 text-gray-400" />
        </div>
        <h2
          className="text-2xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: "var(--font-raleway)" }}
        >
          User not found
        </h2>
        <p
          className="text-gray-500"
          style={{ fontFamily: "var(--font-raleway)" }}
        >
          {error || "The user you are looking for does not exist."}
        </p>
      </div>
    );
  }

  // safe count fallbacks
  const followersCount = user?._count?.followers ?? 0;
  const followingCount = user?._count?.following ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="container  min-h-screen mx-auto px-4 py-8 max-w-7xl border-l border-r border-gray-500 ">
        {/* Profile Header */}
        <div className="flex md:flex-row  items-start text-black md:items-center gap-6 mb-8">
          <div className="relative w-24 h-24  md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-green-600">
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
            <h1
              className="text-3xl font-bold mb-1"
              style={{ fontFamily: "var(--font-arimo)" }}
            >
              {user.name}
            </h1>
            <p
              className="text-lg text-gray-600 mb-2"
              style={{ fontFamily: "var(--font-mozilla-text)" }}
            >
              @{user.username}
            </p>

            {user.bio && (
              <p
                className="text-base mb-4 max-w-2xl"
                style={{ fontFamily: "var(--font-mozilla-text)" }}
              >
                {user.bio}
              </p>
            )}

            {/* Social Links */}
            {(user.website || user.twitter || user.github || user.linkedin) && (
              <div className="flex gap-2 mt-4">
                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" cursor-pointer rounded-full p-2 border border-gray-500 hover:bg-gray-200 "
                  >
                    <FiGlobe className="w-4 h-4" />
                  </a>
                )}
                {user.twitter && (
                  <a
                    href={user.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" cursor-pointer rounded-full p-2 border border-gray-500 hover:bg-gray-200 "
                  >
                    <FaXTwitter className="w-4 h-4" />
                  </a>
                )}
                {user.github && (
                  <a
                    href={user.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" cursor-pointer rounded-full p-2 border border-gray-500 hover:bg-gray-200 "
                  >
                    <FiGithub className="w-4 h-4" />
                  </a>
                )}
                {user.linkedin && (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" cursor-pointer rounded-full p-2 border border-gray-500 hover:bg-gray-200 "
                  >
                    <FiLinkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}

            {/* Follow Button */}
            {!isOwnProfile && user.id && (
              <div className="mt-4">
                <FollowButton
                  targetUserId={user.id}
                  initialIsFollowing={user.isFollowing ?? false}
                  onToggle={(followed) => {
                    setUser((prev) =>
                      prev
                        ? {
                            ...prev,
                            isFollowing: followed,
                            _count: {
                              ...prev._count,
                              followers:
                                prev._count.followers + (followed ? 1 : -1),
                            },
                          }
                        : prev,
                    );
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div
          className="border-b border-gray-300 text-black mb-6"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
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
                <div
                  className="mt-10 bg-gray-50 flex flex-col items-center justify-center gap-4"
                  style={{ fontFamily: "var(--font-mozilla-text)" }}
                >
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                  <span className="text-gray-600 text-lg">
                    Loading posts...
                  </span>
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => <PostCard key={post.id} post={post} />)
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="bg-gray-100 p-6 rounded-full mb-6">
                    <FaBeer className="w-12 h-12 text-gray-400" />
                  </div>
                  <h2
                    className="text-2xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: "var(--font-raleway)" }}
                  >
                    No posts yet
                  </h2>
                </div>
              )}
            </>
          )}

          {/* Followers Tab */}
          {activeTab === "followers" && (
            <>
              {followersLoading ? (
                <div
                  className="mt-10 bg-gray-50 flex flex-col items-center justify-center gap-4"
                  style={{ fontFamily: "var(--font-mozilla-text)" }}
                >
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                  <span className="text-gray-600 text-lg">
                    Loading followers...
                  </span>
                </div>
              ) : followers.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {followers.map((follower) => (
                      <div
                        key={follower.id}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                      >
                        <Link
                          href={`/users/${follower.username}`}
                          className="flex items-center gap-4 flex-1 min-w-0"
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
                          <div className="flex-1 min-w-0">
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
                        {clerkUser?.username !== follower.username && (
                          <FollowButton
                            targetUserId={follower.id}
                            initialIsFollowing={false}
                            size="sm"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {followersPagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8 sm:mt-12">
                      <button
                        onClick={() =>
                          fetchFollowers(
                            Math.max(1, followersPagination.page - 1),
                          )
                        }
                        disabled={followersPagination.page === 1}
                        className="px-6 py-2 border border-gray-600 rounded-full cursor-pointer text-gray-900 text-sm hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                      >
                        Previous
                      </button>
                      <span
                        className="text-sm text-gray-900"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                      >
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
                        className="px-6 py-2 border border-gray-300 rounded-full cursor-pointer text-gray-700 text-sm hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="bg-gray-100 p-6 rounded-full mb-6">
                    <FaUserPlus className="w-12 h-12 text-gray-400" />
                  </div>
                  <h2
                    className="text-2xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: "var(--font-raleway)" }}
                  >
                    No Followers yet
                  </h2>
                </div>
              )}
            </>
          )}

          {/* Following Tab */}
          {activeTab === "following" && (
            <>
              {followingLoading ? (
                <div
                  className="mt-10 bg-gray-50 flex flex-col items-center justify-center gap-4"
                  style={{ fontFamily: "var(--font-mozilla-text)" }}
                >
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                  <span className="text-gray-600 text-lg">
                    Loading Following...
                  </span>
                </div>
              ) : following.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {following.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                      >
                        <Link
                          href={`/users/${u.username}`}
                          className="flex items-center gap-4 flex-1 min-w-0"
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
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900">
                              {u.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              @{u.username}
                            </p>
                            {u.bio && (
                              <p className="text-sm text-gray-700 mt-1 line-clamp-1">
                                {u.bio}
                              </p>
                            )}
                          </div>
                        </Link>
                        {clerkUser?.username !== u.username && (
                          <FollowButton
                            targetUserId={u.id}
                            initialIsFollowing={true}
                            size="sm"
                          />
                        )}
                      </div>
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
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="bg-gray-100 p-6 rounded-full mb-6">
                    <FaUserPlus className="w-12 h-12 text-gray-400" />
                  </div>
                  <h2
                    className="text-2xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: "var(--font-raleway)" }}
                  >
                    No Following yet
                  </h2>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
