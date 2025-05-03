'use client';

export default function FilterSkeleton() {
  // Display 24 skeleton cards (matching PAGE_SIZE)
  const skeletonArray = Array.from({ length: 24 });

  return (
    <div className="container mx-auto p-4">
      {/* Top filter container skeleton */}
      <div className="w-full h-10 bg-[#2a2a2a] rounded-md animate-pulse mb-6" />

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {skeletonArray.map((_, idx) => (
          <div key={idx} className="w-full h-80 rounded-md overflow-hidden bg-[#2a2a2a] animate-pulse">
            {/* Top 75%: Image placeholder */}
            <div className="w-full h-[75%] bg-[#3a3a3a]" />

            {/* Bottom 25%: Title placeholder */}
            <div className="w-full h-[25%] bg-[#2a2a2a] flex justify-center items-center px-2 py-2">
              <div className="w-3/4 h-4 bg-[#444] rounded-sm" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="w-10 h-8 bg-[#2a2a2a] rounded-md animate-pulse" />
        ))}
      </div>
    </div>
  );
}
