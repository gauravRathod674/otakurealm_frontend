"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons"; // or any other icon
import Image from "next/image";
import Link from "next/link";

/**
 * Props:
 *   mostViewed = {
 *     today: [ { image_src, manga_title, genres, view_count, chapter, chapter_link }, ... ],
 *     week: [ ... ],
 *     month: [ ... ]
 *   }
 *
 * Example usage:
 *   <MostViewed mostViewed={homepageData.most_viewed} />
 */
export default function MostViewed({ mostViewed }) {
  // If data is not present or is empty, return null
  if (!mostViewed || Object.keys(mostViewed).length === 0) {
    return null;
  }

  // Convert object keys (e.g. "today", "week", "month") into a categories array
  const categories = Object.keys(mostViewed);
  const [activeIndex, setActiveIndex] = useState(0);

  // Get the data for the active category
  const currentData = mostViewed[categories[activeIndex]] || [];

  return (
    <div className="most-viewed">
      <h2 className="text-2xl font-bold mb-6 mt-4 text-[#BB5052]">
        Most Viewed
      </h2>

      <div className="bg-[#191919] rounded-md">
        {/* Tabs row */}
        <div className="flex">
          {categories.map((cat, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={cat}
                onClick={() => setActiveIndex(idx)}
                className={`px-4 py-3 w-1/3 font-semibold transition-colors
                  ${
                    isActive
                      ? "bg-[#BB5052] text-black"
                      : "bg-[#353535] text-gray-200 hover:text-[#bb5052]"
                  }
                `}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            );
          })}
        </div>

        {/* List of items */}
        <div className="flex flex-col px-4 pt-4">
          {currentData.map((manga, index) => {
            // Compute the rank based on the index (1, 2, 3, ...)
            const rankNum = index + 1;

            return (
              <div key={index}>
                <div className="flex items-center gap-3 py-4">
                  {/* Rank + bar for top 3 */}
                  <div className="flex flex-col items-center w-8 shrink-0">
                    <span className="text-2xl font-bold text-gray-100 leading-none">
                      {rankNum}
                    </span>
                    {rankNum <= 3 && (
                      <div className="w-8 h-1 bg-[#BB5052] mt-1" />
                    )}
                  </div>

                  {/* Poster */}
                  {manga.image_src && (
                    <div className="shrink-0">
                      <Image
                        src={manga.image_src}
                        alt={manga.manga_title}
                        width={64}
                        height={96}
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}

                  {/* Info (title, language+genres, chapter) */}
                  <div className="flex flex-col">
                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-semibold mb-1 line-clamp-2 hover:text-[#bb5052]">
                      <Link href={`/read/${encodeURIComponent(manga.manga_title)}`}>
                        {manga.manga_title}
                      </Link>
                    </h3>

                    {/* Language + Genres */}
                    <p className="text-sm text-gray-300">
                      EN
                      {manga.genres && manga.genres.length > 0 && (
                        <>
                          <span className="mx-2">•</span>
                          {manga.genres.map((genre, i) => (
                            <span key={i}>
                              <Link
                                href={`manga${genre.url}`}
                                className="hover:text-[#bb5052]"
                              >
                                {genre.name}
                              </Link>
                              {/* Add comma except for the last genre */}
                              {i < manga.genres.length - 1 && ", "}
                            </span>
                          ))}
                        </>
                      )}
                    </p>

                    {/* Chapter */}
                    {/* {manga.chapter && (
                      <p className="text-sm text-[#bb5052] flex items-center gap-1 mt-1">
                        <FontAwesomeIcon icon={faFileAlt} />
                        <Link href={manga.chapter_link}>{manga.chapter}</Link>
                      </p>
                    )} */}
                  </div>
                </div>

                {/* Divider except for last item */}
                {index < currentData.length - 1 && (
                  <hr className="border-t border-gray-600" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
