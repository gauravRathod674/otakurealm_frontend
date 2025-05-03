"use client";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileArchive,
  faGlasses,
  faPlus,
  faFile,
  faStar,
  faGlobe,
  faFileAlt,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import MostViewed from "@/components/manga-home/MostViewed";
import RecommendedForYou from "@/components/manga-home/RecommendedForYou";

// Helper function to render description paragraphs preserving <br> tags
function renderDescriptionAsParagraphs(desc) {
  const paragraphs = desc.split(/<br\s*\/?>/i);
  return paragraphs.map((para, idx) => (
    <p
      key={idx}
      className="text-gray-200 leading-relaxed mb-0"
      style={{ display: "inline" }}
    >
      {para.trim()}
      {idx < paragraphs.length - 1 && <br />}
    </p>
  ));
}

// Try to extract the chapter number using common patterns.
function getChapterNumber(chapterName) {
  // Try matching "Ch." pattern first.
  let match = chapterName.match(/Ch\.\s*(\d+(?:[.-]\d+)?)/i);
  if (match) return match[1];
  // Otherwise try "Chapter" pattern.
  match = chapterName.match(/Chapter\s*(\d+(?:[.-]\d+)?)/i);
  if (match) return match[1];
  // Fallback: capture trailing digits (with optional delimiter)
  match = chapterName.match(/(\d+(?:[.-]\d+)?)(?!.*\d)/);
  return match ? match[1] : "";
}

// Normalize a numeric string by removing leading zeros.
function normalize(numStr) {
  return numStr.replace(/^0+/, "") || "0";
}

// If the chapter number contains a delimiter (dot or hyphen), we assume it is of the form "primary-delimiter-secondary"
// and for matching purposes we only consider the secondary part.
function getChapterParts(chapterNum) {
  if (chapterNum.includes(".") || chapterNum.includes("-")) {
    const delimiter = chapterNum.includes(".") ? "." : "-";
    const parts = chapterNum.split(delimiter);
    return {
      primary: normalize(parts[0]),
      secondary: normalize(parts[1]),
      delimiter,
    };
  }
  return { primary: normalize(chapterNum), secondary: null, delimiter: null };
}

// Determines if the chapter (by name) matches the search term.
// If the chapter number (as extracted) contains a secondary part, then the match is true only if
// the normalized secondary part equals the normalized search term.
// Otherwise, the entire number (normalized) must match.
function doesChapterMatch(chapterName, term) {
  if (!term) return false;
  const extracted = getChapterNumber(chapterName);
  const parts = getChapterParts(extracted);
  if (parts.secondary !== null) {
    return parts.secondary === normalize(term);
  }
  return parts.primary === normalize(term);
}

