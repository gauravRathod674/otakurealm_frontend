"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
  faGreaterThan,
} from "@fortawesome/free-solid-svg-icons";

const NewSectionList = ({ sectionData }) => {
  // animeData is an array; if its first item contains "view_more", remove it
  const animeList = sectionData.anime || [];
  let viewMoreLink = null;
  let items = animeList;
  if (animeList.length > 0 && animeList[0].view_more) {
    viewMoreLink = animeList[0].view_more;
    items = animeList.slice(1);
  }

  return (
    <div className="new-section-list p-4 rounded-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[#BB5052] mb-4 max-[420px]:text-lg">
          {sectionData.section.toLowerCase() === "new on kaido"
            ? "New On OtakuRealm"
            : sectionData.section}{" "}
        </h2>
        {viewMoreLink && (
          <Link
            href={viewMoreLink}
            className="text-lg text-gray-300 hover:underline mb-4 hover:text-[#bb5052] max-[420px]:text-lg"
          >
            View more{" "}
            <FontAwesomeIcon icon={faGreaterThan} className="text-sm ml-1" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((anime, idx) => (
          <Link
            key={idx}
            href={`/animedetailpage${anime.url}`}
            className="relative w-full h-80 rounded-md overflow-hidden group"
          >
            {/* Top 75%: Image + gradient + badges */}
            <div className="relative w-full h-[75%]">
              <img
                src={anime.poster}
                alt={anime.anime_title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#191919] to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center flex-wrap gap-[2px] z-10 text-white">
                {anime.subtitle && (
                  <span className="px-1 py-0.5 bg-green-300 text-black border-l border-white/10 flex items-center rounded-l-md text-xs font-bold">
                    <FontAwesomeIcon
                      icon={faClosedCaptioning}
                      className="mr-1"
                    />
                    {anime.subtitle}
                  </span>
                )}
                {anime.dubbing && (
                  <span className="px-1 py-0.5 bg-pink-300 text-black border-l border-white/10 flex items-center gap-1 text-xs font-bold">
                    <FontAwesomeIcon icon={faMicrophone} className="mr-1" />
                    {anime.dubbing}
                  </span>
                )}
                {anime.episode && (
                  <span className="px-1 py-0.5 bg-[#ffffff40] text-white text-xs font-semibold rounded-r-md">
                    {anime.episode}
                  </span>
                )}
              </div>
            </div>
            {/* Bottom 25%: Title + type/runtime */}
            <div className="relative w-full h-[25%] bg-[#191919] px-2 py-2 text-white">
              <h3 className="absolute left-3 top-3 font-semibold text-sm leading-tight line-clamp-2">
                {anime.anime_title}
              </h3>
              <div className="absolute bottom-2 left-3 text-xs text-gray-300 mt-1 flex items-center">
                <span>{anime.type}</span>
                <span className="mx-2 text-base">•</span>
                <span>{anime.run_time}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NewSectionList;
