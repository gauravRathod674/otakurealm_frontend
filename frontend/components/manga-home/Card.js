"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faGlobe,
  faFileAlt,
  faGlasses,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

// A generalized card component for manga/anime items.
const Card = ({ item }) => {
  const router = useRouter();
  // Determine the navigation URL:
  // If a chapter_link exists, use it (e.g., for "Completed" section),
  // otherwise if a url exists, navigate using the detail page route.
  const navigateUrl = item.chapter_link
    ? item.chapter_link
    : item.url
    ? `/animedetailpage${item.url}`
    : "#";

  const handleCardClick = () => {
    router.push(navigateUrl);
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative w-full h-80 rounded-md overflow-hidden group cursor-pointer"
    >
      {/* Top 75% - Image Section */}
      <div className="relative w-full h-[75%]">
        {/* Poster Image */}

        <Image
          src={item.image_src}
          alt={item.manga_title}
          fill
          quality={85}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Gradient at the bottom of the image */}
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#191919] to-transparent" />

        {/* "EN" Badge at Top Left */}
        <span className="absolute top-2 left-2 bg-green-400 text-black px-2 py-1 text-xs font-bold rounded">
          EN
        </span>

        {/* On-Hover Overlay */}
        <div className="absolute inset-0 w-full h-full z-10 bg-[#191919] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col transform translate-y-2 group-hover:translate-y-0">
          <div className="p-3 w-full h-full flex flex-col">
            {/* Top portion (70% height) for details */}
            <div className="mb-2" style={{ height: "70%" }}>
              {/* Title */}
              <div className="text-sm font-semibold mb-1 line-clamp-3">
                {item.manga_title}
              </div>
              {/* Rating */}
              <div className="flex items-center text-sm mb-1">
                <FontAwesomeIcon icon={faStar} className="mr-2" />
                {item.rating}
              </div>
              {/* Language */}
              <div className="flex items-center text-sm mb-1">
                <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                EN
              </div>
              {/* Chapter */}
              <div className="flex items-center text-sm">
                <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                {item.chapter}
              </div>
            </div>

            {/* Bottom portion (30% height) for buttons */}
            <div
              className="flex flex-col justify-between"
              style={{ height: "30%" }}
            >
              {/* Read Now Button */}
              <div>
                <Link
                  href={`/read/${encodeURIComponent(item.manga_title)}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="bg-[#bb5052] text-black text-sm py-1 px-2 rounded w-full transition-transform duration-300 hover:scale-105 flex items-center justify-center">
                    <FontAwesomeIcon icon={faGlasses} className="mr-2" />
                    Read Now
                  </span>
                </Link>
              </div>
              {/* Info Button */}
              <div>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[rgba(255,255,255,0.2)] text-white text-sm py-1 px-2 rounded w-full transition-transform duration-300 hover:scale-105 flex items-center justify-center"
                >
                  <Link
                    href={`mangadetailpage/${encodeURIComponent(
                      item.manga_title
                    )}`}
                  >
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
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
      <div className="relative w-full h-[25%] bg-[#191919] px-2 py-2 text-white flex flex-col items-center justify-around text-center">
        {/* Title */}
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 w-full">
          {item.manga_title}
        </h3>

        {/* Genres row */}
        <div className="mt-1 text-xs text-gray-300 flex flex-nowrap gap-1 overflow-hidden whitespace-nowrap">
          {item.genres?.map((genre, i) => {
            const isHiddenOnSmall = i > 1; // Hide 3rd+ on small screens
            const isHiddenOnLarge = i > 2; // Optionally limit to 5 max on larger screens

            return (
              <Link
                key={i}
                href={`manga${genre.url}`}
                onClick={(e) => e.stopPropagation()}
              >
                <span
                  className={`bg-white/10 px-2 py-0.5 rounded-md truncate max-w-[100px] hover:text-[#bb5052] ${
                    isHiddenOnSmall ? "max-[1300px]:hidden" : ""
                  } ${isHiddenOnLarge ? "hidden" : ""}`}
                >
                  {genre.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Card;