export default function MangaDetail() {
  const [mangaDetail, setMangaDetail] = useState(null);
  const [showExtraInfo, setShowExtraInfo] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Extract slug from URL
  const { slug } = useParams();
  const pathname = usePathname();
  const lastPart = pathname.split("/").pop();

  useEffect(() => {
    console.log("Route changed, slug:", slug, "lastPart:", lastPart);
  }, [slug, lastPart]);

  useEffect(() => {
    if (!lastPart) return;

    axios
      .get(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/scrape/manga-detail/${encodeURIComponent(lastPart)}`
      )
      .then((response) => {
        setMangaDetail(response.data);
      })
      .catch((error) => {
        console.error("Error fetching manga detail:", error);
      });
  }, [lastPart]);

  if (!mangaDetail) return <div>Loading...</div>;

  // Destructure fields from the fetched data, including chapters.
  const {
    image,
    authors,
    genres,
    rating,
    description,
    extra_info, // Array of extra info paragraphs.
    publishers,
    languages,
    status,
    read_direction,
    chapters, // Chapters array.
  } = mangaDetail;

  const proxyImageUrl = `/api/proxy-image?src=${encodeURIComponent(image.src)}`;
  const truncateLength = 300;

  const words = description.split(/\s+/);
  const wordLimit = 50;

  const shortDescription = words.slice(0, wordLimit).join(" ");
  const remainingDescription = words.slice(wordLimit).join(" ");
  const truncated = words.length > wordLimit;

  const finalDesc = showExtraInfo ? description : shortDescription;

  // Separate authors (simple ASCII check).
  const englishAuthors = authors.filter((a) => /^[\x00-\x7F\s]+$/.test(a));
  const japaneseAuthors = authors.filter((a) => /[^\x00-\x7F]/.test(a));

  // When the user presses Enter, search for the chapter whose extracted number matches.
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      const matchingIndex = chapters.findIndex((chapter) =>
        doesChapterMatch(chapter.name, searchTerm)
      );
      if (matchingIndex !== -1) {
        const element = document.getElementById(`chapter-${matchingIndex}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else {
        alert("Chapter not found.");
      }
    }
  };

  return (
    <div className="manga-detail-page relative w-full min-h-screen text-white overflow-hidden mt-8">
      {/* Background & Overlay */}

      <div className="main-container relative w-full">
        {/* Background & overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${proxyImageUrl})`, opacity: 0.6 }}
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[40px]" />
        </div>

        {/* Responsive flex layout */}
        <div className="relative z-10 w-full flex flex-col xl:flex-row items-stretch gap-3 min-h-[70vh] overflow-hidden px-4 py-10 ml-5">
          {/* Top: Left + Center columns container */}
          <div className="flex flex-col max-[640px]:items-center sm:flex-row w-full xl:w-[75%] gap-3">
            {/* Left Column: Manga Cover */}
            <div className="w-full sm:w-[30%] xl:w-[15%] flex-shrink-0 mt-10 max-[640px]:w-[129px] max-[640px]:h-[192px]">
              <img
                src={proxyImageUrl}
                alt={image.title}
                className="w-full h-auto rounded-md shadow-lg"
              />
            </div>

            {/* Center Column: Main Content */}
            <div className="w-full sm:w-[70%] xl:w-[75%] flex flex-col max-[640px]:items-center space-y-4 mt-10 ml-0 sm:ml-10">
              {/* Breadcrumbs */}
              <nav className="flex text-gray-300 gap-[3px] max-[640px]:hidden">
                <Link href="/">Home</Link>
                <span className="mx-2">•</span>
                <span>{image.title}</span>
              </nav>

              <span className="max-[640px]:relative max-[640px]:bottom-5 max-[640px]:flex max-[640px]:flex-col max-[640px]:items-center">
                {/* Title */}
                <h1 className="text-4xl font-bold mb-5 text-center sm:text-left">
                  {image.title}
                </h1>


                {/* Description & “+ More” */}
                <div className="max-[640px]:hidden inline-block pr-10">
                  {renderDescriptionAsParagraphs(description)}
                  {description.length > truncateLength && (
                    <button
                      onClick={() => setShowExtraInfo(!showExtraInfo)}
                      className="inline text-[#bb5052] cursor-pointer text-sm ml-1"
                    >
                      {showExtraInfo ? "– Less" : "+ More"}
                    </button>
                  )}
                </div>

                {/* Description for small screens */}
                <div className="max-[640px]:block hidden mt-4 px-4 text-center">
                  {renderDescriptionAsParagraphs(finalDesc)}
                  {truncated && (
                    <button
                      onClick={() => setShowExtraInfo(!showExtraInfo)}
                      className="inline text-[#bb5052] cursor-pointer text-sm ml-1"
                    >
                      {showExtraInfo ? "– Less" : "+ More"}
                    </button>
                  )}
                </div>
                {/* Extra Info when expanded (optional) */}
                {showExtraInfo && extra_info?.length > 0 && (
                  <div className="mt-4 space-y-2 max-w-prose text-gray-300 leading-relaxed">
                    {extra_info.map((info, idx) => (
                      <p key={idx}>{info}</p>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <button className="bg-[#BB5052] hover:bg-[#A04345] text-black px-7 py-2 rounded-full font-semibold w-full sm:w-auto">
                    <span className="font-bold mr-2">
                      <FontAwesomeIcon icon={faGlasses} />
                    </span>
                    <Link
                      href={`http://localhost:3000/read/${
                        chapters[0].url.split("/title/")[1]
                      }`}
                    >
                      Read now
                    </Link>
                  </button>
                  <button className="bg-white text-gray-800 px-7 py-2 rounded-full font-semibold hover:bg-gray-200 w-full sm:w-auto">
                    <span className="font-extrabold mr-2">
                      <FontAwesomeIcon icon={faPlus} />
                    </span>
                    <span>Add to List</span>
                  </button>
                </div>
              </span>
            </div>
          </div>

          {/* Right Column: Additional Details */}
          <div className="w-full xl:w-[25%] bg-white/10 rounded-md p-7 space-y-3 flex flex-col justify-center text-sm mr-5 mt-5 xl:mt-10 max-[640px]:w-[94%] max-[1280px]:w-[97%]">
            {englishAuthors.length > 0 && (
              <p>
                <strong className="font-bold">Authors (EN):</strong>{" "}
                {englishAuthors.join(", ")}
              </p>
            )}
            {japaneseAuthors.length > 0 && (
              <p>
                <strong className="font-bold">Authors (JP):</strong>{" "}
                {japaneseAuthors.join(", ")}
              </p>
            )}
            <p>
              <strong className="font-bold">Language:</strong> {languages}
            </p>
            <p>
              <strong className="font-bold">Status:</strong> {status}
            </p>

            <hr className="max-[1280px]:hidden mt-2 mb-2 border-gray-100" />
            <div className="flex items-center flex-wrap gap-2">
              <strong className="font-bold">Genres:</strong>
              {genres.map((genre, idx) => (
                <Link
                  href={`/manga/genre/${genre
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  key={idx}
                  className="px-3 py-1 rounded-full border border-white/30 text-white text-sm hover:text-[#D46A6C]"
                >
                  {genre}
                </Link>
              ))}
            </div>
            <hr className="max-[1280px]:hidden mt-2 mb-2 border-gray-100" />

            <p>
              <strong className="font-bold">Rating:</strong> {rating}
            </p>
            <p>
              <strong className="font-bold">Publishers:</strong>{" "}
              {publishers?.join(", ")}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Info Container */}
      <div className="additional-info-container bg-black p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Block: Chapters List */}

          <div className="md:w-[70%] p-4 rounded-md bg-[#191919]  text-gray-200 mt-21">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">
                  <FontAwesomeIcon icon={faFile} className="mr-2" />
                  Language:
                </span>
                <span className="ml-1">EN</span>
              </div>
              <div className="relative flex items-center w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Enter chapter number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="bg-[#2D2D2D] text-white placeholder-gray-400 px-3 py-1 pr-9 rounded-md w-full sm:w-64 outline-none"
                />
                <svg
                  className="w-4 h-4 text-gray-400 absolute right-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.386a1 1 0 01-1.414 1.415l-4.387-4.386zm-4.9.68a6 6 0 100-12 6 6 0 000 12z" />
                </svg>
              </div>
            </div>

            {/* Chapters List with fixed height */}
            <div className="bg-[#252626] rounded-md max-h-[80vh] overflow-y-auto">
              {chapters &&
                chapters.map((chapter, idx) => {
                  const extracted = getChapterNumber(chapter.name);
                  const parts = getChapterParts(extracted);
                  // If a secondary part exists, we match only on that; otherwise on the primary.
                  const chapterMatch =
                    parts.secondary !== null ? parts.secondary : parts.primary;
                  const isHighlighted = doesChapterMatch(
                    chapter.name,
                    searchTerm
                  );

                  return (
                    <div
                      key={idx}
                      id={`chapter-${idx}`}
                      className="flex items-center justify-between px-4 py-2 border-b last:border-none hover:text-[#bb5052]"
                      style={{
                        backgroundColor: isHighlighted
                          ? "#bb5052"
                          : "transparent",
                        borderColor: "#3A3A3A",
                      }}
                    >
                      {/* Left side: Icon + Chapter Name */}
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          style={{ color: isHighlighted ? "white" : "inherit" }}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm0 2l4 4h-4V4z" />
                        </svg>
                        <span
                          className="text-sm sm:text-base"
                          style={{ color: isHighlighted ? "white" : "inherit" }}
                        >
                          {chapter.name}
                        </span>
                      </div>
                      {/* Right side: "Read" button */}
                      <Link
                        href={`http://localhost:3000/read/${
                          chapter.url.split("/title/")[1]
                        }`}
                        rel="noopener noreferrer"
                        className="px-4 py-1 rounded-md text-sm"
                        style={{
                          backgroundColor: "#3A3A3A",
                          color: isHighlighted ? "white" : "inherit",
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faGlasses}
                          className="mr-2"
                          style={{ color: isHighlighted ? "white" : "inherit" }}
                        />
                        Read
                      </Link>
                    </div>
                  );
                })}
            </div>

            {/* Recommended for You Section */}
            <div className="recommended_for_you mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-[#bb5052]">
                  Recommended for you
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mangaDetail.recommended?.map((anime, idx) => (
                  <div
                    key={idx}
                    className="relative w-full h-80 rounded-md overflow-hidden group"
                  >
                    {/* Top 75% (Image Section) */}
                    <div className="relative w-full h-[75%]">
                      <img
                        src={anime.image_src}
                        alt={anime.manga_title}
                        className="absolute inset-0 w-full h-full object-cover 
                       transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Gradient overlay */}
                      <div
                        className="absolute inset-x-0 bottom-0 h-[70%] 
                          bg-gradient-to-t from-[#191919] to-transparent"
                      />
                      {/* "EN" Badge at Top Left */}
                      <span
                        className="absolute top-2 left-2 bg-green-400 
                           text-black px-2 py-1 text-xs font-bold rounded"
                      >
                        EN
                      </span>

                      {/* On-Hover Overlay */}
                      <div
                        className="absolute inset-0 w-full h-full z-10 bg-[#191919] 
                          opacity-0 group-hover:opacity-100 
                          transition-all duration-300 flex flex-col 
                          transform translate-y-2 group-hover:translate-y-0"
                      >
                        <div className="p-3 w-full h-full flex flex-col">
                          {/* Top portion (70% height) for details */}
                          <div className="mb-2" style={{ height: "70%" }}>
                            {/* Title */}
                            <div className="text-sm font-semibold mb-1 line-clamp-3">
                              {anime.manga_title}
                            </div>
                            {/* Rating */}
                            <div className="flex items-center text-sm mb-1">
                              <FontAwesomeIcon icon={faStar} className="mr-2" />
                              {anime.rating}
                            </div>
                            {/* Language */}
                            <div className="flex items-center text-sm mb-1">
                              <FontAwesomeIcon
                                icon={faGlobe}
                                className="mr-2"
                              />
                              EN
                            </div>
                            {/* Chapter */}
                            <div className="flex items-center text-sm">
                              <FontAwesomeIcon
                                icon={faFileAlt}
                                className="mr-2"
                              />
                              {anime.chapter}
                            </div>
                          </div>

                          {/* Bottom portion (30% height) for buttons */}
                          <div
                            className="flex flex-col justify-between"
                            style={{ height: "30%" }}
                          >
                            {/* Read Now Button (Changed to a button) */}
                            <div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // For example, if you want to navigate:
                                  // router.push("/"); // or window.location.href = "/";
                                }}
                                className="bg-[#bb5052] text-black text-sm py-1 px-2 
                               rounded w-full transition-transform 
                               duration-300 hover:scale-105 
                               flex items-center justify-center"
                              >
                                <Link
                                  href={`/read/${encodeURIComponent(
                                    anime.manga_title
                                  )}`}
                                >
                                  <FontAwesomeIcon
                                    icon={faGlasses}
                                    className="mr-2"
                                  />
                                  Read Now
                                </Link>
                              </button>
                            </div>
                            {/* Info Button */}
                            <div>
                              <button
                                onClick={(e) => e.stopPropagation()}
                                className="bg-[rgba(255,255,255,0.2)] text-white text-sm 
                               py-1 px-2 rounded w-full transition-transform 
                               duration-300 hover:scale-105 
                               flex items-center justify-center"
                              >
                                <Link
                                  href={`http://localhost:3000/mangadetailpage/${encodeURIComponent(
                                    anime.manga_title
                                  )}`}
                                >
                                  <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    className="mr-2"
                                  />
                                  Info
                                </Link>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* End On-Hover Overlay */}
                    </div>

                    {/* Bottom 25% - Title & Genres */}
                    <div className="relative w-full h-[25%] bg-[#191919] px-2 py-2 text-white">
                      {/* Title */}
                      <h3 className="absolute left-3 top-3 font-semibold text-base leading-tight line-clamp-2">
                        {anime.manga_title}
                      </h3>

                      {/* Genres row */}
                      <div
                        className="absolute bottom-2 left-3 text-xs text-gray-300 mt-1 
                          flex items-center flex-wrap gap-1"
                      >
                        {anime.genres?.map((genre, i) => (
                          <Link
                            key={i}
                            href={`manga${genre.url}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-[#bb5052]"
                          >
                            {genre.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Block */}
          <div className="md:w-[35%] p-4 rounded-md text-gray-200">
            <MostViewed mostViewed={mangaDetail.most_viewed} />
          </div>
        </div>
      </div>
    </div>
  );
}
