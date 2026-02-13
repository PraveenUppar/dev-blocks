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
  FiMenu,
} from "react-icons/fi";

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setAuthTokenGetter(getToken);
  }, [getToken]);

  return (
    <nav className="bg-gray-50 border-b border-gray-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-l border-r border-gray-500">
        <div className="flex h-18 items-center justify-between ">
          {/* Logo */}
          <Link href="/" className="flex items-center ">
            <span
              className="text-4xl text-black "
              style={{ fontFamily: "var(--font-mrs-sheppards)" }}
            >
              Dev Blocks
            </span>
          </Link>
          {/* Desktop Menu - Hidden on mobile */}
          {isSignedIn && (
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/write"
                className="text-md font-medium text-gray-700 hover:text-gray-900 transition"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Write
              </Link>
              <Link
                href="/drafts"
                className="text-md font-medium text-gray-700 hover:text-gray-900 transition"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Drafts
              </Link>
              <Link
                href="/bookmarks"
                className="text-md font-medium text-gray-700 hover:text-gray-900 transition"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Bookmarks
              </Link>
              <Link
                href="/history"
                className="text-md font-medium text-gray-700 hover:text-gray-900 transition"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Reading History
              </Link>
              <Link
                href="/settings"
                className="text-md font-medium text-gray-700 hover:text-gray-900 transition"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Settings
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
                {/* Mobile Dropdown Menu - Visible only on mobile */}
                <div className="relative md:hidden">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="rounded-md flex gap-2 bg-white px-3 py-2 text-sm items-center text-black border border-gray-300 hover:bg-gray-50"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    <FiMenu className="h-5 w-5" />
                    Menu
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
                        className="absolute right-0 mt-2 w-56 z-20 bg-white py-2 rounded-md shadow-lg ring-1 ring-black/5"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                      >
                        <Link
                          href="/write"
                          className="flex gap-2 px-4 py-2 items-center text-md text-gray-900 cursor-pointer hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FiEdit className="h-5 w-5 text-gray-500" />
                          Write
                        </Link>
                        <Link
                          href="/drafts"
                          className="flex gap-2 px-4 py-2 text-md items-center text-gray-900 cursor-pointer hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FiFileText className="h-5 w-5 text-gray-500" />
                          Drafts
                        </Link>
                        <Link
                          href="/bookmarks"
                          className="flex gap-2 px-4 py-2 text-md items-center text-gray-900 cursor-pointer hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FiBookmark className="h-5 w-5 text-gray-500" />
                          Bookmarks
                        </Link>
                        <Link
                          href="/history"
                          className="flex gap-2 px-4 py-2 text-md items-center text-gray-900 cursor-pointer hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FiClock className="h-5 w-5 text-gray-500" />
                          Reading History
                        </Link>
                        <Link
                          href="/settings"
                          className="flex gap-2 px-4 py-2 text-md items-center text-gray-900 cursor-pointer hover:bg-gray-100"
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
