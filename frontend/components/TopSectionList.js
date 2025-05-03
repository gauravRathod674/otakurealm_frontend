"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faGreaterThan,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";

/**
 * Expects data shaped like:
 * {
 *   section: "Top Airing",
 *   anime: [
 *     {
 *       image_url: "https://...",
 *       anime_title: "Solo Leveling Season 2",
 *       subtitle: "11",      // e.g. CC count
 *       dubbing: "9",        // e.g. dub count
 *       episode: "13",       // e.g. total episodes
 *       type: "TV"
 *     },
 *     ...
 *     { "view_more": "/top-airing" }
 *   ]
 * }
 */
export default function TopSectionList({ sectionData }) {
  if (!sectionData) return null;

  const { section, anime } = sectionData;

  // The last item often has `view_more`. Extract that link, if present:
  let viewMoreUrl = "";
  let animeList = [...anime];
  const lastItem = animeList[animeList.length - 1];
  if (lastItem && lastItem.view_more) {
    viewMoreUrl = lastItem.view_more;
    animeList.pop(); // remove the view_more item so we don’t render it as anime
  }

  return (
    <div className="bg-[#191919] p-4 rounded-md text-white">
      {/* Section Title */}
      <h2 className="text-xl font-bold mb-4 text-[#BB5052] text-center">
        {section}
      </h2>

      <hr className="border-t border-[#bb5052] w-[90%] mx-4" />

      {/* Anime Items */}
      <div className="flex flex-col space-y-4">
        {animeList.map((item, idx) => (
          <div
            key={idx}
            className="flex p-3"
            style={{ minHeight: "80px", backgroundColor: "#191919" }}
          >
            {/* Left Part (Thumbnail) */}
            <div className="w-[20%] flex-shrink-0">
              <div className="relative w-full h-[120px] mr-4">
                <Image
                  src={item.image_url}
                  alt={item.anime_title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            </div>

            {/* Middle Part: Title + Stats */}
            <div className="w-[80%] px-3 flex flex-col justify-center">
              <Link href={`/animedetailpage${item.url}`}>
                {/* Anime Title */}
                <h3 className="text-white text-base font-semibold mb-2 hover:text-[#BB5052] line-clamp-2">
                  {item.anime_title}
                </h3>

                {/* Badges Row (subtitle/dubbing/episode/type) */}
                <div className="flex items-center flex-wrap gap-[2px] text-xs font-bold">
                  {/* Subtitle */}
                  {item.subtitle && (
                    <span className="px-2 py-1 bg-green-300 text-black rounded-l-md flex items-center">
                      <FontAwesomeIcon
                        icon={faClosedCaptioning}
                        className="mr-1"
                      />
                      {item.subtitle}
                    </span>
                  )}
                  {/* Dubbing */}
                  {item.dubbing && (
                    <span className="px-2 py-1 bg-pink-300 text-black flex items-center">
                      <FontAwesomeIcon icon={faMicrophone} className="mr-1" />
                      {item.dubbing}
                    </span>
                  )}
                  {/* Episode */}
                  {item.episode && (
                    <span className="px-2 py-1 bg-[#ffffff50] text-white rounded-r-md">
                      {item.episode}
                    </span>
                  )}
                  {/* Dot + Type */}
                  {item.type && (
                    <>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-white">{item.type}</span>
                    </>
                  )}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {viewMoreUrl && (
        <div className="mt-4 flex justify-center">
          <Link
            href={viewMoreUrl}
            className="
        inline-block bg-[#BB5052] text-black px-4 py-2 font-semibold hover:bg-[#A04345]
        w-80 sm:w-72 md:w-64
        max-[639px]:w-full max-[639px]:mx-auto text-center rounded-sm
      "
          >
            View more <FontAwesomeIcon icon={faGreaterThan} className="ml-2" />
          </Link>
        </div>
      )}
    </div>
  );
}
