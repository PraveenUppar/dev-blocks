"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { handleApiError } from "@/utils/errorHandler";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { setAuthTokenGetter } from "@/lib/axios";
import { toast } from "react-toastify";
import {   FiSettings,
 } from "react-icons/fi";

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
}

export default function Settings() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { user: clerkUser } = useUser();

  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    name: "",
    username: "",
    email: "",
    bio: "",
    avatar: "",
    website: "",
    twitter: "",
    github: "",
    linkedin: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAuthTokenGetter(getToken);
  }, [getToken]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get("/user/profile");
      if (response.data.success) {
        setProfile(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile.name.trim()) {
      toast.warning("Name is required");
      return;
    }

    setSaving(true);
    try {
      const response = await api.put("/user/update", {
        name: profile.name,
        bio: profile.bio || undefined,
        avatar: profile.avatar || undefined,
        website: profile.website || undefined,
        twitter: profile.twitter || undefined,
        github: profile.github || undefined,
        linkedin: profile.linkedin || undefined,
      });

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        // Optionally refresh Clerk user data
        if (clerkUser) {
          await clerkUser.reload();
        }
      }
    } catch (error: any) {
      handleApiError(error, "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };



  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4" style={{ fontFamily: "var(--font-mozilla-text)" }}>
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        <span className="text-gray-600 text-lg">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto px-4 py-8 border-l border-r  border-gray-500">
        {/* Header */}
        <div className=" border-gray-200 pb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gray-200 rounded-full">
                      <FiSettings className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-mozilla-text)" }}>
                        Account Settings
                      </h1>
                      <p className="text-gray-600 text-sm mt-1" style={{ fontFamily: "var(--font-montserrat)" }}>
                        Manage your account settings and profile information
                      </p>
                    </div>
                  </div>
                </div>



        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="bg-gray-50 ">
          {/* Profile Picture Section */}

          {/* Basic Information */}
          <div className="p-6 border-b border-t border-gray-400">
            <h2 className="text-xl font-semibold text-gray-900 mb-4"               style={{ fontFamily: "var(--font-raleway)" }}
>
              Basic Information
            </h2>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"             style={{ fontFamily: "var(--font-arimo)" }}
>
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Username (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "var(--font-raleway)" }}>
                  Username
                </label>
                <input
                  type="text"
                  value={profile.username}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-sm text-gray-500 mt-1"             style={{ fontFamily: "var(--font-armio)" }}
>
                  Username managed by authentication provider
                </p>
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "var(--font-raleway)" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-sm text-gray-500 mt-1"             style={{ fontFamily: "var(--font-armio)" }}
>
                  Email managed by authentication provider
                </p>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "var(--font-raleway)" }}>
                  Bio
                </label>
                <textarea
                  style={{ fontFamily: "var(--font-armio)" }}
                  value={profile.bio || ""}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                />
                <p className="text-sm text-gray-500 mt-1"             style={{ fontFamily: "var(--font-armio)" }}
>
                  Brief description for your profile (max 160 characters)
                </p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: "var(--font-raleway)" }}>
              Social Links
            </h2>
            <div className="space-y-4">
              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"             style={{ fontFamily: "var(--font-armio)" }}
>
                  Website
                </label>
                <input
                  type="url"
                  value={profile.website || ""}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Twitter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"             style={{ fontFamily: "var(--font-armio)" }}
>
                  Twitter
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={profile.twitter || ""}
                    onChange={(e) =>
                      handleInputChange("twitter", e.target.value)
                    }
                    placeholder="username"
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"             style={{ fontFamily: "var(--font-armio)" }}
>
                  GitHub
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={profile.github || ""}
                    onChange={(e) =>
                      handleInputChange("github", e.target.value)
                    }
                    placeholder="username"
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"             style={{ fontFamily: "var(--font-armio)" }}
>
                  LinkedIn
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={profile.linkedin || ""}
                    onChange={(e) =>
                      handleInputChange("linkedin", e.target.value)
                    }
                    placeholder="username"
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="p-6">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
