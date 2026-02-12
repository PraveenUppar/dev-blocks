"use client";
import Link from "next/link";
import { SignUpButton, UserButton, useUser, useAuth } from "@clerk/nextjs";
import { setAuthTokenGetter } from "../../lib/axios";
import { useEffect, useState } from "react";
import {
  FiEdit,
  FiFileText,
  FiBookmark,
  FiClock,
  FiSettings,
} from "react-icons/fi";

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setAuthTokenGetter(getToken);
  }, [getToken]);

  return (
    <nav className="bg-gray">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span
              className="text-4xl "
              style={{ fontFamily: "var(--font-mrs-sheppards)" }}
            >
              Blocks
            </span>
          </Link>
          {/* Search (optional - add later) */}
          <div className="hidden md:flex flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 text-black rounded-full bg-gray-100"
            />
          </div>
          {/* Right side */}
          <div className="flex items-center gap-4">
            {!isLoaded ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            ) : isSignedIn ? (
              // Signed in state
              <>
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="rounded-md bg-white px-6 py-2 text-sm  text-black cursor-pointer"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    Explore
                  </button>

                  {isDropdownOpen && (
                    <>
                      {/* Close dropdown */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsDropdownOpen(false)}
                      />

                      {/* Dropdown menu */}
                      <div
                        className="
    fixed inset-x-0 top-16 z-20
    bg-white py-2 shadow-lg ring-1 ring-black
    md:absolute md:inset-auto md:right-0 md:mt-2 md:w-56 md:rounded-md
  "
                        style={{ fontFamily: "var(--font-montserrat)" }}
                      >
                        <Link
                          href="/write"
                          className="flex gap-2 px-4 py-2  text-md text-gray-900 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FiEdit className="h-5 w-5  text-gray-500" />
                          Write
                        </Link>
                        <Link
                          href="/drafts"
                          className="flex gap-2 px-4 py-2 text-md text-gray-900 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FiFileText className="h-5 w-5 text-gray-500" />
                          Drafts
                        </Link>
                        <Link
                          href="/bookmarks"
                          className="flex gap-2 px-4  py-2 text-md text-gray-900 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FiBookmark className="h-5 w-5 text-gray-500" />
                          Bookmarks
                        </Link>
                        <Link
                          href="/history"
                          className="flex gap-2 px-4 py-2 text-md text-gray-900 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FiClock className="h-5 w-5 text-gray-500" />
                          Reading History
                        </Link>
                        <Link
                          href="/settings"
                          className="flex gap-2 px-4 py-2 text-md text-gray-900 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FiSettings className="h-5 w-5 text-gray-500" />
                          Settings
                        </Link>
                      </div>
                    </>
                  )}
                </div>
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
              <>
                <SignUpButton mode="modal">
                  <button
                    className="bg-gray-100 text-black px-4 py-2 rounded-full cursor-pointer"
                    style={{ fontFamily: "var(--font-google-sans-code)" }}
                  >
                    Get started
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
