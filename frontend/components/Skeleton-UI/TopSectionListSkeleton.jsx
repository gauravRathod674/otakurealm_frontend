"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClosedCaptioning, faMicrophone } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";

/**
 * Skeleton loader for the TopSectionList component.
 */
export default function TopSectionListSkeleton() {
  return (
    <div className="bg-[#191919] p-4 rounded-md text-white">
      {/* Skeleton for Section Title */}
      <div
        className="h-6 bg-[#2b2b2b] rounded w-1/4 mb-4 mx-auto animate-pulse"
        style={{ width: "120px" }}
      ></div>

      {/* Skeleton for Section Divider */}
      <div className="border-t border-[#303030] w-[90%] mx-4 animate-pulse" style={{ height: "1px" }}></div>

      {/* Skeleton for Anime Items */}
      <div className="flex flex-col space-y-4">
        {[...Array(5)].map((_, idx) => (
          <div
            key={idx}
            className="flex p-3 animate-pulse"
            style={{ minHeight: "80px", backgroundColor: "#191919" }}
          >
            {/* Left Part (Thumbnail) Skeleton */}
            <div className="w-[20%] flex-shrink-0">
              <div className="relative w-full h-[120px] mr-4 bg-[#2b2b2b] rounded-md"></div>
            </div>

            {/* Middle Part: Title + Stats Skeleton */}
            <div className="w-[80%] px-3 flex flex-col justify-center">
              {/* Anime Title Skeleton */}
              <div className="h-4 w-[70%] bg-[#2b2b2b] rounded mb-2"></div>

              {/* Badges Row Skeleton */}
              <div className="flex items-center flex-wrap gap-[2px] text-xs font-bold">
                <div className="px-2 py-1 bg-[#2b2b2b] text-black rounded-l-md flex items-center w-24 h-4"></div>
                <div className="px-2 py-1 bg-[#2b2b2b] text-black flex items-center w-20 h-4"></div>
                <div className="px-2 py-1 bg-[#2b2b2b] text-white rounded-r-md w-16 h-4"></div>
                <div className="mx-2 text-gray-300 h-4 w-4 bg-[#2b2b2b]"></div>
                <div className="text-white h-4 w-16 bg-[#2b2b2b]"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton for “View more” link */}
      <div className="mt-4">
        <div className="inline-block w-80 h-10 bg-[#2b2b2b] rounded-sm animate-pulse"></div>
      </div>
    </div>
  );
}
