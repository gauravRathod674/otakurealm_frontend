"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";

const PersonalRecommendationList = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="new-section-list p-4 rounded-md mt-7">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[#BB5052] mb-4 max-[387px]:text-xl  max-[333px]:text-base">
          Personal Recommendations
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-7">
        {recommendations.map((anime, idx) => (
          <Link
            key={idx}
            href={`/animedetailpage${anime.url}`}
            className="relative w-full h-85 rounded-md overflow-hidden group"
          >
            {/* Top 75%: Image + gradient + badges */}
            <div className="relative w-full h-[75%]">
              <img
                src={anime.cover}
                alt={anime.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#191919] to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center flex-wrap gap-[2px] z-10 text-white">
                {anime.subtitle_episodes && (
                  <span className="px-1 py-0.5 bg-green-300 text-black border-l border-white/10 flex items-center rounded-l-md text-xs font-bold">
                    <FontAwesomeIcon icon={faClosedCaptioning} className="mr-1" />
                    {anime.subtitle_episodes}
                  </span>
                )}
                {anime.dubbing_episodes && (
                  <span className="px-1 py-0.5 bg-pink-300 text-black border-l border-white/10 flex items-center gap-1 text-xs font-bold">
                    <FontAwesomeIcon icon={faMicrophone} className="mr-1" />
                    {anime.dubbing_episodes}
                  </span>
                )}
                {anime.total_episodes && (
                  <span className="px-1 py-0.5 bg-[#ffffff40] text-white text-xs font-semibold rounded-r-md">
                    {anime.total_episodes}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom 25%: Title + type/runtime */}
            <div className="relative w-full h-[25%] bg-[#191919] px-2 py-2 text-white">
              <h3 className="absolute left-3 top-3 font-semibold leading-tight line-clamp-2 text-base">
                {anime.title}
              </h3>
              <div className="absolute bottom-2 left-3 text-xs text-gray-300 mt-1 flex items-center">
                <span>{anime.type}</span>
                <span className="mx-2 text-base">•</span>
                <span>{anime.runtime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PersonalRecommendationList;
