"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";

/**
 * Props:
 *   mostViewed = [
 *     {
 *       category: "Today",
 *       data: [
 *         { rank, image, title, url, subtitles, dubbing, episodes },
 *         ...
 *       ],
 *     },
 *     {
 *       category: "Week",
 *       data: [...],
 *     },
 *     {
 *       category: "Month",
 *       data: [...],
 *     },
 *   ]
 *
 * Example usage:
 *   <MostViewed mostViewed={homepageData.most_viewed} />
 */

export default function MostViewed({ mostViewed }) {
  // We'll track which tab is active by index (0=Today, 1=Week, 2=Month, etc.)
  const [activeIndex, setActiveIndex] = useState(0);

  if (!mostViewed || mostViewed.length === 0) {
    return null; // No data
  }

  // The array of categories might be something like ["Today", "Week", "Month"]
  // We'll read them from mostViewed[].category
  const categories = mostViewed.map((item) => item.category);

  // Get the data for the active category
  const currentData = mostViewed[activeIndex]?.data || [];

  return (
    <div className="most-viewed">
      <h2 className="text-2xl font-bold mb-6 mt-4 text-[#BB5052]">
        Most Viewed
      </h2>
      <div className="bg-[#191919] rounded-md">
        {/* Heading */}

        {/* Tabs row */}
        <div className="flex">
          {categories.map((cat, idx) => {
            // "New On Kaido" => "New On OtakuRealm" example if needed
            // But here we just display them as is
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
                {cat}
              </button>
            );
          })}
        </div>

        {/* List of items */}
        <div className="flex flex-col pl-4 pr-4 pt-4 ">
          {currentData.map((anime, index) => {
            const rankNum = parseInt(anime.rank, 10) || 0;
            return (
              <div key={index}>
                {/* Single item row */}
                <div className="flex flex-row items-start sm:items-center max-[640px]:items-center gap-3 py-4">
                {/* Rank + green bar for top 3 */}
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-100 leading-none max-[640px]:self-center">
                      {anime.rank}
                    </span>
                    {rankNum > 0 && rankNum <= 3 && (
                      <div className="w-8 h-1 bg-[#BB5052] mt-1" />
                    )}
                  </div>

                  {/* Poster + Title/Badges */}
                  <div className="flex-1 flex items-center">
                    {/* Poster (hidden on very small screens if you like) */}
                    {anime.image && (
                      <Image
                        src={anime.image}
                        alt={anime.title}
                        width={64} // 16 * 4 = 64px
                        height={96} // 24 * 4 = 96px
                        className="rounded-md object-cover"
                      />
                    )}

                    <div className="flex flex-col justify-center gap-1 ml-5">
                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-semibold mb-1 line-clamp-2 hover:text-[#bb5052]">
                        <Link href={`animedetailpage${anime.url}`}>
                          {anime.title}
                        </Link>
                      </h3>
                      {/* Badges row */}
                      <div className="flex items-center gap-1 text-sm">
                        {anime.subtitles && (
                          <span className="bg-green-300 text-black px-2 py-1 text-xs rounded-l-md flex items-center gap-1 font-bold">
                            <FontAwesomeIcon icon={faClosedCaptioning} />
                            {anime.subtitles}
                          </span>
                        )}
                        {anime.dubbing && (
                          <span className="bg-pink-300 text-black px-2 py-1 text-xs flex items-center gap-1 font-bold">
                            <FontAwesomeIcon icon={faMicrophone} />
                            {anime.dubbing}
                          </span>
                        )}
                        {anime.episodes && (
                          <span className="bg-[#ffffff40] text-white px-2 py-1 text-xs rounded-r-md font-semibold">
                            {anime.episodes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Horizontal rule except for last item */}
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
