"use client";

export default function GenresListSkeleton() {
  return (
    <div className="genres my-8">
      {/* Skeleton for Genres Title */}
      <div
        className="h-6 rounded mb-8 animate-pulse bg-[#2b2b2b] w-1/4"
      ></div>
      
      <div className="bg-[#191919] p-4 rounded-md">
        {/* Skeleton for Genres Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
          {[...Array(24)].map((_, index) => (
            <div
              key={index}
              className="h-6 bg-[#2b2b2b] rounded w-24 animate-pulse"
            ></div>
          ))}
        </div>

        {/* Skeleton for "Show More" Button */}
        <div
          className="h-12 bg-[#2b2b2b] rounded-md w-full animate-pulse mt-4"
        ></div>
      </div>
    </div>
  );
}
