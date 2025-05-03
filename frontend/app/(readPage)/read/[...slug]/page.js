"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

// Utility function for title formatting
function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function ReadPage() {
  const { slug } = useParams();
  const router = useRouter();

  // States for manga and images
  const [images, setImages] = useState([]);
  const [mangaTitle, setMangaTitle] = useState("");
  const [chapter, setChapter] = useState("");
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // For tracking the current page being viewed
  const [currentPage, setCurrentPage] = useState(1);
  const imageRefs = useRef([]);

  // Dropdown open/close state for chapter selection
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const searchParams = useSearchParams();
  const initialPageParam = parseInt(searchParams.get("page")) || 1;

  // Fetch page images and header info from the backend
  useEffect(() => {
    if (!slug) return;

    const combinedSlug = Array.isArray(slug) ? slug.join("/") : slug;
    const fullUrl = `http://localhost:3000/read/${combinedSlug}`;

    async function fetchImages() {
      try {
        const res = await fetch(
          `http://localhost:8000/api/scrape/read-page?full_url=${encodeURIComponent(
            fullUrl
          )}`
        );
        const data = await res.json();

        if (data.images && Array.isArray(data.images)) {
          setImages(data.images);
          setMangaTitle(data.manga_title);
          setChapter(data.chapter);
          setChapters(data.chapters);

          const resolvedPath = data.resolved_path;
          if (
            resolvedPath &&
            decodeURIComponent(combinedSlug) !==
              decodeURIComponent(resolvedPath)
          ) {
            router.replace(`/read/${resolvedPath}`);
          }
        } else {
          setError(data.error || "Unexpected response structure");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching images.");
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, [slug, router]);

  useEffect(() => {
    if (!images.length || !imageRefs.current.length) return;

    const targetIndex = initialPageParam - 1;
    const targetImage = imageRefs.current[targetIndex];
    if (targetImage) {
      // Initial scroll to the target page (even if it’s not loaded yet)
      targetImage.scrollIntoView({ behavior: "smooth", block: "start" });
      setCurrentPage(initialPageParam);

      // Scroll to the target page and keep scrolling if images are lazily loaded
      const checkAndScroll = () => {
        // If the target image isn't in the viewport yet, continue scrolling
        const isTargetInView =
          targetImage.getBoundingClientRect().top <= window.innerHeight;

        if (!isTargetInView) {
          // Scroll a little more to bring the target image into view
          window.scrollBy(0, 5000); // Scroll down by 5000px
        }
      };

      // Start an interval to keep checking and scrolling until the target image is loaded
      const scrollInterval = setInterval(checkAndScroll, 10);

      // Clean up the interval when done
      return () => clearInterval(scrollInterval);
    }
  }, [images, initialPageParam]);

  // IntersectionObserver to update currentPage as the user scrolls
  useEffect(() => {
    if (!images.length) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: Array.from(Array(101).keys(), (x) => x / 100),
    };

    const callback = (entries) => {
      let maxRatio = 0;
      let visibleIndex = currentPage - 1;
      entries.forEach((entry) => {
        const ratio = entry.intersectionRatio;
        if (ratio > maxRatio) {
          maxRatio = ratio;
          visibleIndex = Number(entry.target.getAttribute("data-index"));
        }
      });
      setCurrentPage(visibleIndex + 1);
    };

    const observer = new IntersectionObserver(callback, observerOptions);
    imageRefs.current.forEach((img) => {
      if (img) observer.observe(img);
    });

    console.log("Current visible page:", currentPage);

    return () => {
      observer.disconnect();
    };
  }, [images, currentPage]);

  // Save the reading progress to backend via a POST request
  const saveReadHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return; // Only premium users with token

      const baseUrl =
        typeof window !== "undefined"
          ? window.location.origin + window.location.pathname
          : "";

      // Construct the read history payload
      const payload = {
        manga_title: mangaTitle,
        chapter_name: chapter,
        read_url: `${baseUrl}?page=${currentPage}`,
        total_pages: images.length,
        last_read_page: currentPage,
      };

      await fetch("http://localhost:8000/api/auth/read-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Failed saving read history", error);
    }
  }, [mangaTitle, chapter, images.length, currentPage]);

  // Use effect to send read history when component is unmounting or when page is unloaded.
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      saveReadHistory();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      saveReadHistory();
    };
  }, [saveReadHistory]);

  // Handler when user clicks on a chapter from the dropdown
  const handleChapterClick = (chapterName) => {
    setIsDropdownOpen(false); // Close the dropdown
    const selectedChapterUrl = chapters.find(
      (c) => c.name === chapterName
    )?.url;
    if (selectedChapterUrl) {
      // Extract the part after '/title/' from the chapter URL
      const parts = selectedChapterUrl.split("/title/");
      if (parts.length > 1) {
        const cleanedChapterUrl = parts[1];
        router.push(`/read/${cleanedChapterUrl}`);
      } else {
        // Fallback: if the expected segment isn't there
        router.push(`/read/${selectedChapterUrl}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-white bg-black">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 bg-black">
        {error}
      </div>
    );
  }

  const totalPages = images.length;

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* VERY TOP THIN RED BAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-red-700 h-2" />

      {/* FIXED HEADER BAR */}
      <div className="fixed top-2 left-0 right-0 z-50 h-20 flex items-center px-4 justify-between bg-opacity-80 max-[648px]:backdrop-blur-sm">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-4">
          <Link href="/mangahome">
            <Image
              src="/OtakuRealm_Logo.png"
              alt="Otaku Realm Logo"
              width={120}
              height={60}
            />
          </Link>

          <div className="hidden sm:flex flex-col">
            <span className="text-3xl font-bold hover:text-[#bb5052]">
              <Link href={`/mangadetailpage/${encodeURIComponent(mangaTitle)}`}>
                {toTitleCase(mangaTitle)}
              </Link>
            </span>

            {/* Chapter Dropdown (hidden on small screens) */}
            <div className="relative top-3 hidden sm:block">
              <div
                className="flex items-center gap-2 cursor-pointer bg-[rgba(0,0,0,0.25)] px-3 py-2 rounded-md border border-gray-800 hover:bg-[rgba(0,0,0,0.50)] hover:text-[#bb5052]"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="text-lg font-bold r">
                  {toTitleCase(mangaTitle)} - {chapter}
                </span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              <div
                className={`absolute left-0 right-0 mt-2 overflow-hidden bg-[rgba(0,0,0,0.85)] rounded-md transition-all duration-300 ease-in-out ${
                  isDropdownOpen ? "max-h-[300px]" : "max-h-0"
                }`}
                style={{ zIndex: 9999 }}
              >
                <div className="max-h-[300px] overflow-y-auto">
                  {chapters.map((chap, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleChapterClick(chap.name)}
                      className="px-4 py-2 hover:bg-[rgba(255,255,255,0.1)] cursor-pointer border-b border-gray-700"
                    >
                      {chap.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">
          <div className="cursor-pointer">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.5334 38.9331C10.3167 38.9331 10.1001 38.8831 9.90008 38.7831C9.41675 38.5497 9.11675 38.0497 9.11675 37.5164V32.8997H3.33341C2.55008 32.8997 1.91675 32.2664 1.91675 31.4831V6.48307C1.91675 5.69974 2.55008 5.06641 3.33341 5.06641H36.6667C37.4501 5.06641 38.0834 5.69974 38.0834 6.48307V31.4831C38.0834 32.2664 37.4501 32.8997 36.6667 32.8997H18.9501L11.3834 38.6497C11.1334 38.8497 10.8334 38.9331 10.5334 38.9331ZM4.75008 30.0664H10.5334C11.3167 30.0664 11.9501 30.6997 11.9501 31.4831V34.6664L17.6167 30.3664C17.8667 30.1831 18.1667 30.0831 18.4667 30.0831H35.2334V7.89974H4.75008V30.0664Z"
                fill="#FAFAFA"
              />
              <text
                x="20"
                y="24"
                textAnchor="middle"
                fontSize="10"
                fill="#FAFAFA"
                fontWeight="bold"
              >
                ENG
              </text>
            </svg>
          </div>

          {/* Hamburger for small screens */}
          <div
            className=" cursor-pointer text-2xl ml-4"
            onClick={() => setSidebarOpen(true)}
          >
            <FontAwesomeIcon icon={faBars} />
          </div>

          {/* Dots */}
          {/* <div className="cursor-pointer text-4xl leading-none ml-4 hidden sm:block">
            ⋮
          </div> */}
        </div>
      </div>

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-[250px]  bg-black/50 backdrop-blur-2xl border-r border-white/20 z-[9999] transition-transform duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-4 border-b border-gray-700">
          <span className="text-lg font-bold text-white">
            {toTitleCase(mangaTitle)}
          </span>
          <FontAwesomeIcon
            icon={faTimes}
            className="text-xl text-white cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          />
        </div>

        <div className="mt-4 px-4 text-white">
          <p className="font-semibold mb-2">Chapters</p>
          <div className="max-h-[85vh] overflow-y-auto border border-gray-700 rounded-md">
            {chapters.map((chap, idx) => (
              <div
                key={idx}
                onClick={() => {
                  handleChapterClick(chap.name);
                  setSidebarOpen(false);
                }}
                className="px-4 py-2 bg-[rgba(0,0,0,0.5)] hover:bg-[rgba(255,255,255,0.1)] cursor-pointer border-b border-gray-200"
              >
                {chap.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SCROLLABLE CONTENT AREA */}
      <main className="pt-[5rem] pb-12 flex flex-col items-center w-full">
        {images.map((src, idx) => (
          <div
            key={idx}
            data-index={idx}
            ref={(el) => (imageRefs.current[idx] = el)}
            className="w-full max-w-3xl mb-4 mx-auto relative"
          >
            <Image
              key={idx}
              src={`/api/proxy-image?src=${encodeURIComponent(src)}`}
              alt={`Page ${idx + 1}`}
              width={728}
              height={1068}
              unoptimized
              className="w-full h-auto"
              ref={(el) => (imageRefs.current[idx] = el)}
            />
          </div>
        ))}
      </main>

      {/* PAGE COUNTER */}
      <span className="fixed bottom-5 right-3 font-medium text-2xl z-50">
        {currentPage} / {totalPages}
      </span>

      {/* VERY BOTTOM THIN RED BAR */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-red-700 h-2" />
    </div>
  );
}
