"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const MangaRecommendedCard = ({ manga }) => {
  return (
    <Link
      href={`/mangadetailpage${manga.url}`}
      className="relative w-[93%] h-85 rounded-md overflow-hidden group"
    >
      {/* Top 75% - Cover Image */}
      <div className="relative w-full h-[75%]">
        <Image
          src={manga.cover}
          alt={manga.title}
          fill
          quality={85}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#191919] to-transparent" />
      </div>

      {/* Bottom 25% - Title & Genres */}
      <div className="relative w-full h-[25%] bg-[#191919] px-2 py-2 text-white flex flex-col items-center justify-around text-center">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 w-full">
          {manga.title}
        </h3>
        <div className="mt-1 text-xs text-gray-300 flex flex-nowrap gap-1 overflow-hidden whitespace-nowrap">
          {manga.genres?.map((genre, idx) => {
            const isHiddenOnSmall = idx > 1; // Hide if index > 1 (i.e., 3rd genre) on small screens
            const isHiddenOnLarge = idx > 2; // Hide if index > 2 (i.e., 4th genre or more)

            return (
              <span
                key={idx}
                className={`bg-white/10 px-2 py-0.5 rounded-md truncate max-w-[100px] ${
                  isHiddenOnSmall ? "max-[1300px]:hidden" : ""
                } ${isHiddenOnLarge ? "hidden" : ""}`}
                title={genre}
              >
                {genre}
              </span>
            );
          })}
        </div>
      </div>
    </Link>
  );
};

const PersonalRecommendations = ({ mangaList = [] }) => {
  if (!mangaList.length) return null;

  return (
    <div className="recommended_for_you">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[#bb5052] mb-4 ml-5">
          Personal Recommendations
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-5 pt-0">
        {mangaList.map((manga, idx) => (
          <MangaRecommendedCard key={idx} manga={manga} />
        ))}
      </div>
    </div>
  );
};

export default PersonalRecommendations;
