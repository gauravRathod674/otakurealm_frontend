"use client";

import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClosedCaptioning, faMicrophone } from "@fortawesome/free-solid-svg-icons";

// A Card component customized for recommended anime
const RecommendedCard = ({ anime }) => {
  return (
    <Link
      href={`/animedetailpage${anime.url}`}
      className="relative w-full h-80 rounded-md overflow-hidden group"
    >
      {/* Top 75% - Image and badges */}
      <div className="relative w-full h-[75%]">
        {/* Anime poster */}
        <img
          src={anime.poster}
          alt={anime.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Gradient overlay at the bottom */}
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#191919] to-transparent" />

        {/* Badges (Subtitles, Dubbing, Episodes) */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center flex-wrap gap-[2px] z-10 text-white">
          {anime.subtitles && (
            <span className="px-1 py-0.5 bg-green-300 text-black border-l border-white/10 flex items-center rounded-l-md text-xs font-bold">
              <FontAwesomeIcon icon={faClosedCaptioning} className="mr-1" />
              {anime.subtitles}
            </span>
          )}
          {anime.dubbing && (
            <span className="px-1 py-0.5 bg-pink-300 text-black border-l border-white/10 flex items-center gap-1 text-xs font-bold">
              <FontAwesomeIcon icon={faMicrophone} className="mr-1" />
              {anime.dubbing}
            </span>
          )}
          {anime.episodes && (
            <span className="bg-[#ffffff40] text-white text-xs font-semibold rounded-r-md px-2 py-0.5">
              {anime.episodes}
            </span>
          )}
        </div>
      </div>

      {/* Bottom 25% - Title and Type/Runtime */}
      <div className="relative w-full h-[25%] bg-[#191919] px-2 py-2 text-white">
        <h3 className="absolute left-3 top-3 font-semibold text-sm leading-tight line-clamp-2">
          {anime.title}
        </h3>
        <div className="absolute bottom-2 left-3 text-xs text-gray-300 flex items-center">
          <span>{anime.type}</span>
          <span className="mx-2 text-base">•</span>
          <span>{anime.runtime}</span>
        </div>
      </div>
    </Link>
  );
};

// RecommendedForYou wraps the recommended anime cards in a grid layout
const RecommendedForYou = ({ animeList = [] }) => {
  return (
    <div className="recommended_for_you p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[#bb5052] mt-10 mb-4">
          Recommended for you
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {animeList.map((anime, idx) => (
          <RecommendedCard key={idx} anime={anime} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedForYou;
