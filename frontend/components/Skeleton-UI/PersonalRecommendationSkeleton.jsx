"use client";

const PersonalRecommendationSkeleton = () => {
  return (
    <div className="new-section-list p-4 rounded-md mt-7 animate-pulse">
      <div
        className="h-6 mb-6 rounded"
        style={{ width: "240px", backgroundColor: "#2b2b2b" }}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-7">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-full h-85 rounded-md overflow-hidden"
            style={{ backgroundColor: "#191919" }}
          >
            {/* Top Image Section */}
            <div
              className="relative w-full h-[75%]"
              style={{ backgroundColor: "#2b2b2b" }}
            />

            {/* Bottom Info Section */}
            <div className="relative w-full h-[25%] px-2 py-2">
              <div
                className="rounded mb-2"
                style={{ height: "16px", width: "80%", backgroundColor: "#353535" }}
              />
              <div
                className="rounded"
                style={{ height: "12px", width: "66%", backgroundColor: "#353535" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalRecommendationSkeleton;
