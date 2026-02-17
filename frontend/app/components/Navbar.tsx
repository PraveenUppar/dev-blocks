"use client";

import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import {
  FiEdit,
  FiFileText,
  FiBookmark,
  FiClock,
  FiSettings,
  FiMenu,
  FiUser,
  FiBell
  
} from "react-icons/fi";

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-gray-50 border-b border-gray-500 sticky top-0 z-30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-l border-r border-gray-500">
        <div className="flex h-18 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span
              className="text-4xl text-black"
              style={{ fontFamily: "var(--font-mrs-sheppards)" }}
            >
              Dev Blocks
            </span>
          </Link>

          {/* Desktop Menu options - Hidden on mobile */}
          {isSignedIn && (
            <div className="hidden md:flex items-center gap-8" style={{ fontFamily: "var(--font-mozilla-text)" }}>
             
              <Link
                href="/write"
                className="text-md font-medium text-gray-900 hover:text-gray-900 transition"
              >
                Write
              </Link>
              <Link
                href="/drafts"
                className="text-md font-medium text-gray-900 hover:text-gray-900 transition"
              >
                Drafts
              </Link>
              <Link
                href="/bookmarks"
                className="text-md font-medium text-gray-900 hover:text-gray-900 transition"
              >
                Bookmarks
              </Link>
              <Link
                href="/history"
                className="text-md font-medium text-gray-900 hover:text-gray-900 transition"
              >
                Reading History
              </Link>
               <Link
                href="/profile"
                className="text-md font-medium text-gray-900 hover:text-gray-900 transition"
              >
                Profile
              </Link>
              <Link
                href="/settings"
                className="text-md font-medium text-gray-900 hover:text-gray-900 transition"
              >
                Settings
              </Link>
              <Link
                href="/notifications"
                className="text-md font-medium text-gray-900 hover:text-gray-900 transition"
              >
                Notifications
              </Link>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-4">
            {!isLoaded ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            ) : isSignedIn ? (
              // Signed in state
              <>
                {/* Mobile Menu Button - Visible only on mobile */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="md:hidden rounded-md flex gap-2 bg-white px-3 py-2 text-sm items-center text-black border border-gray-300 hover:bg-gray-50"
                  style={{ fontFamily: "var(--font-mozilla-text)" }}
                >
                  <FiMenu className="h-5 w-5" />
                  Menu
                </button>

                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-12 h-12",
                    },
                  }}
                />
              </>
            ) : (
              // Signed out state
              <SignInButton mode="modal">
                <button
                  className="bg-gray-200 text-black px-4 py-2 rounded-full cursor-pointer"
                  style={{ fontFamily: "var(--font-mozilla-text)" }}
                >
                  Get started
                </button>
              </SignInButton>
            )}
          </div>
        </div>

        {/* Full-width Mobile Dropdown - Outside of flex container */}
        {isDropdownOpen && isSignedIn && (
          <>
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0 z-10 md:hidden"
              onClick={() => setIsDropdownOpen(false)}
            />

            {/* Dropdown menu - spans full width */}
            <div
              className="absolute left-0 right-0 top-full z-20 bg-gray-50 py-2 shadow-lg border-b border-gray-200 md:hidden"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Link
                  href="/profile"
                  className="flex gap-2 px-4 py-2 items-center text-md text-gray-900 cursor-pointer hover:bg-gray-100 rounded-md"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FiUser className="h-5 w-5 text-gray-500" />
                  Profile
                </Link>
                <Link
                  href="/write"
                  className="flex gap-2 px-4 py-2 items-center text-md text-gray-900 cursor-pointer hover:bg-gray-100 rounded-md"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FiEdit className="h-5 w-5 text-gray-500" />
                  Write
                </Link>
                <Link
                  href="/drafts"
                  className="flex gap-2 px-4 py-2 text-md items-center text-gray-900 cursor-pointer hover:bg-gray-100 rounded-md"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FiFileText className="h-5 w-5 text-gray-500" />
                  Drafts
                </Link>
                <Link
                  href="/bookmarks"
                  className="flex gap-2 px-4 py-2 text-md items-center text-gray-900 cursor-pointer hover:bg-gray-100 rounded-md"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FiBookmark className="h-5 w-5 text-gray-500" />
                  Bookmarks
                </Link>
                <Link
                  href="/history"
                  className="flex gap-2 px-4 py-2 text-md items-center text-gray-900 cursor-pointer hover:bg-gray-100 rounded-md"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FiClock className="h-5 w-5 text-gray-500" />
                  Reading History
                </Link>
                <Link
                  href="/settings"
                  className="flex gap-2 px-4 py-2 text-md items-center text-gray-900 cursor-pointer hover:bg-gray-100 rounded-md"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FiSettings className="h-5 w-5 text-gray-500" />
                  Settings
                </Link>
                <Link
                  href="/notifications"
                  className="flex gap-2 px-4 py-2 text-md items-center text-gray-900 cursor-pointer hover:bg-gray-100 rounded-md"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FiBell className="h-5 w-5 text-gray-500" />
                  Notifications
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
