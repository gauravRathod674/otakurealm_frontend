"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faTv,
  faBook,
  faComments,
  faRightToBracket,
  faRightFromBracket,
  faSearch,
  faHouse,
  faBookOpen,
  faClockRotateLeft,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ChatbotModal from "./ChatbotModal";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const menuItems = [
    ["Anime Home", "/", faTv],
    ["Manga Home", "/mangahome", faBook],
    ["Chat Now", "chat", faComments],
    ["Watch History", "/watch_history", faClockRotateLeft],
    ["Read History", "/read_history", faFileLines],
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) {
        setUser({
          username: decoded.username,
          profile_photo:
            localStorage.getItem("profile_photo") ||
            "/media/profile_photos/profile_photo.jpg",
        });
      } else {
        localStorage.removeItem("token");
      }
    } catch {
      localStorage.removeItem("token");
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) router.push(`/filter?keyword=${encodeURIComponent(q)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  const isProtected = (label) =>
    ["Chat Now", "Watch History", "Read History"].includes(label);

  // Detect mobile screen sizes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // or use your preferred breakpoint
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize on load
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensures code runs only on client side

    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) {
        setUser({
          username: decoded.username,
          profile_photo:
            localStorage.getItem("profile_photo") ||
            "/media/profile_photos/profile_photo.jpg",
        });
      } else {
        localStorage.removeItem("token");
      }
    } catch {
      localStorage.removeItem("token");
    }
  }, []);

  return (
    <>
      {/* Top Navbar */}
      <nav className="flex items-center justify-between bg-transparent backdrop-blur-lg h-16 px-4 md:px-6 text-white w-full fixed top-0 z-40 shadow-md">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none cursor-pointer"
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
          <Link href="/" legacyBehavior>
            <a className="block">
              <Image
                src="/OtakuRealm_Logo.png"
                alt="Otaku Realm"
                width={100}
                height={30}
                priority
              />
            </a>
          </Link>
        </div>

        {/* Center: Search (Only on large screens) */}
        <div
          className={`hidden md:flex flex-1 justify-center ${
            isMobile && "hidden"
          } max-[800px]:hidden`}
        >
          <form onSubmit={handleSearch} className="w-full max-w-md relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 text-base"
            />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Search anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Right: Links & Auth (Always visible) */}
        <div className="flex items-center space-x-5">
          <span className="flex items-center space-x-5 max-[632px]:hidden">
            <Link href="/" legacyBehavior>
              <a className="flex items-center text-sm hover:text-[#bb5052] transition-colors">
                <FontAwesomeIcon icon={faTv} className="mr-1" />
                Anime
              </a>
            </Link>
            <Link href="/mangahome" legacyBehavior>
              <a className="flex items-center text-sm hover:text-[#bb5052] transition-colors">
                <FontAwesomeIcon icon={faBook} className="mr-1" />
                Manga
              </a>
            </Link>
            {!user ? (
              <a
                href="/login"
                className="flex items-center text-sm hover:text-[#bb5052] transition-colors"
              >
                <FontAwesomeIcon icon={faComments} className="mr-1" />
                Chat Now
              </a>
            ) : (
              <button
                onClick={() => setChatOpen(true)}
                className="flex items-center text-sm hover:text-[#bb5052] transition-colors"
              >
                <FontAwesomeIcon icon={faComments} className="mr-1" />
                Chat Now
              </button>
            )}
          </span>
          {!user ? (
           <a
           href="/login"
           className="flex items-center justify-center px-3 py-1.5 rounded-sm text-white bg-white/25 backdrop-blur-md border border-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/30"
         >
           <FontAwesomeIcon icon={faRightToBracket} className="mr-2" />
           Log In
         </a>
           
          
          ) : (
            <div className="flex items-center space-x-3">
              <Image
                src={
                  user.profile_photo.startsWith("http")
                    ? user.profile_photo
                    : `http://localhost:8000${user.profile_photo}`
                }
                alt="Profile"
                width={36}
                height={36}
                className="rounded-full border-2 border-[#bb5052]"
              />
              <span>{user.username}</span>
              <button
                onClick={handleLogout}
                className="hover:text-[#bb5052]"
                title="Log Out"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Sidebar (For smaller screens) */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-black/50 backdrop-blur-2xl border-r border-white/20 z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <div className="relative px-5 pt-4 pb-4">
          {/* Close Button - Positioned at top right */}
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-5 text-white hover:text-[#bb5052]"
          >
            <FontAwesomeIcon
              icon={faTimes}
              className="text-3xl text-[#bb5052] cursor-pointer"
            />
          </button>

          {/* Centered Profile Section */}
          {user && (
            <div className="flex flex-col items-center space-y-1">
              <Image
                src={
                  user.profile_photo.startsWith("http")
                    ? user.profile_photo
                    : `http://localhost:8000${user.profile_photo}`
                }
                alt="Profile"
                width={100}
                height={60}
                className="rounded-full border-2 border-[#bb5052]"
              />
              <span className="text-white text-sm font-semibold mt-2 mb-1">
                {user.username}
              </span>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className={`px-5 mb-4 relative ${user ? "" : "mt-5"}`}
        >
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-8 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder="Search anime..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Menu Items */}
        <ul className="px-5 divide-y divide-[#444]">
          {menuItems.map(([label, href, icon], index) => (
            <li key={label} className="py-2">
              {label === "Chat Now" && user ? (
                // Chat Now button for logged-in users
                <button
                  onClick={() => {
                    setChatOpen(true);
                    setMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full text-left px-2 py-2 text-white hover:bg-[#bb5052] rounded"
                >
                  <FontAwesomeIcon icon={icon} />
                  <span>{label}</span>
                </button>
              ) : !user && isProtected(label) ? (
                // Redirect unauthenticated protected routes to /login
                <a
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center space-x-2 px-2 py-2 text-white hover:bg-[#bb5052] rounded"
                >
                  <FontAwesomeIcon icon={icon} />
                  <span>{label}</span>
                </a>
              ) : (
                // All other cases use Link
                <Link
                  href={href === "chat" ? "/" : href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center space-x-2 px-2 py-2 text-white hover:bg-[#bb5052] rounded"
                >
                  <FontAwesomeIcon icon={icon} />
                  <span>{label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        {user ? (
          <div className="mt-6 px-5">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-4 py-2 rounded-md text-white bg-white/25 backdrop-blur-md border border-white/20 hover:bg-[#bb5052] focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
              Log Out
            </button>
          </div>
        ) : (
          <div className="mt-6 px-5">
            <a
              href="/login"
              className="flex items-center justify-center w-full px-4 py-2 rounded-md text-white bg-white/25 backdrop-blur-md border border-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
              Log In
            </a>
          </div>
        )}
      </div>

      {/* Chat Modal */}
      <ChatbotModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
