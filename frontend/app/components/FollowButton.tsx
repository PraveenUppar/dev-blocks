"use client";

import React, { useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/axios";
import { toast } from "react-toastify";

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing: boolean;
  onToggle?: (followed: boolean) => void;
  size?: "sm" | "md";
}

export default function FollowButton({
  targetUserId,
  initialIsFollowing,
  onToggle,
  size = "md",
}: FollowButtonProps) {
  const { isSignedIn } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isHovered, setIsHovered] = useState(false);
  const isToggling = useRef(false);

  const handleToggle = async () => {
    if (!isSignedIn) {
      toast.info("Please sign in to follow users");
      return;
    }
    if (isToggling.current) return;
    isToggling.current = true;

    const previousState = isFollowing;
    // Optimistic update
    setIsFollowing(!isFollowing);
    onToggle?.(!isFollowing);

    try {
      const response = await api.post(`/user/${targetUserId}/follow-toggle`);
      if (response.data.success) {
        const followed = response.data.data.followed;
        setIsFollowing(followed);
        onToggle?.(followed);
        if (followed) {
          toast.success("Followed!");
        } else {
          toast.info("Unfollowed");
        }
      }
    } catch (error: unknown) {
      // Revert on error
      setIsFollowing(previousState);
      onToggle?.(previousState);

      const err = error as {
        response?: { status?: number; data?: { error?: { message?: string } } };
      };
      if (err.response?.status === 401) {
        toast.info("Please sign in to follow users");
      } else if (err.response?.data?.error?.message) {
        toast.error(err.response.data.error.message);
      } else {
        toast.error("Failed to update follow. Please try again.");
      }
    } finally {
      isToggling.current = false;
    }
  };

  const sizeClasses = size === "sm" ? "px-3 py-1 text-xs" : "px-5 py-2 text-sm";

  if (isFollowing) {
    return (
      <button
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`${sizeClasses} rounded-full font-medium transition shrink-0 cursor-pointer border ${
          isHovered
            ? "border-red-400 text-red-600 bg-red-50 hover:bg-red-100"
            : "border-emerald-600 text-emerald-600 bg-white"
        }`}
      >
        {isHovered ? "Unfollow" : "Following"}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`${sizeClasses} bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition shrink-0 cursor-pointer`}
    >
      Follow
    </button>
  );
}
