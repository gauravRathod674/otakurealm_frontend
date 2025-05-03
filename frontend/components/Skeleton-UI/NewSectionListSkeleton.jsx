"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGreaterThan } from "@fortawesome/free-solid-svg-icons";

/**
 * Skeleton loader for the NewSectionList component.
 */
export default function NewSectionListSkeleton() {
  return (
    <div className="new-section-list p-4 rounded-md animate-pulse">
      {/* Skeleton for Section Title and "View More" Link */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="h-6 bg-[#2b2b2b] rounded w-1/4 mb-4 animate-pulse"
          style={{ width: "120px", backgroundColor: "#2b2b2b" }}
        ></div>
        <div
          className="h-6 bg-[#2b2b2b] w-24 rounded mb-4 animate-pulse"
          style={{ width: "90px", backgroundColor: "#2b2b2b" }}
        ></div>
      </div>

      {/* Skeleton for Anime Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(12)].map((_, idx) => (
          <div
            key={idx}
            className="relative w-full h-80 rounded-md overflow-hidden group animate-pulse"
          >
            {/* Skeleton for Image + Gradient + Badges */}
            <div className="relative w-full h-[75%] bg-[#2b2b2b]"></div>
            <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#191919] to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 flex items-center flex-wrap gap-[2px] z-10 text-white">
              <div className="px-1 py-0.5 bg-[#2b2b2b] text-black border-l border-white/10 flex items-center rounded-l-md text-xs font-bold w-16 h-4"></div>
              <div className="px-1 py-0.5 bg-[#2b2b2b] text-black border-l border-white/10 flex items-center gap-1 text-xs font-bold w-16 h-4"></div>
              <div className="px-1 py-0.5 bg-[#2b2b2b] text-white text-xs font-semibold rounded-r-md w-12 h-4"></div>
            </div>

            {/* Skeleton for Title + Type/Runtime */}
            <div className="relative w-full h-[25%] bg-[#191919] px-2 py-2 text-white">
              <div className="absolute left-3 top-3 font-semibold text-sm leading-tight w-24 h-4 bg-[#2b2b2b] rounded"></div>
              <div className="absolute bottom-2 left-3 text-xs text-gray-300 mt-1 flex items-center">
                <div className="w-5 h-4 bg-[#2b2b2b] rounded"></div>
                <span className="w-2 h-4 bg-[#2b2b2b] rounded"></span>
                <div className="w-5 h-4 bg-[#2b2b2b] rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
