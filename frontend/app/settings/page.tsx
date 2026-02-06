"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();

  const [name, setName] = useState(user?.firstName || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [github, setGithub] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // TODO: Call API to update profile
    console.log({ name, username, bio, website, twitter, github });
    setTimeout(() => {
      setSaving(false);
      alert("Profile updated!");
    }, 1000);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile</h2>

          {/* Avatar */}
          <div className="flex items-center gap-6 mb-6">
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt="Avatar"
                width={80}
                height={80}
                className="rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-300" />
            )}
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Profile photo is managed by Clerk
              </p>
              <button
                onClick={() => user?.openUserProfile()}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Change in Clerk Dashboard →
              </button>
            </div>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="flex items-center">
              <span className="px-4 py-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-gray-500">
                devblocks.com/users/
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-r-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the world about yourself..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
            />
            <p className="text-sm text-gray-400 mt-1">
              {bio.length}/200 characters
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Social Links
          </h2>

          {/* Website */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Twitter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter
            </label>
            <div className="flex items-center">
              <span className="px-4 py-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-gray-500">
                twitter.com/
              </span>
              <input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="username"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-r-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* GitHub */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub
            </label>
            <div className="flex items-center">
              <span className="px-4 py-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-gray-500">
                github.com/
              </span>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="username"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-r-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Email Preferences */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Email Preferences
          </h2>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
              />
              <div>
                <p className="font-medium text-gray-900">
                  New follower notifications
                </p>
                <p className="text-sm text-gray-500">
                  Get notified when someone follows you
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
              />
              <div>
                <p className="font-medium text-gray-900">
                  Comment notifications
                </p>
                <p className="text-sm text-gray-500">
                  Get notified when someone comments on your posts
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
              />
              <div>
                <p className="font-medium text-gray-900">Weekly digest</p>
                <p className="text-sm text-gray-500">
                  Receive a weekly summary of your stats
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6 border border-red-200">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Danger Zone
          </h2>
          <p className="text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button className="px-6 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-50 transition">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
