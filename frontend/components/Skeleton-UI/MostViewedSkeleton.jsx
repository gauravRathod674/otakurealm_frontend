"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";

/**
 * Skeleton loader for the MostViewed component.
 */
export default function MostViewedSkeleton() {
  return (
    <div className="most-viewed">
      {/* Title Skeleton */}
      <div
        className="h-6 rounded mb-8 animate-pulse bg-[#2b2b2b] w-1/4"
      ></div>

      <div className="bg-[#191919] rounded-md p-3 animate-pulse">
        {/* Tabs row Skeleton */}
        <div className="flex mb-4">
          <div
            className={`w-1/3 h-8 bg-[#3a3a3a] mr-0.5 rounded-md animate-pulse`}
          ></div>
          <div
            className={`w-1/3 h-8 bg-[#3a3a3a] ml-0.5 mr-0.5 rounded-md  animate-pulse`}
          ></div>
          <div
            className={`w-1/3 h-8 bg-[#3a3a3a] ml-0.5 rounded-md  animate-pulse`}
          ></div>
        </div>

        {/* List of items Skeleton */}
        <div className="flex flex-col pl-4 pr-4 pt-4">
          {[...Array(10)].map((_, index) => (
            <div key={index}>
              {/* Single item row Skeleton */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-4">
                {/* Rank + green bar for top 3 */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-8 h-8 bg-[#3a3a3a] rounded-full mb-2 animate-pulse"></div>
                  <div
                    className="w-8 h-1 bg-[#303030] mt-1 animate-pulse"
                    style={{ visibility: index < 3 ? "visible" : "hidden" }}
                  />
                </div>

                {/* Poster + Title/Badges Skeleton */}
                <div className="flex-1 flex items-center">
                  {/* Poster */}
                  <div className="w-16 h-24 bg-[#3a3a3a] rounded-md animate-pulse"></div>

                  <div className="flex flex-col justify-center gap-1 ml-5">
                    {/* Title Skeleton */}
                    <div className="w-48 h-4 bg-[#3a3a3a] rounded animate-pulse mb-1"></div>
                    {/* Badges row Skeleton */}
                    <div className="flex items-center gap-1 text-sm">
                      <div className="w-16 h-4 bg-[#3a3a3a] rounded-md animate-pulse"></div>
                      <div className="w-16 h-4 bg-[#3a3a3a] rounded-md animate-pulse"></div>
                      <div className="w-12 h-4 bg-[#3a3a3a] rounded-md animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horizontal rule except for last item */}
              {index < 9 && <hr className="border-t border-gray-600" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
